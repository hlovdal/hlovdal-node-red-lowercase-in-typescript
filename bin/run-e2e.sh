#!/bin/bash

concurrently --shell /bin/bash --kill-others --success first -n 'NODE-RED,CYPRESS' -c 'green,blue' \
	"bash bin/run-node-red.sh" \
	"wait-on http://localhost:1880 && npm run cy:run"
