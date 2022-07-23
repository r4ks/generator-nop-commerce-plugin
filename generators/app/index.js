var Generator = require('yeoman-generator');
var yeoman = require('yeoman-environment');
var env = yeoman.createEnv();
var beautify = require("gulp-beautify");

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        // This method adds support for a '--babel' flag
        this.option('babel');

        this.helperMethod = function() {
            console.log('won\'t be called automatically.');
        }

        // stream transformers:
        // this.registerTransformStream(beautify({ indent_size: 2 }));
        // this.queueTransformStream(beautify({ indent_size: 2 }));
    }

    _private_method() {
        console.log('private hey...');
    }

    paths() {
        // prints the project root path
        console.log(this.destinationRoot());

        // prints the project root index.js
        console.log(this.destinationPath('index.js'));

        // returns the path where the user is executing yo
        console.log(this.contextRoot);

        // prints the templates folder
        console.log(this.sourceRoot());

        //prints the template index.js
        console.log(this.templatePath('index.js'));
    }


    initialConfig() {
        this.log('...');
    }

    async prompting() {
         this.answers = await this.prompt([
            {
                type: "input",
                name: "username",
                message: "What is your GitHub username?",
                store: true
            },
            {
                type: "input",
                name: "name",
                message: "Your Plugin Name",
                default: this.appname
            },
            {
                type: "confirm",
                name: "menusOnPluginsNode",
                message: "Do you wish to put the menu items inside the standard Plugins Menu Category?",
                default: false
            }
        ]);

    }

    writing() {
        this.log("app name", this.answers.name);
        this.log("menus inside plugins category", this.answers.menusOnPluginsNode);

        this.fs.copyTpl(
            this.templatePath("index.html"),
            this.destinationPath("public/index.html"),
            { title: this.answers.name }
        );
    }
};
