var Promise = require('bluebird');

module.exports = {
	invokeUntilResolve: invokeUntilResolve
};

/**
 * Rerun action while it's not resolved
 * @param {Function} fn Function which must return a promise
 * @param {Object} opts A configuration
 * @param {Number} opts.attemptsCount The maximum allowed attempts to rerun action
 * @param {Number} opts.attemptTimeout The delay between attempts
 * @returns {Promise} A promise which will be fulfilled/rejected with the value received from the final attempt of action
 */
function invokeUntilResolve(fn, opts) {
	opts._currentAttempt = opts._currentAttempt || 0;
	opts._currentAttempt++;

	console.log('called invokeUntilResolve '+ JSON.stringify(opts));

	return new Promise(function(resolve, reject){
		fn()
			.then(resolve)
			.catch(function(reason){
				if (opts._currentAttempt < opts.attemptsCount) {
					// retry
					setTimeout(function() {
						invokeUntilResolve(fn, opts)
							.then(resolve, reject);
					}, opts.attemptTimeout);
				}
				else {
					reject(reason);
				}
			});
	});
}
