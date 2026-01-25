#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"/..

echo -n > cypress/fixtures/upload_file_path.txt

