#!/usr/bin/env bash

npm install -g npm@$(node -p -e "require('./package.json').engines.npm")