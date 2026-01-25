#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"/..

(pwd | tr '\012' '/' ; npm pack --dry-run 2>/dev/null) > cypress/fixtures/upload_file_path.txt

