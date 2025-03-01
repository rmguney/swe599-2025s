using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using MLAgents;
using TMPro;
using System;

public class PenguinArea : Area
{
    public PenguinAgent penguinAgent;
    public GameObject penguinBaby;
    public Fish fishPrefab;
    public TextMeshPro cumulativeRewardText;

    [HideInInspector]
    public float fishSpeed = 0f;
    [HideInInspector]
    public float feedRadius = 1f;

    private List<GameObject> fishList;

    public override void ResetArea()
    {
        RemoveAllFish();
        PlacePenguin();
        PlaceBaby();
        SpawnFish(4, fishSpeed);
    }

    public void RemoveSpecificFish(GameObject fishObject)
    {
        fishList.Remove(fishObject);
        Destroy(fishObject);
    }

    public static Vector3 ChooseRandomPosition(Vector3 center, float minAngle, float maxAngle, float minRadius, float maxRadius)
    {
        float radius = minRadius;

        if (maxRadius > minRadius)
        {
            radius = UnityEngine.Random.Range(minRadius, maxRadius);
        }

        return center + Quaternion.Euler(0f, UnityEngine.Random.Range(minAngle, maxAngle), 0f) * Vector3.forward * radius;
    }

    private void RemoveAllFish()
    {
        if (fishList != null)
        {
            for (int i = 0; i < fishList.Count; i++)
            {
                if (fishList[i] != null)
                {
                    Destroy(fishList[i]);
                }
            }
        }

        fishList = new List<GameObject>();
    }

    private void PlacePenguin()
    {
        penguinAgent.transform.position = ChooseRandomPosition(transform.position, 0f, 360f, 0f, 9f) + Vector3.up * .5f;
        penguinAgent.transform.rotation = Quaternion.Euler(0f, UnityEngine.Random.Range(0f, 360f), 0f);
    }

    private void PlaceBaby()
    {
        penguinBaby.transform.position = ChooseRandomPosition(transform.position, -45f, 45f, 4f, 9f) + Vector3.up * .5f;
        penguinBaby.transform.rotation = Quaternion.Euler(0f, 180f, 0f);
    }

    private void SpawnFish(int count, float fishSpeed)
    {
        for (int i = 0; i < count; i++)
        {
            GameObject fishObject = Instantiate<GameObject>(fishPrefab.gameObject);
            fishObject.transform.position = ChooseRandomPosition(transform.position, 100f, 260f, 2f, 13f) + Vector3.up * .5f;
            fishObject.transform.rotation = Quaternion.Euler(0f, UnityEngine.Random.Range(0f, 360f), 0f);
            fishObject.transform.parent = transform;
            fishList.Add(fishObject);
            fishObject.GetComponent<Fish>().fishSpeed = fishSpeed;
        }
    }

    private void Update()
    {
        cumulativeRewardText.text = penguinAgent.GetCumulativeReward().ToString("0.00");
    }
}
