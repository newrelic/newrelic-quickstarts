# Import observability pack definitions

The GitHub Action located in `.github/actions/import-data` validates the definition files for dashboards and alerts by executing those definitions against an account. The `importer.Dockerfile` wraps that node app for ease in running locally.

## Running via docker

1. Install [Docker](https://www.docker.com/products/docker-desktop)
2. Execute the following command from the root of the project:

```bash
docker-compose run importer -- --accountId XXXXXXX --nrApiKey NRAK-... mysql
```

The importer expects 3 arguments, so you must supply those yourself:

* accountId
* nrApiKey
* Name of the pack to install
