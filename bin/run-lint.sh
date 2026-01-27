#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"/..

if ! grep -q lint package.json
then
	exit 0
fi

./bin/ci.sh

npm run lint

