var utils = require('./../infrastructure/utils');

/**
 * Throws an exception if any individuals have less than two genes
 * @param {Individual[]} individuals - An array of individuals to validate
 * @throws An exception is thrown if any individuals have less than two genes
 */
var validateMinimumLength = function (individuals) {
    if (individuals[0].body.length < 2 || individuals[0].body.length < 2) {
        throw "individuals must have at least two genes for crossover";
    }
};

/**
 * Throws an exception if any individuals are not fixed length
 * @param {Individual[]} individuals - An array of individuals to validate
 * @throws An exception is thrown if any individuals are not fixed length
 */
var validateFixedLength = function (individuals) {
    if (!(individuals[0].isFixedLength() && individuals[1].isFixedLength())) {
        throw "individuals must be of a fixed length for crossover";
    }
};

/**
 * Throws an exception if any individuals are fixed length
 * @param {Individual[]} individuals - An array of individuals to validate
 * @throws An exception is thrown if any individuals are fixed length
 */
var validateVariableLength = function (individuals) {
    if (individuals[0].isFixedLength() || individuals[1].isFixedLength()) {
        throw "individuals must be of variable length for crossover";
    }
};

/**
 * Swaps genes between two individuals at the specified index
 * @param {Individual} indvidualA - The first individual
 * @param {Individual} indvidualB - The second individual
 * @param {number} index - Body array index to swap genes at
 */
var swapGenes = function (indvidualA, indvidualB, index) {
    var temp = indvidualA.body[index];
    indvidualA.body[index] = indvidualB.body[index];
    indvidualB.body[index] = temp;
};

/**
 * Performs one point fixed crossover
 * @param {Individual[]} individuals - An array containing two individuals
 * @returns {Individual[]} An array containing two offspring
 */
exports.onePointFixed = function (individuals) {
    validateMinimumLength(individuals);
    validateFixedLength(individuals);
    var offspringA = individuals[0].copy();
    var offspringB = individuals[1].copy();
    var cut = utils.randBetween(0, offspringA.body.length - 1);
    for (var i = cut; i < offspringA.body.length; i++) {
        swapGenes(offspringA, offspringB, i);
    }
    return [offspringA, offspringB];
};

/**
 * Performs two point fixed crossover
 * @param {Individual[]} individuals - An array containing two individuals
 * @returns {Individual[]} An array containing two offspring
 */
exports.twoPointFixed = function (individuals) {
    validateMinimumLength(individuals);
    validateFixedLength(individuals);
    var offspringA = individuals[0].copy();
    var offspringB = individuals[1].copy();
    var cutA = utils.randBetween(0, offspringA.body.length - 2);
    var cutB = utils.randBetween(cutA + 1, offspringA.body.length - 1);
    for (var i = cutA; i < cutB; i++) {
        swapGenes(offspringA, offspringB, i);
    }
    return [offspringA, offspringB];
};

/**
 * Performs uniform crossover
 * @param {Individual[]} individuals - An array containing two individuals
 * @returns {Individual[]} An array containing two offspring
 */
exports.uniform = function (individuals) {
    validateMinimumLength(individuals);
    validateFixedLength(individuals);
    var offspringA = individuals[0].copy();
    var offspringB = individuals[1].copy();
    for (var i = 0; i < offspringA.body.length; i++) {
        if (utils.random() < 0.5) {
            swapGenes(offspringA, offspringB, i);
        }
    }
    return [offspringA, offspringB];
};

/**
 * Performs one point variable crossover
 * @param {Individual[]} individuals - An array containing two individuals
 * @returns {Individual[]} An array containing two offspring
 */
exports.onePointVariable = function (individuals) {
    validateMinimumLength(individuals);
    validateVariableLength(individuals);
    var offspringA = individuals[0].copy();
    var offspringB = individuals[1].copy();
    var cutA = utils.randBetween(0, offspringA.body.length);
    var cutB = utils.randBetween(0, offspringB.body.length);
    offspringA.body = individuals[0].body.slice(0, cutA).concat(individuals[1].body.slice(cutB, individuals[1].body.length));
    offspringB.body = individuals[1].body.slice(0, cutB).concat(individuals[0].body.slice(cutA, individuals[0].body.length));
    return [offspringA, offspringB];
};

/**
 * Performs two point variable crossover
 * @param {Individual[]} individuals - An array containing two individuals
 * @returns {Individual[]} An array containing two offspring
 */
exports.twoPointVariable = function (individuals) {
    validateMinimumLength(individuals);
    validateVariableLength(individuals);
    var offspringA = individuals[0].copy();
    var offspringB = individuals[1].copy();
    var cutA, cutB, cutC, cutD;
    while (true) {
        cutA = utils.randBetween(0, offspringA.body.length - 2);
        cutB = utils.randBetween(cutA + 1, offspringA.body.length - 1);
        cutC = utils.randBetween(0, offspringB.body.length - 2);
        cutD = utils.randBetween(cutC + 1, offspringB.body.length - 1);
        var newSizeA = offspringA.body.length - (cutB - cutA) + (cutD - cutC);
        var newSizeB = offspringB.body.length - (cutD - cutC) + (cutB - cutA);
        if (newSizeA <= offspringA.options.maxLength &&
            newSizeA >= offspringA.options.minLength &&
            newSizeB <= offspringB.options.maxLength &&
            newSizeB >= offspringB.options.minLength) {
            break;
        }
    }
    offspringA.body = individuals[0].body.slice(0, cutA);
    offspringB.body = individuals[1].body.slice(0, cutC);
    offspringA.body = offspringA.body.concat(individuals[1].body.slice(cutC, cutD));
    offspringB.body = offspringB.body.concat(individuals[0].body.slice(cutA, cutB));
    offspringA.body = offspringA.body.concat(individuals[0].body.slice(cutB, individuals[0].body.length));
    offspringB.body = offspringB.body.concat(individuals[1].body.slice(cutD, individuals[1].body.length));
    return [offspringA, offspringB];
};