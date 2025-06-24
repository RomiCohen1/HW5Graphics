# Basketball Exercise HW06 - Interactive Basketball Shooting Game with Physics

## Group Members
**[Please add your full names here]**

## Overview
This project builds upon HW05 by implementing a fully interactive basketball shooting game with realistic physics, comprehensive scoring system, and enhanced user interface. The game transforms the static 3D basketball court into a dynamic gaming experience.

## How to Run
1. Start a local web server:
   ```bash
   python -m http.server 8000
   ```
2. Open your browser and navigate to `http://localhost:8000`
3. The basketball game will load automatically

## Implemented Features

### ✅ Physics-Based Basketball Movement
- **Realistic Gravity Simulation**: Constant downward acceleration (-9.8 m/s²)
- **Parabolic Trajectory**: Proper arc physics for basketball shots
- **Ball Bouncing Mechanics**: Energy loss with coefficient of restitution (0.6)
- **Ground Collision Detection**: Ball bounces realistically when hitting the court
- **Hoop Collision Detection**: Accurate detection for successful shots

### ✅ Interactive Basketball Controls
- **Arrow Keys**: Move basketball horizontally (left/right) and forward/backward
- **W/S Keys**: Adjust shot power from 0% to 100%
- **Spacebar**: Shoot basketball toward nearest hoop
- **R Key**: Reset basketball to center court position
- **O Key**: Toggle orbit camera controls (inherited from HW05)

### ✅ Basketball Rotation Animations
- **Realistic Ball Rotation**: During movement and flight
- **Direction-Based Rotation**: Rotation axis matches movement direction
- **Velocity-Proportional Speed**: Rotation speed scales with ball velocity
- **Smooth Transitions**: Continuous rotation animations

### ✅ Comprehensive Scoring System
- **Two-Team Scoring**: Right hoop scores for HOME team, left hoop scores for AWAY team
- **Score Detection**: Detects when basketball passes through hoop area
- **Proper Arc Requirement**: Ball must be moving downward for successful shots
- **Point System**: Each successful shot awards 2 points to the appropriate team
- **Real-time Updates**: Both team scores update immediately

### ✅ Enhanced User Interface
- **Live Score Display**: Current score prominently shown
- **Shot Statistics**: Tracks attempts, made shots, and accuracy percentage
- **Shot Power Indicator**: Visual display of current power level with color coding
- **Control Instructions**: Complete panel showing all available controls
- **Visual Feedback**: "SHOT MADE!" and "MISSED SHOT" messages

### ✅ Advanced Features
- **Dual Hoop Support**: Can shoot at both hoops with automatic targeting
- **Boundary Checking**: Ball stays within court limits during movement
- **Physics State Management**: Proper handling of flight vs. ground states
- **Responsive Controls**: Smooth, real-time input handling

## Detailed Control Specifications

| Control | Function | Implementation |
|---------|----------|----------------|
| **Arrow Keys** | Move Basketball | Smooth movement across court with boundary checking |
| **W/S Keys** | Adjust Shot Power | Increases/decreases power with visual indicator (0-100%) |
| **Spacebar** | Shoot Basketball | Launches ball toward nearest hoop with physics simulation |
| **R Key** | Reset Basketball | Returns ball to center court, resets velocity and power |
| **O Key** | Toggle Camera | Enable/disable orbit camera controls |

## Physics Implementation Details

### Gravity and Trajectory
- Constant downward acceleration applied during flight
- Parabolic trajectory calculations for realistic shots
- Initial velocity components based on shot angle and power
- Proper arc height for basketball shots

### Collision Detection
- Ball-to-ground collision with realistic bounce mechanics
- Ball-to-rim collision for successful shot detection
- Energy loss on each bounce (60% retention)
- Ball naturally comes to rest after multiple bounces

### Shot Mechanics
- Adjustable shot power affecting initial velocity (0-100%)
- Automatic angle calculation toward nearest hoop
- Minimum arc height requirement for successful shots
- Ball must pass through hoop area while moving downward

## Game Statistics Tracking
- **Total Score**: Points earned from successful shots (2 points each)
- **Shot Attempts**: Number of times spacebar was pressed
- **Shots Made**: Number of successful shots through hoops
- **Shooting Percentage**: (Shots Made / Shot Attempts) × 100%

## Technical Implementation
- **Frame Rate**: Optimized for smooth 60 FPS performance
- **Physics Integration**: Time-based physics calculations using delta time
- **Collision Precision**: Accurate detection ensuring fair gameplay
- **Code Organization**: Separated physics, input handling, and rendering logic
- **State Management**: Proper handling of ball states (moving, flying, bouncing)

## File Structure
```
├── index.html          # Main HTML file
├── src/
│   ├── hw5.js          # Main JavaScript file with all game logic
│   ├── OrbitControls.js # Three.js orbit controls
│   └── README.md       # This documentation
└── README.md           # Project documentation
```

## Known Issues and Limitations
- Shot accuracy may vary based on distance from hoop
- Ball physics are simplified for gameplay purposes
- No wind resistance or air drag simulation

## External Assets
- **Three.js**: 3D graphics library (CDN version r128)
- **OrbitControls**: Three.js camera controls extension

## Testing Checklist - All Features Verified ✅
- ✅ Basketball moves smoothly with arrow keys in all directions
- ✅ W/S keys adjust shot power with visual feedback
- ✅ Spacebar shoots basketball toward hoop with proper trajectory
- ✅ R key resets basketball to center court
- ✅ Basketball bounces realistically when hitting the ground
- ✅ Ball rotates correctly during movement and flight
- ✅ Successful shots are detected and score is updated
- ✅ Shot attempts and accuracy percentage are tracked
- ✅ UI displays all required information clearly
- ✅ All controls work as specified without errors

## Future Enhancements (Optional)
- Sound effects for shots, bounces, and scores
- Multiple game modes (timed challenges, free shoot)
- Ball trail effects during flight
- Advanced physics (air resistance, spin effects)
- Leaderboard system with local storage

---

**Note**: This implementation fully satisfies all HW06 requirements including physics-based movement, interactive controls, rotation animations, and comprehensive scoring system.
