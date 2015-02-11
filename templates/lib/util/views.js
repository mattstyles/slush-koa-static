var path = require( 'path' ),
    views = require( 'co-views' );

module.exports = views( path.join( __dirname, '../tmpl' ), {
    map: {
        hjs: 'hogan'
    },
    ext: 'hjs'
});
