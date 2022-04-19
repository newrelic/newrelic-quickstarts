import {
  InstallPlanDestination,
  InstallPlanDirectiveInput,
  InstallPlanMutationVariable,
  InstallPlanOperatingSystem,
  InstallPlanTargetInput,
  InstallPlanTargetType,
} from './types/InstallPlanMutationVariables';
import {
  InstallPlanConfig,
  InstallPlanInstall,
  InstallPlanTarget,
  InstallPlanTargetOS,
} from './types/InstallPlanConfig';
import { NerdGraphResponseWithLocalErrors } from './types/nerdgraph';

import * as path from 'path';
import {
  readYamlFile,
  FilePathAndContents,
  passedProcessArguments,
} from './helpers';
import {
  fetchPaginatedGHResults,
  filterInstallPlans,
} from './github-api-helpers';
import {
  fetchNRGraphqlResults,
  translateMutationErrors,
  chunk,
} from './nr-graphql-helpers';
import { track, CUSTOM_EVENT } from './newrelic/customEvent';

const gql = String.raw;
export const INSTALL_PLAN_MUTATION = gql`
  # gql
  mutation QuickstartRepoInstallPlanMutation(
    $description: String!
    $dryRun: Boolean
    $displayName: String!
    $fallback: Nr1CatalogInstallPlanDirectiveInput
    $heading: String!
    $id: ID!
    $primary: Nr1CatalogInstallPlanDirectiveInput!
    $target: Nr1CatalogInstallPlanTargetInput!
  ) {
    nr1CatalogSubmitInstallPlanStep(
      dryRun: $dryRun
      installPlanStep: {
        description: $description
        displayName: $displayName
        fallback: $fallback
        heading: $heading
        id: $id
        primary: $primary
        target: $target
      }
    ) {
      installPlanStep {
        id
      }
    }
  }
`;

interface InstallPlanMutationResponse {
  installPlanStep: {
    id: string;
  };
}

/**
 * Builds the target parameter from the config into the variables for NR Request
 * @param {Object} target the `target` parameter object
 * @returns {Object} target transformed for NR request
 */
const buildInstallPlanTargetVariable = (
  target: InstallPlanTarget
): InstallPlanTargetInput => {
  const upperCaseTarget = {
    type: target.type.toUpperCase(),
    destination: target.destination.toUpperCase(),
  } as InstallPlanTargetInput;

  if ('os' in target && Array.isArray(target.os)) {
    upperCaseTarget.os = target.os.map((str: InstallPlanTargetOS) =>
      str.toUpperCase()
    );
  }

  return upperCaseTarget;
};

/**
 * Builds the target parameter from the config into the variables for NR Request
 * @param {{mode, destination}} directive `install` or `fallback` parameter object
 * @returns {{mode, destination}} directive transformed for NR request
 */
const buildInstallPlanDirectiveVariable = ({
  mode,
  destination,
}: InstallPlanInstall): InstallPlanDirectiveInput => {
  switch (mode) {
    case 'targetedInstall':
      return {
        targeted: { recipeName: destination && destination.recipeName },
      };
    case 'link':
      return { link: { url: destination && destination.url } };
    case 'nerdlet':
      return {
        nerdlet: {
          nerdletId: destination && destination.nerdletId,
          nerdletState: destination && JSON.stringify(destination.nerdletState),
        },
      };
    default:
      // Defaults to submitting an invalid directive, so that validation can catch it
      return { mode, destination: undefined };
  }
};

/**
 * Builds input argument for submitQuickstart GraphQL mutation.
 * @param {Object} installPlanConfig - An object containing the path and contents of a quickstart config file.
 * @return {Object} An object that represents a quickstart in the context of a GraphQL mutation.
 */
const buildMutationVariables = (
  installPlanConfig: FilePathAndContents<InstallPlanConfig>
): InstallPlanMutationVariable => {
  const { id, name, title, description, target, install, fallback } =
    installPlanConfig.contents[0] || {};

  const dryRun = passedProcessArguments()[1] === 'true';

  return {
    id,
    dryRun,
    description,
    displayName: name,
    heading: title,
    target: target && buildInstallPlanTargetVariable(target),
    primary: install && buildInstallPlanDirectiveVariable(install),
    fallback: fallback && buildInstallPlanDirectiveVariable(fallback),
  };
};

/**
 * Takes the filenames and returns path and request variables for file for submitInstallPlan mutation.
 * @param {{filename}} file - An object containing the filename of install plan config file.
 * @return {{filePath, variables}} - An object containing the path and mutation variables for install plan.
 */
const transformInstallPlansToRequestVariables = ({
  filename,
}: {
  filename: string;
}): {
  variables: InstallPlanMutationVariable;
  filePath: string;
} => {
  const installPlanFile = readYamlFile<InstallPlanConfig>(
    path.join(process.cwd(), `../${filename}`)
  );

  return {
    filePath: installPlanFile.path,
    variables: buildMutationVariables(installPlanFile),
  };
};

/**
 * Validates for an array of install plan filenames
 * @param {Array} installPlanFiles - Array containing install plan file names.
 * @return {Promise.<Boolean>} - Boolean value indicating whether all files were validated
 */
export const createValidateUpdateInstallPlan = async (
  installPlanFiles: { filename: string }[]
): Promise<boolean> => {
  type GraphQLResponse =
    NerdGraphResponseWithLocalErrors<InstallPlanMutationResponse> & {
      filePath: string;
    };

  const installPlanRequests = installPlanFiles.map(
    transformInstallPlansToRequestVariables
  );
  const chunkedInstallPlanRequests = chunk(installPlanRequests, 5); // Run requests in groups of 5

  let graphqlResponses: GraphQLResponse[] = [];
  // using a For Of loop so that it respects the `await`
  for (const reqChunk of chunkedInstallPlanRequests) {
    const chunkRes = await Promise.all(
      reqChunk.map(async ({ variables, filePath }) => {
        const { data, errors } = await fetchNRGraphqlResults<
          InstallPlanMutationVariable,
          InstallPlanMutationResponse
        >({
          queryString: INSTALL_PLAN_MUTATION,
          variables,
        });

        return { data, filePath, errors };
      })
    );
    graphqlResponses = [...graphqlResponses, ...chunkRes];
  }

  let hasFailed = false;

  graphqlResponses.forEach(({ errors, filePath }) => {
    if (errors && errors.length > 0) {
      hasFailed = true;
      translateMutationErrors(errors, filePath);
    }
  });

  return hasFailed;
};

/**
 * @param {boolean} hasFailed if the validation or submission has failed
 * @param {boolean} isDryRun - true for validation, false for submission
 */
const recordCustomNREvent = async (hasFailed: boolean, isDryRun: boolean) => {
  const status = hasFailed ? 'failed' : 'success';
  const event = isDryRun
    ? CUSTOM_EVENT.VALIDATE_INSTALL_PLANS
    : CUSTOM_EVENT.UPDATE_INSTALL_PLANS;

  await track(event, { status });
};

const main = async () => {
  const [GITHUB_API_URL, isDryRun] = passedProcessArguments();

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    console.error('GITHUB_TOKEN is not defined.');
    process.exit(1);
  }

  const files = await fetchPaginatedGHResults(GITHUB_API_URL, githubToken);

  const installPlanFiles = filterInstallPlans(files);
  const hasFailed = await createValidateUpdateInstallPlan(installPlanFiles);
  await recordCustomNREvent(hasFailed, isDryRun === 'true');

  if (hasFailed) {
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}
