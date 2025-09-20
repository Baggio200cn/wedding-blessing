# Large Model Post-Training Project

## 项目简介
本项目旨在构建一个基于大模型后训练的实验场，测试环境为中国大乐透有奖竞猜。通过整合多种模型的预测能力与灵修图片的随机性扰动，最终实现对下一期中奖号码的预测。

## 项目目标
1. **数据分析与处理**：收集并清洗中国大乐透历史中奖数据。
2. **多模型训练与预测**：基于大模型（LSTM、Transformer等）训练历史数据，预测下一期中奖号码的概率值。
3. **灵修图片扰动模块**：引入灵修图片作为不确定性因素，调整预测权重。
4. **集成预测模块**：采用Stacking方法汇总各模块预测结果，并根据自学习算法调整权重。
5. **自动化推文生成**：输出详细的预测分析推文，采用中文Markdown格式。

## 文件结构
```
project/
├── data/
│   ├── raw_data/               # 原始数据
│   ├── processed_data/         # 处理后的数据
├── models/
│   ├── lstm_model.py           # LSTM模型代码
│   ├── transformer_model.py    # Transformer模型代码
│   ├── xgboost_model.py        # XGBoost模型代码
│   ├── rf_model.py             # Random Forest代码
├── spiritual/
│   ├── perturbation.py         # 灵修图片扰动模块代码
├── ensemble/
│   ├── stacking.py             # Stacking集成模型代码
├── utils/
│   ├── data_processing.py      # 数据处理工具
│   ├── markdown_generator.py   # Markdown推文生成工具
├── tests/
│   ├── test_models.py          # 各模型测试代码
├── main.py                     # 主程序入口
├── README.md                   # 项目说明文档
```

## 技术栈
- Python：数据分析与模型训练。
- HTML/CSS：项目网页设计与展示。
- GitHub Pages：项目托管与发布。

## 快速开始
1. 克隆仓库：
   ```bash
   git clone https://github.com/Baggio200cn/Large-model-post-training
   ```
2. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```
3. 运行项目：
   ```bash
   python main.py
   ```

## 贡献指南
欢迎所有对本项目感兴趣的开发者提交问题或贡献代码。请通过GitHub的`Issues`或`Pull Requests`功能进行协作。

## 许可
本项目遵循 [MIT License](LICENSE) 开源许可。
# Vercel 部署故障排除指南

## 主要修复内容

### 1. Vercel 配置文件 (vercel.json)
- 更新了 Python 运行时版本为 3.11
- 优化了路由配置，确保 API 路径正确映射
- 调整了内存限制和超时设置

### 2. 依赖管理 (requirements.txt)
- 移除了可能导致部署失败的重量级机器学习库
- 保留核心依赖：requests 和 python-dateutil
- 添加了关于 TensorFlow/PyTorch 限制的说明

### 3. API 文件修复
- 所有 API 文件都添加了完整的 CORS 头
- 统一了错误处理机制
- 确保 OPTIONS 请求得到正确处理

### 4. 前端 JavaScript 修复
- 修复了 API 路径问题
- 添加了更完善的错误处理
- 改进了数据显示逻辑

## 部署检查清单

### 文件结构确认
```
项目根目录/
├── api/
│   ├── health.py
│   ├── predict.py
│   ├── data-analysis.py
│   ├── spiritual.py
│   ├── generate-tweet.py
│   └── latest-results.py
├── public/
│   ├── index.html
│   ├── css/
│   └── js/
├── vercel.json
└── requirements.txt
```

### 常见问题解决

#### 1. API 路由问题
- 确保 API 文件名与 vercel.json 中的路由匹配
- 所有 API 文件都应该有 `handler` 类继承 `BaseHTTPRequestHandler`

#### 2. CORS 问题
- 所有 API 都已添加必要的 CORS 头
- 确保 OPTIONS 请求得到正确处理

#### 3. 依赖问题
- 避免使用大型机器学习库（TensorFlow, PyTorch）
- 如需要，可以考虑使用云端 API 服务

#### 4. 超时问题
- 设置了合理的 maxDuration (10秒)
- 避免长时间运行的计算

## 部署命令

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署项目
vercel --prod

# 4. 查看部署日志
vercel logs [deployment-url]
```

## 测试建议

1. **本地测试**: 使用 `vercel dev` 在本地测试
2. **逐步部署**: 先部署简单的 API，再添加复杂功能
3. **监控日志**: 部署后查看 Vercel 日志定位问题

## 性能优化

1. **冷启动优化**: 减少导入的库数量
2. **缓存策略**: 对静态内容设置合适的缓存头
3. **错误处理**: 添加完善的错误处理和日志

## 下一步行动

1. 使用修复后的配置文件重新部署
2. 测试所有 API 端点
3. 检查前端功能是否正常
4. 根据实际运行情况调整配置
