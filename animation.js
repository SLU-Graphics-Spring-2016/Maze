function animate() {
  requestAnimationFrame( animate );
      
  if ( controlsEnabled ) {
    raycaster.ray.origin.copy( controls.getObject().position );
    raycaster.ray.direction.copy(controls.getObject().getWorldDirection());
    // raycaster.ray.direction.copy(velocity);
      

    var intersections = raycaster.intersectObjects( maze.getElements() );
    // intersections = raycaster.intersectObjects( balls );
    // console.log(intersections);
    hitWall = intersections.length > 0;
    // console.log(isOnObject);

    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
    // camera.position.y=0;
    if ( moveForward ) 
      velocity.z -= 400.0 * delta;
    if ( moveBackward ) 
      velocity.z += 400.0 * delta;
    if ( moveLeft ) 
      velocity.x -= 400.0 * delta;
    if ( moveRight ) 
      velocity.x += 400.0 * delta;

    // if ( hitWall) {
    //   console.log("hit");
    //   velocity.z+=1;
    // }

    for (var i=0;i<30;i++){
      console.log(controls.getObject().position);
      if (balls[i].position.distanceTo(controls.getObject().position)<=2){
        scene.remove(balls[i]);
      }
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