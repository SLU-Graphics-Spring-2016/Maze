function animate() {
  requestAnimationFrame( animate );
      
    if ( controlsEnabled ) {
	var time = performance.now();
	var delta = ( time - prevTime ) / 1000;
	
	velocity.x -= velocity.x * 10.0 * delta;
	velocity.z -= velocity.z * 10.0 * delta;
	velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
	
	if ( moveForward ) 
	    velocity.z -= 400.0 * delta;
	if ( moveBackward ) 
	    velocity.z += 400.0 * delta;
	if ( moveLeft ) 
	    velocity.x -= 400.0 * delta;
	if ( moveRight ) 
	    velocity.x += 400.0 * delta;

	//forward
	raycaster.ray.origin.copy( camera.position );
	raycaster.ray.origin.y=10;
	raycaster.ray.direction.copy(camera.getWorldDirection());
	
	var intersections = raycaster.intersectObjects( maze.getElements() );
	if (intersections.length>0) velocity.z=Math.max(velocity.z,0);

	//back
	raycaster.ray.origin.copy( camera.position );
	raycaster.ray.origin.y=10;
	raycaster.ray.direction.copy(camera.getWorldDirection().negate());
	
	var intersections = raycaster.intersectObjects( maze.getElements() );
	if (intersections.length>0) velocity.z=Math.min(velocity.z,0);

	//left
	raycaster.ray.origin.copy( camera.position );
	raycaster.ray.origin.y=10;
	var curr=camera.getWorldDirection();
	curr.setX(curr.x*Math.cos(Math.PI/2)+curr.z*Math.sin(Math.PI/2));
	curr.setZ(-curr.x*Math.sin(Math.PI/2)+curr.z*Math.cos(Math.PI/2));
	raycaster.ray.direction.copy(curr);
	
	var intersections = raycaster.intersectObjects( maze.getElements() );
	if (intersections.length>0) velocity.x=Math.max(velocity.x,0);
	

	//right
	raycaster.ray.origin.copy( camera.position );
	raycaster.ray.origin.y=10;
	var curr1=camera.getWorldDirection();
	curr1.setX(curr1.x*Math.cos(-Math.PI/2)+curr1.z*Math.sin(-Math.PI/2));
	curr1.setZ(-curr1.x*Math.sin(-Math.PI/2)+curr1.z*Math.cos(-Math.PI/2));
	raycaster.ray.direction.copy(curr1);
	
	var intersections = raycaster.intersectObjects( maze.getElements() );
	if (intersections.length>0) velocity.x=Math.min(velocity.x,0);
	
	//console.log("camera: "+camera.position.x);
	for (var i=0;i<30;i++){
	    if (balls[i].position.distanceTo(camera.position)<=2){
		sound.play();
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
