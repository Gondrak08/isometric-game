# Three.js - Isometric Game Study.

## Materials and Lighting

### Materials Type

**How to choose a material**

- MeshPhongMaterial = MeshShinyMaterial
- MeshLambertMaterial = MeshMatteMaterial(fosco)
- MeshStandardMaterial = a combo of both mesh above.

* Each one of this materials need light to be seen in scene

When in doubt, go MeshStandardMaterial

### light's

Lights iluminates objects and materials that require it. Some of the most commomn lights in Three.js are:

- AmbientLight - It's iluminate the secene from every direction like the light of the sun.
- DirectionalLight - Iluminate the object from a pre set position, casting a shadow at the feet of the object.
- PointLight - Works like a lamp or tourch, iluminating the light around it.
- SpotLight - works like a spot light, similar to `DirectionalLight`, but the shadow casted is stronger and rounded.

## Shadows

You must explicitly state what objects cast and receive shadows. All four of the properties below MUST be enable for shadows to work.

- `RENDERER.shadowMap.enabled = true;`

- `LIGHT.castShadow = true;`

- `MESH.receiveShadow = true;`

- `MESH.castShadow = true;`

---

# ChatGP

Hi,
I'm building a web game using javascript and three.js lib.

I created a class BOX, that I use to generate all the 3d objects of my

```

class BOX extends THREE.Mesh {
  constructor({
    width,
    height,
    depth,
    color = "0x1254d5",
    velocity = {
      x: 0,
      y: 0,
      z: 0,
    },
    position = {
      x: 0,
      y: 0,
      z: 0,
    },
  }) {
    const material = new THREE.MeshStandardMaterial({
      ambient: 0x835e55,
      color: color,
      specular: 0xffffff,
      shininess: 50,
      shading: THREE.SmoothShading,
    });
    const geometry = new THREE.BoxGeometry(width, height, depth);
    super(geometry, material);
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.color = color;
    this.position.set(position.x, position.y, position.z);
    this.bottom = this.position.y - this.height / 2; // this is the bottom of the object.
    this.top = this.position.y + this.height / 2; // this represents the top of the box.
    this.velocity = velocity; // the velocity with the objects moves, if moves.
    this.gravity = 0.11;
  }
  update(ground) {
    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
    this.position.y += this.velocity.y; // this move's object to the ground;
    //ground gravity collision
    // ground is an array, a group, of little cubes...
    // ground = floor of our dungeons or any map or world
    ground.forEach((ground) => {
      const cameraAngle = 0.5;
      if (this.bottom + this.velocity.y <= ground.top + cameraAngle)
        this.velocity.y = 0;
      //   this.velocity.y += this.velocity.y;
    });
  }
}
```

Then in my `main.js`, I declare a retangular cube as a player.

```
const playerMaterial = new THREE.MeshStandardMaterial({
  ambient: 0x835e55,
  color: 0x1254d5,
  specular: 0xffffff,
  shininess: 50,
  shading: THREE.SmoothShading,
});
const cube = new BOX({
  width: 0.5,
  height: 1,
  depth: 0.5,
  velocity: {
    x: 0,
    y: -0.1,
    z: 0,
  },
});
console.log("cube-->", cube);
cube.castShadow = true;
cube.position.set(3, 10, 1.6); // Define a posição inicial do cubo
```

Then I declare the floor of my game, it's a gridfloor made of tiles, the tiles are generated using the calss BOX.

```
const material = new THREE.MeshStandardMaterial({
  ambient: 0x555555,
  color: 0x555555,
  specular: 0xffffff,
});
const gridSize = 60;
const tileSize = 1;
const grid = new THREE.Group();
const tilesP1 = [];

////////////////////
//Floor Generator//
//////////////////
const dungeonFloor = dungeonFloorTwo;
for (let x = 0; x < gridSize; x++) {
  for (let z = 0; z < gridSize; z++) {
    const index = x * gridSize + z;
    const isTile = dungeonFloor[index] === 1;
    if (isTile) {
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
scene.add(grid);

```

Finnaly in animation i'm calling the functions:

```
function animate() {
  playerMovment();
  const clock = new THREE.Clock();
  const deltaTime = clock.getDelta();
  cube.update(grid.children);
  cubeBB.copy(cube.geometry.boundingBox).applyMatrix4(cube.matrixWorld);
  checkCollisions();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
```

Now let-me tell the problem I'm having.

When creating the gravity of my objects, here in the `upodate` function of the BOX object class:

```
update(ground) {
    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
    this.position.y += this.velocity.y; // this move's object to the ground;
    //ground gravity collision
    // ground is an array, a group, of little cubes...
    // ground = floor of our dungeons or any map or world
    ground.forEach((ground) => {
      const cameraAngle = 0.5;
      if (this.bottom + this.velocity.y <= ground.top + cameraAngle)
        this.velocity.y = 0;
    });
  }
```

I'm descovering the bottom of the box my player is also the top of the box each of the tiles of the ground is, as show in `update(ground)`.
`ground` is an array of arrays, each of the arrays in it, is a BOX, that contains a top.

My player is being render high in the `y` axis. So he will fell. When he touches the ground he stops. The code above is working.

But I want to create certain effect of boucingness of the object when he fell on the ground. he will touch the ground, then go up, down again, up, down util he stops.

To that happen I do something like this:

```
...
    ground.forEach((ground) => {
      const cameraAngle = 0.5;
      if (this.bottom + this.velocity.y <= ground.top + cameraAngle)
        this.velocity.y = -this.velocity.y;
      else this.velocity.y += this.velocity.y
    });
```

so my player should hit the ground go up and return. But that don't happen, he go up and disapears.

i thin the error has something to do with the forEach...
What is happening ?
