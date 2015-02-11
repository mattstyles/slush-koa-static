var inquirer = require( 'inquirer' );

/**
 * Mock inquirer prompt
 */
module.exports = function mockPrompt( answers ) {
    inquirer.prompt = function( prompts, done ) {

        [].concat( prompts ).forEach( function( prompt ) {
              if ( !( prompt.name in answers ) ) {
                  answers[ prompt.name ] = prompt.default;
              }
        });

        done( answers );
    };
};
