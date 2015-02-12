/**
 * <%= appName %>
 */

var path        = require( 'path' );

var koa         = require( 'koa' );
<% if ( logging === 'koa-logger' ) { %>var logger      = require( 'koa-logger' );<% } %><% if ( logging === 'koa-logging' ) { %>var logger      = require( 'koa-logging' );<% } %><% if ( logging === 'koa-bunyan-logger' ) { %>var logger      = require( 'koa-bunyan-logger' );<% } %>
var serve       = require( 'koa-static' );
var route       = require( 'koa-route' );
var mount       = require( 'koa-mount' );

var render      = require( './util/views' );

<% if ( pkgUrl ) { %>var <%= pkgName %> = require( '<%= pkgName %>' );<% } %>

var app = koa();

app.use( logger() );
<% if ( logging === 'koa-bunyan-logger' ) { %>app.use( logger.requestLogger() );<% } %>

// Custom 404
app.use( function *( next ) {
    yield next;

    if ( this.body || !this.idempotent ) {
        return;
    }

    this.status = 404;
    this.body = yield render( '404' );
});


// Serve the frontend
<% if ( pkgUrl ) { %>app.use( serve( <%= pkgName %> ) );<% } else { %>app.use( serve( path.join( __dirname, '../public' ) ) );<% } %>


// Export composable app
module.exports = app;
