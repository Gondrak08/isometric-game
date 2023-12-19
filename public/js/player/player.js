class Player extends BOX {
  constructor({
    width,
    height,
    depth,
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
    super({ width, height, depth, velocity, position });
    this.isJumping = false;
    this.jumpsLeft = 1;
    this.jumpForce = 0.8;
  }
  update(ground) {
    super.update(ground);
  }
  jump() {
    if (!this.isJumping && this.jumpsLeft == 1) {
      this.velocity.y += this.jumpForce;
      this.isJumping = true;
      this.jumpsLeft--;
    }
    if (this.isJumping && this.position.y <= 1) {
        this.isJumping = false;
        this.jumpsLeft = 1;
    }
  }
}
