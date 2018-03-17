let cache = [];

class rotate {

    static init() {
        cache = this.copy( window.imageStore.source );
    }

    /**
     * 
     * @param {*} to_copy 
     */
    static copy( to_copy ) {
        //console.log('cache',cache);
        //alert();
        return JSON.parse( JSON.stringify( to_copy ) );
    }

    /**
     * 
     * @param {*} to_copy 
     */
    static get_cached( to_copy ) {
        return JSON.parse( JSON.stringify( cache[ to_copy ] ) );
    }

    /**
     * 
     * @param string id 
     */
    static cw( id ) {
        let sprite_array = this.get_cached( id );

        sprite_array.map( ( frame, i ) => {
            frame = this._cw( frame );
        } );

        window.imageStore.source[ id ] = sprite_array;

        window.renderImages();
    }

    /**
     * 
     * @param array a 
     */
    static _cw( a ) {
        var n = a.length;
        for ( var i = 0; i < n / 2; i++ ) {
            for ( var j = i; j < n - i - 1; j++ ) {
                var tmp = a[ i ][ j ];
                a[ i ][ j ] = a[ n - j - 1 ][ i ];
                a[ n - j - 1 ][ i ] = a[ n - i - 1 ][ n - j - 1 ];
                a[ n - i - 1 ][ n - j - 1 ] = a[ j ][ n - i - 1 ];
                a[ j ][ n - i - 1 ] = tmp;
            }
        }
        return a;
    }

    /**
     * 
     * @param string id 
     */
    static ccw( id ) {
        let sprite_array = this.get_cached( id );

        sprite_array.map( ( frame, i ) => {
            frame = this._ccw( frame );
        } );

        window.imageStore.source[ id ] = sprite_array;

        window.renderImages();
    }

    /**
     * 
     * @param array a 
     */
    static _ccw( a ) {
        var n = a.length;
        for ( var i = 0; i < n / 2; i++ ) {
            for ( var j = i; j < n - i - 1; j++ ) {
                var tmp = a[ i ][ j ];
                a[ i ][ j ] = a[ j ][ n - i - 1 ];
                a[ j ][ n - i - 1 ] = a[ n - i - 1 ][ n - j - 1 ];
                a[ n - i - 1 ][ n - j - 1 ] = a[ n - j - 1 ][ i ];
                a[ n - j - 1 ][ i ] = tmp;
            }
        }
        return a;
    }

    /**
     * 
     * @param string id 
     */
    static flip_h( id ) {
        let sprite_array = this.get_cached( id );

        sprite_array.map( ( frame, i ) => {
            frame = this._flip_h( frame );
        } );

        window.imageStore.source[ id ] = sprite_array;

        window.renderImages();
    }

    /**
     * 
     * @param array a 
     */
    static _flip_h( a ) {
        a.map( ( x ) => {
            x.reverse();
        } );
    }

    /**
     * 
     * @param string id 
     */
    static reset( id ) {
        let sprite_array = this.get_cached( id );

        window.imageStore.source[ id ] = sprite_array;

        window.renderImages();
    }
}

module.exports = rotate;