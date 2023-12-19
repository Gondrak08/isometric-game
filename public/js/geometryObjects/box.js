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
    this.gravity = 0.2;
  }
  update(ground) {
    this.bottom = this.position.y - this.height / 2; // declare the bottom surface of the box
    this.top = this.position.y + this.height / 2; // declare the top surface of the box
    this.applyGravity(ground);
    // console.log("console.log de position", this.position.y);
  }

  applyGravity(ground) {
    this.velocity.y -= this.gravity; // apply gravity speed.
    const cameraAngle = 0.002;
    let shouldBounce = false;
    // groud as a grid,
    ground.forEach((ground) => {
      if (this.bottom + this.velocity.y <= ground.top + cameraAngle) {
        shouldBounce = true;
      }
    });
    if (shouldBounce) {
      // Bounce effect
      this.velocity.y *= 0.1; //the speed of that reduce the bounce
      this.velocity.y = -this.velocity.y;
    } else {
      // No collision, update the position
      this.position.y += this.velocity.y;
    }
  }
}
