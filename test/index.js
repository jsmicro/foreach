'use strict';

const foreach = require('../main');

const test = require('jsmicro-test');

// Call function to give arguments
StartTest('first', 2, ['thrid']);

function StartTest() {
    // Run the foreach() Test.
    test(foreach)
        .try(test.color.yellow('Iterating {a: 1, b: 2} will create "ab" and 3.'), function(accept, reject) {
            let keys = '';
            let vals = 0;

            foreach({a: 1, b: 2}, function(key, value) {
                keys += key;
                vals += value;
            });

            console.log(`    ${keys} ${vals}`);

            if (keys === 'ab' && vals === 3) {
                accept();
            } else {
                reject();
            }
        })
        .try(test.color.yellow('Iterating [1, 2, 3] will create "012" and 6.'), function(accept, reject) {
            let keys = '';
            let vals = 0;

            foreach([1, 2, 3], function(key, value) {
                keys += key;
                vals += value;
            });

            console.log(`    ${keys} ${vals}`);

            if (keys === '012' && vals === 6) {
                accept();
            } else {
                reject();
            }
        })
        .try(test.color.yellow('Iterating "Test" will create "0123" and "Test".'), function(accept, reject) {
            let keys = '';
            let vals = '';

            foreach('Test', function(key, value) {
                keys += key;
                vals += value;
            });

            console.log(`    ${keys} ${vals}`);

            if (keys === '0123' && vals === 'Test') {
                accept();
            } else {
                reject();
            }
        })
        .try(test.color.yellow('Iterating 5 will create "01234" and "12345".'), function(accept, reject) {
            let keys = '';
            let vals = '';

            foreach(5, function(key, value) {
                keys += key;
                vals += value;
            });

            console.log(`    ${keys} ${vals}`);

            if (keys === '01234' && vals === '12345') {
                accept();
            } else {
                reject();
            }
        })
        .try(test.color.yellow('Iterating arguments will create "01" and 2.'), function(accept, reject) {
            let keys = '';
            let vals = 0;

            foreach(arguments, function(key) {
                keys += key;
                vals += 1;
            });

            console.log(`    ${keys} ${vals}`);

            if (keys === '01' && vals === 2) {
                accept();
            } else {
                reject();
            }
        })
        .queue(true);

    test(foreach)
        .try(test.color.yellow('Wait mode iteration {a: 1, b: 2} will create "ab" and "12".'), function(accept, reject) {
            let keys = '';
            let vals = '';

            foreach({a: 1, b: 2})
                .run(function(key, value, next) {
                    keys += key;
                    vals += value;

                    setTimeout(next, 50);
                })
                .then(function() {
                    console.log(`    ${keys} ${vals}`);

                    if (keys === 'ab' && vals == '12') {
                        accept();
                    } else {
                        reject();
                    }
                });
        })
        .try(test.color.yellow('Wait mode iteration [1, 2, 3] will create "012" and "123".'), function(accept, reject) {
            let keys = '';
            let vals = '';

            foreach([1, 2, 3])
                .run(function(key, value, next) {
                    keys += key;
                    vals += value;

                    setTimeout(next, 50);
                })
                .then(function() {
                    console.log(`    ${keys} ${vals}`);

                    if (keys === '012' && vals == '123') {
                        accept();
                    } else {
                        reject();
                    }
                });
        })
        .try(test.color.yellow('Wait mode iteration [1, 2, 3, 4, 5, 6] will break on 4.'), function(accept, reject) {
            let keys = '';
            let vals = '';

            foreach([1, 2, 3, 4, 5, 6])
                .run(function(key, value, next, stop) {
                    keys += key;
                    vals += value;

                    if (value === 4) {
                        stop();
                    } else {
                        next();
                    }
                })
                .catch(function() {
                    console.log(`    ${keys} ${vals}`);

                    if (keys === '0123' && vals == '1234') {
                        accept();
                    } else {
                        reject();
                    }
                });
        })
        .queue(true);
}
