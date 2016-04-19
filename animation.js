function animate() {
  requestAnimationFrame( animate );
      
  if ( controlsEnabled ) {
    raycaster.ray.origin.copy( controls.getObject().position );
    raycaster.ray.direction.copy(controls.getObject().getWorldDirection());
    // raycaster.ray.direction.copy(velocity);
      

    var intersections = raycaster.intersectObjects( maze.getElements() );
    // console.log(intersections);
    var isOnObject = intersections.length > 0;
    // console.log(isOnObject);

    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    if ( moveForward ) velocity.z -= 400.0 * delta;
    if ( moveBackward ) velocity.z += 400.0 * delta;

    if ( moveLeft ) velocity.x -= 400.0 * delta;
    if ( moveRight ) velocity.x += 400.0 * delta;

    if ( isOnObject === true) {
    // velocity.y = Math.max( 0, velocity.y );
    // canJump = true;
    console.log("hit");
    // velocity.z=Math.max(0,velocity.z);
    // console.log("velocity.z: "+velocity.z);
    // velocity.z=0;
    }
      

    controls.getObject().translateX( velocity.x * delta );
    controls.getObject().translateY( velocity.y * delta );
    controls.getObject().translateZ( velocity.z * delta );

    if ( controls.getObject().position.y < 10 ) {
      velocity.y = 0;
      controls.getObject().position.y = 10;
      canJump = true;
    }
    prevTime = time;
	
  }
    
  renderer.render( scene, camera );
	
}
animate();