import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';

import Quickstart from './lib/Quickstart';

const GREEN = '\x1b[32m';
const PORT = process.env.PORT || '3000';
const BASE_PREVIEW_LINK =
  'https://newrelic.com/instant-observability/preview?local=true';

const app = express();

app.use(
  cors({
    origin: '*',
  })
);

app.use('/', express.static(path.resolve(__dirname, '..')));

/**
 * Helper function to ensure that an identifier has been supplied
 * and that it is for a valid quickstart.
 */
const validateArgs = (identifier: string) => {
  if (!identifier) {
    console.error(
      'You must provide a directory path to the quickstart. Example: yarn preview aws/amazon-athena'
    );
    process.exit(1);
  }

  // FIXME: determine why this is using the _directory_ not the _configuration_
  const quickstart = new Quickstart(
    identifier,
    path.resolve(__dirname, '..', 'quickstarts')
  );

  if (!quickstart.isValid) {
    console.error(
      `Could not find a config.yml or config.yaml for ${identifier}.`
    );
    process.exit(1);
  }
};

/**
 * Helper function to generate a preview link with an identifier
 * and an optional port.
 */
const getPreviewLink = (identifier: string) => {
  const port = PORT !== '&port=3000' ? PORT : '';
  return `${BASE_PREVIEW_LINK}&quickstart=${identifier}${port}`;
};

/**
 * Entrypoint.
 */
const main = async () => {
  const identifier = process.argv[2];

  validateArgs(identifier);

  const link = getPreviewLink(identifier);

  app.listen(PORT, () => {
    console.log(`Now serving files on http://localhost:${PORT}`);
    console.log(`${GREEN}You can view your preview at ${link}`);
  });
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node create_validate_pr_quickstarts.js', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main();
}
