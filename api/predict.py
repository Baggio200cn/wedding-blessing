import json
import os
from http.server import BaseHTTPRequestHandler

def handler(request):
    try:
        # 初始化 base 变量
        base = BaseHTTPRequestHandler  # 默认赋值为 BaseHTTPRequestHandler 类

        # 检查 base 的类型
        if not isinstance(base, type):
            raise TypeError("base must be a class object")

        # 示例推理逻辑（可以根据业务需求替换）
        prediction_result = {
            "前区预测号码": [12, 15, 18, 22, 30],
            "后区预测号码": [8, 11],
            "模型权重调整": {
                "LSTM": 0.25,
                "Transformer": 0.25,
                "XGBoost": 0.25,
                "Random Forest": 0.25
            }
        }

        return {
            "statusCode": 200,
            "body": json.dumps(prediction_result),
            "headers": {"Content-Type": "application/json"}
        }
    except TypeError as e:
        # 捕获类型错误
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"TypeError: {str(e)}"}),
            "headers": {"Content-Type": "application/json"}
        }
    except Exception as e:
        # 捕获其他异常
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Unexpected error: {str(e)}"}),
            "headers": {"Content-Type": "application/json"}
        }
