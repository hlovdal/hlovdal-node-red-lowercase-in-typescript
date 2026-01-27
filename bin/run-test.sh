#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"/..

if ! grep -q lint package.json
then
	exit 0
fi

./bin/ci.sh

rm -rf dist
npm run test

