#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"/..

FILE=$(pwd | tr '\012' '/' ; npm pack --dry-run 2>/dev/null)

# Avoid unbound error, convert not set to empty string
set +u
if [[ ! -n $OS ]]
then
	OS=""
fi
set -u

case "$OS" in
	Windows_NT)
		FILE="$(cygpath -w "$FILE" | tr '\\' /)"
		;;
	*)
		;;
esac

echo "$FILE" > cypress/fixtures/upload_file_path.txt
