import requests
import json

def handler(request):
    try:
        # 示例数据源
        endpoint = "https://api.example.com/latest-results"
        response = requests.get(endpoint)
        response.raise_for_status()

        # 返回中奖号码与奖金池情况
        return {
            "statusCode": 200,
            "body": json.dumps(response.json()),
            "headers": {"Content-Type": "application/json"}
        }
    except requests.exceptions.RequestException as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Failed to fetch results: {str(e)}"}),
            "headers": {"Content-Type": "application/json"}
        }
