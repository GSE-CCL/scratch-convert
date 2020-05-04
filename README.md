# scratch-convert

Converts Scratch 2 to Scratch 3 JSON representations using [LLK/scratch-vm](https://github.com/LLK/scratch-vm/).

## Setup

1. Make sure you've installed Node.js and NPM.
2. Navigate the terminal to the downloaded repository.
3. Run npm install.
4. You should be all set to run the code as described below.

## Usage

Usage: node convert.js [options]

- -v, --verbose       Verbose messaging.
- -h, --help          Display this usage guide.
- -u, --unified       Whether to save SB3 projects to a single unified directory. If not set, replicates original directory structure under the output root.
- -d, --dest string   Destination root directory for output files.
- --src file ...      List of directories and files to convert from SB2 to SB3. Directories will always be followed recursively.

Note that you'll always see a lot of errors as a result of running the headless Scratch VM with minimal features enabled (no audio renderer, etc.).

## Examples

Convert all projects in directory SRC, saving new ones to root directory DEST, preserving directory structures recursively:

```node convert.js -d DEST SRC```

Convert projects A, B, C, and those in the directory SRC, to root directory DEST, without preserving directory structures:

```node convert.js -ud DEST A B C SRC```

## Convert server

To use this code as a server to convert one project at a time, run `node app.js`.

Then you can POST to `/convert` with your Scratch 2 project JSON as the only data, with header `application/json`.

You'll receive the Scratch 3 JSON in return.

As a Python example:

```python
import json
import requests

with open("test.json") as f:
    sb2 = json.load(f)

r = requests.post("http://localhost:3000/convert", json=sb2)
print(r.text)
```