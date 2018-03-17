let currentPlayerRotate = -1;
let sprite_copy;

//const rotate = require('../../../../tools/hacker/es6/rotate.js');
const rotate = require( './rotate.js' );

/**
 * 
 */
function key_check() {

    // walkingPath
    // curRoom

    if ( ( window.curPlayerDirection != -1 ) && ( currentPlayerRotate != window.curPlayerDirection ) ) {
        console.log( 'window.curPlayerDirection', window.curPlayerDirection );

        currentPlayerRotate = window.curPlayerDirection;

        switch ( window.curPlayerDirection ) {
            // up
            case 0:
                rotate.ccw( 'SPR_A' );
                rotate.ccw( 'TIL_a' );
                break;

                //down
            case 1:
                rotate.cw( 'SPR_A' );
                rotate.cw( 'TIL_a' );
                break

                //left
            case 2:
                rotate.flip_h( 'SPR_A' );
                rotate.flip_h( 'TIL_a' );

                //rotate._rotateCCW( room[ 0 ].tilemap );
                break;

                //right
            case 3:
                rotate.reset( 'SPR_A' );
                rotate.reset( 'TIL_a' );

                //rotate._rotateCW( room[ 0 ].tilemap );
                break;
        }

        renderImages();
    }
}

function copy( to_copy ) {
    return JSON.parse( JSON.stringify( to_copy ) );
}

function init() {
    if ( imageStore.source.SPR_A ) {
        rotate.cache = copy( imageStore.source );
        
        clearInterval( init_interval );
        setInterval( key_check, 50 );
    }
}

let init_interval = setInterval( init, 50 );