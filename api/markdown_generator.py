import json

def handler(request):
    # 示例数据
    prediction_data = {
        "前区预测号码": [12, 15, 18, 22, 30],
        "后区预测号码": [8, 11],
        "推理过程": [
            "Step 1: 数据预处理",
            "Step 2: 模型训练",
            "Step 3: 测试集预测"
        ]
    }

    # 生成 Markdown
    markdown_content = f"""# 预测结果报告

## 推理过程
{"\n".join(prediction_data["推理过程"])}

## 预测结果
**前区预测号码**: {", ".join(map(str, prediction_data["前区预测号码"]))}
**后区预测号码**: {", ".join(map(str, prediction_data["后区预测号码"]))}
"""

    return {
        "statusCode": 200,
        "body": json.dumps({"markdown": markdown_content}),
        "headers": {"Content-Type": "application/json"}
    }
