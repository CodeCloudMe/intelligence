var clone = require('clone');
var utils = require('./../../infrastructure/utils');
var Individual = require('./../individual').Individual;
var RegisterSet = require('./registerSet').RegisterSet;
var LinearFunctionNode = require('./linearFunctionNode').LinearFunctionNode;
var LinearConditionalNode = require('./linearConditionalNode').LinearConditionalNode;

/**
 * Linear genetic programming individual
 * @constructor
 * @extends Individual
 * @param {object} options - Linear indivdual options
 * @param {number} options.numInputs - The number of inputs that the individual accepts
 * @param {number} options.numOutputs - The number of output the individual should return
 * @param {function[]} options.functionSet - An array of functions that are made available to the individual
 * @param {boolean} [options.removeIntrons=true] - Specify whether introns should be removed before execution
 * @param {function[]} [options.conditionalSet=[]] - An array of functions that can be used to control logic
 * @property {object} options - Linear indivdual options
 */
var LinearIndividual = function (options) {
    this.options = options;
    this.options.registerSet = new RegisterSet(clone(this.options));
    this.setDefaultOptionsIfNotProvided();
    Individual.call(this, options);
    return this;
};

utils.inherits(LinearIndividual, Individual);

/**
 * Validates the linear individuals current options
 * @throws An exception will occur if a required option is missing
 * @returns {LinearIndividual} Reference to current object for chaining
 */
LinearIndividual.prototype.validateRequiredOptions = function () {
    Individual.prototype.validateRequiredOptions.call(this);
    if (!this.options.numInputs) {
        throw "option 'numInputs' is required";
    } else if (!this.options.numOutputs) {
        throw "option 'numOutputs' is required";
    } else if (!this.options.functionSet) {
        throw "option 'functionSet' is required";
    }
    return this;
};

/**
 * Sets default values for options that have not been defined
 * @returns {LinearIndividual} Reference to current object for chaining
 */
LinearIndividual.prototype.setDefaultOptionsIfNotProvided = function () {
    if (this.options.removeIntrons === undefined) {
        this.options.removeIntrons = true;
    }
    if (!this.options.conditionalSet) {
        this.options.conditionalSet = [];
    }
};

/**
 * Executes the liner code represented by the indivduals body
 * @param {object[]} An array of inputs
 * @returns {object[]} An array of outputs
 */
LinearIndividual.prototype.execute = function (inputs) {
    var i = 0;
    this.options.registerSet.setInputs(inputs);
    while (i < this.body.length) {
        var node = this.body[i];
        if (node instanceof LinearFunctionNode) {
            node.execute(this.options.registerSet);
        } else if (node instanceof LinearConditionalNode) {
            if (!node.execute(this.options.registerSet)) {
                while (this.body[i] instanceof LinearConditionalNode) {
                    i++;
                }
            }
        } else {
            throw "unknown node type";
        }
        i++;
    }
    return this.options.registerSet.getOutputNodes();
};

/**
 * Removes all structurally noneffective code until the body length reaches the minimum allowed length
 * @returns {LinearIndividual} Reference to current object for chaining
 */
LinearIndividual.prototype.removeIntrons = function () {

};

/**
 * Returns a string containing an executable representation of the individual
 * @returns {string} A string containing an executable representation of the individual
 */
LinearIndividual.prototype.toString = function () {
    var toReturn = "";
    var numIndents = 0;
    for (var i = 0; i < this.body.length; i++) {
        var node = this.body[i];
        for (var j = 0; j < numIndents; j++) {
            toReturn += "\t";
        }
        toReturn += node.toString() + "\n";
        if (node instanceof LinearFunctionNode) {
            numIndents = 0;
        } else {
            numIndents += 1;
        }
    }
    return toReturn;
};

exports.LinearIndividual = LinearIndividual;