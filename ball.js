var balls=[];
// var names=[];
// for (var i=0;i<20;i++){
// 	names[i]=i;
// }
// console.log(names);
for (var i=0;i<20;i++){
	createBall();
}
function createBall () {
	var geometry = new THREE.DodecahedronGeometry(2,5);
	var material = new THREE.MeshPhongMaterial({color:0x10ED8A});
	var ball = new THREE.Mesh(geometry,material);
	ball.position.x=Math.floor( Math.random() * 20 - 10 ) * 10;
	ball.position.y=10;
	ball.position.z=Math.floor( Math.random() * 20 - 10 ) * 10;
	scene.add(ball);
	balls.push(ball);
}
