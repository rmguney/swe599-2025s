# Mars Rover Simulation Using Deep Reinforcement and Imitation Learning (PPO & GAIL) for Autonomous Navigation and Sample Retrieval

## Table of Contents
1. [Introduction](#introduction)
2. [Requirements and Design](#requirements-and-design)
   - [Functional Requirements](#functional-requirements)
   - [Non-Functional Requirements](#non-functional-requirements)
   - [Constraints and Limitations](#constraints-and-limitations)
   - [System Design](#system-design)
3. [Methodology and Implementation](#methodology-and-implementation)
   - [Core Technologies](#core-technologies)
   - [Neural Network Model Architecture](#neural-network-model-architecture)
   - [Proximal Policy Optimization Algorithm](#proximal-policy-optimization-algorithm)
   - [Hyperparameter Tuning and Optimization Techniques](#hyperparameter-tuning-and-optimization-techniques)
   - [Generative Adversarial Imitation Learning](#generative-adversarial-imitation-learning)
   - [Agent Training](#agent-training)
   - [Web Application Deployment](#web-application-deployment)

## Introduction
Deep reinforcement learning (DRL) and deep imitation learning techniques are being increasingly applied to autonomous robot navigation and control, with recent studies suggesting that DRL is a promising approach for autonomous rovers.

Platforms like Unity have made it easier to train autonomous agents in controlled 3D environments. For this project, Unity's built-in physics engine, customizable terrains, and sensor simulation tools were essential for replicating Martian terrain and rover dynamics.

This project's scope is training the Sample Retrieval Lander agents in dynamic pathfinding through a simulated environment to find samples collected and tubed by the Perseverance Rover, and return them back to the Mars Ascent Vehicle.

## Requirements and Design

### Functional Requirements
#### Autonomous Navigation
- Trained rover agent must navigate simulated Martian terrain without human intervention.
- It must avoid obstacles with a success rate of at least 90%.
- The rover should autonomously plan paths through unknown terrain using reinforcement learning.

#### Sample Identification and Collection
- The system must be capable of detecting and collecting geological samples.
- The rover should approach and successfully collect samples in at least 75% of trials.

#### Sample Transport and Delivery
- After collection, the rover must transport the sample to a designated transport area.
- The success rate for sample delivery must be at least 75%.

#### Learning and Adaptation
- Reinforcement learning should allow the agent to improve navigation and collection tasks over time.
- Imitation learning should be incorporated to enhance training efficiency and reduce initial training time.

### Non-Functional Requirements
- Simulation Platform: Unity 3D with ML-Agents toolkit.
- AI Framework: PyTorch for deep learning model development.
- Model Deployment: ONNX format for model portability, using Unity Barracuda for inference. Inference should be optimized for WebAssembly deployment to allow browser-based execution.
- Choice of Topic: AI must be trained with deep reinforcement learning using the Proximal Policy Optimization algorithm.

### Constraints and Limitations
- The rover operates only in a simulated environment.
- The AI model does not incorporate high-fidelity scientific analysis.
- Training time should not exceed 24 hours on available hardware (i9-13, RTX 4050).
- No single file, including the reinforcement learning model, should be more than 100mb.

### System Design
#### Architecture and Components
The Mars rover training system follows a modular, simulation-based architecture designed for autonomous learning, task execution, and evaluation.

##### Main Controller (Agent)
- SampleReturn (Agent) → The main controller that handles rover movement, interactions, and ML-Agents learning.

##### Physical Components
- Rigidbody → Provides physics properties (mass, velocity, torque).
- WheelCollider → Controls wheel movement for front and back wheels.
- Transform → Stores the position and rotation of the rover.
- Renderer → Manages material changes for visual feedback.

##### Sample Collection System
- GameObject (Sample) → Represents collectible samples.
- MeshFilter (Spawn Mesh) → Defines the area where samples are spawned.
- Container → The target area where samples must be returned.
- Wall → Obstacles that the rover must avoid.

##### Key Methods and Their Roles
- OnEpisodeBegin() → Resets the rover, samples, and environment at the start of an episode.
- CollectObservations() → Gathers sensor data for the ML-Agent to learn.
- OnActionReceived() → Processes neural network output for movement.
- FixedUpdate() → Applies movement physics every frame.
- RoverMovement() → Moves the rover based on actions received.
- ApplyLocalPositionToVisuals() → Updates wheel visuals to match physics.
- Heuristic() → Allows manual control input for debugging.
- OnTriggerEnter() → Handles collisions (sample collection, container interaction, hitting walls).
- SpawnSamplesOnMesh() → Spawns new samples at random locations.

#### Workflow
- Initialization: The Unity simulation loads predefined terrain and initializes the rover agent.
- Heuristic Training Phase: The rover learns obstacle avoidance, sample collection, and transport sequentially.
- Inference Phase: The trained model is deployed within the Unity environment.
- Evaluation & Optimization: Performance data is collected and analyzed.

## Methodology and Implementation

### Core Technologies
- **Unity Game Engine**: Used for real-time 3D graphics rendering, physics simulation, and custom scripting.
- **Unity ML-Agents Toolkit**: Provides infrastructure for reinforcement and imitation learning algorithms.
- **PyTorch**: Selected as the deep learning library for its dynamic computation graph and integration with ML-Agents.
- **ONNX**: Used for model serialization and cross-platform compatibility.
- **Unity Barracuda**: Used for neural network inference within Unity.
- **Next.js**: Used to build the interface for accessing and visualizing the rover simulation in WebAssembly.

### Neural Network Model Architecture
#### Multi-Layer Perceptron (MLP) for Vector Observations
A fully connected feedforward neural network that processes vector observations like velocity or sensor data.

#### Weight Initialization and Activation Functions
Uses Xavier initialization and ReLU by default to maintain activation variance across layers and introduce non-linearity.

#### Attention Mechanisms
Used to handle variable length observations, enabling agents to focus on relevant parts of their input dynamically.

### Proximal Policy Optimization Algorithm
PPO is a reinforcement learning algorithm that balances the need for sufficient policy updates and the risk of making overly large changes that could destabilize learning. It introduces a clipped surrogate objective function to constrain policy updates within a predefined range.

#### PPO Algorithm Training Flow:
1. **Start & Environment Interaction**: The environment receives the current state and returns the next state, reward, and other relevant information.
2. **Actor (Policy Network)**: Outputs a probability distribution for actions.
3. **Storage for Updates**: Stores experience tuples for batch processing.
4. **Critic (Value Function Estimation)**: Estimates the value of a state for advantage calculation.
5. **Policy Update Using PPO Clipping**: Ensures changes are small using the clipped surrogate objective.
6. **Batch Update**: Processes stored experiences in batches.
7. **Loss Minimization**: Optimizes the actor and critic networks.

### Hyperparameter Tuning and Optimization Techniques
- **Generalized Advantage Estimation (GAE)**: Enhances sample efficiency and reduces variance.
- **Reward Shaping**: Designs meaningful reward functions to guide learning.
- **Experience Replay Buffers**: Stores past experiences to improve learning stability.
- **Adam Optimizer**: Used for efficient model updates.
- **Learning Rate Scheduling**: Adjusts learning rate dynamically.
- **Entropy Regularization**: Encourages diverse action selection.

### Generative Adversarial Imitation Learning
GAIL is an imitation learning technique that uses adversarial training to learn policies from expert demonstrations without relying only on predefined reward functions. It accelerates early training and improves generalization.

### Agent Training
The training implementation is structured into multiple sequential phases:

#### Obstacle Avoidance Training
Uses negative rewards when the agent collides with obstacles or hazards.

#### Sample Acquisition Training
Uses positive reinforcement when the agent successfully identifies and collects samples.

#### Sample Transport Training
Provides positive rewards when the agent delivers samples to the designated location.

### Web Application Deployment
The trained model is exported using ONNX for efficient serialization and deployed with Unity's Barracuda inference engine within the WebAssembly runtime, allowing users to run the simulation directly in their browsers without external software installation.