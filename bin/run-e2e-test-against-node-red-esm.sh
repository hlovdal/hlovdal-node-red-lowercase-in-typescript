#!/bin/bash

OS=${OS:-""}
set -euo pipefail

git clone --depth 1 --branch installing_esm_nodes https://github.com/hlovdal/node-red.git
case "$OS" in
  Windows_NT)
    REPO="$(cygpath -w "$(pwd)" | tr '\\' /)"/node-red
    ;;
  *)
    REPO="$(pwd)"/node-red
    ;;
esac
sed -i "s@#REPO=.*@REPO=${REPO}@" bin/run-node-red.sh
cd node-red
npm ci
npm run build
cd ..
npm run e2e
