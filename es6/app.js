let currentPlayerRotate = -1,
    room_copy = [];

const rotate = require( './rotate.js' );

/**
 * 
 */
function key_check() {
    if ( ( window.curPlayerDirection != -1 ) && ( currentPlayerRotate != window.curPlayerDirection ) ) {
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

                break;

                //right
            case 3:
                rotate.reset( 'SPR_A' );
                rotate.reset( 'TIL_a' );

                break;
        }
    }
}

function overlay() {

}

function custom_keys( e ) {
    console.log( ' custom_keys keyDownList', keyDownList );

    // rotate player on grid
    let _player = player();

    switch ( e.key ) {
        case "e":
            room_copy[ 1 ].tilemap[ _player.y ][ _player.x ] = "-1";

            rotate._cw( room_copy[ 0 ].tilemap );
            rotate._cw( room_copy[ 1 ].tilemap );
            break;

        case "q":
            room_copy[ 1 ].tilemap[ _player.y ][ _player.x ] = "-1";

            rotate._ccw( room_copy[ 0 ].tilemap );
            rotate._ccw( room_copy[ 1 ].tilemap );
            break;

        default:
            return;
            break;
    }

    // pause bitsy updater
    //clearInterval( window.update_interval );

    room[ 0 ].tilemap = rotate.copy( room_copy[ 0 ].tilemap );
    room[ 1 ].tilemap = rotate.copy( room_copy[ 1 ].tilemap );

    room[ 1 ].tilemap.map( ( row, y ) => {
        row.map( ( col, x ) => {
            if ( col == '-1' ) {
                room_copy[ 1 ].tilemap[ y ][ x ] = "0";

                _player.x = x;
                _player.y = y;
            } else if( col == 'c' ){
                room[ 0 ].tilemap[ y - 1 ][ x ] = (room[ 0 ].tilemap[ y ][ x ] == "b") ? "d" : "c";
            }
        } );
    } );
}
window.addEventListener( 'keydown', custom_keys );

function init() {
    if ( imageStore.source.SPR_A ) {
        rotate.init();

        room_copy = rotate.copy( room );

        clearInterval( init_interval );
        setInterval( key_check, 50 );
    }
}

let init_interval = setInterval( init, 50 );