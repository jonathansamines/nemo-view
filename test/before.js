'use strict';

const path = require('path');

before((done) => {
  process.setMaxListeners(20);
  process.env.nemoBaseDir = path.join(process.cwd(), 'test');
	done();
});
