var assert = require('assert'),
  fs = require('fs'),
  path = require('path'),
  cli = require('./cli'),
  Migrant = require('./migrant');


var templates = {
  coffee: [
    ''
    , 'exports.up = (next) ->'
    , '  next()'
    , ''
    , 'exports.down = (next) ->'
    , '  next()'
    , ''
  ],
  js: [
    ''
    , 'exports.up = (next) => {'
    , '  next();'
    , '};'
    , ''
    , 'exports.down = (next) => {'
    , '  next();'
    , '};'
    , ''
  ]
};

function Index(opts) {
  assert(opts, 'options should be specified');
  assert(opts.meta, 'meta storage should be specified');
  assert(opts.dir, 'migrations directory should be specified');
  try {
    fs.mkdirSync(opts.dir, 0755);
  } catch (err) { /* ignore */ }

  assert(fs.existsSync(opts.dir), 'migrations directory should exists');

  opts.verbose = opts.verbose != null ? opts.verbose : true;
  this.opts = opts;
  this.migrant = new Migrant(opts);
}


Index.prototype.run = function() {
  if (cli.help) return;
  if (cli.create) return this.create();

  if (cli.revert) {
    cli.count = cli['revert'] || 1;
    cli.down = true;
    cli.up = false;
  }

  var cb = function(err) {
    if (err) {
      console.error(err);
      return process.exit(1);
    }
    process.exit();
  };

  cli.count = cli.count || Infinity;
  if (cli.down)
    return this.migrant.down(cli.count, cb);

  this.migrant.up(cli.count, cb);
};


Index.prototype.create = function() {
  var supportedExtensions = Object.keys(templates);
  var extension = supportedExtensions.includes(cli['extension']) ? cli['extension'] : 'coffee';
  var template = templates[extension].join('\n');

  var now = new Date().toISOString().substring(0, 19).replace(/-|T|:/g, ''),
    name = cli.create !== 'true' ? cli.create : 'just-another-boring-migration',
    filename = now + '-' + name + '.' + extension,
    filepath = path.join(this.opts.dir, filename);

  try {
    fs.writeFileSync(filepath, template);
    this.migrant.log(filename, 'created', true)
  } catch (e) {
    throw e;
  }
};


module.exports = Index;
