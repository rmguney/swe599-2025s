using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Unity.MLAgents;
using Unity.MLAgents.Actuators;
using Unity.MLAgents.Sensors;

public class MoveToGoal : Agent
{
    [SerializeField] private Transform targetTransform;
    [SerializeField] private Material winMaterial;
    [SerializeField] private Material loseMaterial;
    [SerializeField] private Material defaultMaterial;
    [SerializeField] private Renderer globeMeshRenderer;
    
    private bool materialChangeActive = false;
    private Coroutine materialResetCoroutine = null;

    public override void OnEpisodeBegin()
    {
        transform.localPosition = Vector3.zero;
        
        if (!materialChangeActive)
        {
            globeMeshRenderer.material = defaultMaterial;
        }
    }
    public override void CollectObservations(VectorSensor sensor)
    {
        sensor.AddObservation(transform.localPosition);
        sensor.AddObservation(targetTransform.localPosition);
    }
    public override void OnActionReceived(ActionBuffers actions)
    {
        float moveX = actions.ContinuousActions[0];
        float moveZ = actions.ContinuousActions[1];

        float moveSpeed = 5f;

        transform.localPosition += new Vector3(moveX, 0, moveZ) * Time.deltaTime * moveSpeed;
    }
    public override void Heuristic(in ActionBuffers actionsOut)
    {
        ActionSegment<float> continuousActions = actionsOut.ContinuousActions;
        continuousActions[0] = Input.GetAxis("Horizontal");
        continuousActions[1] = Input.GetAxis("Vertical");

    }
    private void OnTriggerEnter(Collider other)
    {
        if (other.TryGetComponent<Goal>(out Goal goal))
        {
            SetReward(+1f);
            ChangeMaterialWithDelay(winMaterial, 2f);
            EndEpisode();
        }
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
