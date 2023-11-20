///////////////////////
// Global Variables //
/////////////////////
// window.innerWidth / window.innerHeight,
// Scene Related
const fieldWidth = 10;
const fieldHeight = 10;
const width = window.innerWidth;
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
const geometry = new THREE.BoxGeometry(0.5, 1, 0.5);
//---
const initialPlayerX = 0;
const initialPlayerZ = 0;
const playerMaterial = new THREE.MeshPhongMaterial({
  ambient: 0x835e55,
  color: 0x1254d5,
  specular: 0xffffff,
  shininess: 50,
  shading: THREE.SmoothShading,
});
const cube = new THREE.Mesh(geometry, playerMaterial);
// (cube.position.y = 1), 2;
// cube.position.y= 3
cube.position.set(0, 1, 2); // Define a posição inicial do cubo
cube.castShadows = true;
cube.castShadow = true;
cube.casShadow = true;
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
// Floor tiles - Declarig floor tile's
const material = new THREE.MeshPhongMaterial({
  ambient: 0x555555,
  color: 0x555555,
  specular: 0xffffff,
  shininess: 50,
  shading: THREE.SmoothShading,
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
      const geometry = new THREE.BoxGeometry(0.9, 0.5, 0.9);
      const tile = new THREE.Mesh(geometry, material);
      tile.position.set(
        (x - gridSize / 2) * tileSize,
        0,
        (z - gridSize / 2) * tileSize,
      );
      grid.add(tile);
    }
  }
}

scene.add(grid);
// this is a way to make a hardMap
// for (let x = -gridSize / 2; x < gridSize / 2; x++) {
//   for (let z = -gridSize / 2; z < gridSize / 2; z++) {
//     const geometry = new THREE.BoxGeometry(0.9, 0.5, 0.9);
//     const tile = new THREE.Mesh(geometry, material);
//     tile.position.set(x * tileSize, 0, z * tileSize);
//     grid.add(tile);
//   }
//   if (x < tileSize / 2) {
//     tilesP1.push(cube);
//   }
//   scene.add(grid);
// }
grid.receiveShadow = true;
grid.castShadow = true;
// --
// Create lights
scene.add(new THREE.AmbientLight(0x4000ff));

const light = new THREE.PointLight(0xffffff, 6, 40);
light.position.set(10, 20, 15);
scene.add(light);

// define camera
//
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
  }
});
// gamepad
window.addEventListener("gamepadconnected", null);
window.addEventListener("gamepaddisconnected", null);



//////////////////////////
///Player Movment Setup//
////////////////////////
//
function playerMovment() {
  const playerSpeed = 0.15; // player speed;
  const cameraGroup = new THREE.Group();
  cameraGroup.add(camera);
  scene.add(cameraGroup);

  function movePlayer(deltaX, deltaZ) {
   return new Promise((resolve) => {
      const newX = cube.position.x + deltaX * tileSize;
      const newZ = cube.position.z + deltaZ * tileSize;

      // Calculate the target position based on the movement direction
      const targetX =
        newX + (deltaX > 0 ? tileSize : deltaX < 0 ? -tileSize : 0);
      const targetZ =
        newZ + (deltaZ > 0 ? tileSize : deltaZ < 0 ? -tileSize : 0);

      // Check if the new position is within the grid and on a walkable tile
      const newIndexX = Math.floor(
        (targetX + (gridSize / 2) * tileSize) / tileSize
      );
      const newIndexZ = Math.floor(
        (targetZ + (gridSize / 2) * tileSize) / tileSize
      );
      const newIndex = newIndexX * gridSize + newIndexZ;

      const isValidMove =
        newIndexX >= 0 &&
        newIndexX < gridSize &&
        newIndexZ >= 0 &&
        newIndexZ < gridSize &&
        dungeonFloor[newIndex] === 1;

      if (isValidMove) {
        // Move smoothly to the target position using a tween or other method
        // For simplicity, using setTimeout here as a placeholder
        setTimeout(() => {
          cube.position.x = targetX;
          cube.position.z = targetZ;
          resolve(); // Resolve the promise once the movement is complete
        }, 200); // Adjust the duration as needed
      } else {
        resolve(); // Resolve immediately if the move is not valid
      }
    }); 
  }

  if (keys.up || keys.down || keys.left || keys.right) {
  let deltaMove = playerSpeed * tileSize;
    let movePromise = Promise.resolve(); // Initial resolved promise

    if (keys.up && !keys.down) {
      movePromise = movePlayer(0, -deltaMove);
    } else if (keys.down && !keys.up) {
      movePromise = movePlayer(0, deltaMove);
    }

    if (keys.left && !keys.right) {
      movePromise = movePlayer(-deltaMove, 0);
    } else if (keys.right && !keys.left) {
      movePromise = movePlayer(deltaMove, 0);
    }

    // Update and centralize camera position after all movements are complete
    movePromise.then(() => {
      cameraGroup.position.x = cube.position.x;
      cameraGroup.position.z = cube.position.z;
    }); 
  } else if (!keys.up && !keys.down && !keys.left && !keys.right) {
    // Snap to the center of the current tile when no keys are pressed
    const currentTileX = Math.round(cube.position.x / tileSize) + 0.3;
    const currentTileZ = Math.round(cube.position.z / tileSize) + 0.3;
    cube.position.x = currentTileX;
    cube.position.z = currentTileZ;

    // // Centralize the cube in the tile floor;
    // cube.position.x = Math.floor(cube.position.x) + 0.3;
    // cube.position.z = Math.floor(cube.position.z) + 0.3;
    //
    // Centralize the camera into the player;
    cameraGroup.position.x = cube.position.x;
    cameraGroup.position.z = cube.position.z;
  }
}
// Object Colissions

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
  const clock = new THREE.Clock();
  const deltaTime = clock.getDelta();
  // floorCollision(cube);
  // applyGravity(cube, deltaTime);
  playerMovment();
  cubeBB.copy(cube.geometry.boundingBox).applyMatrix4(cube.matrixWorld);
  checkCollisions();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
