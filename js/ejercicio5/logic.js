let moves = 0;
let movesui = document.getElementById("movesui");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("gamebox").appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5).normalize();
scene.add(directionalLight);

const baseGeometry = new THREE.BoxGeometry(12, 1, 5);
const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.x = 5;
base.position.y = -0.5;
scene.add(base);

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

createTower(1);
createTower(5);
createTower(9);

const disks = [[], [], []];

function interpolateColor(color1, color2, factor) {
  const result = color1.clone();
  result.lerp(color2, factor);
  return result;
}

function createDisk(radius, height, x, y, towerIndex, color) {
  const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
  const material = new THREE.MeshPhongMaterial({ color });
  const disk = new THREE.Mesh(geometry, material);
  disk.position.set(1, y, 0);
  scene.add(disk);
  disks[towerIndex].push(disk);
}

const baseColor = new THREE.Color(0x1e90ff);
const targetColor = new THREE.Color(0xffffff);

let numDisks = 3;

for (let i = 0; i < numDisks; i++) {
  const factor = i / (numDisks - 1);
  const color = interpolateColor(baseColor, targetColor, factor);
  createDisk(1.5 - 0.25 * i, 0.5, -4, 0.25 + 0.5 * i, 0, color);
}

camera.position.x = 4;
camera.position.y = 8;
camera.position.z = 12;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

let selectedTowerIndex = null;

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
    selectedTowerIndex = towerIndex;
    towers[towerIndex].material.color.set(0xffff00);
  } else {
    moveDisk(selectedTowerIndex, towerIndex);
    towers[selectedTowerIndex].material.color.set(0x808080);
    selectedTowerIndex = null;
  }

  if (disks[2].length === numDisks) {
    disks[2].forEach((disk) => {
      disk.material.color.set(0xffd700);
    });

    towers.forEach((tower) => {
      tower.material.color.set(0xffd700);
    });

    base.material.color.set(0xffd700);

    console.log("Game finished!");
  }
}

function moveDisk(fromTowerIndex, toTowerIndex) {
  if (disks[fromTowerIndex].length === 0) {
    return;
  }

  const fromDisk = disks[fromTowerIndex][disks[fromTowerIndex].length - 1];
  const toDisk = disks[toTowerIndex][disks[toTowerIndex].length - 1];
  if (
    toDisk &&
    fromDisk.geometry.parameters.radiusTop >
      toDisk.geometry.parameters.radiusTop
  ) {
    return;
  }

  disks[fromTowerIndex].pop();
  console.log(disks);

  const targetPosition = {
    x: towers[toTowerIndex].position.x,
    y: 0.25 + disks[toTowerIndex].length * 0.5,
    z: 0,
  };

  const upPosition = { ...fromDisk.position, y: towerHeight + 1 };

  new TWEEN.Tween(fromDisk.position)
    .to(upPosition, 500)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onComplete(() => {
      new TWEEN.Tween(fromDisk.position)
        .to({ x: targetPosition.x }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
          new TWEEN.Tween(fromDisk.position)
            .to(targetPosition, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        })
        .start();
    })
    .start();

  disks[toTowerIndex].push(fromDisk);
  console.log("disk added to the destination");
  console.log(disks);

  moves++;
  movesui.innerText = moves;

  if (disks[2].length === numDisks) {
    disks[2].forEach((disk) => {
      disk.material.color.set(0xffd700);
    });

    towers.forEach((tower) => {
      tower.material.color.set(0xffd700);
    });

    base.material.color.set(0xffd700);

    console.log("Game finished!");
  }
}

window.addEventListener("click", onMouseClick);
window.addEventListener("touchstart", onTouchStart);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.getElementById("startGame").addEventListener("click", () => {
  moves = 0;
  movesui.innerText = moves;

  disks.forEach((tower) => {
    tower.forEach((disk) => {
      scene.remove(disk);
    });
  });
  disks[0] = [];
  disks[1] = [];
  disks[2] = [];

  towers.forEach((tower) => {
    tower.material.color.set(0x808080);
  });

  base.material.color.set(0x8b4513);

  numDisks = parseInt(document.getElementById("numDisksInput").value);

  for (let i = 0; i < numDisks; i++) {
    const factor = i / (numDisks - 1);
    const color = interpolateColor(baseColor, targetColor, factor);
    createDisk(1.5 - 0.25 * i, 0.5, -4, 0.25 + 0.5 * i, 0, color);
  }
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  TWEEN.update();
  renderer.render(scene, camera);
}
animate();
