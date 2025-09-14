import json
import os
import requests

def handler(request):
    # 检查环境变量是否存在
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "API key is missing"}),
            "headers": {"Content-Type": "application/json"}
        }

    # Anthropic API 的端点
    endpoint = "https://api.anthropic.com/v1/completions"

    # 请求数据示例
    payload = {
        "model": "claude-2",
        "prompt": "请给我一个关于人工智能的总结。",
        "max_tokens_to_sample": 256,
        "temperature": 0.7
    }

    # 请求头
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    try:
        # 发起请求
        response = requests.post(endpoint, json=payload, headers=headers)
        # 如果返回状态码非 200，记录错误
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {"Content-Type": "application/json"}
        }

    # 返回结果
    return {
        "statusCode": response.status_code,
        "body": response.text,
        "headers": {"Content-Type": "application/json"}
    }
