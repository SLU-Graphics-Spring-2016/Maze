// global variables
var renderer;
var scene;
var camera;
var objects = [];
var controls;
var raycaster;
var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
if ( havePointerLock ) {
    var element = document.body;
    var pointerlockchange = function ( event ) {
      if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
	      controlsEnabled = true;
        controls.enabled = true;
        blocker.style.display = 'none';
      } 
      else{
	      controls.enabled = false;
        blocker.style.display = '-webkit-box';
        blocker.style.display = '-moz-box';
        blocker.style.display = 'box';
        instructions.style.display = '';
      }
    };
    
    var pointerlockerror = function ( event ) {
      instructions.style.display = '';
    };

    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

    instructions.addEventListener( 'click', function ( event ) {
      instructions.style.display = 'none';
      // Ask the browser to lock the pointer
      element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
      if ( /Firefox/i.test( navigator.userAgent ) ) {
        var fullscreenchange = function ( event ) {
          if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
            document.removeEventListener( 'fullscreenchange', fullscreenchange );
            document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
            element.requestPointerLock();
          }
        };

        document.addEventListener( 'fullscreenchange', fullscreenchange, false );
        document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
        element.requestFullscreen();
      }
      else{
        element.requestPointerLock();
      }
    },false);
  }
  else{
    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
  }

  init();
  animate();

  var controlsEnabled = false;

  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;
  var canJump = false;

  var prevTime = performance.now();
  var velocity = new THREE.Vector3();
  var maze;
  function init () {
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
    maze = new Maze(scene,17, 200, 200);
    console.log(maze.getElements());
    maze.generate();
    maze.draw();

    flashlight = new THREE.SpotLight(0xffffff,1,80);

    // create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    // camera.position.y=54;
    // camera.position.z=100;
    // camera.lookAt(new THREE.Vector3(0,0,0));
    camera.add(flashlight);
    flashlight.position.set(0,0,1);
    flashlight.target = camera;

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(200, 200);
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    
    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = 0;

    // add the plane to the scene
    scene.add(plane);
    
    
    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 100, 0);
    spotLight.shadow.camera.near = 20;
    spotLight.shadow.camera.far = 50;
    spotLight.castShadow = true;

    var ambientLight = new THREE.AmbientLight(0x080808);
    ambientLight.position.set(0,30,0);
    scene.add(ambientLight);

    // var ambientLight1 = new THREE.AmbientLight(0x080808);
    // ambientLight.position.set(-30,30,0);
    // scene.add(ambientLight1);
    scene.add(spotLight);
    controls = new THREE.PointerLockControls( camera );
    scene.add( controls.getObject() );

    var onKeyDown = function ( event ) {
      switch ( event.keyCode ) {
        case 38: // up
        case 87: // w
          moveForward = true;
          break;

        case 37: // left
        case 65: // a
          moveLeft = true;
          break;

        case 40: // down
        case 83: // s
          moveBackward = true;
          break;

        case 39: // right
        case 68: // d
          moveRight = true;
          break;

        case 32: // space
          if ( canJump === true ) velocity.y += 150;
            canJump = false;
            break;
      }
    };

    var onKeyUp = function ( event ) {
      switch( event.keyCode ) {
        case 38: // up
        case 87: // w
          moveForward = false;
          break;

        case 37: // left
        case 65: // a
          moveLeft = false;
          break;

        case 40: // down
        case 83: // s
          moveBackward = false;
          break;

        case 39: // right
        case 68: // d
          moveRight = false;
          break;
      }
    };

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0,10);
    console.log(maze.width);
    //Rendering

    renderer = new THREE.WebGLRenderer();
    // renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
  }

  function animate() {
    requestAnimationFrame( animate );
      
    if ( controlsEnabled ) {
      raycaster.ray.origin.copy( controls.getObject().position );
      // raycaster.ray.direction.copy(controls.getObject().getWorldDirection());
      raycaster.ray.direction.copy(velocity);

      var intersections = raycaster.intersectObjects( maze.getElements() );
      var isOnObject = intersections.length > 0;
      console.log(isOnObject);

      var time = performance.now();
      var delta = ( time - prevTime ) / 1000;

      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;
      velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

      if ( moveForward ) velocity.z -= 400.0 * delta;
      if ( moveBackward ) velocity.z += 400.0 * delta;

      if ( moveLeft ) velocity.x -= 400.0 * delta;
      if ( moveRight ) velocity.x += 400.0 * delta;

      if ( isOnObject === true ) {
        velocity.y = Math.max( 0, velocity.y );
        canJump = true;
        console.log("hit");
        velocity.z=Math.max(0,velocity.z);
      }
      
      velocity.z-= velocity.z * 10.0 * delta;
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

// function render() {
// 	// var delta = clock.getDelta();
//  //  controls.update(delta);
//   requestAnimationFrame(render);
//   renderer.render(scene, camera);
//   // console.log(camera.lookAt);
// }

// render();

/**
 * Function handles the resize event. This make sure the camera and the renderer
 * are updated at the correct moment.
 */
function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// calls the handleResize function when the window is resized
window.addEventListener('resize', handleResize, false);