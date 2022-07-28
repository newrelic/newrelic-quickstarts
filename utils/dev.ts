import Quickstart from './lib/Quickstart';

const apache = new Quickstart('quickstarts/circleci/config.yml');
// test

(async () => {
  const mut = await apache.getMutationVariables(true);
  console.log(mut);
})();
