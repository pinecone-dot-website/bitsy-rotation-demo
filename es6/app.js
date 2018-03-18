let currentPlayerRotate = -1,
    _curRoom,
    items_copy = [], // keyed by room id, 16x grid
    room_copy = [],
    floors = 3,
    room_rotate = 0; // 360 degrees!

const rotate = require( './rotate.js' ),
    shadow_tiles_floor = [ 'e', 'f', 'g', 'h', 'i', 'j', 'm', 'n', 'o', 'p', 'r', 's' ],
    shadow_tiles_walls = [ 'q', 't', 'u' ];

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
            let _y = ( y - ( i - room_id ) );

            if ( _y > -1 ) {
                row.map( ( col, x ) => {
                    if ( col != "0" ) {
                        room[ room_id ].tilemap[ _y ][ x ] = col;
                    }
                } );
            }
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
            console.log( 'rotate_tiles frame:', frame, 'rot_func:', rot_func );
            frame = rot_func( frame );
        } );
    } )

    window.renderImages();
}

/**
 * 
 */
function rotate_items_pos( _cur_room, rot_func ) {
    // rotate items 
    let tmp_items = rotate.empty_grid_16();

    // items_copy is going to store all items that are not collected, but may or may not be visible
    // get this once, before any rotations
    if ( !items_copy.hasOwnProperty( _cur_room ) ) {
        items_copy[ _cur_room ] = rotate.copy( room[ _cur_room ].items );
    }

    // next track items we picked up
    items_copy[ _cur_room ].map( ( item ) => {
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
                let _on = room[ _cur_room ].tilemap[ y ][ x ] == "0" || shadow_tiles_floor.includes( room[ _cur_room ].tilemap[ y ][ x ] );

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
    items_copy[ _cur_room ] = tmp_items;

    // show these only
    tmp_items = tmp_items.filter( item => {
        return item._on;
    } );

    room[ _cur_room ].items = tmp_items;
}

/**
 * 
 * @param {*} rot_func 
 */
function rotate_player_pos( rot_func ) {
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

    tmp_room[ _player.y ][ _player.x ] = 'PLAYER';

    rot_func( tmp_room );

    tmp_room.filter( ( col, y ) => {
        let _col = col.filter( ( row, x ) => {
            if ( row == 'PLAYER' ) {
                _player.x = x;
                _player.y = y;
            };
        } );
    } );
}

function custom_keys( e ) {
    //console.log( ' custom_keys keyDownList', keyDownList );

    // rotate player on grid
    let _player = player(),
        rot_func,
        _cur_room = parseInt( curRoom, 10 );

    if ( _curRoom !== _cur_room ) {
        // reset sprite rotations
        shadow_tiles_floor.map( ( id ) => {
            let tile_id = `TIL_${id}`;

            rotate.reset( tile_id );
        } );

        // store internal tracker
        _curRoom = _cur_room;

        // refesh levels
        rotate_room( _curRoom, rotate._reset );
    }

    switch ( e.key ) {
        // use this.floors !
        case "e":
            rot_func = rotate._cw;
            room_rotate = ( room_rotate + 90 ) % 360;
            break;

        case "q":
            rot_func = rotate._ccw;
            room_rotate = ( room_rotate + 270 ) % 360;
            break;

        default:
            return;
            break;
    }

    rotate_room( _cur_room, rot_func );

    rotate_tiles( shadow_tiles_floor, rot_func );

    console.log( 'room_rotate', room_rotate );

    //rotate_tiles( shadow_tiles_walls, flip v? );

    rotate_items_pos( _cur_room, rot_func );
    rotate_player_pos( rot_func );
}
window.addEventListener( 'keydown', custom_keys );

function init() {
    if ( imageStore.source.SPR_A ) {
        rotate.init();

        room_copy = rotate.copy( room );
        _curRoom = 0;

        // draw on screen
        let rot_func = rotate.copy;

        // dbugging
        window.flip_shadows_h = function() {
            rotate_tiles( shadow_tiles_walls, rotate._flip_h );
        }

        window.flip_shadows_v = function() {
            rotate_tiles( shadow_tiles_walls, rotate._flip_v );
        }

        rotate_room( 0, rot_func );
        rotate_tiles( shadow_tiles_floor, rot_func );
        rotate_items_pos( 0, rot_func );
        rotate_player_pos( rot_func );

        clearInterval( init_interval );
        setInterval( key_check, 50 );
    }
}

let init_interval = setInterval( init, 50 );