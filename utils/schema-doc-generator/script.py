import fileinput
import glob
from pathlib import Path
import sys

from json_schema_for_humans.generation_configuration import GenerationConfiguration
from json_schema_for_humans.generate import generate_from_filename

def reword_footer(file_path):
    with fileinput.input(files=(file_path), inplace=True) as f:
        for line in f:
            search_string = "Generated using [json-schema-for-humans](https://github.com/coveooss/json-schema-for-humans)"
            if search_string in line:
                # this line strips off the timestamp, so the file doesn't all change and get picked up by git
                line = "Generated using [json-schema-for-humans](https://github.com/coveooss/json-schema-for-humans)"
            sys.stdout.write(line)

config = GenerationConfiguration(template_name="md", show_toc=False)

schema_paths = glob.glob('utils/schemas/*.json')

for path in schema_paths:
    # stem is filename without extension
    stem = Path(path).stem
    print(f'generating doc for: {path}')
    generate_from_filename(path, f'docs/{stem}.md', config=config)
    reword_footer(f'docs/{stem}.md')
