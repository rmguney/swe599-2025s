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
    [SerializeField] private Material sampleCollectedMaterial; 
    [SerializeField] private Renderer globeMeshRenderer;
    
    // Sample spawning
    [SerializeField] private MeshFilter spawnMeshFilter;
    [SerializeField] private GameObject samplePrefab;
    [SerializeField] private int numberOfSamplesToSpawn = 1;
    private List<GameObject> spawnedSamples = new List<GameObject>();
    
    // Rover components
    [SerializeField] private Rigidbody rB;
    [SerializeField] private List<WheelCollider> frontWheels;
    [SerializeField] private List<WheelCollider> backWheels;
    private float speedTorque = 120f;
    private Vector2 roverMovement;
    
    // Sample tracking
    private bool isCarryingSample = false;
    private GameObject currentSample = null;
    private Transform sampleAttachPoint; // Point where collected samples will be attached
    
    private bool materialChangeActive = false;
    private Coroutine materialResetCoroutine = null;
    private float lastSampleDistance = float.MaxValue; // For distance-based rewards

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
            currentSample.transform.parent = null;
            currentSample = null;
        }
        
        // Clean up previously spawned samples
        foreach (var sample in spawnedSamples)
        {
            if (sample != null)
                Destroy(sample);
        }
        spawnedSamples.Clear();
        
        // Spawn new samples at random positions on the mesh
        SpawnSamplesOnMesh();
        
        if (!materialChangeActive)
        {
            globeMeshRenderer.material = defaultMaterial;
        }
        
        // Reset the last sample distance
        lastSampleDistance = GetDistanceToNearestSample();
    }

    private void Awake()
    {
        // Create sample attachment point if it doesn't exist
        if (sampleAttachPoint == null)
        {
            GameObject attachPoint = new GameObject("SampleAttachPoint");
            sampleAttachPoint = attachPoint.transform;
            sampleAttachPoint.parent = transform;
            sampleAttachPoint.localPosition = new Vector3(0, 0.5f, 0); // Adjust position as needed
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
        
        // Add nearest sample information if not carrying one
        if (!isCarryingSample && spawnedSamples.Count > 0)
        {
            GameObject nearestSample = GetNearestSample();
            if (nearestSample != null)
            {
                // Direction to nearest sample
                Vector3 directionToSample = (nearestSample.transform.position - transform.position).normalized;
                sensor.AddObservation(directionToSample);
                
                // Distance to nearest sample
                float distanceToSample = Vector3.Distance(transform.position, nearestSample.transform.position);
                sensor.AddObservation(distanceToSample);
            }
            else
            {
                // No valid samples, add zero vectors
                sensor.AddObservation(Vector3.zero);
                sensor.AddObservation(0f);
            }
        }
        else
        {
            // If carrying a sample or no samples exist, add placeholder observations
            sensor.AddObservation(Vector3.zero);
            sensor.AddObservation(0f);
        }
    }

    public override void OnActionReceived(ActionBuffers actions)
    {
        AddReward(-0.001f);

        float moveX = actions.ContinuousActions[0];
        float moveY = actions.ContinuousActions[1];
        
        roverMovement = new Vector2(moveX, moveY);
        RoverMovement(roverMovement);
        
        // Add distance-based rewards to encourage approaching samples
        if (!isCarryingSample)
        {
            float currentDistance = GetDistanceToNearestSample();
            
            // Reward for getting closer to a sample
            if (currentDistance < lastSampleDistance)
            {
                AddReward(0.001f);
            }
            
            lastSampleDistance = currentDistance;
        }
        else if (isCarryingSample)
        {
            // Reward for getting closer to the target when carrying a sample
            float distanceToTarget = Vector3.Distance(transform.position, targetTransform.position);
            AddReward(0.0005f / (distanceToTarget + 1));
        }
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
            
            // Attach the sample visually to the rover instead of hiding it
            currentSample.transform.parent = sampleAttachPoint;
            currentSample.transform.localPosition = Vector3.zero;
            currentSample.transform.localRotation = Quaternion.identity;
            
            // Disable collider but keep visuals
            if (currentSample.GetComponent<Collider>() != null)
            {
                currentSample.GetComponent<Collider>().enabled = false;
            }
            
            // Scale down the sample for better visualization
            currentSample.transform.localScale = new Vector3(0.5f, 0.5f, 0.5f);
            
            AddReward(3.0f);
            
            // Optional: Change material to indicate sample collection
            if (sampleCollectedMaterial != null)
            {
                globeMeshRenderer.material = sampleCollectedMaterial;
            }
        }
        // Check for container interaction (win condition)
        else if (other.TryGetComponent<Container>(out Container container) && isCarryingSample)
        {
            // Sample successfully returned to container
            SetReward(10.0f);
            ChangeMaterialWithDelay(winMaterial, 2f);
            EndEpisode();
        }
        // Wall collision (lose condition)
        else if (other.TryGetComponent<Wall>(out Wall wall))
        {
            SetReward(-3.0f);
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
    
    // Spawn samples at random positions on the configured mesh
    private void SpawnSamplesOnMesh()
    {
        if (spawnMeshFilter == null || spawnMeshFilter.mesh == null || samplePrefab == null)
        {
            Debug.LogWarning("Cannot spawn samples: Missing mesh or sample prefab");
            return;
        }
        
        for (int i = 0; i < numberOfSamplesToSpawn; i++)
        {
            Vector3 spawnPosition = GetRandomPositionOnMesh(spawnMeshFilter.mesh);
            GameObject newSample = Instantiate(samplePrefab, spawnPosition, Quaternion.identity);
            spawnedSamples.Add(newSample);
        }
    }
    
    // Calculate a random position on the provided mesh
    private Vector3 GetRandomPositionOnMesh(Mesh mesh)
    {
        // Get mesh data
        Vector3[] vertices = mesh.vertices;
        int[] triangles = mesh.triangles;
        
        if (triangles.Length == 0)
        {
            Debug.LogWarning("Mesh has no triangles!");
            return Vector3.zero;
        }
        
        // Select a random triangle
        int triangleIndex = Random.Range(0, triangles.Length / 3);
        
        // Get the vertices of the triangle
        Vector3 v1 = vertices[triangles[triangleIndex * 3]];
        Vector3 v2 = vertices[triangles[triangleIndex * 3 + 1]];
        Vector3 v3 = vertices[triangles[triangleIndex * 3 + 2]];
        
        // Get a random point inside the triangle using barycentric coordinates
        float r1 = Random.value;
        float r2 = Random.value;
        
        // Use sqrt for uniform distribution
        r1 = Mathf.Sqrt(r1);
        
        // Calculate the random position using barycentric coordinates
        Vector3 randomPosition = (1 - r1) * v1 + r1 * (1 - r2) * v2 + r1 * r2 * v3;
        
        // Convert from local space to world space
        randomPosition = spawnMeshFilter.transform.TransformPoint(randomPosition);
        
        // Optionally, add a small offset to avoid z-fighting or terrain clipping
        randomPosition += Vector3.up * 0.05f;
        
        return randomPosition;
    }
    
    // Helper function to get the nearest sample
    private GameObject GetNearestSample()
    {
        if (spawnedSamples.Count == 0)
            return null;
            
        GameObject nearestSample = null;
        float nearestDistance = float.MaxValue;
        
        foreach (GameObject sample in spawnedSamples)
        {
            // Skip if the sample is null or inactive
            if (sample == null || !sample.activeInHierarchy)
                continue;
                
            float distance = Vector3.Distance(transform.position, sample.transform.position);
            if (distance < nearestDistance)
            {
                nearestDistance = distance;
                nearestSample = sample;
            }
        }
        
        return nearestSample;
    }
    
    // Helper function to get the distance to the nearest sample
    private float GetDistanceToNearestSample()
    {
        GameObject nearest = GetNearestSample();
        if (nearest == null)
            return float.MaxValue;
            
        return Vector3.Distance(transform.position, nearest.transform.position);
    }
}


