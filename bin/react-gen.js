#!/usr/bin/env node

require = require('esm')(module /*, options */)
require('../dist/index').cli(process.argv)
