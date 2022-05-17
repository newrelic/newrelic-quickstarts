import { fetchPaginatedGHResults } from './github-api-helpers';
import { buildUniqueQuickstartSet } from './helpers';
import { IO_PREVIEW_PAGE_URL } from './constants';

const getQuickstartsFromPRFiles = async (
  prURL: string,
  token: string
): Promise<string[]> => {
  const filesURL = `${prURL}/files`;

  const files = await fetchPaginatedGHResults(filesURL, token);
  const uniqueQuickstarts = files.reduce(
    buildUniqueQuickstartSet,
    new Set<string>()
  );

  return [...uniqueQuickstarts.values()];
};

const createPreviewLink = (
  prNumber: string,
  quickstartPath: string
): string => {
  const url = new URL(IO_PREVIEW_PAGE_URL);

  url.searchParams.set('pr', prNumber);
  url.searchParams.set('quickstart', quickstartPath);

  return url.href;
};

const createComment = (
  quickstarts: { path: string; link: string }[]
): string => {
  const markdownLinks = quickstarts
    .map((q) => `* [${q.path}](${q.link})`)
    .join('\n');
  return `### Quickstart previews
    ${markdownLinks}`;
};

const main = async () => {
  const pr =
    'https://api.github.com/repos/newrelic/newrelic-quickstarts/pulls/1090';
  const prNumber = '1090';

  try {
    const quickstarts = await getQuickstartsFromPRFiles(pr);
    const links = quickstarts.map((q) => ({
      path: q,
      link: createPreviewLink(prNumber, q),
    }));
    const comment = JSON.stringify(createComment(links));
    console.log(`::set-output name=comment::${comment}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();
