FROM node:14.17.0-alpine
WORKDIR /newrelic-observability-packs/.github/actions/import-data
RUN npm install
ENTRYPOINT [ "npm", "run", "import"]
