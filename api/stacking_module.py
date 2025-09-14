import json

def handler(request):
    # 示例Stacking汇总结果
    stacking_data = {
        "probabilities": {
            "前区": [0.9, 0.85, 0.92, 0.87, 0.88],
            "后区": [0.91, 0.89]
        },
        "final_prediction": {
            "前区预测号码": [12, 15, 18, 22, 30],
            "后区预测号码": [8, 11]
        }
    }

    return {
        "statusCode": 200,
        "body": json.dumps(stacking_data),
        "headers": {"Content-Type": "application/json"}
    }
