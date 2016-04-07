// global variables
var renderer;
var scene;
var camera;

// create a scene, that will hold all our elements such as objects, cameras and lights.
scene = new THREE.Scene();
var maze = new Maze(scene,17, 200, 200);
maze.generate();
maze.draw();


// create a camera, which defines where we're looking at.
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y=1;
camera.lookAt(new THREE.Vector3(0,0,0));


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
spotLight.shadowCameraNear = 20;
spotLight.shadowCameraFar = 50;
spotLight.castShadow = true;

var ambientLight = new THREE.AmbientLight(0x080808);
scene.add(ambientLight);

scene.add(spotLight);


//Rendering

renderer = new THREE.WebGLRenderer();
// renderer.setClearColor(0x000000, 1.0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMapEnabled = true;
document.body.appendChild(renderer.domElement);
// var controls = new THREE.OrbitControls(camera, renderer.domElement);

// First Person Controls
var controls = new THREE.FirstPersonControls( camera, renderer.domElement );
controls.movementSpeed = 2.0;
controls.lookSpeed = 0.3;

var clock = new THREE.Clock();

function render() {
	var delta = clock.getDelta();
  controls.update(delta);
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();

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