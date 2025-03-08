/* using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Rover : MonoBehaviour
{
    public Rigidbody rB;

    private float speedTorque = 120f;

    public List<WheelCollider> frontWheels;
    public List<WheelCollider> backWheels;

    private Vector2 playerMov;

    private void Update()
    {
        playerMov = PlayerInput();
    }

    void FixedUpdate()
    {
        PlayerMovement(playerMov);
    }

    private Vector2 PlayerInput()
    {
        Vector2 playerMovement = Vector2.zero;
        if (Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.Z))
        {
            playerMovement.y += 1;
        }
        if (Input.GetKey(KeyCode.S))
        {
            playerMovement.y -= 1;
        }
        if (Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.Q))
        {
            playerMovement.x -= 1;
        }
        if (Input.GetKey(KeyCode.D))
        {
            playerMovement.x += 1;
        }

        return playerMovement;
    }

    private void PlayerMovement(Vector2 movement)
    {
        rB.maxAngularVelocity = 22f;

        float clampValueRot = 35f;
        float signRot = 1f;

        float TorqueMult = 1.33f;
        if (movement.y < 0)
        {
            clampValueRot = 5f;
            signRot = -1f;
        }

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
} */