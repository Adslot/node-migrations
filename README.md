node-migrations
============

Data agnostic migrations



## Installation

    npm i migrations


## Usage

```javascript
var Migrant = require('migrations'),
  MetaFile = require('migrations/lib/meta/file');

module.exports = new Migrant({
  dir: __dirname + '/migrations', // directory with migration files
  meta: new MetaFile({path: __dirname + '/migrations.json'}) // meta information storage
});

module.exports.run();
```

You can specify your custom store of meta data, e.g.:

```javascript
var Migrant = require('migrations'),
  meta = {};

// Meta Storage has very basic interface:
var storage = {
  get: function(cb) { cb(null, meta) },
  set: function(value, cb) { meta = value; cb() }
};


module.exports = new Migrant({
  dir: __dirname + '/migrations',
  meta: storage // custom storage
});

module.exports.run();
```

### Using with `npm`

You can put a special task in package.json file:

```
{
  "name": "my-project",
  "scripts": {
    "migrate": "node migrations.js"
  }
}
```

and then you be able to do `npm run migrate`. Another option is to add shebang
to the *migrations* executable and run it in a manual way.


## Cli interface

```
  Usage: migrations.js [options]

  Options:

    -h, --help  output usage information
    --up      Migrate up
    --down    Migrate down
    --create  Create empty migration file
    --count   Migrate particular number of migration
    --revert  Revert last migration
```
