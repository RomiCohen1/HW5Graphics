import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Set background color
scene.background = new THREE.Color(0x000000);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

// Enable shadows
renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}

// Create basketball court
function createBasketballCourt() {
  // Court floor - just a simple brown surface
  const courtGeometry = new THREE.BoxGeometry(30, 0.2, 15);
  const courtMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xc68642,  // Brown wood color
    shininess: 50
  });
  const court = new THREE.Mesh(courtGeometry, courtMaterial);
  court.receiveShadow = true;
  scene.add(court);

  // Improve lighting setup
  ambientLight.intensity = 0.3; 
  directionalLight.intensity = 0.7; 
  directionalLight.position.set(15, 25, 20); 

  // Enhanced shadow settings
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
  directionalLight.shadow.mapSize.width = 2048;    
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 60;
  directionalLight.shadow.camera.left = -25;      
  directionalLight.shadow.camera.right = 25;
  directionalLight.shadow.camera.top = 25;
  directionalLight.shadow.camera.bottom = -25;

  // Add a second directional light for better illumination (reduced intensity)
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
  directionalLight2.position.set(-10, 20, -15);
  directionalLight2.castShadow = false; 
  scene.add(directionalLight2);

}
  
// Create court markings using white lines
const lineColor = 0xffffff;
const lineHeight = 0.21; 

// Center circle
const centerCircleGeometry = new THREE.RingGeometry(3, 3.1, 32);
const centerCircleMaterial = new THREE.MeshPhongMaterial({ 
  color: lineColor,
  side: THREE.DoubleSide
});
const centerCircle = new THREE.Mesh(centerCircleGeometry, centerCircleMaterial);
centerCircle.rotation.x = -Math.PI / 2; 
centerCircle.position.y = lineHeight;
scene.add(centerCircle);


// Free throw area & key (for both sides)
function createKey(side) {
  const basketX = side * 12;
  const keyWidth = 4.9;   
  const keyHeight = 5.8;  
  
  // Paint area (the box) 
  const keyGeometry = new THREE.BoxGeometry(keyHeight, 0.02, keyWidth); 
  const keyMaterial = new THREE.MeshPhongMaterial({ 
    color: lineColor,
    transparent: true,
    opacity: 0.2, 
    side: THREE.DoubleSide
  });
  const key = new THREE.Mesh(keyGeometry, keyMaterial);
  key.position.set(basketX, lineHeight, 0);
  scene.add(key);
  
  // Free-throw line 
  const ftLineGeometry = new THREE.BoxGeometry(0.1, 0.02, keyWidth); 
  const ftLine = new THREE.Mesh(ftLineGeometry, new THREE.MeshPhongMaterial({ color: lineColor }));
  ftLine.position.set(basketX - (side * keyHeight/2), lineHeight + 0.001, 0);
  scene.add(ftLine);
  
  // Free throw circle (top half)
  const ftCircleGeometry = new THREE.RingGeometry(1.8 - 0.05, 1.8 + 0.05, 32, 1, 0, Math.PI);
  const ftCircleMaterial = new THREE.MeshPhongMaterial({ color: lineColor, side: THREE.DoubleSide });
  const ftCircle = new THREE.Mesh(ftCircleGeometry, ftCircleMaterial);
  ftCircle.rotation.x = -Math.PI/2;
  ftCircle.rotation.z = side > 0 ? Math.PI/2 : -Math.PI/2; 
  ftCircle.position.set(basketX - (side * keyHeight/2), lineHeight, 0); 
  scene.add(ftCircle);
}

// Create keys for both sides
createKey(1);
createKey(-1);

// Function to create three-point arc
function createThreePointArc(side) {
  const arcRadius = 7.24;
  const basketX = side * 12;
  
  // Create the curved part of the three-point line
  const arcGeometry = new THREE.RingGeometry(arcRadius - 0.05, arcRadius + 0.05, 32, 1, 0, Math.PI);
  const arcMaterial = new THREE.MeshPhongMaterial({ 
    color: lineColor,
    side: THREE.DoubleSide
  });
  const arc = new THREE.Mesh(arcGeometry, arcMaterial);
  arc.rotation.x = -Math.PI / 2; 
  arc.rotation.z = side > 0 ? Math.PI/2 : -Math.PI/2; 
  arc.position.set(basketX, lineHeight, 0);
  scene.add(arc);
  
  const lineWidth = 0.1;
  const lineLength = 0.5; 
  
  // Top connecting line
  const topLineGeometry = new THREE.BoxGeometry(lineWidth, 0.02, lineLength);
  const topLineMaterial = new THREE.MeshPhongMaterial({ color: lineColor });
  const topLine = new THREE.Mesh(topLineGeometry, topLineMaterial);
  topLine.position.set(basketX - (side * arcRadius), lineHeight, 7.5 - lineLength/2);
  scene.add(topLine);
  
  // Bottom connecting line
  const bottomLine = new THREE.Mesh(topLineGeometry, topLineMaterial);
  bottomLine.position.set(basketX - (side * arcRadius), lineHeight, -7.5 + lineLength/2);
  scene.add(bottomLine);

  // connect arc endpoints to court boundaries
  const closingLineLength = 2.8; 
  
  const topArcLineGeometry = new THREE.BoxGeometry(closingLineLength, 0.02, lineWidth);
  const topArcLineMaterial = new THREE.MeshPhongMaterial({ color: lineColor });
  const topArcLine = new THREE.Mesh(topArcLineGeometry, topArcLineMaterial);
  topArcLine.position.set(basketX + (side * closingLineLength/2), lineHeight, side * arcRadius); // At arc endpoint
  topArcLine.receiveShadow = true;
  scene.add(topArcLine);
  
  const bottomArcLine = new THREE.Mesh(topArcLineGeometry, topArcLineMaterial);
  bottomArcLine.position.set(basketX + (side * closingLineLength/2), lineHeight, -side * arcRadius); // At arc endpoint
  bottomArcLine.receiveShadow = true;
  scene.add(bottomArcLine);
}

// Create three-point lines for both sides
createThreePointArc(1);  // One side
createThreePointArc(-1); // Other side


// Create basketball at center court
function createBasketball() {
  // Basketball sphere 
  const ballRadius = 0.24;
  const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 16);
  
  // Orange basketball material
  const ballMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff6600, 
    shininess: 30
  });
  
  const basketball = new THREE.Mesh(ballGeometry, ballMaterial);
  basketball.position.set(0, ballRadius + 0.2, 0); 
  basketball.castShadow = true;
  scene.add(basketball);
  

   // Create simple basketball seams 
  const seamMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x000000 
  });
  
  // Vertical seam line (going around the ball vertically)
  const verticalSeamGeometry = new THREE.TorusGeometry(ballRadius + 0.001, 0.004, 8, 16);
  const verticalSeam = new THREE.Mesh(verticalSeamGeometry, seamMaterial);
  verticalSeam.position.set(0, ballRadius + 0.2, 0);
  verticalSeam.rotation.x = Math.PI / 2; 
  scene.add(verticalSeam);

  // Four continuous curved seams that go all the way around
  const curvedSeamGeometry = new THREE.TorusGeometry(ballRadius + 0.001, 0.004, 8, 16); 
  
  // First curved seam
  const curvedSeam1 = new THREE.Mesh(curvedSeamGeometry, seamMaterial);
  curvedSeam1.position.set(0, ballRadius + 0.2, 0);
  curvedSeam1.rotation.x = Math.PI / 2;
  curvedSeam1.rotation.y = Math.PI / 4;
  scene.add(curvedSeam1);
  
  // Second curved seam (perpendicular to first)
  const curvedSeam2 = new THREE.Mesh(curvedSeamGeometry, seamMaterial);
  curvedSeam2.position.set(0, ballRadius + 0.2, 0);
  curvedSeam2.rotation.x = Math.PI / 2;
  curvedSeam2.rotation.y = -Math.PI / 4;
  scene.add(curvedSeam2);
}

// Create the basketball
createBasketball();

const centerLineGeometry = new THREE.BoxGeometry(0.1, 0.02, 15);
const centerLineMaterial = new THREE.MeshPhongMaterial({ color: lineColor });
const centerLine = new THREE.Mesh(centerLineGeometry, centerLineMaterial);
centerLine.position.y = lineHeight;
scene.add(centerLine);

// Create all elements
createBasketballCourt();

function createHoopSystem(xPos, flip = false) {
  const group = new THREE.Group();

  // Backboard
  const boardGeometry = new THREE.BoxGeometry(1.8, 1.05, 0.05);
  const boardMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.6
  });
  const backboard = new THREE.Mesh(boardGeometry, boardMaterial);
  backboard.position.set(0.28, 3.05, 0);
  backboard.rotation.y = degrees_to_radians(90);
  group.add(backboard);

  // Rim
  const rimGeometry = new THREE.TorusGeometry(0.23, 0.02, 16, 100);
  const rimMaterial = new THREE.MeshPhongMaterial({ color: 0xFF4500 });
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.position.set(0.1, 3.05, 0);
  rim.rotation.x = Math.PI / 2;
  group.add(rim);

  // Net
  const netMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const netHeight = 0.4;
  const rimRadius = 0.23;

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * 2 * Math.PI;
    const x = rimRadius * Math.cos(angle);
    const z = rimRadius * Math.sin(angle);

    const points = [
      new THREE.Vector3(0.1 + x, 3.05, z),
      new THREE.Vector3(0.1, 3.05 - netHeight, 0)
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, netMaterial);
    group.add(line);
  }

  // Support Pole
  const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3.05, 32);
  const poleMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 });
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.set(0.6, 1.525, 0);
  group.add(pole);

  // Support Arm 
  const armLength = 0.4; 
  const armGeometry = new THREE.CylinderGeometry(0.05, 0.05, armLength, 16);
  const armMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 });
  const arm = new THREE.Mesh(armGeometry, armMaterial);
  const poleX = 0.6;
  const backboardX = 0.28;
  const midpointX = (poleX + backboardX) / 2; 

  arm.position.set(midpointX, 3.2, 0); 
  arm.rotation.z = THREE.MathUtils.degToRad(60);

  group.add(arm);


  if (flip) {
    group.rotation.y = Math.PI;
  }

  group.position.x = xPos;
  scene.add(group);
}

function createPerson() {
  const group = new THREE.Group();

  // Randomize proportions
  const bodyHeight = 0.35 + Math.random() * 0.15;
  const bodyRadius = Math.random() > 0.5 ? 0.12 : 0.09;
  const headSize = 0.12 + Math.random() * 0.03;

  // Body
  const bodyGeom = new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyHeight, 16);
  const shirtColors = [0xFFACDB, 0xDBACFF, 0xACDBFF, 0xACFAFF, 0x90ee90, 0xFFB2AC];
  const bodyMat = new THREE.MeshPhongMaterial({ color: shirtColors[Math.floor(Math.random() * shirtColors.length)] });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.y = bodyHeight / 2;
  group.add(body);

  // Head
  const headGeom = new THREE.SphereGeometry(headSize, 16, 16);
  const skinTones = [0xffdbac, 0xf1c27d, 0xe0ac69, 0xc68642, 0x8d5524];
  const headMat = new THREE.MeshPhongMaterial({ color: skinTones[Math.floor(Math.random() * skinTones.length)] });
  const head = new THREE.Mesh(headGeom, headMat);
  head.position.y = bodyHeight + headSize * 0.9;
  group.add(head);

  // Arms 
  const armGeom = new THREE.BoxGeometry(0.04, 0.2, 0.04);
  const armMat = new THREE.MeshPhongMaterial({ color: bodyMat.color });
  const leftArm = new THREE.Mesh(armGeom, armMat);
  const rightArm = new THREE.Mesh(armGeom, armMat);
  leftArm.position.set(-bodyRadius - 0.04, bodyHeight * 0.75, 0);
  rightArm.position.set(bodyRadius + 0.04, bodyHeight * 0.75, 0);
  group.add(leftArm);
  group.add(rightArm);

  return group;
}


function createTribune() {
  const group = new THREE.Group();
  const rows = 5;

  for (let i = 0; i < rows; i++) {
    const stepGeometry = new THREE.BoxGeometry(30, 0.5, 2);
    const color = i % 2 === 0 ? 0xFFB6C1 : 0xADD8E6;
    const stepMaterial = new THREE.MeshPhongMaterial({ color: color });
    const step = new THREE.Mesh(stepGeometry, stepMaterial);
    step.position.set(0, 0.25 + i * 0.5, -7 + i * 2);
    group.add(step);
    for (let j = 0; j < 30; j++) {
      const person = createPerson();
      person.position.set(-15 + j * 1, 0.5 + i * 0.5, -7 + i * 2 + 0.5);
      group.add(person);
    }

  }
  
  group.position.set(0, 0, -16);  // Place tribune
  group.rotation.y = Math.PI;
  scene.add(group);
}

createHoopSystem(14.5)
createHoopSystem(-14.5,true)
createTribune();

// UI Framework Setup
// Create main UI container
const uiContainer = document.createElement('div');
uiContainer.id = 'ui-container';
uiContainer.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  font-family: 'Arial', sans-serif;
`;
document.body.appendChild(uiContainer);

// Score Display Container (Top Center)
const scoreContainer = document.createElement('div');
scoreContainer.id = 'score-container';
scoreContainer.style.cssText = `
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px 30px;
  border-radius: 10px;
  border: 2px solid #ff6600;
  text-align: center;
  min-width: 200px;
  pointer-events: auto;
`;
scoreContainer.innerHTML = `
  <h2 style="margin: 0 0 10px 0; font-size: 18px; color: #ff6600;">BASKETBALL COURT</h2>
  <div style="display: flex; justify-content: space-between; font-size: 24px; font-weight: bold;">
    <span>HOME: <span id="home-score">0</span></span>
    <span style="color: #ff6600;">|</span>
    <span>AWAY: <span id="away-score">0</span></span>
  </div>
  <div style="font-size: 12px; margin-top: 5px; color: #ccc;">
    Time: <span id="game-time">12:00</span>
  </div>
`;
uiContainer.appendChild(scoreContainer);

// Controls Instructions Container (Bottom Left)
const controlsContainer = document.createElement('div');
controlsContainer.id = 'controls-container';
controlsContainer.style.cssText = `
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  border-radius: 8px;
  max-width: 250px;
  pointer-events: auto;
`;
controlsContainer.innerHTML = `
  <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #ff6600;">CONTROLS</h3>
  <div style="font-size: 14px; line-height: 1.4;">
    <div><strong>O</strong> - Toggle orbit camera</div>
    <div><strong>Mouse</strong> - Rotate view (when orbit enabled)</div>
    <div><strong>Scroll</strong> - Zoom in/out</div>
    <div style="margin-top: 8px; font-size: 12px; color: #ccc;">
      Camera: <span id="camera-status">Enabled</span>
    </div>
  </div>
`;
uiContainer.appendChild(controlsContainer);

// Game Stats Container (Top Right)
const statsContainer = document.createElement('div');
statsContainer.id = 'stats-container';
statsContainer.style.cssText = `
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  border-radius: 8px;
  min-width: 180px;
  pointer-events: auto;
`;
statsContainer.innerHTML = `
  <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #ff6600;">GAME STATS</h3>
  <div style="font-size: 13px; line-height: 1.6;">
    <div>Quarter: <span id="quarter">1st</span></div>
    <div>Fouls: H:<span id="home-fouls">0</span> | A:<span id="away-fouls">0</span></div>
    <div>Timeouts: H:<span id="home-timeouts">3</span> | A:<span id="away-timeouts">3</span></div>
    <div style="margin-top: 8px; font-size: 11px; color: #ccc;">
      Status: <span id="game-status">Ready</span>
    </div>
  </div>
`;
uiContainer.appendChild(statsContainer);


// Set camera position for better view
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0, 15, 30);
camera.applyMatrix4(cameraTranslate);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;


// Update camera status display
function updateCameraStatus() {
  const statusElement = document.getElementById('camera-status');
  if (statusElement) {
    statusElement.textContent = isOrbitEnabled ? 'Enabled' : 'Disabled';
    statusElement.style.color = isOrbitEnabled ? '#4CAF50' : '#f44336';
  }
}

// Initialize camera status
updateCameraStatus();

// Handle key events
function handleKeyDown(e) {
  if (e.key === "o" || e.key === "O") {
    isOrbitEnabled = !isOrbitEnabled;
    updateCameraStatus(); // Updates UI display

  }
}

document.addEventListener('keydown', handleKeyDown);

// Animation function
function animate() {
  requestAnimationFrame(animate);
  
  // Update controls
  controls.enabled = isOrbitEnabled;
  controls.update();
  
  renderer.render(scene, camera);
}

animate();