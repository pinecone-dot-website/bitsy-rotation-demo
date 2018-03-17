module.exports = {
    cache: [],

    copy: function( to_copy ) {
        return JSON.parse( JSON.stringify( this.cache[ to_copy ] ) );
    },

    ccw: function( id ) {
        let sprite_array = this.copy( id );

        sprite_array.map( ( frame, i ) => {
            frame = this._rotateCCW( frame );
        } );

        imageStore.source[ id ] = sprite_array;
    },

    cw: function( id ) {

        let sprite_array = this.copy( id );

        sprite_array.map( ( frame, i ) => {
            frame = this._rotateCW( frame );
        } );

        imageStore.source[ id ] = sprite_array;
    },

    flip_h: function( id ) {
        let sprite_array = this.copy( id );

        sprite_array.map( ( frame, i ) => {
            frame = this._flipH( frame );
        } );

        imageStore.source[ id ] = sprite_array;
    },

    reset: function( id ) {
        let sprite_array = this.copy( id );

        imageStore.source[ id ] = sprite_array;
    },

    _flipH: function( a ) {
        a.map( ( x ) => {
            x.reverse();
        } );
    },

    _rotateCCW: function( a ) {
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
    },

    _rotateCW: function( a ) {
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
};