#!/bin/bash

set -euo pipefail

TGZ="$(npm pack --dry-run 2>/dev/null)"
TAR="${TGZ/.tgz/.tar}"

rm -f "${TGZ}" "${TAR}"
npm pack

# npm pack has "package/*" as a hard coded prefix which is not possible to change,
# https://stackoverflow.com/questions/29717774/npm-pack-rename-package-directory,
# and node-red also expects this, for instance
#                let moduleInfo = checkModulePath(path.join(tarballDir,"package"));
# in /usr/src/node-red/node_modules/@node-red/registry/lib/installer.js

# Add dist files into src as well
gunzip "${TGZ}"
tar rvf "${TAR}" -C dist . --transform="s@^@package/src/@"
gzip "${TAR}"
mv "${TAR}".gz "${TGZ}"

