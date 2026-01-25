#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"/..

rm -fr user-dir
mkdir user-dir

cat > user-dir/.config.users.json <<EOF
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

cat > user-dir/.config.runtime.json <<EOF
{
    "telemetryEnabled": false
}
EOF

npx node-red -p 1880 -u user-dir

