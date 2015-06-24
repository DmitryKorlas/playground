var Chai = require('chai');
var ChaiAsPromised = require('chai-as-promised');
var Sinon = require('sinon');
var Promise = require('bluebird');
var withData = require('leche').withData;
var retry = require('../invokeUntilResolve').invokeUntilResolve;

Chai.use(ChaiAsPromised);

var expect = Chai.expect;

//@todo use fake timers

describe('invokeUntilResolve', function(){


	withData({
		'testdata_1': {
			input: {
				attemptsCount: 2,
				rejectMessage: 'Rejected reason'
			},
			expected: {
				actionCallCount: 2,
				rejectMessage: 'Rejected reason'
			}
		},
		'testdata_2': {
			input: {
				attemptsCount: 1,
				rejectMessage: 'Rejected reason'
			},
			expected: {
				actionCallCount: 1,
				rejectMessage: 'Rejected reason'
			}
		}

	}, function(testData){

		it('should retry failed action', function(done) {

			var spy = Sinon.spy();
			function action() {
				spy();
				return Promise.reject('Rejected reason');
			}

			var result = retry(action, {
				attemptsCount: testData.input.attemptsCount,
				attemptTimeout: 100
			});

			expect(result).to.eventually.rejectedWith(testData.expected.rejectMessage)
				.then(function() {
					return expect(Promise.resolve(spy.callCount))
						.to.eventually.equals(testData.expected.actionCallCount);
				})
				.then(function() {
					done()
				});
		});
	})

	withData({
		testdata_1: {
			input: {
				numberOfSuccessAttempt: 2,
				attemptsCount: 4,
				resolveMessage: 'Successful attempt'
			},
			expected: {
				actionCallCount: 2,
				resultMessage: 'Successful attempt'
			}
		},
		testdata_2: {
			input: {
				numberOfSuccessAttempt: 4,
				attemptsCount: 4,
				resolveMessage: 'Successful attempt'
			},
			expected: {
				actionCallCount: 4,
				resultMessage: 'Successful attempt'
			}
		}
	}, function(testData){
		it('should stop retries when action is resolved', function(done){

			var spy = Sinon.spy();
			var ctr = 0;

			function action() {
				spy();
				if (++ctr < testData.input.numberOfSuccessAttempt) {
					return Promise.reject();
				}
				else {
					return Promise.resolve(testData.input.resolveMessage);
				}
			}

			var result = retry(action, {
				attemptsCount: testData.input.attemptsCount,
				attemptTimeout: 100
			});

			expect(result).to.eventually.equals(testData.expected.resultMessage)
				.then(function(){
					return expect(Promise.resolve(spy.callCount))
						.to.eventually.equals(testData.expected.actionCallCount);
				})
				.then(function(){
					done();
				})
		})
	});
})
