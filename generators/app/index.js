var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        // This method adds support for a '--babel' flag
        this.option('babel');

        this.helperMethod = function() {
            console.log('won\'t be called automatically.');
        }
    }

    _private_method() {
        console.log('private hey...');
    }


    initialConfig() {
        this.log('...');
    }

};