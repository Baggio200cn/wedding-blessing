import json

def handler(request):
    # 示例预测逻辑
    front_numbers = [1, 12, 23, 34, 45]
    back_numbers = [6, 7]
    return {
        "statusCode": 200,
        "body": json.dumps({
            "front_numbers": front_numbers,
            "back_numbers": back_numbers
        }),
        "headers": {
            "Content-Type": "application/json"
        }
    }
