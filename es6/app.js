let currentPlayerRotate = -1,
    items_copy = [],
    room_copy = [],
    floors = 3;

const rotate = require( './rotate.js' );
window.rotate = rotate;

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
                break;

                //down
            case 1:
                rotate.cw( 'SPR_A' );
                break

                //left
            case 2:
                rotate.flip_h( 'SPR_A' );

                break;

                //right
            case 3:
                rotate.reset( 'SPR_A' );

                break;
        }
    }
}

/**
 * 
 * @param int room_id index
 * @param callable
 */
function rotate_room( room_id, rot_func ) {
    for ( let i = room_id; i < room_id + floors; i++ ) {
        // rotate the matrix
        rot_func( room_copy[ i ].tilemap );
        room[ i ].tilemap = rotate.copy( room_copy[ i ].tilemap );

        // copy floors to the base room
        room[ i ].tilemap.map( ( row, y ) => {
            let _y = Math.max( 0, y - (i - room_id) );
            
            row.map( ( col, x ) => {
                if ( col != "0" ) {
                    room[ room_id ].tilemap[ _y ][ x ] = col;
                }
            } );
        } );
    }
}

/**
 * 
 * @param array tiles 
 * @param callable
 */
function rotate_tiles( tiles, rot_func ) {
    // turn arrow tiles
    tiles.forEach( ( e ) => {
        imageStore.source[ `TIL_${e}` ].map( ( frame, i ) => {
            frame = rot_func( frame );
        } );
    } )

    window.renderImages();
}

function rotate_player_pos( rot_func ){
    let _player = player(),
        tmp_room = [
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    ];

    tmp_room[ _player.y ][ _player.x ] = "p";

    rot_func(tmp_room);

    tmp_room.filter((col, y)=>{
        let _col = col.filter((row,x)=>{
            if( row == 'p' ){
                _player.x = x;
                 _player.y =y;
            };
        });
    });
}

function custom_keys( e ) {
    //console.log( ' custom_keys keyDownList', keyDownList );

    // rotate player on grid
    let _player = player(),
        rot_func,
        _cur_room = parseInt( curRoom, 10 );

    switch ( e.key ) {
        // use this.floors !
        case "e":
            rot_func = rotate._cw;
            break;

        case "q":
            rot_func = rotate._ccw;
            break;

        default:
            return;
            break;
    }

    rotate_room( _cur_room, rot_func );
    
    rotate_tiles( [ 'e', 'f', 'g', 'h', 'i', 'j', 'm', 'n' ], rot_func );

    rotate_player_pos( rot_func );

    /*
    room[ _cur_room + 1 ].tilemap.map( ( row, y ) => {
        let _y = Math.max( 0, y - 1 );

        row.map( ( col, x ) => {
            
            if ( col == '-1' ) {
                room_copy[ _cur_room + 1 ].tilemap[ y ][ x ] = "0";
                //alert( 'player found!' );
                _player.x = x;
                _player.y = y;
            } else
             if ( col != "0" ) {
                room[ _cur_room ].tilemap[ _y ][ x ] = col;
            }
        } );
    } );

    room[ _cur_room + 2 ].tilemap.map( ( row, y ) => {
        let _y = Math.max( 0, y - 2 );

        row.map( ( col, x ) => {
            if ( col != "0" ) {
                room[ _cur_room ].tilemap[ _y ][ x ] = col;
            }
        } );
    } );
    */

    // rotate items 
    let tmp_items = [
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    ];

    // items_copy is going to store all items that are not collected, but may or may not be visible
    // get this once, before any rotations
    if ( !items_copy.length ) {
        items_copy = rotate.copy( room[ _cur_room ].items );
    }

    // next track items we picked up
    items_copy.map( ( item ) => {
        if ( room[ _cur_room ].items.filter( in_room => {
                return ( item.x == in_room.x ) && ( item.y == in_room.y );
            } ) ) {
            tmp_items[ item.y ][ item.x ] = {
                id: item.id
            };
        }
    } );

    rot_func( tmp_items );

    //
    tmp_items = tmp_items.map( ( row, y ) => {
        let row_items = row.map( ( item, x ) => {
            if ( item.id ) {
                let _on = room[ _cur_room ].tilemap[ y ][ x ] == "0";

                return {
                    id: item.id,
                    x: x,
                    y: y,
                    _on: _on
                };
            }
        } );

        return row_items;
    } );

    // remove empty ones
    tmp_items = tmp_items.map( row => {
        return row.filter( item => {
            return item !== undefined;
        } );
    } );


    // flatten array
    tmp_items = [].concat.apply( [], tmp_items );
    items_copy = tmp_items;

    // show these only
    tmp_items = tmp_items.filter( item => {
        return item._on;
    } );

    room[ _cur_room ].items = tmp_items;
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