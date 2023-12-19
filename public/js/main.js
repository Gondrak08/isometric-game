///////////////////////
// Global Variables //
/////////////////////
// window.innerWidth / window.innerHeight,
// Scene Related
const fieldWidth = 10;
const fieldHeight = 10;
const width = 700;
const height = window.innerHeight;
const aspect = width / height;
const D = 5;

//////////////////
// Scene setup //
////////////////

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
  -D * aspect,
  D * aspect,
  D,
  -D,
  1,
  1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// # set the camera
camera.position.set(20, 20, 20);
camera.lookAt(scene.position);

//////////////////
//Objects Setup//
////////////////

// Player
//---
const initialPlayerX = 0;
const initialPlayerZ = 0;
const playerMaterial = new THREE.MeshStandardMaterial({
  ambient: 0x835e55,
  color: 0x1254d5,
  specular: 0xffffff,
  shininess: 50,
  shading: THREE.SmoothShading,
});
const cube = new Player({
  width: 0.5,
  height: 1,
  depth: 0.5,
  velocity: {
    x: 0,
    y: -0.1,
    z: 0,
  },
});
// (cube.position.y = 1), 2;
// cube.position.y= 3
cube.castShadow = true;
cube.position.set(3, 10, 1.6); // Define a posição inicial do cubo
cube.receiveShadow = true;
// cube bounding box
let cubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cubeBB.setFromObject(cube); // set the values from te cube to the bb
cube.geometry.computeBoundingBox();
scene.add(cube);
//---
// Killer Balls
const ball = new THREE.Mesh(
  new THREE.SphereGeometry(1),
  new THREE.MeshPhongMaterial({ color: 0xff2293 }),
);
(ball.position.y = 1), 10;
// ball.position.x = 2;
ball.position.z = 4;
//ball bounding sphere
let ballBB = new THREE.Sphere(ball.poosition, 1);
ball.geometry.computeBoundingSphere();
scene.add(ball);

///////////////////////////////
///Dungeons floor generator///
/////////////////////////////
// Floor tiles - Declarig floor tile's
const material = new THREE.MeshStandardMaterial({
  ambient: 0x555555,
  color: 0x555555,
  specular: 0xffffff,
  // shininess: 50,
  // shading: THREE.SmoothShading,
});
const gridSize = 60;
const tileSize = 1;
const grid = new THREE.Group();
const tilesP1 = [];

let tileBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
// const tileTexture = new THREE.TextureLoader().load("texture.jpg");
// here is where the floor of the game is generated

////////////////////
//Floor Generator//
//////////////////
// uncomment code bellow to generate floor based on pixel tiles;
const dungeonFloor = dungeonFloorTwo;
for (let x = 0; x < gridSize; x++) {
  for (let z = 0; z < gridSize; z++) {
    const index = x * gridSize + z;
    const isTile = dungeonFloor[index] === 1;
    if (isTile) {
      // const geometry = new THREE.BoxGeometry(0.9, 0.5, 0.9);
      const tile = new BOX({ width: 0.9, height: 0.1, depth: 0.9 });

      tile.position.set(
        (x - gridSize / 2) * tileSize,
        0,
        (z - gridSize / 2) * tileSize,
      );

      tile.receiveShadow = true;
      grid.add(tile);
    }
  }
}

grid.receiveShadow = true;
// console.log("grid console-->", grid);
scene.add(grid);
// this is a way to make a hardMap
/// Monster positions///
// declarations of others objets in scene.
// --
// //////////////////////
// LIGHT'S AND SHADOWS//
// ////////////////////
const sun = new THREE.AmbientLight(0x4000ff);
// sun.position.set(10, 20, 15);
sun.castShadow = true;
scene.add(sun);
const light = new THREE.PointLight(0xffffff, 6, 40);
light.position.set(10, 30, 15);
light.castShadow = true;

scene.add(light);

///////////////////////////
//Capture players input////
//////////////////////////
// Player Movement declaration
const keys = {
  up: false,
  left: false,
  right: false,
  down: false,
  attack: false,
  jump: false,
};

// keyboards
window.addEventListener("keydown", function (e) {
  switch (e.key) {
    case "w":
      keys.up = true;
      break;
    case "s":
      keys.down = true;
      break;
    case "d":
      keys.right = true;
      break;
    case "a":
      keys.left = true;
    case "s":
      keys.left = true;
      break;
    case " ":
      keys.jump = true;
      break;
  }
});

window.addEventListener("keyup", function (e) {
  switch (e.key) {
    case "w":
      keys.up = false;
      break;
    case "s":
      keys.down = false;
      break;
    case "d":
      keys.right = false;
      break;
    case "a":
      keys.left = false;
      break;
    case " ":
      keys.jump = false;
  }
});
// gamepad
window.addEventListener("gamepadconnected", null);
window.addEventListener("gamepaddisconnected", null);

//////////////////////////
// Player Movment Setup//
////////////////////////
function playerMovment() {
  const playerSpeed = 0.1; // player speed;
  const cameraGroup = new THREE.Group();
  cameraGroup.add(camera);
  scene.add(cameraGroup);

  if (keys.up || keys.down || keys.left || keys.right || keys.jump) {
    let deltaMove = playerSpeed * tileSize;
    if (keys.up && !keys.down) {
      movePlayer(0, -deltaMove);
    } else if (keys.down && !keys.up) {
      movePlayer(0, deltaMove);
    }

    if (keys.left && !keys.right) {
      movePlayer(-deltaMove, 0);
    } else if (keys.right && !keys.left) {
      movePlayer(deltaMove, 0);
    }

    if (keys.jump) {
      cube.jump();
    } //makes player jump

    // update and centralize camera position...
    cameraGroup.position.x = cube.position.x;
    cameraGroup.position.z = cube.position.z;
  } else {
    // const currentTileX = Math.round(cube.position.x / tileSize) + 0.3;
    // const currentTileZ = Math.round(cube.position.z / tileSize) + 0.3;
    // if (!isMoving) {
    //   cube.position.x = currentTileX;
    //   cube.position.z = currentTileZ;
    // }

    cameraGroup.position.x = cube.position.x;
    cameraGroup.position.z = cube.position.z;
  }
}

function movePlayer(deltaX, deltaZ) {
  const newX = cube.position.x + deltaX * tileSize;
  const newZ = cube.position.z + deltaZ * tileSize;

  // Calculate the target position based on the movement direction
  const targetX = Math.round(newX / tileSize) * tileSize;
  const targetZ = Math.round(newZ / tileSize) * tileSize;

  // Check if the new position is within the grid and on a walkable tile
  const newIndexX = Math.floor(
    (targetX + (gridSize / 2) * tileSize) / tileSize,
  );
  const newIndexZ = Math.floor(
    (targetZ + (gridSize / 2) * tileSize) / tileSize,
  );
  const newIndex = newIndexX * gridSize + newIndexZ;

  const isValidMove =
    newIndexX >= 0 &&
    newIndexX < gridSize &&
    newIndexZ >= 0 &&
    newIndexZ < gridSize &&
    dungeonFloor[newIndex] === 1;

  if (isValidMove) {
    cube.position.x = newX;
    cube.position.z = newZ;
  }
  return null;
}
///////////////////////
///Object Colissions//
////////////////////////
function checkCollisions() {
  // INTERSECTING (TOUCHING) TEST
  // does bounding box intersect with bounding shpereof another object?
  const cubePosition = cube.position.clone();
  cubePosition.y += cube.geometry.boundingBox.max.y; // Adjust for the cube's height

  const ballPosition = ball.position.clone();
  ballPosition.y += ball.geometry.boundingSphere.radius; // Adjust for the ball's radius

  const distance = cubePosition.distanceTo(ballPosition);

  if (
    distance <
    cube.geometry.boundingBox.max.x + ball.geometry.boundingSphere.radius
  ) {
    animation2();
  } else {
    ball.material.opacity = 1.0;
  }
  // if (cubeBB.intersectsSphere(ballBB)) {
  //   animation2();
  // } else {
  //   ball.material.opacity = 1.0;
  // }

  // Contains toDateString();
  // does bounding box contain a bounding box of another object?
}

function animation1() {
  cube.material.transparent = true;
  cube.material.opacity = 0.5;
  cube.material.color = new THREE.Color(Math.random() * 0xffffff);
}
function animation2() {
  ball.material.transparent = true;
  ball.material.opacity = 0.5;
  ball.material.color = new THREE.Color(Math.random() * 0xffffff);
}
/////////////
//Gravity//
///////////

const gravity = new THREE.Vector3(0, -9.8, 0); // Adjust gravity as needed

function applyGravity(object, deltaTime) {
  // calculate the new vertical velocity
  object.verticalVelocity -= gravity.y * deltaTime;
  object.position.y += object.verticalVelocity * deltaTime;
}

function floorCollision(object) {
  const floorHeight = 0;
  if (object.position.y < floorHeight) {
    object.position.y = floorHeight;
    object.verticalVelocity = 0;
  }
}

////////////
//Animate//
///////////
function animate() {
  playerMovment();
  const clock = new THREE.Clock();
  const deltaTime = clock.getDelta();
  // floorCollision(cube);
  // applyGravity(cube, deltaTime);
  // cube.position.y -= 0.1
  cube.update(grid.children);
  //
  cubeBB.copy(cube.geometry.boundingBox).applyMatrix4(cube.matrixWorld);
  checkCollisions();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
