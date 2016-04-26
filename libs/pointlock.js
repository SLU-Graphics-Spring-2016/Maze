/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

    var scope = this;
    
    camera.rotation.set( 0, 0, 0 );
    
    
    var PI_2 = Math.PI / 2;

    var onMouseMove = function ( event ) {
	
	if ( scope.enabled === false ) return;
	
	var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
	
	camera.rotation.y -= movementX * 0.002;
    };
    
    this.dispose = function() {
	    
	document.removeEventListener( 'mousemove', onMouseMove, false );
	
    };
    
    document.addEventListener( 'mousemove', onMouseMove, false );
    
    this.enabled = false;

    this.getObject = function () {
	
	return camera;
	
    };

       
};
