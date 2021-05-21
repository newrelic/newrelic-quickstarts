#!/usr/bin/env bash

accountId=$(grep -E '^accountId' ./importer-config.sh | sed s/.*=//)

apiKey=$(grep -E '^apiKey' ./importer-config.sh | sed s/.*=//)

docker-compose run importer -- --accountId $accountId --nrApiKey $apiKey $1
