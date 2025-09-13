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
├── index.html                  # 项目网页展示
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
