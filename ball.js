var balls=[];
function createBalls () {
	var geometry = new THREE.DodecahedronGeometry(2,5);
	var material = new THREE.MeshPhongMaterial({color:0x10ED8A});
	var ball = new THREE.Mesh(geometry,material);
	return ball;
}

var X=-51, Z=-96;
for (var i=0;i<8;i++){
	balls[i]=createBalls();
	balls[i].position.x=X;
	balls[i].position.y=2;
	balls[i].position.z=Z;
	X+=17;
	Z+=24;
}

for (var i=0;i<10;i++)
	scene.add(balls[i]);

var X=21, Z=-96;
for (var i=0;i<7;i++){
	balls[i]=createBalls();
	balls[i].position.x=X;
	balls[i].position.y=2;
	balls[i].position.z=Z;
	X-=12;
	Z+=32;
}

for (var i=0;i<10;i++)
	scene.add(balls[i]);