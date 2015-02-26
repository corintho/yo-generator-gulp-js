'use strict';
var Base = require('../../util/base.js'),
    chalk = require('chalk'),
    prompting = require('../../util/prompting.js');

module.exports = Base.extend({
  constructor: function () {
    Base.apply(this, arguments);
  },

  initializing: function() {
    this.log('Initializing sub generator');
  },

  prompting: function() {
    var done = this.async();
    this.prompt(
      {
        type: 'expand',
        name: 'configureEC',
        message: 'Change editorConfig configuration: ',
        choices: [
          {
            key: 'y',
            name: 'Change configuration',
            value: true
          },
          {
            key: 'n',
            name: 'Don\'t change configuration',
            value: false
          },
          {
            key: 'd',
            name: 'Display configuration',
            value: 'display'
          }
        ],
        default: 1
      }, function (answers) {
        if (answers.configureEC === 'display') {
          this.log(JSON.stringify(this.config.get('editorConfig'), null, 2));
          this.log(JSON.stringify(this.config.get('codeStyle'), null, 2));
          return this.prompting();
        }
        if (answers.configureEC) {
          var questions = [],
              identStyles = [
                'space',
                'tab'
                ],
              eol = [
                'lf',
                'cr',
                'crlf'
              ],
              charset = [
                {name: 'latin1', value: 'latin1'},
                {name: 'utf-8', value: 'utf-8'},
                {name: 'utf-16be', value: 'utf-16be'},
                {name: 'utf-16le', value: 'utf-16le'},
                {name: chalk.red('utf-8-bom'), value: 'utf-8-bom'},
              ];
          questions.push({
            type: 'list',
            name: 'identStyle',
            message: 'Identation style:',
            choices: identStyles,
            default: identStyles.indexOf(this.config.get('codeStyle').identStyle)
          },
          {
            type: 'input',
            name: 'identSize',
            message: 'Identation size: ',
            default: this.config.get('codeStyle').identSize,
            when: function (answers) {return answers.identStyle === 'space';}
          },
          {
            type: 'list',
            name: 'endOfLine',
            message: 'End of line character: ',
            choices: eol,
            default: eol.indexOf(this.config.get('editorConfig').endOfLine)
          },
          {
            type: 'list',
            name: 'charset',
            message: 'Character set: ',
            choices: charset,
            default: prompting.findValue(charset, this.config.get('editorConfig').charset)
          }
          );
          this.prompt(questions, function(answers) {
            var codeStyle = this.config.get('codeStyle'),
                editorConfig = this.config.get('editorConfig');
            codeStyle.identStyle = answers.identStyle;
            if (answers.identStyle === 'space') {
              codeStyle.identSize = answers.identSize;
            }
            editorConfig.endOfLine = answers.endOfLine;
            editorConfig.charset = answers.charset;
            this.config.set('codeStyle', codeStyle);
            this.config.set('editorConfig', editorConfig);
            done();
          }.bind(this));
        } else {
          done();
        }
      }.bind(this)
    );
  },

  configuring: function() {
    if (this.config.get('editorConfig').generate) {
      this.fs.copyTpl(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig'),
        {generateComments: this.config.get('generateComments'),
         editorConfig: this.config.get('editorConfig'),
         codeStyle: this.config.get('codeStyle')}
      );
    }
  }

});
