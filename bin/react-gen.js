#!/usr/bin/env node

require = require('esm')(module /*, options */);
require('../js/index').cli(process.argv);
