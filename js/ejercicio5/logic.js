let moves = 0;
let movesui = document.getElementById("movesui");

// Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight - 56);
document.getElementById("gamebox").appendChild(renderer.domElement);

// lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5).normalize();
scene.add(directionalLight);

// Create the base for the towers
const baseGeometry = new THREE.BoxGeometry(12, 1, 5);
const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.y = -0.5;
scene.add(base);

//create a tower
const towers = [];
const towerHeight = 6;

function createTower(x) {
  const geometry = new THREE.CylinderGeometry(0.2, 0.2, towerHeight, 32);
  const material = new THREE.MeshPhongMaterial({ color: 0x808080 });
  const tower = new THREE.Mesh(geometry, material);
  tower.position.set(x, towerHeight / 2, 0);
  scene.add(tower);
  towers.push(tower);
}

// Create three towers
createTower(-4);
createTower(0);
createTower(4);

const disks = [[], [], []];

// Function to interpolate between two colors
function interpolateColor(color1, color2, factor) {
  const result = color1.clone();
  result.lerp(color2, factor);
  return result;
}

function createDisk(radius, height, x, y, towerIndex, color) {
  const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
  const material = new THREE.MeshPhongMaterial({ color });
  const disk = new THREE.Mesh(geometry, material);
  disk.position.set(x, y, 0);
  scene.add(disk);
  disks[towerIndex].push(disk);
}

// Base color and target color for the gradient
const baseColor = new THREE.Color(0x1e90ff); // Blue
const targetColor = new THREE.Color(0xffffff); // White

// Number of disks
const numDisks = 6;

// Create disks with gradient colors
for (let i = 0; i < numDisks; i++) {
  const factor = i / (numDisks - 1); // Calculate interpolation factor
  const color = interpolateColor(baseColor, targetColor, factor); // Interpolate color
  createDisk(1.5 - 0.25 * i, 0.5, -4, 0.25 + 0.5 * i, 0, color); // Create disk with interpolated color
}

camera.position.z = 15;

//  OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable inertia (damping)
controls.dampingFactor = 0.25; // Damping factor

// Variables for handling tower selection and disk movement
let selectedTowerIndex = null;

// Raycaster for detecting clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(towers);

  if (intersects.length > 0) {
    const towerIndex = towers.indexOf(intersects[0].object);
    handleTowerSelection(towerIndex);
  }
}

function onTouchStart(event) {
  if (event.touches.length > 0) {
    mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(towers);

    if (intersects.length > 0) {
      const towerIndex = towers.indexOf(intersects[0].object);
      handleTowerSelection(towerIndex);
    }
  }
}

function handleTowerSelection(towerIndex) {
  if (selectedTowerIndex === null) {
    // Select the tower
    selectedTowerIndex = towerIndex;
    towers[towerIndex].material.color.set(0xffff00); // Highlight selected tower
  } else {
    // Move disk from selected tower to the clicked tower
    moveDisk(selectedTowerIndex, towerIndex);
    towers[selectedTowerIndex].material.color.set(0x808080); // Reset the previous tower's color
    selectedTowerIndex = null;
  }

  // bug fix (last tower before finish dosnt change to golden after the game finished)
  if (disks[2].length === numDisks) {
    // Game finished, change colors to golden

    // Change color of disks
    disks[2].forEach((disk) => {
      disk.material.color.set(0xffd700); // Golden color
    });

    // Change color of rods (towers)
    towers.forEach((tower) => {
      tower.material.color.set(0xffd700); // Golden color
    });

    // Change color of base
    base.material.color.set(0xffd700); // Golden color

    console.log("Game finished!");
    // You can add further logic here for game completion actions
  }
}

function moveDisk(fromTowerIndex, toTowerIndex) {
  if (disks[fromTowerIndex].length === 0) {
    return; // No disk to move
  }

  // Check if the move is valid
  const fromDisk = disks[fromTowerIndex][disks[fromTowerIndex].length - 1];
  const toDisk = disks[toTowerIndex][disks[toTowerIndex].length - 1];
  if (
    toDisk &&
    fromDisk.geometry.parameters.radiusTop >
      toDisk.geometry.parameters.radiusTop
  ) {
    return; // Invalid move
  }

  // Remove the disk from the source tower
  disks[fromTowerIndex].pop();
  console.log(disks);

  // Animate the disk movement
  const targetPosition = {
    x: towers[toTowerIndex].position.x,
    y: 0.25 + disks[toTowerIndex].length * 0.5,
    z: 0,
  };

  // Move disk up
  const upPosition = { ...fromDisk.position, y: towerHeight + 1 };

  new TWEEN.Tween(fromDisk.position)
    .to(upPosition, 500)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onComplete(() => {
      // Move disk horizontally
      new TWEEN.Tween(fromDisk.position)
        .to({ x: targetPosition.x }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
          // Move disk down
          new TWEEN.Tween(fromDisk.position)
            .to(targetPosition, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        })
        .start();
    })
    .start();

  // Add the disk to the destination tower
  disks[toTowerIndex].push(fromDisk);
  console.log("disk added to the destination");
  console.log(disks);

  // update moves and UI
  moves++;
  movesui.innerText = moves;

  // todo
  // check if the game is finished

  if (disks[2].length === numDisks) {
    // Game finished, change colors to golden

    // Change color of disks
    disks[2].forEach((disk) => {
      disk.material.color.set(0xffd700); // Golden color
    });

    // Change color of rods (towers)
    towers.forEach((tower) => {
      tower.material.color.set(0xffd700); // Golden color
    });

    // Change color of base
    base.material.color.set(0xffd700); // Golden color

    console.log("Game finished!");
    // You can add further logic here for game completion actions
  }
}

window.addEventListener("click", onMouseClick);
window.addEventListener("touchstart", onTouchStart);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  TWEEN.update();
  renderer.render(scene, camera);
}
animate();
