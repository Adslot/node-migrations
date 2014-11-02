node-migrant
============

Data agnostic migrations


```
var migrant = require('migrant');

var m = migrant({
  meta: {
    get: function() {}
    set: function() {}
  },
  style: 'timestamp',
  dir: __dirname + '/migrations'
});

```
