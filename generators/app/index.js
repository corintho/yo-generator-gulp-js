'use strict';
var Base = require('../../util/base.js'),
    chalk = require('chalk'),
    prompting = require('../../util/prompting.js');

module.exports = Base.extend({
  constructor: function() {
    Base.apply(this, arguments);
    //TODO Define options and arguments
//    this.option('generate-comments');
//    this.argument('appname', {type: String, required: false, desc: 'Application name'});
//    this.appname = this._.camelize(this.appname);
//    this.comments = !!this.options.generateComments;
  },

  initializing: function() {
    //TODO import from template?
    this.bowerFile = {}; //this.src.readJSON('_bower.json');

    //Default values. Imported from external file for organization and brevity
    this.config.defaults(require('../../config.js'));
  },

  //User prompts
  prompting: {
    //General prompts
    general: function() {
      var done = this.async(),
          questions = [];
      questions.push({
        type: 'confirm',
        name: 'comments',
        message: 'Generate comments: ',
        default: this.config.get('generateComments')
      },
      {
        type: 'confirm',
        name: 'editorConfig',
        message: 'Generate editorConfig: ',
        default: this.config.get('editorConfig').generate
      }
      );
      this.prompt(questions, function(answers) {
        var editorConfig = this.config.get('editorConfig');
        editorConfig.generate = answers.editorConfig;
        this.config.set('generateComments', answers.comments);
        this.config.set('editorConfig', editorConfig);
        if (editorConfig.generate) {
          this.composeWith('gulp-js:editorconfig', {options: {}});
        }
        done();
      }.bind(this));
    }
  },

  default: {},

  writing: {
    dependencies: function() {
      //TODO Manage dependencies
      this.npmInstall(['gulp'], {saveDev: true});
    }
  },

  install: {},

  end: {}
});
