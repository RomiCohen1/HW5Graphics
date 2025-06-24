import {OrbitControls} from './OrbitControls.js'
class SimpleSoundManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.7;
    this.initialized = false;
    
    this.initializeAudio();
    this.createSounds();
  }

  async initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create master volume control
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.volume;
      
      console.log('Simple audio system initialized');
      this.initialized = true;
    } catch (error) {
      console.warn('Audio initialization failed:', error);
      this.enabled = false;
    }
  }

  async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  createSounds() {
    this.createBounceSound();
    this.createShootSound();
    this.createScoreSound();
  }

  // Basketball bounce sound
  createBounceSound() {
    this.sounds.bounce = () => {
      if (!this.enabled || !this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      // Deep thump sound for basketball bounce
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(120, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(60, this.audioContext.currentTime + 0.15);
      
      gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    };
  }

  // Basketball shooting sound
  createShootSound() {
    this.sounds.shoot = () => {
      if (!this.enabled || !this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      // Quick whoosh sound for shooting
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    };
  }

  // Score celebration sound
  createScoreSound() {
    this.sounds.score = () => {
      if (!this.enabled || !this.audioContext) return;
      
      // Create a simple celebratory chord progression
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
      
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(this.masterGain);
          
          oscillator.type = 'sine';
          oscillator.frequency.value = freq;
          
          gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
          
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.4);
        }, index * 80);
      });
    };
  }

  // Play a specific sound
  playSound(soundName) {
    if (!this.enabled || !this.sounds[soundName]) return;
    
    this.resumeAudioContext();
    this.sounds[soundName]();
  }

  // Toggle sound on/off
  toggleSound() {
    this.enabled = !this.enabled;
    console.log(`Sound ${this.enabled ? 'enabled' : 'disabled'}`);
    return this.enabled;
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume;
    }
  }

  isEnabled() {
    return this.enabled;
  }
}
// FIXED TIME CHALLENGE SYSTEM - NON-INTRUSIVE UI
// Replace your existing TimeChallenge class with this improved version

class TimeChallenge {
  constructor() {
    this.isActive = false;
    this.timeRemaining = 0;
    this.totalTime = 0;
    this.timer = null;
    this.challengeType = 'none';
    this.startTime = 0;
    this.challenges = {
      sprint: { name: "Sprint Shoot", time: 30, target: 5, description: "Score 5 baskets in 30 seconds" },
      marathon: { name: "Marathon", time: 120, target: 15, description: "Score 15 baskets in 2 minutes" },
      lightning: { name: "Lightning Round", time: 15, target: 3, description: "Score 3 baskets in 15 seconds" },
      endurance: { name: "Endurance Test", time: 180, target: 25, description: "Score 25 baskets in 3 minutes" }
    };
    this.challengeStats = {
      shotsAttempted: 0,
      shotsMade: 0,
      startingScore: 0,
      targetReached: false,
      bestTime: null
    };
    
    this.createChallengeUI();
  }

  createChallengeUI() {
    // MAIN CHALLENGE MENU (only shown when selecting challenges)
    const challengeContainer = document.createElement('div');
    challengeContainer.id = 'challenge-container';
    challengeContainer.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 3000;
      min-width: 400px;
      display: none;
      font-family: Arial, sans-serif;
    `;
    
    challengeContainer.innerHTML = `
      <h2 style="margin: 0 0 20px 0; color: #fff; font-size: 28px;">🏀 TIME CHALLENGE</h2>
      <div id="challenge-menu">
        <p style="margin-bottom: 20px; font-size: 16px;">Choose your challenge:</p>
        <div id="challenge-buttons" style="margin-bottom: 20px;">
          ${Object.keys(this.challenges).map(key => `
            <button class="challenge-btn" data-challenge="${key}" style="
              display: block;
              width: 100%;
              margin: 8px 0;
              padding: 12px;
              background: rgba(255,255,255,0.2);
              border: 2px solid rgba(255,255,255,0.3);
              color: white;
              border-radius: 8px;
              cursor: pointer;
              font-size: 14px;
              transition: all 0.3s ease;
            ">
              <strong>${this.challenges[key].name}</strong><br>
              <small>${this.challenges[key].description}</small>
            </button>
          `).join('')}
        </div>
        <button id="close-challenge" style="
          padding: 10px 20px;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          border-radius: 5px;
          cursor: pointer;
        ">Close</button>
      </div>
      
      <div id="challenge-complete" style="display: none;">
        <h3 id="completion-title" style="margin: 0 0 15px 0;"></h3>
        <div id="completion-message" style="font-size: 18px; margin: 15px 0;"></div>
        <div id="challenge-stats" style="margin: 20px 0; font-size: 14px;"></div>
        <button id="new-challenge" style="
          margin: 10px 5px;
          padding: 10px 20px;
          background: #4CAF50;
          border: none;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        ">New Challenge</button>
        <button id="back-to-game" style="
          margin: 10px 5px;
          padding: 10px 20px;
          background: #2196F3;
          border: none;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        ">Back to Game</button>
      </div>
    `;
    
    document.body.appendChild(challengeContainer);
    
    // COMPACT CHALLENGE HUD (shown during gameplay - non-intrusive)
    this.createCompactHUD();
    this.setupEventListeners();
    this.addChallengeButton();
  }

  createCompactHUD() {
    // Create a compact HUD that doesn't block the game view
    const compactHUD = document.createElement('div');
    compactHUD.id = 'challenge-hud';
    compactHUD.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 12px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      font-family: Arial, sans-serif;
      z-index: 2000;
      display: none;
      min-width: 200px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    `;
    
    compactHUD.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div style="font-size: 12px; font-weight: bold; color: #FFE082;" id="hud-challenge-name">CHALLENGE</div>
        <button id="quit-challenge-hud" style="
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          border-radius: 4px;
          padding: 2px 8px;
          cursor: pointer;
          font-size: 10px;
        ">QUIT</button>
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div style="font-size: 28px; font-weight: bold;" id="hud-timer">1:00</div>
        <div style="text-align: right; font-size: 14px;">
          <div id="hud-progress" style="font-weight: bold;">0/5</div>
          <div style="font-size: 10px; color: #E0E0E0;">PROGRESS</div>
        </div>
      </div>
      
      <div style="background: rgba(255,255,255,0.2); height: 6px; border-radius: 3px; overflow: hidden; margin-bottom: 8px;">
        <div id="hud-progress-bar" style="
          height: 100%;
          background: linear-gradient(90deg, #4CAF50 0%, #45a049 100%);
          width: 0%;
          transition: width 0.3s ease;
          border-radius: 3px;
        "></div>
      </div>
      
      <div style="display: flex; justify-content: space-between; font-size: 11px; color: #E0E0E0;">
        <span>Attempts: <span id="hud-attempts">0</span></span>
        <span>Accuracy: <span id="hud-accuracy">0%</span></span>
      </div>
    `;
    
    document.body.appendChild(compactHUD);
  }

  addChallengeButton() {
    // Add to existing controls container
    const controlsContainer = document.getElementById('controls-container');
    if (controlsContainer) {
      const challengeButton = document.createElement('div');
      challengeButton.style.cssText = `
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #555;
      `;
      challengeButton.innerHTML = `
        <button id="start-challenge-btn" style="
          width: 100%;
          padding: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
        ">🏀 TIME CHALLENGE</button>
        <div style="font-size: 10px; color: #ccc; margin-top: 3px; text-align: center;">
          Press 'T' for challenges
        </div>
      `;
      
      controlsContainer.appendChild(challengeButton);
      
      document.getElementById('start-challenge-btn').addEventListener('click', () => {
        this.showChallengeMenu();
      });
    }
  }

  setupEventListeners() {
    // Challenge selection buttons
    document.querySelectorAll('.challenge-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const challengeType = btn.dataset.challenge;
        this.startChallenge(challengeType);
      });
      
      // Hover effects
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(255,255,255,0.3)';
        btn.style.transform = 'scale(1.02)';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'rgba(255,255,255,0.2)';
        btn.style.transform = 'scale(1)';
      });
    });
    
    // Close button
    document.getElementById('close-challenge').addEventListener('click', () => {
      this.hideChallengeMenu();
    });
    
    // Quit challenge buttons (both main and HUD)
    document.getElementById('quit-challenge-hud').addEventListener('click', () => {
      this.endChallenge(false);
    });
    
    // New challenge button
    document.getElementById('new-challenge').addEventListener('click', () => {
      this.showChallengeMenu();
    });
    
    // Back to game button
    document.getElementById('back-to-game').addEventListener('click', () => {
      this.hideChallengeMenu();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 't' && !this.isActive) {
        this.showChallengeMenu();
      }
      if (e.key === 'Escape') {
        if (document.getElementById('challenge-container').style.display !== 'none') {
          this.hideChallengeMenu();
        } else if (this.isActive) {
          this.endChallenge(false); // Quit active challenge with Escape
        }
      }
    });
  }

  showChallengeMenu() {
    const container = document.getElementById('challenge-container');
    container.style.display = 'block';
    
    // Show menu, hide completion section
    document.getElementById('challenge-menu').style.display = 'block';
    document.getElementById('challenge-complete').style.display = 'none';
  }

  hideChallengeMenu() {
    document.getElementById('challenge-container').style.display = 'none';
  }

  startChallenge(challengeType) {
    if (this.isActive) return;
    
    this.isActive = true;
    this.challengeType = challengeType;
    this.timeRemaining = this.challenges[challengeType].time;
    this.totalTime = this.challenges[challengeType].time;
    this.startTime = Date.now();
    
    // Reset stats
    this.challengeStats = {
      shotsAttempted: gameStats.shotAttempts, // Store starting attempts
      shotsMade: 0,
      startingScore: gameStats.shotsMade,
      targetReached: false,
      bestTime: null
    };
    
    // Hide the challenge menu
    this.hideChallengeMenu();
    
    // Show the compact HUD instead
    document.getElementById('challenge-hud').style.display = 'block';
    document.getElementById('hud-challenge-name').textContent = this.challenges[challengeType].name.toUpperCase();
    document.getElementById('hud-progress').textContent = `0/${this.challenges[challengeType].target}`;
    
    // Start countdown
    this.startTimer();
    
    // Play sound if available
    if (window.soundManager) {
      soundManager.playSound('shoot');
    }
    
    console.log(`Started ${challengeType} challenge: ${this.challenges[challengeType].description}`);
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      this.updateHUDDisplay();
      
      if (this.timeRemaining <= 0) {
        this.endChallenge(false); // Time up
      }
      
      // Check if target reached
      const currentMade = gameStats.shotsMade - this.challengeStats.startingScore;
      if (currentMade >= this.challenges[this.challengeType].target) {
        this.endChallenge(true); // Success
      }
      
    }, 1000);
  }

  updateHUDDisplay() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Update timer
    document.getElementById('hud-timer').textContent = timeString;
    
    // Update progress
    const currentMade = gameStats.shotsMade - this.challengeStats.startingScore;
    const target = this.challenges[this.challengeType].target;
    const progress = (currentMade / target) * 100;
    
    document.getElementById('hud-progress').textContent = `${currentMade}/${target}`;
    document.getElementById('hud-progress-bar').style.width = Math.min(progress, 100) + '%';
    
    // Update stats
    const totalAttempts = gameStats.shotAttempts - this.challengeStats.shotsAttempted;
    const accuracy = totalAttempts > 0 ? Math.round((currentMade / totalAttempts) * 100) : 0;
    document.getElementById('hud-accuracy').textContent = accuracy + '%';
    document.getElementById('hud-attempts').textContent = totalAttempts;
    
    // Change timer color when time is running out
    const timerEl = document.getElementById('hud-timer');
    if (this.timeRemaining <= 10) {
      timerEl.style.color = '#ff4444';
      timerEl.style.animation = 'pulse 1s infinite';
      // Flash the entire HUD
      document.getElementById('challenge-hud').style.borderColor = '#ff4444';
    } else if (this.timeRemaining <= 30) {
      timerEl.style.color = '#ffaa00';
      document.getElementById('challenge-hud').style.borderColor = '#ffaa00';
    } else {
      timerEl.style.color = 'white';
      timerEl.style.animation = 'none';
      document.getElementById('challenge-hud').style.borderColor = 'rgba(255, 255, 255, 0.3)';
    }
  }

  endChallenge(success) {
    if (!this.isActive) return;
    
    this.isActive = false;
    clearInterval(this.timer);
    
    // Hide HUD
    document.getElementById('challenge-hud').style.display = 'none';
    
    // Calculate final stats
    const currentMade = gameStats.shotsMade - this.challengeStats.startingScore;
    const totalAttempts = gameStats.shotAttempts - this.challengeStats.shotsAttempted;
    const finalAccuracy = totalAttempts > 0 ? Math.round((currentMade / totalAttempts) * 100) : 0;
    const timeUsed = this.totalTime - this.timeRemaining;
    
    // Show completion screen
    document.getElementById('challenge-container').style.display = 'block';
    document.getElementById('challenge-menu').style.display = 'none';
    document.getElementById('challenge-complete').style.display = 'block';
    
    if (success) {
      document.getElementById('completion-title').textContent = '🎉 CHALLENGE COMPLETED!';
      document.getElementById('completion-title').style.color = '#4CAF50';
      document.getElementById('completion-message').textContent = `Congratulations! You scored ${currentMade} baskets in ${this.formatTime(timeUsed)}!`;
      
      // Play success sound
      if (window.soundManager) {
        soundManager.playSound('score');
      }
    } else {
      document.getElementById('completion-title').textContent = '⏰ TIME UP!';
      document.getElementById('completion-title').style.color = '#ff4444';
      document.getElementById('completion-message').textContent = `Challenge failed. You scored ${currentMade} out of ${this.challenges[this.challengeType].target} baskets.`;
    }
    
    // Show detailed stats
    document.getElementById('challenge-stats').innerHTML = `
      <div style="text-align: left; display: inline-block;">
        <div><strong>Challenge:</strong> ${this.challenges[this.challengeType].name}</div>
        <div><strong>Target:</strong> ${this.challenges[this.challengeType].target} baskets</div>
        <div><strong>Scored:</strong> ${currentMade} baskets</div>
        <div><strong>Attempts:</strong> ${totalAttempts}</div>
        <div><strong>Accuracy:</strong> ${finalAccuracy}%</div>
        <div><strong>Time Used:</strong> ${this.formatTime(timeUsed)} / ${this.formatTime(this.totalTime)}</div>
        ${success ? `<div style="color: #4CAF50;"><strong>Result:</strong> SUCCESS! 🏆</div>` : `<div style="color: #ff4444;"><strong>Result:</strong> Failed ❌</div>`}
      </div>
    `;
    
    console.log(`Challenge ended: ${success ? 'SUCCESS' : 'FAILED'}`);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  onScore() {
    if (this.isActive) {
      this.updateHUDDisplay();
    }
  }

  onShotAttempt() {
    if (this.isActive) {
      this.updateHUDDisplay();
    }
  }

  isInChallenge() {
    return this.isActive;
  }

  getCurrentChallenge() {
    return this.isActive ? this.challenges[this.challengeType] : null;
  }
}

// Re-initialize with the fixed version
if (window.timeChallenge) {
  // Clean up old instance
  const oldHUD = document.getElementById('challenge-hud');
  if (oldHUD) oldHUD.remove();
  
  const oldContainer = document.getElementById('challenge-container');
  if (oldContainer) oldContainer.remove();
}

// Create new improved instance
window.timeChallenge = new TimeChallenge();

// CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);

// Initialize the simple sound manager
const soundManager = new SimpleSoundManager();
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


// Basketball Game State Variables
let basketball;
let basketballGroup;
let ballRadius = 0.24;
let ballVelocity = new THREE.Vector3(0, 0, 0);
let ballRotation = new THREE.Vector3(0, 0, 0);
let isInFlight = false;
let shotPower = 50; // 0-100%
let gravity = -9.8;
let bounceCoefficient = 0.6;
let gameStats = {
  homeScore: 0,
  awayScore: 0,
  shotAttempts: 0,
  shotsMade: 0,
  accuracy: 0
};

// Track ball position for pass-through detection
let previousBallPosition = new THREE.Vector3(0, 0, 0);
let ballAboveHoop = false;

// Create basketball at center court
function createBasketball() {
  basketballGroup = new THREE.Group();
  
  // Basketball sphere
  const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 16);
  
  // Orange basketball material
  const ballMaterial = new THREE.MeshPhongMaterial({
    color: 0xff6600,
    shininess: 30
  });
  
  basketball = new THREE.Mesh(ballGeometry, ballMaterial);
  basketball.castShadow = true;
  basketballGroup.add(basketball);
  

   // Create simple basketball seams
  const seamMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000
  });
  
  // Vertical seam line (going around the ball vertically)
  const verticalSeamGeometry = new THREE.TorusGeometry(ballRadius + 0.001, 0.004, 8, 16);
  const verticalSeam = new THREE.Mesh(verticalSeamGeometry, seamMaterial);
  verticalSeam.rotation.x = Math.PI / 2;
  basketballGroup.add(verticalSeam);

  // Four continuous curved seams that go all the way around
  const curvedSeamGeometry = new THREE.TorusGeometry(ballRadius + 0.001, 0.004, 8, 16);
  
  // First curved seam
  const curvedSeam1 = new THREE.Mesh(curvedSeamGeometry, seamMaterial);
  curvedSeam1.rotation.x = Math.PI / 2;
  curvedSeam1.rotation.y = Math.PI / 4;
  basketballGroup.add(curvedSeam1);
  
  // Second curved seam (perpendicular to first)
  const curvedSeam2 = new THREE.Mesh(curvedSeamGeometry, seamMaterial);
  curvedSeam2.rotation.x = Math.PI / 2;
  curvedSeam2.rotation.y = -Math.PI / 4;
  basketballGroup.add(curvedSeam2);
  
  // Position the basketball group at center court
  basketballGroup.position.set(0, ballRadius + 0.2, 0);
  scene.add(basketballGroup);
}

// Create the basketball
createBasketball();

// Basketball Physics Functions
function updateBasketballPhysics(deltaTime) {
  if (!isInFlight) return;
  
  // Apply gravity
  ballVelocity.y += gravity * deltaTime;
  
  // Update position
  basketballGroup.position.add(ballVelocity.clone().multiplyScalar(deltaTime));
  
  // Apply rotation based on velocity
  const speed = ballVelocity.length();
  ballRotation.x += speed * deltaTime * 5; // Increased from 2 to 5
  ballRotation.z += ballVelocity.x * deltaTime * 5; // Increased from 2 to 5
  
  // Apply rotation to both basketball mesh and group
  basketball.rotation.x = ballRotation.x;
  basketball.rotation.z = ballRotation.z;
  basketballGroup.rotation.x = ballRotation.x;
  basketballGroup.rotation.z = ballRotation.z;
  
  // Ground collision detection
  if (basketballGroup.position.y <= ballRadius + 0.2) {
    basketballGroup.position.y = ballRadius + 0.2;
    ballVelocity.y = -ballVelocity.y * bounceCoefficient;
    ballVelocity.x *= 0.8; // Friction
    ballVelocity.z *= 0.8; // Friction
    soundManager.playSound('bounce');
    
    // Stop bouncing if velocity is too low
    if (Math.abs(ballVelocity.y) < 0.5 && speed < 1) {
      isInFlight = false;
      ballVelocity.set(0, 0, 0);
    }
  }
  
  // Check for backboard collisions
  checkBackboardCollision();
  
  // Check if ball is out of court bounds
  if (basketballGroup.position.x < -16 || basketballGroup.position.x > 16 ||
      basketballGroup.position.z < -9 || basketballGroup.position.z > 9) {
    // Ball is out of bounds - reset to center court
    setTimeout(() => {
      resetBasketball();
    }, 1000);
    return; // Don't check for score if ball is out of bounds
  }
  
  // Check for score
  checkForScore();
}

function checkForScore() {
  const ballPos = basketballGroup.position;
  const hoopHeight = 3.05;
  const hoopRadius = 0.23;
  const hoopDetectionHeight = 0.4; // Height range for detection
  
  // Check both hoops with team assignment
  const hoops = [
    { x: 14.5 + 0.1, z: 0, team: 'home' },   // Right hoop scores for HOME
    { x: -14.5 - 0.1, z: 0, team: 'away' }  // Left hoop scores for AWAY
  ];
  
  hoops.forEach(hoop => {
    const distanceToHoop = Math.sqrt(
      Math.pow(ballPos.x - hoop.x, 2) +
      Math.pow(ballPos.z - hoop.z, 2)
    );
    
    const prevDistanceToHoop = Math.sqrt(
      Math.pow(previousBallPosition.x - hoop.x, 2) +
      Math.pow(previousBallPosition.z - hoop.z, 2)
    );
    
    // Check if ball is within hoop radius horizontally
    const withinHoopRadius = distanceToHoop <= hoopRadius;
    const prevWithinHoopRadius = prevDistanceToHoop <= hoopRadius;
    
    // Check if ball is above hoop (approaching from above)
    const aboveHoop = ballPos.y > hoopHeight && ballPos.y < hoopHeight + hoopDetectionHeight;
    const belowHoop = ballPos.y < hoopHeight && ballPos.y > hoopHeight - hoopDetectionHeight;
    
    // Check if ball was above hoop in previous frame
    const wasAboveHoop = previousBallPosition.y > hoopHeight;
    
    // Ball must pass through hoop: was above, now below, and within radius, moving downward
    if (withinHoopRadius &&
        wasAboveHoop &&
        belowHoop &&
        ballVelocity.y < 0 && // Ball must be moving downward
        isInFlight) { // Only count during flight, not manual movement
      
      soundManager.playSound('score');
      timeChallenge.onScore();
      
      // Score for the appropriate team!
      gameStats.shotsMade++;
      if (hoop.team === 'home') {
        gameStats.homeScore += 2;
        // Show "SHOT MADE!" first, then team-specific message
        showShotFeedback(true, 'SHOT MADE!');
        setTimeout(() => {
          showShotFeedback(true, 'HOME SCORES!');
        }, 1000);
      } else {
        gameStats.awayScore += 2;
        // Show "SHOT MADE!" first, then team-specific message
        showShotFeedback(true, 'SHOT MADE!');
        setTimeout(() => {
          showShotFeedback(true, 'AWAY SCORES!');
        }, 1000);
      }
      
      updateGameUI();
      
      // Stop the ball and reset to center court after a short delay
      isInFlight = false;
      ballVelocity.set(0, 0, 0);
      setTimeout(() => {
        resetBasketball();
      }, 2000); // Reset after 2 seconds
    }
  });
  
  // Update previous position for next frame
  previousBallPosition.copy(ballPos);
}

function checkBackboardCollision() {
  const ballPos = basketballGroup.position;
  const ballRadius = 0.24;
  
  // Backboard dimensions and positions
  const backboards = [
    {
      x: 14.5 + 0.28, // Right backboard (hoop at 14.5 + 0.1, backboard at +0.28 from hoop)
      minY: 3.05 - 0.525, // Bottom of backboard (hoop height - half backboard height)
      maxY: 3.05 + 0.525, // Top of backboard
      minZ: -0.9, // Half backboard width
      maxZ: 0.9,  // Half backboard width
      thickness: 0.05
    },
    {
      x: -14.5 - 0.28, // Left backboard (hoop at -14.5 - 0.1, backboard at -0.28 from hoop)
      minY: 3.05 - 0.525,
      maxY: 3.05 + 0.525,
      minZ: -0.9,
      maxZ: 0.9,
      thickness: 0.05
    }
  ];
  
  backboards.forEach(board => {
    // Check if ball is within backboard Y and Z bounds
    if (ballPos.y >= board.minY - ballRadius && ballPos.y <= board.maxY + ballRadius &&
        ballPos.z >= board.minZ - ballRadius && ballPos.z <= board.maxZ + ballRadius) {
      
      // Check collision with right backboard (positive X)
      if (board.x > 0) {
        // Ball hits from the left side (court side)
        if (ballPos.x + ballRadius >= board.x - board.thickness/2 &&
            ballPos.x < board.x &&
            ballVelocity.x > 0) {
          // Collision detected - bounce ball back
          ballPos.x = board.x - board.thickness/2 - ballRadius;
          ballVelocity.x = -ballVelocity.x * 0.8; // Reverse X velocity with some energy loss
          ballVelocity.y *= 0.9; // Slight energy loss in Y
          ballVelocity.z *= 0.9; // Slight energy loss in Z
        }
      }
      // Check collision with left backboard (negative X)
      else {
        // Ball hits from the right side (court side)
        if (ballPos.x - ballRadius <= board.x + board.thickness/2 &&
            ballPos.x > board.x &&
            ballVelocity.x < 0) {
          // Collision detected - bounce ball back
          ballPos.x = board.x + board.thickness/2 + ballRadius;
          ballVelocity.x = -ballVelocity.x * 0.8; // Reverse X velocity with some energy loss
          ballVelocity.y *= 0.9; // Slight energy loss in Y
          ballVelocity.z *= 0.9; // Slight energy loss in Z
        }
      }
    }
  });
}

function shootBasketball() {
  if (isInFlight) return; // Can't shoot while ball is in flight
  soundManager.playSound('shoot');
  timeChallenge.onShotAttempt();
  gameStats.shotAttempts++;
  
  // Find nearest hoop
  const ballPos = basketballGroup.position;
  const hoops = [
    { x: 14.5 + 0.1, z: 0 }, // Right hoop
    { x: -14.5 - 0.1, z: 0 } // Left hoop
  ];
  
  let nearestHoop = hoops[0];
  let minDistance = Math.sqrt(
    Math.pow(ballPos.x - hoops[0].x, 2) +
    Math.pow(ballPos.z - hoops[0].z, 2)
  );
  
  const distance1 = Math.sqrt(
    Math.pow(ballPos.x - hoops[1].x, 2) +
    Math.pow(ballPos.z - hoops[1].z, 2)
  );
  
  if (distance1 < minDistance) {
    nearestHoop = hoops[1];
    minDistance = distance1;
  }
  
  // Calculate shot trajectory
  const targetHeight = 3.05; // Hoop height
  const currentHeight = 0.44; // Ball is always at this height when shooting (ballRadius + 0.2)
  const distance = minDistance;
  
  // Calculate initial velocity based on shot power and distance
  const powerMultiplier = shotPower / 100;
  
  // Use consistent shooting angle that provides good arc regardless of distance
  const shootingAngle = Math.PI / 4; // 45 degrees - optimal for most distances
  
  // Calculate required velocity to reach the target at this angle
  const heightDiff = targetHeight - currentHeight;
  const gravity = 9.8;
  
  // Physics formula: v = sqrt(g * d^2 / (2 * cos^2(θ) * (d * tan(θ) - h)))
  const cosAngle = Math.cos(shootingAngle);
  const tanAngle = Math.tan(shootingAngle);
  
  const velocitySquared = (gravity * distance * distance) /
    (2 * cosAngle * cosAngle * (distance * tanAngle - heightDiff));
  
  const requiredVelocity = Math.sqrt(Math.abs(velocitySquared));
  
  // Apply power multiplier to the required velocity
  const initialVelocity = requiredVelocity * powerMultiplier;
  const angle = shootingAngle;
  
  // Set velocity components
  const direction = new THREE.Vector3(
    nearestHoop.x - ballPos.x,
    0,
    nearestHoop.z - ballPos.z
  ).normalize();
  
  ballVelocity.x = direction.x * initialVelocity * Math.cos(angle);
  ballVelocity.z = direction.z * initialVelocity * Math.cos(angle);
  ballVelocity.y = initialVelocity * Math.sin(angle);
  
  isInFlight = true;
  
  // Add slight delay before checking if shot missed
  setTimeout(() => {
    if (isInFlight && basketballGroup.position.y < 1) {
      showShotFeedback(false);
    }
  }, 2000);
  
  updateGameUI();
}

function resetBasketball() {
  basketballGroup.position.set(0, ballRadius + 0.2, 0);
  ballVelocity.set(0, 0, 0);
  ballRotation.set(0, 0, 0);
  basketball.rotation.set(0, 0, 0);
  basketballGroup.rotation.set(0, 0, 0); // Also reset group rotation
  previousBallPosition.set(0, ballRadius + 0.2, 0); // Reset previous position tracking
  ballAboveHoop = false;
  isInFlight = false;
  shotPower = 50;
  updateGameUI();
}


function moveBasketball(direction, speed = 5) {
  if (isInFlight) return; // Can't move while ball is in flight
  
  const moveSpeed = speed * 0.016; // Assuming 60 FPS
  const newPosition = basketballGroup.position.clone();
  
  switch(direction) {
    case 'left':
      newPosition.x -= moveSpeed;
      break;
    case 'right':
      newPosition.x += moveSpeed;
      break;
    case 'forward':
      newPosition.z -= moveSpeed;
      break;
    case 'backward':
      newPosition.z += moveSpeed;
      break;
  }
  
  // Keep ball within court boundaries
  newPosition.x = Math.max(-14, Math.min(14, newPosition.x));
  newPosition.z = Math.max(-7, Math.min(7, newPosition.z));
  
  basketballGroup.position.copy(newPosition);
  
  // Add rotation during movement - PROPORTIONAL TO VELOCITY
  if (!isInFlight) {
    // Calculate rotation based on movement speed (velocity-proportional)
    const rotationMultiplier = 15; // How much rotation per unit of movement
    const rotationAmount = moveSpeed * rotationMultiplier;
    
    if (direction === 'left' || direction === 'right') {
      ballRotation.z += (direction === 'left' ? rotationAmount : -rotationAmount);
    } else {
      ballRotation.x += (direction === 'forward' ? rotationAmount : -rotationAmount);
    }
    
    // Apply rotation to the basketball mesh
    basketball.rotation.x = ballRotation.x;
    basketball.rotation.z = ballRotation.z;
    
    // Also apply to the entire basketball group for visibility
    basketballGroup.rotation.x = ballRotation.x;
    basketballGroup.rotation.z = ballRotation.z;
    
    console.log(`Moving ${direction}: speed=${moveSpeed.toFixed(4)}, rotation=${rotationAmount.toFixed(4)}`);
  }
}

function adjustShotPower(increase) {
  if (isInFlight) return; // Can't adjust power while ball is in flight
  
  if (increase) {
    shotPower = Math.min(100, shotPower + 2);
  } else {
    shotPower = Math.max(0, shotPower - 2);
  }
  updateGameUI();
}

function showShotFeedback(made, customMessage = null) {
  const feedback = document.createElement('div');
  feedback.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: ${made ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)'};
    color: white;
    padding: 20px 40px;
    border-radius: 10px;
    font-size: 24px;
    font-weight: bold;
    z-index: 2000;
    pointer-events: none;
  `;
  feedback.textContent = customMessage || (made ? 'SHOT MADE!' : 'MISSED SHOT');
  document.body.appendChild(feedback);
  
  setTimeout(() => {
    document.body.removeChild(feedback);
  }, 2000);
}

function updateGameUI() {
  // Update accuracy
  gameStats.accuracy = gameStats.shotAttempts > 0 ?
    Math.round((gameStats.shotsMade / gameStats.shotAttempts) * 100) : 0;
    
  // Update both team scores
  document.getElementById('home-score').textContent = gameStats.homeScore;
  document.getElementById('away-score').textContent = gameStats.awayScore;
  
  // Update power indicator in controls
  const powerDisplay = document.getElementById('power-display');
  if (powerDisplay) {
    powerDisplay.textContent = shotPower + '%';
    powerDisplay.style.color = shotPower > 70 ? '#ff4444' : shotPower > 40 ? '#ffaa00' : '#44ff44';
  }
  
  // Update stats
  const shotAttemptsEl = document.getElementById('shot-attempts');
  const shotsMadeEl = document.getElementById('shots-made');
  const accuracyEl = document.getElementById('accuracy');
  
  if (shotAttemptsEl) shotAttemptsEl.textContent = gameStats.shotAttempts;
  if (shotsMadeEl) shotsMadeEl.textContent = gameStats.shotsMade;
  if (accuracyEl) accuracyEl.textContent = gameStats.accuracy + '%';
}

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
  const armLength = 0.38; 
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
    <div><strong>Arrow Keys</strong> - Move basketball</div>
    <div><strong>W/S</strong> - Adjust shot power</div>
    <div><strong>Spacebar</strong> - Shoot basketball</div>
    <div><strong>R</strong> - Reset ball position</div>
    <div><strong>O</strong> - Toggle orbit camera</div>
    <div><strong>T</strong> - Time challenge</div>
    <div style="margin-top: 8px; font-size: 12px; color: #ccc;">
      Shot Power: <span id="power-display" style="font-weight: bold;">50%</span>
    </div>
    <div style="font-size: 12px; color: #ccc;">
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
  <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #ff6600;">SHOOTING STATS</h3>
  <div style="font-size: 13px; line-height: 1.6;">
    <div>Shot Attempts: <span id="shot-attempts">0</span></div>
    <div>Shots Made: <span id="shots-made">0</span></div>
    <div>Accuracy: <span id="accuracy">0%</span></div>
    <div style="margin-top: 8px; font-size: 11px; color: #ccc;">
      Status: <span id="game-status">Ready to Shoot</span>
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

// Input handling variables
let keysPressed = {};

// Handle key events
function handleKeyDown(e) {
  keysPressed[e.key.toLowerCase()] = true;
  
  // Handle single-press actions
  switch(e.key.toLowerCase()) {
    case 'o':
      isOrbitEnabled = !isOrbitEnabled;
      updateCameraStatus();
      break;
    case ' ': // Spacebar
      e.preventDefault(); // Prevent page scrolling
      shootBasketball();
      break;
    case 'r':
      resetBasketball();
      break;
    case 't':
      if (!timeChallenge.isInChallenge()) {
        timeChallenge.showChallengeMenu();
      }
      break;
  }
}

function handleKeyUp(e) {
  keysPressed[e.key.toLowerCase()] = false;
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Handle continuous key presses
function handleContinuousInput() {
  // Movement controls (arrow keys)
  if (keysPressed['arrowleft']) {
    moveBasketball('left');
  }
  if (keysPressed['arrowright']) {
    moveBasketball('right');
  }
  if (keysPressed['arrowup']) {
    moveBasketball('forward');
  }
  if (keysPressed['arrowdown']) {
    moveBasketball('backward');
  }
  
  // Shot power adjustment
  if (keysPressed['w']) {
    adjustShotPower(true);
  }
  if (keysPressed['s']) {
    adjustShotPower(false);
  }
}

// Animation function with delta time for physics
let lastTime = 0;
function animate(currentTime) {
  requestAnimationFrame(animate);
  
  // Calculate delta time
  const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
  lastTime = currentTime;
  
  // Handle continuous input
  handleContinuousInput();
  
  // Update basketball physics
  updateBasketballPhysics(deltaTime);
  
  // Update controls
  controls.enabled = isOrbitEnabled;
  controls.update();
  
  renderer.render(scene, camera);
}

animate();

// Initialize the game UI
updateGameUI();