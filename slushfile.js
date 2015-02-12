/*
 * slush-koa-static
 * https://github.com/mattstyles/slush-es2015
 *
 * Copyright (c) 2015, mattstyles @personalurban
 * Licensed under WTFPL.
 */

'use strict';

var fs = require( 'fs' );
var path = require( 'path' );

var gulp = require( 'gulp' );
var $ = require( 'gulp-load-plugins' )();

var inquirer = require( 'inquirer' );
var iniparser = require( 'iniparser' );


function format( string ) {
    var username = string.toLowerCase();
    return username.replace( /\s/g, '' );
}

var defaults = (function () {
    var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
        workingDirName = process.cwd().split( '/' ).pop().split( '\\' ).pop(),
        osUserName = homeDir && homeDir.split( '/' ).pop() || 'root',
        configFile = homeDir + '/.gitconfig',
        user = {};

    if ( fs.existsSync( configFile ) ) {
        user = iniparser.parseSync( configFile ).user;

        if ( !user ) {
            user = {
                name: null,
                email: null
            };
        }
    }

    return {
        appName: workingDirName,
        userName: user.name ? format( user.name ) : osUserName,
        authorEmail: user.email ? user.email : ''
    };
})();


gulp.task( 'default', function( done ) {
    var prompts = [{
        name: 'appName',
        message: 'What is the name of your project?',
        default: defaults.appName,
        validate: function( str ) {
            return !/\s/.test( str );
        }
    }, {
        name: 'appDescription',
        message: 'What is the description?'
    }, {
        name: 'appVersion',
        message: 'What is the version of your project?',
        default: '0.0.0'
    }, {
        name: 'authorName',
        message: 'What is the author name?',
    }, {
        name: 'authorEmail',
        message: 'What is the author email?',
        default: defaults.authorEmail
    }, {
        name: 'userName',
        message: 'What is the github username?',
        default: defaults.userName
    }, {
        name: 'pkgUrl',
        message: 'What is the url of the public package?'
    }, {
        type: 'list',
        name: 'logging',
        message: 'What sort of logging will you support?',
        choices: [
            'koa-logger',
            'koa-logging',
            'koa-bunyan-logger'
        ]
    }, {
        type: 'confirm',
        name: 'continue',
        message: 'Continue?',
        default: true
    }];
    //Ask
    inquirer.prompt( prompts, function ( answers ) {
        if ( !answers.continue ) {
            return done();
        }

        if ( answers.pkgUrl ) {
            answers.pkgName = answers.pkgUrl.replace( /\-(.+)tgz$/g, '' ).split( '/' ).pop();
        }

        var templates = [
            path.join( __dirname, 'templates/**' )
        ];

        if ( !answers.pkgUrl ) {
            templates.push( path.join( __dirname, 'public-templates/**' ) );
        }

        // Start scaffold
        return gulp.src( templates )
            .pipe( $.template( answers ) )
            .pipe( $.rename( function( file ) {
                if ( file.basename[0] === '_' ) {
                    file.basename = '.' + file.basename.slice( 1 );
                }
            }))
            .pipe( $.conflict( './' ) )
            .pipe( gulp.dest( './' ) )
            .pipe( $.install() )
            .on( 'finish', function () {
                done();
            });
    });
});
