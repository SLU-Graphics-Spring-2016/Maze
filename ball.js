var balls=[];
var geometry = new THREE.DodecahedronGeometry(2,5);
var material = new THREE.MeshPhongMaterial({color:0x10ED8A});

//Sounds
var listener=new THREE.AudioListener();
var sound=new THREE.PositionalAudio(listener);
sound.load('sound.mp3');
camera.add(listener);

for (var i=0;i<30;i++){
	createBall();
}
// console.log(balls[0].vertices);

function createBall () {
    var ball = new THREE.Mesh(geometry,material);
    ball.position.x=Math.floor( Math.random() * 20 - 10 ) * 10;
    ball.position.y=10;
    ball.position.z=Math.floor( Math.random() * 20 - 10 ) * 10;
    scene.add(ball);

    ball.add(sound);
    balls.push(ball);
}

var total=0;

