'use strict';

/**
 * Iterate Object, Array, Arguments, String, Number and NodeList, support reversed mode.
 *
 * @param {array|object|arguments|string|nodelist|number} object - Object to iterate.
 * @param {function} handler - Function to handle direct iteration, like array.forEach().
 * @param {boolean} [reversed=false] - Does the iteration is reversed or not.
 * @returns {JSMicroIterator}
 * @constructor
 */
function JSMicroIterator(object, handler, reversed) {
    // Save the object and handler.
    this.object = object;
    this.handler = handler;

    // Create the object type and status.
    this.type = toString.call(object).replace(/(\[object\s+)|(\])/g, '').toLowerCase();
    this.status = 'ready';

    // Create the waiting mode handlers.
    this.resolve = null;
    this.reject = null;

    // Start in direct mode if handler is defined.
    if ('function' === typeof handler) {
        this.start(handler, reversed);
        this.status = 'completed';
    }

    return this;
}

JSMicroIterator.prototype = {
    start: start,
    run: run,
    then: resolve,
    catch: reject
};

/**
 * Start the direct iteration.
 *
 * @param {function} handler - Function to handle the iteration.
 * @param {boolean} [reversed=false] - Does the iteration is reversed or not.
 * @returns {start}
 */
function start(handler, reversed) {
    var self = this;
    var i;

    // Creating key and value list.
    var list = [];

    // Collecting key and value depend on the object type.
    switch (this.type) {
        case 'object':
            Object.keys(this.object).forEach(function(key) {
                list.push({key: key, value: self.object[key]});
            });

            break;
        case 'array':
            self.object.forEach(function(item, i) {
                list.push({key: i, value: item});
            });

            break;
        case 'arguments':
            for (i = 0; i < self.object.length; ++i) {
                list.push({key: i, value: self.object[i]});
            }

            break;
        case 'string':
            self.object.split('').forEach(function(item, i) {
                list.push({key: i, value: item});
            });

            break;
        case 'number':
            for (i = 0; i < this.object; ++i) {
                list.push({key: i, value: (i + 1)});
            }

            break;
        default:
            throw new Error('The given object is not supported by "foreach" iterator.');
    }

    // Do reversed iteration if required.
    if (reversed) {
        for (i = list.length; i > 0; --i) {
            handler.call(self, list[i - 1].key, list[i - 1].value);
        }
    }

    // Do standard iteration if no reversal required.
    else {
        list.forEach(function(item) {
            handler.call(self, item.key, item.value);
        });
    }

    return this;
}

/**
 * Run iteration on waiting mode.
 *
 * @param {function} handler - Function to handle the each items.
 * @param {boolean} [reversed=false] - Does the iteration should be reversed or not.
 * @returns {run}
 */
function run(handler, reversed) {
    // Save the handler.
    this.handler = handler;

    // Wrapping it self, create current position, and create items list.
    var self = this;
    var cursor = 0;
    var list = [];

    // Collect the key and values.
    this.start(function(key, value) {
        list.push({key: key, value: value});
    }, reversed);

    // Get the initial item.
    next();

    // Get the next items and call the resolver when done.
    function next() {
        // Get the items only when the current position is less than items length.
        if (cursor < list.length) {
            // Get the item by cursor position.
            var item = list[cursor];

            // Increase the position.
            cursor += 1;

            // Call the iteration handler.
            handler.call(self, item.key, item.value, next, stop);
        } else {
            // Mark the iterator as complete.
            self.status = 'complete';

            // Call the resolver if defined.
            if ('function' === typeof self.resolve) {
                self.resolve(self);
            }
        }
    }

    // Stop the iteration with or without reason.
    function stop(error) {
        // Change iteration status to stopped.
        self.status = 'stopped';
        self.error = error;

        // Call the stop handler if defined, and give the given reason.
        if ('function' === typeof self.reject) {
            self.reject.call(self, error);
        }
    }

    return this;
}

/**
 * Create handler to handle the iteration when done.
 *
 * @param {function} handler - Function to handle when the iteration is done.
 * @returns {resolve}
 */
function resolve(handler) {
    // Save the handler.
    this.resolve = handler;

    // Call the handler directly if the status is already completed.
    if (this.status === 'complete' && 'function' === typeof handler) {
        handler.call(this);
    }

    return this;
}

/**
 * Create handler to handle the iteration when stopped.
 *
 * @param {function} handler - Function to handle when the iteration stopped.
 * @returns {reject}
 */
function reject(handler) {
    this.reject = handler;

    if (this.status === 'stopped' && 'function' === typeof handler) {
        handler.call(this, this.error);
    }

    return this;
}

/**
 * Iterate Object, Array, Arguments, String, Number and NodeList, support reversed mode.
 *
 * @param {array|object|arguments|string|nodelist|number} object - Object to iterate.
 * @param {function} handler - Function to handle direct iteration, like array.forEach().
 * @param {boolean} [reversed=false] - Does the iteration is reversed or not.
 * @returns {JSMicroIterator}
 */
function foreach(object, handler, reversed) {
    return new JSMicroIterator(object, handler, reversed);
}

// Add the iterator to global.
if (!global.hasOwnProperty('foreach')) global.foreach = foreach;

// Export the iterator.
module.exports = foreach;
