var assert = require('assert'),
  fs = require('fs'),
  path = require('path'),
  cli = require('./cli'),
  Migrant = require('./migrant');


var noon = function() {};

function Index(opts) {
  assert(opts, 'options should be specified')
  assert(opts.meta, 'meta storage should be specified')
  assert(opts.dir, 'migrations directory should be specified')
  try {
    fs.mkdirSync(opts.dir, 0755);
  } catch (err) { /* ignore */ }

  assert(fs.existsSync(opts.dir), 'migrations directory should exists')

  this.opts = opts;
  this.migrant = new Migrant(opts);
}


Index.prototype.run = function() {
  if (cli.create) return this.create();

  if (cli.revert) {
    cli.count = 1;
    cli.down = true;
    cli.up = false;
  }

  cli.count = cli.count || Infinity;
  if (cli.down)
    return this.migrant.up(cli.count, noon);

  this.migrant.up(cli.count, noon);
};


Index.prototype.create = function() {
  var isCoffee = !!require.extensions['.coffee'];

  var template = (isCoffee ? [
    ''
    , 'exports.up = (next) ->'
    , '  next()'
    , ''
    , 'exports.down = (next) ->'
    , '  next()'
    , ''
  ] : [
      ''
    , 'exports.up = function(next) {'
    , '  next();'
    , '};'
    , ''
    , 'exports.down = function(next) {'
    , '  next();'
    , '};'
    , ''
  ]).join('\n');

  var now = new Date().toISOString().substring(0, 19).replace(/-|T|:/g, ''),
    ext = isCoffee ? '.coffee' : '.js',
    name = cli.create !== true ? cli.create : 'migrate-data'
    filepath = path.join(this.opts.dir, now + '-' + name + ext);

  fs.writeFileSync(filepath, template);
};


module.exports = Index;
