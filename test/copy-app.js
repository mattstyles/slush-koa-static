'use strict';

var os = require( 'os' );

var test = require( 'tape' );
var mockPrompt = require( './utils/mockPrompt' );
var gulp = require( 'gulp' );
var mockGulpDest = require( 'mock-gulp-dest' )( gulp );

require( '../slushfile' );

process.chdir( os.tmpDir() );

test( 'Project scaffold', function( t ) {
    t.plan( 2 );

    mockPrompt({
        name: 'test koa-static'
    });

    gulp.start( 'default' )
        .once( 'stop', function() {
            mockGulpDest.assertDestContains([
                'package.json',
                'bower.json',
                'README.md'
            ]);
            t.pass( 'Build files included' );

            mockGulpDest.assertDestContains([
                '.bowerrc',
                '.gitignore',
                '.jshintrc'
            ]);
            t.pass( 'Dotfiles included' );
        });
});
