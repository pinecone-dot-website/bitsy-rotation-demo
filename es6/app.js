let currentPlayerRotate = -1,
    _curRoom,
    exits_copy = [], // keyed by room id, 16x grid
    items_copy = [], // keyed by room id, 16x grid
    room_copy = [],
    room_init = [], // keyed by room id, original contents of room, never to be rotated
    floors = 3,
    room_rotate = 0; // 360 degrees!

const rotate = require( './rotate.js' ),
    shadow_tiles_floor = [ 'e', 'f', 'g', 'h', 'i', 'j', 'm', 'n', 'o', 'p', 'r', 's', 'w' ],
    shadow_tiles_walls = [ 'q', 't', 'u' ];

// debugging
window.items_copy = items_copy;
window.room_init = room_init;
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
    }

    refresh_room( room_id );
}

/**
 * copy the floors from the nex x levels to build 3d
 * @param int room_id 
 */
function refresh_room( room_id ){
    for ( let i = room_id; i < room_id + floors; i++ ) {
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
window.refresh_room = refresh_room;

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

/**
 * @todo consolidate duplicate logic with rotate_items_pos, implement rotate endings
 * @param {*} _cur_room 
 * @param {*} rot_func 
 */
function rotate_exits_pos( _cur_room, rot_func ) {
    // empty 16x grid
    let tmp_exits = rotate.empty_grid_16();

    // get this once, before any rotations
    exits_copy[ _cur_room ] = rotate.copy( room[ _cur_room ].exits );

    // next track items we picked up
    exits_copy[ _cur_room ].map( ( exit ) => {
        tmp_exits[ exit.y ][ exit.x ] = {
            dest: exit.dest
        };
    } );

    rot_func( tmp_exits );

    tmp_exits = tmp_exits.map( ( row, y ) => {
        let row_items = row.map( ( exit, x ) => {
            if ( exit.dest ) {
                //
                let _on = true; //room[ _cur_room ].tilemap[ y ][ x ] == "l" || shadow_tiles_floor.includes( room[ _cur_room ].tilemap[ y ][ x ] );

                return {
                    dest: exit.dest,
                    x: x,
                    y: y,
                    _on: _on
                };
            }
        } );

        return row_items;
    } );

    // remove empty ones
    tmp_exits = tmp_exits.map( row => {
        return row.filter( item => {
            return item !== undefined;
        } );
    } );

    // flatten array
    tmp_exits = [].concat.apply( [], tmp_exits );
    exits_copy[ _cur_room ] = tmp_exits;

    // show these only
    tmp_exits = tmp_exits.filter( item => {
        return item._on;
    } );

    room[ _cur_room ].exits = tmp_exits;
}

/**
 * 
 * @param int
 * @param callable
 * @return
 */
function rotate_items_pos( _cur_room, rot_func ) {
    // empty 16x grid
    let tmp_items = rotate.empty_grid_16();

    // items_copy is going to store all items that are not collected, but may or may not be visible
    // get this once, before any rotations
    if ( !items_copy.hasOwnProperty( _cur_room ) ) {
        items_copy[ _cur_room ] = rotate.copy( room[ _cur_room ].items );
    }
    
    // the items that have been picked up since last rotation.
    // needs to account for hidden items
    let picked_up = items_copy[ _cur_room ].filter( item => {
        let found = room[ _cur_room ].items.find( ( element ) => {
            return !item._on || ( element.x == item.x ) && ( element.y == item.y );
        } );

        return !found;
    } );

    items_copy[ _cur_room ].map( ( item ) => {
        let is_in_picked_up = picked_up.find( ( element ) => {
            return ( element.x == item.x ) && ( element.y == item.y );
        } );

        if ( !is_in_picked_up ) {
            tmp_items[ item.y ][ item.x ] = {
                id: item.id
            };
        } else {
            //alert('its gone!');
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
    // rotate player on grid
    let _player = player(),
        rot_func,
        _cur_room = parseInt( curRoom, 10 );

    if ( _curRoom !== _cur_room ) {
        for ( let i = _cur_room; i < _cur_room + floors; i++ ) {
            room[ i ] = rotate.copy( room_init[ i ] );
            room_copy[ i ] = rotate.copy( room_init[ i ] );
        }

        // reset sprite rotations
        shadow_tiles_floor.map( ( id ) => {
            let tile_id = `TIL_${id}`;

            rotate.reset( tile_id );
        } );

        // store internal tracker
        _curRoom = _cur_room;

        // refesh levels, to build dimensions, place items / sprites behind 
        room_rotate = 0;
        refresh_room( _curRoom );

        //console.log('room 0 items', room[0].items); alert();
        rotate_items_pos( _curRoom, rotate._reset );
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
    //rotate_tiles( shadow_tiles_walls, flip v? );

    rotate_items_pos( _cur_room, rot_func );
    rotate_exits_pos( _cur_room, rot_func );

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

        Object.entries( room ).forEach( ( [ key, value ] ) => {
            room_init[ key ] = rotate.copy( room[ key ] );
        } );

        refresh_room( 0 );
        rotate_tiles( shadow_tiles_floor, rot_func );
        rotate_items_pos( 0, rot_func );
        rotate_player_pos( rot_func );

        clearInterval( init_interval );
        setInterval( key_check, 50 );
    }
}

let init_interval = setInterval( init, 50 );