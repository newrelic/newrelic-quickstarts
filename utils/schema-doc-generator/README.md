# Schema documentation geneator

## Purpose

This script will generate human readable documentation for the schemas located in [util/schemas](../schemas). This can be run locally to update documentation, but is run as part of a github workflow which automatically updates the documentation when there are changes to the schemas or a new schema is added.

## How to use

You will need to have python (v3.6 or higher) and pip installed locally.

If you do, run the following commands from the `root` of the repository:

```sh
# install dependencies
pip install -r utils/schema-doc-generator/requirements.txt

# run script
python utils/schema-doc-generator/script.py
```

This should produce documentation in [docs](../../docs) based on the schemas you have locally.
