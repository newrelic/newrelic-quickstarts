import csv
import pandas
from ruamel.yaml import YAML
import os
from os import path
import pathlib
from yaml.loader import SafeLoader
import sys
import math


# Reading whole csv file with panda library.
yaml = YAML()
yaml.width = 4096
df = pandas.read_csv('quickstarts-installplans.csv', sep=',')

install_plan_map = {
    "dotnet": ["dotnet-agent"],
    "ruby": ["setup-ruby-agent"],
    "python": ["setup-python-agent"],
    "java": ["setup-java-agent"],
    "aws": [],
    "os": ["guided-install"],
    "mobile": [],
    "apache": ["infra-agent-targeted", "apache-integration"],
    "zookeeper": [],
    "azure": [],
    "browser": [],
    "c": [],
    "c++": [],
    "php": ["php-agent"],
    "cassandra": ["infra-agent-targeted", "cassandra-integration"],
    "couchbase": ["infra-agent-targeted", "couchbase-integration"],
    "docker": [],
    "golang": ["setup-go-agent"],
    "elasticsearch": ["infra-agent-targeted", "elasticsearch-integration"],
    "node.js": ["node-agent"],
    "f5": [],
    "gcp": [],
    "haproxy": ["infra-agent-targeted", "haproxy-integration"],
    "jmx": [],
    "kafka": [],
    "kubernetes": [],
    "logstash": [],
    "mariadb": ["infra-agent-targeted", "mysql-integration"],
    "memcached": ["infra-agent-targeted", "memcached-integration"],
    "micrometer": [],
    "mongodb": ["infra-agent-targeted", "mongodb-integration"],
    "mssql": ["infra-agent-targeted", "microsoft-sql-server-integration"],
    "mysql": ["infra-agent-targeted", "mysql-integration"],
    "nagios": ["infra-agent-targeted", "nagios-integration"],
    "nginx": ["infra-agent-targeted", "nginx-integration"],
    "oracle": [],
    "windows": ["guided-install"],
    "postgres": ["infra-agent-targeted", "postgres-integration"],
    "prometheus": [],
    "rabbitmq": ["infra-agent-targeted", "rabbitmq-integration"],
    "redis": ["infra-agent-targeted", "redis-integration"],
    "snmp": [],
    "statsd": [],
    "synthetics": [],
    "varnish": ["infra-agent-targeted", "varnish-cache-integration"],
    "esxi": [],
    "tanzu": []
}

def dumpToYaml(path, pack_install_key):
    with open(path, 'r+') as outfile:
        documents = yaml.load(outfile)

        if pack_install_key in install_plan_map:
            install_plan_list = install_plan_map[pack_install_key]
            if len(install_plan_list) > 0:
                documents['installPlans'] = install_plan_list
            else:
                print(f'Install plan {pack_install_key} not found')
            outfile.seek(0) # Move position in outfile to front. 
            yaml.indent(sequence=4, offset=2)
            yaml.dump(documents, outfile)
        else:
            print(f'{pack_install_key} not defined')
    outfile.close()

for index, row in df.iterrows(): # Iterates the csv file.
    print('**** Pack ****')
    pack_path = str.lower(row['PATH']).replace(' ', '-') # Path of the pack
    pack_name = str.lower(row['NAME']).replace(' ', '-') # Name of the pack
    pack_install_key = row['INSTALL_PLAN'] # Install plan for the pack

    # Find the pack
    print(f'Path: {pack_path}')
    path = f'../../packs/{pack_path}/config.yml'
    
    if os.path.exists(path): # Check if the pack exists
        print(f'Pack {pack_name} was found, updating...')
        dumpToYaml(path, pack_install_key)        
    else:
        print(f'Pack {pack_name} was not found at {path}')
    print('\n')