
/**
 * Library dependencies.
 */

var request = require('superagent');

/**
 * Expose a `Priceonomics` client.
 */

module.exports = Priceonomics;

/**
 * Initialize a new `Priceonomics`.
 *
 * @param {String} xAccessKey
 */

function Priceonomics(xAccessKey){
  if (!(this instanceof Priceonomics)) return new Priceonomics(xAccessKey);
  if (!xAccessKey || xAccessKey.length === 0) throw "Need to provide x-access-key key.";
  this.xAccessKey = xAccessKey;
  this.host = 'https://api.engine.priceonomics.com/v1/';
}

/**
 * Get all applications.
 *
 * @param {Function} fn (optional)
 */

Priceonomics.prototype.list = function(fn) {
  this.get('apps/', fn);
};

/**
 * Get application details.
 *
 * @param {String} slug
 * @param {Function} fn (optional)
 */

Priceonomics.prototype.details = function(slug, fn) {
  this.get('apps/' + slug, fn);
};

/**
 * Invoke application.
 *
 * @param {String} slug
 * @param {String} json
 * @param {Function} fn (optional)
 */

Priceonomics.prototype.start = function(slug, json, fn) {
  this.post('apps/' + slug, json, fn);
};

/**
 * Get application status.
 *
 * @param {String} jobId
 * @param {Function} fn (optional)
 */

Priceonomics.prototype.status = function(jobId, fn) {
  this.get('jobs/' + jobId, fn);
};

/**
 * Private function to form POST request.
 *
 * @param {String} path
 * @param {Object} data
 * @param {Function} fn (optional)
 */

Priceonomics.prototype._post = function(path, data, fn) {
  request
    .post(this.host + path)
    .set('x-access-key', this.xAccessKey)
    .send(data)
    .end(fn);
};

/**
 * Private function to form GET request.
 *
 * @param {String} path
 * @param {Function} fn (optional)
 */

Priceonomics.prototype._get = function(path, fn) {
  if (typeof path === 'function') {
    fn = path;
    path = '';
  }
  request
    .get(this.host + path)
    .set('x-access-key', this.xAccessKey)
    .end(fn);
};
