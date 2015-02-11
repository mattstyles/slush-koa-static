/**
 * <%= appName %>
 */

var path        = require( 'path' ),

    koa         = require( 'koa' ),
    logger      = require( 'koa-logger' ),
    serve       = require( 'koa-static' ),
    route       = require( 'koa-route' ),
    mount       = require( 'koa-mount' ),

    render      = require( './util/views' ),

    app;


app = koa();

app.use( logger() );


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
app.use( serve( path.join( __dirname, '../public' ) ) );


// Export composable app
module.exports = app;
