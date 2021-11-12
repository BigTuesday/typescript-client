nludb-cli
=========

A command line tool for NLUDB

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/nludb-cli.svg)](https://npmjs.org/package/nludb-cli)
[![Downloads/week](https://img.shields.io/npm/dw/nludb-cli.svg)](https://npmjs.org/package/nludb-cli)
[![License](https://img.shields.io/npm/l/nludb-cli.svg)](https://github.com/nludb/typescript-client/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g nludb-cli
$ nludb COMMAND
running command...
$ nludb (-v|--version|version)
nludb-cli/0.0.1 darwin-x64 node-v14.17.0
$ nludb --help [COMMAND]
USAGE
  $ nludb COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`nludb hello [FILE]`](#nludb-hello-file)
* [`nludb help [COMMAND]`](#nludb-help-command)

## `nludb hello [FILE]`

describe the command here

```
USAGE
  $ nludb hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ nludb hello
  hello world from ./src/deploy.ts!
```

_See code: [src/commands/deploy.ts](https://github.com/nludb/typescript-client/blob/v0.0.1/src/commands/hello.ts)_

## `nludb help [COMMAND]`

display help for nludb

```
USAGE
  $ nludb help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.4/src/commands/help.ts)_
<!-- commandsstop -->
