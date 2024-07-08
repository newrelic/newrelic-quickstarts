FROM node:14.21.0-alpine
WORKDIR /newrelic-quickstarts/.github/actions/import-data
RUN npm install
ENTRYPOINT [ "npm", "run", "import"]
