node-migrant
============

Data agnostic migrations



## Installation

    npm install npm-proxy-cache -g


## Usage

```
var Migrant = require('migrant'),
  MetaFile = require('migrant/lib/meta/file');

module.exports = new Migrant({
  dir: "#{__dirname}/migrations", // directory with migration files
  meta: new MetaFile({path: __dirname + '/migrant.json'}) // meta information storage
});

module.exports.run();
```

You can specify your custom store of meta data, e.g.:

```
var Migrant = require('migrant'),
  meta = {};

// Meta Storage has very basic interface:
var storage = {
  get: function(cb) { cb(null, meta) },
  set: function(value, cb) { meta = value; cb() }
};


module.exports = new Migrant({
  dir: "#{__dirname}/migrations",
  meta: storage // custom storage
});

module.exports.run();
```


## Cli interface

```
  Usage: migrant.coffee [options]

  Options:

    -h, --help  output usage information
    --up      Migrate up
    --down    Migrate down
    --create  Create empty migration file
    --count   Migrate particular number of migration
    --revert  Revert last migration
```
