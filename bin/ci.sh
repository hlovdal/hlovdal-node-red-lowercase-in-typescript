#!/bin/bash

if [ "$GIT_TEST_PREVIOUS_CHECKED_OUT_COMMIT" = "" ]
then
	GIT_TEST_PREVIOUS_CHECKED_OUT_COMMIT=""
fi
set -euo pipefail

PARENT=$(git log --pretty=%P -n 1 HEAD)
# If current commit is not a merge commit ...
if [ "$(echo "$PARENT" | wc -w)" -eq 1 ]
then
    if [ "$GIT_TEST_PREVIOUS_CHECKED_OUT_COMMIT" = "$PARENT" ]
    then
        # ... and package.json has not changed then skip running npm ci.
        git diff --quiet "$PARENT" -- package.json package-lock.json || npm ci
    else
        npm ci
    fi
else
    npm ci
fi

