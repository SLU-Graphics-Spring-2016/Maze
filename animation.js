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

	var r=new THREE.Vector3();
	var c=camera.getWorldDirection();
	r.copy(velocity);
	r.y=0;
	if (r.lengthSq()>0.001){
	    r.normalize();
	    raycaster = new THREE.Raycaster( new THREE.Vector3(),
					     new THREE.Vector3(),
					     0,5);
	    raycaster.ray.direction.x=-r.z*c.x-r.x*c.z;
	    raycaster.ray.direction.z=r.x*c.x-r.z*c.z;
	   	   
	    raycaster.ray.origin.copy( camera.position );
	    raycaster.ray.origin.y=10;
		   
//	    console.log(raycaster.ray.direction);
//	    console.log(camera.getWorldDirection());
//	    console.log("dot: "+raycaster.ray.direction.dot(camera.getWorldDirection()));
	    var intersections = raycaster.intersectObjects( maze.getElements() );
	    
	    if (intersections.length > 0) {
		
	    //set velocity to 0
		velocity.z=0;
		velocity.x=0
	    }
	}    /*
	var rays = 6.0;
	for (var i=0;i<rays;i++){
	    var curr=camera.getWorldDirection();
	   
	    if (.dot(curr) > 0){
	
		raycaster.ray.direction.copy(camera.getWorldDirection());
		raycaster.ray.direction.copy(curr);
	;
}

	    }
	}
*/
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
