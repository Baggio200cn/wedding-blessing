import json
import os
import requests

def handler(request):
    # 从环境变量中获取 Anthropic API 密钥
    api_key = os.getenv("ANTHROPIC_API_KEY")

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

    # 发起请求
    response = requests.post(endpoint, json=payload, headers=headers)
    
    # 返回结果
    return {
        "statusCode": response.status_code,
        "body": response.text,
        "headers": {
            "Content-Type": "application/json"
        }
    }
