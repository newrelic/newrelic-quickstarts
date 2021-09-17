import glob
from pathlib import Path

from json_schema_for_humans.generation_configuration import GenerationConfiguration
from json_schema_for_humans.generate import generate_from_filename

config = GenerationConfiguration(template_name="md", show_toc=False)

schema_paths = glob.glob('utils/schemas/*.json')

for path in schema_paths:
    # stem is filename without extension
    stem = Path(path).stem
    print(f'generating doc for: {path}')
    generate_from_filename(path, f'docs/{stem}.md', config=config)
