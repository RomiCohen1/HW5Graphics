# Basketball Exercise HW06 - Interactive Basketball Shooting Game with Physics

## Group Members
**Rotem Mizrachi, Romi Cohen.**

## Overview
This project builds upon HW06 by implementing a fully interactive basketball shooting game with realistic physics, comprehensive scoring system, and enhanced user interface. The game transforms the static 3D basketball court into a dynamic gaming experience.

## How to Run
1. Start a local web server:
   ```bash
   node index.js
   ```
2. Open your browser and navigate to `http://localhost:8000`
3. The basketball game will load automatically

## Implemented Features

### Physics-Based Basketball Movement
- **Realistic Gravity Simulation**: Constant downward acceleration (-9.8 m/s²)
- **Parabolic Trajectory**: Proper arc physics for basketball shots
- **Ball Bouncing Mechanics**: Energy loss with coefficient of restitution (0.6)
- **Ground Collision Detection**: Ball bounces realistically when hitting the court
- **Hoop Collision Detection**: Accurate detection for successful shots

### Interactive Basketball Controls
- **Arrow Keys**: Move basketball horizontally (left/right) and forward/backward
- **W/S Keys**: Adjust shot power from 0% to 100%
- **Spacebar**: Shoot basketball toward nearest hoop
- **R Key**: Reset basketball to center court position
- **O Key**: Toggle orbit camera controls (inherited from HW05)
- **T Key**: Time challenge (Bonus)

### Basketball Rotation Animations
- **Realistic Ball Rotation**: During movement and flight
- **Direction-Based Rotation**: Rotation axis matches movement direction
- **Velocity-Proportional Speed**: Rotation speed scales with ball velocity
- **Smooth Transitions**: Continuous rotation animations

### Comprehensive Scoring System
- **Two-Team Scoring**: Right hoop scores for HOME team, left hoop scores for AWAY team
- **Score Detection**: Detects when basketball passes through hoop area
- **Proper Arc Requirement**: Ball must be moving downward for successful shots
- **Point System**: Each successful shot awards 2 points to the appropriate team
- **Real-time Updates**: Both team scores update immediately

### Enhanced User Interface
- **Live Score Display**: Current score prominently shown
- **Shot Statistics**: Tracks attempts, made shots, and accuracy percentage
- **Shot Power Indicator**: Visual display of current power level
- **Control Instructions**: Complete panel showing all available controls
- **Visual Feedback**: "SHOT MADE!" and "MISSED SHOT" messages

### Advanced Features
- **Boundary Checking**: Ball stays within court limits during movement
- **Physics State Management**: Proper handling of flight vs. ground states
- **Responsive Controls**: Smooth, real-time input handling

## Bonus
- Sound effects for shots, bounces, and scores
- Timed challenges

 ## Demo: 


https://github.com/user-attachments/assets/970ac841-e038-4111-990e-31f9a724dd35

