# Keywords Script

This is a Python script that automates the process of adding keywords to each packs config.yml file. 

## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install.


#### Make sure you have python installed on your machine, minimun version is 3.7.1. If not, follow this link [Python Installation](https://realpython.com/installing-python/)
```bash
python --version
```

#### Create a virtual environment and activcate it.
```bash
python3 -m venv

source venv/bin/activate
```

#### When inside your venv, run this command to install the required packages:
```bash
python -m pip install -r requirements.txt
```

#### Now you should be ready to go!

## Usage


#### Want to add a new pack or update the current keywords?

Head into the NR_Keywords.csv file. At the bottom, add the new pack as __Name;keywords, keywords__
```csv
NewPack;newpack, apm
```
Run the script from the terminal (make sure you're inside your virtual env):

```bash
python3 readCsv.py
```
If the script succeded, output in terminal will be:

```bash
NewPack was made!
```

If you updated a keyword and succeded, there will be no output.

You will then find the new pack inside packs/ folder in the root.