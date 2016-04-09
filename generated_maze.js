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

  function init () {
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
    var maze = new Maze(scene,17, 200, 200);
    maze.generate();
    maze.draw();


    // create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    // camera.position.y=1;
    // camera.lookAt(new THREE.Vector3(0,0,0));


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
    spotLight.position.set(40, 100, 280);
    spotLight.shadow.camera.near = 20;
    spotLight.shadow.camera.far = 50;
    spotLight.castShadow = true;

    var ambientLight = new THREE.AmbientLight(0x080808);
    scene.add(ambientLight);

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
          if ( canJump === true ) velocity.y += 350;
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

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
    //Rendering

    renderer = new THREE.WebGLRenderer();
    // renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    // var controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    // First Person Controls
    // var controls = new THREE.FirstPersonControls( camera, renderer.domElement );
    // controls.movementSpeed = 2.0;
    // controls.lookSpeed = 0.3;
    
    // var clock = new THREE.Clock();
    // position and point the camera to the center of the scene
    // camera.position.x = 80;
    // camera.position.y = 120;
    // camera.position.z = 100;
    // camera.lookAt(scene.position);
  }

  function animate() {
    requestAnimationFrame( animate );
      
    if ( controlsEnabled ) {
      raycaster.ray.origin.copy( controls.getObject().position );
      raycaster.ray.origin.y -= 10;

      var intersections = raycaster.intersectObjects( objects );
      var isOnObject = intersections.length > 0;

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