using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour
{
    [Header("Target Settings")]
    public Transform target;                // Object to follow and rotate around
    
    [Header("Distance Settings")]
    public float distance = 70.0f;          // Initial distance from target
    public float minDistance = 50.0f;        // Minimum zoom distance
    public float maxDistance = 90.0f;       // Maximum zoom distance
    public float zoomSpeed = 10.0f;          // Zoom sensitivity
    
    [Header("Rotation Settings")]
    public float xRotation = 13.25f;         // Initial vertical rotation angle
    public float yRotation = 83.5f;          // Initial horizontal rotation angle
    public float rotationSpeed = 5.0f;      // Rotation sensitivity
    public bool invertY = false;            // Invert Y-axis for vertical rotation
    
    [Header("Smoothing")]
    public float smoothSpeed = 10.0f;       // Speed of camera movement smoothing
    
    [Header("Input")]
    public KeyCode rotateKey = KeyCode.Mouse0;  // Default to left mouse button

    private Vector3 targetPosition;
    private Quaternion targetRotation;

    void Start()
    {
        if (target == null)
        {
            Debug.LogWarning("No target specified for CameraController, please assign a target in the inspector.");
            if (transform.parent != null)
            {
                target = transform.parent;
            }
        }
        
        UpdateCameraPosition();
    }

    void LateUpdate()
    {
        if (target == null)
            return;
            
        float scrollInput = Input.GetAxis("Mouse ScrollWheel");
        if (scrollInput != 0)
        {
            distance = Mathf.Clamp(distance - scrollInput * zoomSpeed, minDistance, maxDistance);
        }
        
        if (Input.GetKey(rotateKey) || Input.GetKey(KeyCode.Mouse1))
        {
            float yInput = Input.GetAxis("Mouse X") * rotationSpeed;
            float xInput = Input.GetAxis("Mouse Y") * rotationSpeed * (invertY ? 1 : -1);
            
            yRotation += yInput;
            xRotation = Mathf.Clamp(xRotation + xInput, -89f, 89f);
        }
        
        UpdateCameraPosition();
    }
    
    void UpdateCameraPosition()
    {
        if (target == null)
            return;
            
        targetRotation = Quaternion.Euler(xRotation, yRotation, 0);
        
        Vector3 offset = targetRotation * Vector3.back * distance;
        targetPosition = target.position + offset;
        
        transform.position = Vector3.Lerp(transform.position, targetPosition, smoothSpeed * Time.deltaTime);
        transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, smoothSpeed * Time.deltaTime);
        
        transform.LookAt(target);
    }
}
