#!/bin/bash

set -euo pipefail

USER_DIR=$(mktemp -d "${TMPDIR:-/tmp}/user-dir.XXXXXXXXXXXX")
function cleanup {
	rm -rf "$USER_DIR"
}
trap cleanup EXIT


#REPO=$HOME/src/github/node-red

# Avoid unbound error, convert not set to empty string
set +u
if [[ ! -n $REPO ]]
then
	REPO=""
fi
set -u

if [[ -n $REPO ]]
then
	cd "$REPO"
else
	cd "$(dirname "$0")"/..
fi

rm -fr "$USER_DIR"
mkdir "$USER_DIR"

cat > "$USER_DIR"/.config.users.json <<EOF
{
    "_": {
        "editor": {
            "view": {
                "view-show-tips": false,
                "view-show-welcome-tours": false
            }
        }
    }
}
EOF

cat > "$USER_DIR"/.config.runtime.json <<EOF
{
    "telemetryEnabled": false
}
EOF


if [[ -n $REPO ]]
then
	if [[ $USER_DIR == *@* || $USER_DIR == *" "* ]]
	then
		echo "$0: Invalid USER_DIR value" 1>&2
		exit 2
	fi
	sed -i "s@node packages/node_modules/node-red/red.js.*@node packages/node_modules/node-red/red.js -p 1880 -u $USER_DIR\",@" package.json
	npm start
else
	npx node-red -p 1880 -u "$USER_DIR"
fi

