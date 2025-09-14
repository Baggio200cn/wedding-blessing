import json
import os
import requests
from http.server import BaseHTTPRequestHandler

def handler(request):
    try:
        # 检查环境变量
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            return {
                "statusCode": 500,
                "body": json.dumps({"error": "API key is missing"}),
                "headers": {"Content-Type": "application/json"}
            }
        
        # 检查 BaseHTTPRequestHandler 类型
        base = BaseHTTPRequestHandler  # 默认赋值
        if not isinstance(base, type):
            raise TypeError("base must be a class object")

        # 请求 Anthropic API
        endpoint = "https://api.anthropic.com/v1/completions"
        payload = {
            "model": "claude-2",
            "prompt": "请给我一个关于人工智能的总结。",
            "max_tokens_to_sample": 256,
            "temperature": 0.7
        }
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        # 发起请求并捕获异常
        response = requests.post(endpoint, json=payload, headers=headers)
        response.raise_for_status()

        return {
            "statusCode": response.status_code,
            "body": response.text,
            "headers": {"Content-Type": "application/json"}
        }
    except requests.exceptions.RequestException as e:
        # 捕获请求异常
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Request failed: {str(e)}"}),
            "headers": {"Content-Type": "application/json"}
        }
    except Exception as e:
        # 捕获其他异常
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Unexpected error: {str(e)}"}),
            "headers": {"Content-Type": "application/json"}
        }
