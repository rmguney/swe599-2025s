using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Unity.MLAgents;
using Unity.MLAgents.Actuators;
using Unity.MLAgents.Sensors;

public class SampleReturn : Agent
{
    [SerializeField] private Transform targetTransform;
    [SerializeField] private Material winMaterial;
    [SerializeField] private Material loseMaterial;
    [SerializeField] private Material defaultMaterial;
    [SerializeField] private Material sampleCollectedMaterial;  // Optional: Material to show when carrying a sample
    [SerializeField] private Renderer globeMeshRenderer;
    
    // Rover components
    [SerializeField] private Rigidbody rB;
    [SerializeField] private List<WheelCollider> frontWheels;
    [SerializeField] private List<WheelCollider> backWheels;
    private float speedTorque = 120f;
    private Vector2 roverMovement;
    
    // Sample tracking
    private bool isCarryingSample = false;
    private GameObject currentSample = null;
    
    private bool materialChangeActive = false;
    private Coroutine materialResetCoroutine = null;

    public override void OnEpisodeBegin()
    {
        // Reset position and rotation
        if (rB != null)
        {
            rB.velocity = Vector3.zero;
            rB.angularVelocity = Vector3.zero;
            transform.localPosition = Vector3.zero;
            transform.localRotation = Quaternion.identity;
        }
        
        // Reset sample state
        isCarryingSample = false;
        
        // Reset any previously collected samples
        if (currentSample != null)
        {
            currentSample.SetActive(true);
            currentSample = null;
        }
        
        if (!materialChangeActive)
        {
            globeMeshRenderer.material = defaultMaterial;
        }
    }

    public override void CollectObservations(VectorSensor sensor)
    {
        // Add observations needed for the rover to navigate
        sensor.AddObservation(transform.localPosition);
        sensor.AddObservation(targetTransform.localPosition);
        sensor.AddObservation(transform.forward);
        sensor.AddObservation(rB.velocity);
        sensor.AddObservation(isCarryingSample); // Add whether we're carrying a sample
    }

    public override void OnActionReceived(ActionBuffers actions)
    {
        // Get actions from the neural network or from human input
        float moveX = actions.ContinuousActions[0]; // Steering (left/right)
        float moveY = actions.ContinuousActions[1]; // Acceleration/Deceleration (forward/backward)
        
        // Create movement vector
        roverMovement = new Vector2(moveX, moveY);
        
        // Apply movement in FixedUpdate
        RoverMovement(roverMovement);
    }

    private void FixedUpdate()
    {
        // Movement is applied in OnActionReceived or Heuristic
    }

    private void RoverMovement(Vector2 movement)
    {
        if (rB == null)
            return;
            
        rB.maxAngularVelocity = 22f;

/*         float clampValueRot = 35f;
        float signRot = 1f; */

        float TorqueMult = 1.33f;
/*         if (movement.y < 0)
        {
            clampValueRot = 5f;
            signRot = -1f;
        } */
        
        foreach (WheelCollider wheel in frontWheels)
        {
            wheel.steerAngle = movement.x * 40f;
            wheel.motorTorque = TorqueMult * movement.y * 3f;

            ApplyLocalPositionToVisuals(wheel);
        }
        foreach (WheelCollider wheel in backWheels)
        {
            wheel.motorTorque = TorqueMult * movement.y * 3f;

            ApplyLocalPositionToVisuals(wheel);
        }

        rB.AddTorque(new Vector3(-movement.y, 0, -movement.x) * speedTorque * 0.1f, ForceMode.Force);
    }

    private void ApplyLocalPositionToVisuals(WheelCollider collider)
    {
        if (collider.transform.childCount == 0)
        {
            return;
        }

        Transform visualWheel = collider.transform.GetChild(0);

        Vector3 position;
        Quaternion rotation;
        collider.GetWorldPose(out position, out rotation);

        visualWheel.transform.position = position;
        visualWheel.transform.rotation = rotation;
    }

    public override void Heuristic(in ActionBuffers actionsOut)
    {
        ActionSegment<float> continuousActions = actionsOut.ContinuousActions;
        
        // Map keyboard inputs to continuous actions (similar to the Rover's PlayerInput method)
        Vector2 input = Vector2.zero;
        
        // Forward/backward
        if (Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.Z))
        {
            input.y += 1;
        }
        if (Input.GetKey(KeyCode.S))
        {
            input.y -= 1;
        }
        
        // Left/right
        if (Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.Q))
        {
            input.x -= 1;
        }
        if (Input.GetKey(KeyCode.D))
        {
            input.x += 1;
        }
        
        continuousActions[0] = input.x; // Steering
        continuousActions[1] = input.y; // Acceleration/Deceleration
    }

    private void OnTriggerEnter(Collider other)
    {
        // Check for sample collection
        if (other.TryGetComponent<Sample>(out Sample sample) && !isCarryingSample)
        {
            // Collect the sample
            isCarryingSample = true;
            currentSample = sample.gameObject;
            sample.gameObject.SetActive(false);
            
            // Optional: Give small positive reward for collecting a sample
            AddReward(0.5f);
            
            // Optional: Change material to indicate sample collection
            if (sampleCollectedMaterial != null)
            {
                globeMeshRenderer.material = sampleCollectedMaterial;
            }
            
            // Note: We don't end the episode here, rover needs to return to container
        }
        // Check for container interaction (win condition)
        else if (other.TryGetComponent<Container>(out Container container) && isCarryingSample)
        {
            // Sample successfully returned to container
            SetReward(1.0f);
            ChangeMaterialWithDelay(winMaterial, 2f);
            EndEpisode();
        }
        // Wall collision (lose condition)
        else if (other.TryGetComponent<Wall>(out Wall wall))
        {
            SetReward(-1f);
            ChangeMaterialWithDelay(loseMaterial, 2f);
            EndEpisode();
        }
    }
    
    private void ChangeMaterialWithDelay(Material newMaterial, float delay)
    {
        materialChangeActive = true;
        globeMeshRenderer.material = newMaterial;
        
        if (materialResetCoroutine != null)
        {
            StopCoroutine(materialResetCoroutine);
        }
        
        materialResetCoroutine = StartCoroutine(GraduallyTransitionToDefaultMaterial(delay));
    }
    
    private IEnumerator GraduallyTransitionToDefaultMaterial(float transitionTime)
    {
        Material currentMat = globeMeshRenderer.material;
        Color startColor = currentMat.color;
        Color targetColor = defaultMaterial.color;
        
        float elapsedTime = 0f;
        
        Material tempMaterial = new Material(currentMat);
        globeMeshRenderer.material = tempMaterial;
        
        while (elapsedTime < transitionTime)
        {
            float t = elapsedTime / transitionTime;
            tempMaterial.color = Color.Lerp(startColor, targetColor, t);
            
            elapsedTime += Time.deltaTime;
            yield return null;
        }
        
        globeMeshRenderer.material = defaultMaterial;
        materialChangeActive = false;
        materialResetCoroutine = null;
        
        Destroy(tempMaterial);
    }
}
