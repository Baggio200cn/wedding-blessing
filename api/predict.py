from http.server import BaseHTTPRequestHandler
import json
import logging
from datetime import datetime
import random
import hashlib
import traceback

# 设置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PredictionEngine:
    """预测引擎核心类"""
    
    def __init__(self):
        self.front_zone_range = (1, 36)  # 前区号码范围
        self.back_zone_range = (1, 13)   # 后区号码范围
        self.front_zone_count = 5        # 前区选号数量
        self.back_zone_count = 2         # 后区选号数量
        
        # 历史热门号码（模拟数据）
        self.historical_hot_front = [7, 12, 23, 28, 35, 9, 17, 25, 33, 1]
        self.historical_hot_back = [3, 7, 11, 5, 9]
        
        # 号码权重系统
        self.weight_factors = {
            'frequency': 0.3,     # 历史频率权重
            'recent_trend': 0.25, # 近期趋势权重
            'pattern': 0.2,       # 规律性权重
            'random': 0.25        # 随机性权重
        }
    
    def generate_lstm_prediction(self, seed):
        """LSTM模型预测模拟"""
        random.seed(seed)
        
        # 基于历史热门号码和随机性的组合
        front_candidates = list(range(*self.front_zone_range))
        back_candidates = list(range(*self.back_zone_range))
        
        # 给热门号码更高权重
        weighted_front = []
        for num in front_candidates:
            weight = 3 if num in self.historical_hot_front else 1
            weighted_front.extend([num] * weight)
        
        weighted_back = []
        for num in back_candidates:
            weight = 3 if num in self.historical_hot_back else 1
            weighted_back.extend([num] * weight)
        
        # 选择号码
        front_zone = sorted(random.sample(weighted_front, self.front_zone_count))
        back_zone = sorted(random.sample(weighted_back, self.back_zone_count))
        
        confidence = round(random.uniform(0.65, 0.85), 3)
        
        return {
            'front_zone': front_zone,
            'back_zone': back_zone,
            'confidence': confidence,
            'model_features': {
                'sequence_length': 50,
                'hidden_units': 128,
                'training_epochs': 100,
                'loss_function': 'mse'
            }
        }
    
    def generate_transformer_prediction(self, seed):
        """Transformer模型预测模拟"""
        random.seed(seed + 1000)
        
        # 注意力机制模拟 - 关注号码间的关联
        attention_pairs = [
            ([7, 23], [3]),     # 7和23常与后区3一起出现
            ([12, 28], [7]),    # 12和28常与后区7一起出现
            ([9, 35], [11]),    # 9和35常与后区11一起出现
        ]
        
        # 随机选择一个注意力模式
        if random.random() < 0.6:  # 60%概率使用注意力模式
            pattern = random.choice(attention_pairs)
            front_base = pattern[0]
            back_base = pattern[1]
            
            # 补充其他号码
            remaining_front = [n for n in range(*self.front_zone_range) if n not in front_base]
            additional_front = random.sample(remaining_front, self.front_zone_count - len(front_base))
            front_zone = sorted(front_base + additional_front)
            
            remaining_back = [n for n in range(*self.back_zone_range) if n not in back_base]
            additional_back = random.sample(remaining_back, self.back_zone_count - len(back_base))
            back_zone = sorted(back_base + additional_back)
        else:
            # 随机选择
            front_zone = sorted(random.sample(range(*self.front_zone_range), self.front_zone_count))
            back_zone = sorted(random.sample(range(*self.back_zone_range), self.back_zone_count))
        
        confidence = round(random.uniform(0.70, 0.90), 3)
        
        return {
            'front_zone': front_zone,
            'back_zone': back_zone,
            'confidence': confidence,
            'model_features': {
                'attention_heads': 8,
                'encoder_layers': 6,
                'embedding_dim': 256,
                'attention_mechanism': 'multi_head'
            }
        }
    
    def generate_xgboost_prediction(self, seed):
        """XGBoost模型预测模拟"""
        random.seed(seed + 2000)
        
        # 基于统计特征的预测
        # 模拟特征重要性分析
        features = {
            'number_frequency': 0.25,
            'gap_analysis': 0.20,
            'odd_even_ratio': 0.15,
            'sum_range': 0.15,
            'consecutive_pattern': 0.10,
            'prime_number_factor': 0.10,
            'digit_sum_pattern': 0.05
        }
        
        # 基于特征生成预测
        front_zone = []
        back_zone = []
        
        # 确保奇偶比例平衡
        odd_count = random.choice([2, 3])  # 前区奇数个数
        even_count = self.front_zone_count - odd_count
        
        odd_numbers = [n for n in range(1, 36, 2) if n <= 35]
        even_numbers = [n for n in range(2, 36, 2) if n <= 35]
        
        front_zone.extend(random.sample(odd_numbers, odd_count))
        front_zone.extend(random.sample(even_numbers, even_count))
        front_zone = sorted(front_zone)
        
        # 后区选择
        back_zone = sorted(random.sample(range(*self.back_zone_range), self.back_zone_count))
        
        confidence = round(random.uniform(0.68, 0.82), 3)
        
        return {
            'front_zone': front_zone,
            'back_zone': back_zone,
            'confidence': confidence,
            'model_features': {
                'n_estimators': 200,
                'max_depth': 6,
                'learning_rate': 0.1,
                'feature_importance': features
            }
        }
    
    def generate_ensemble_prediction(self, lstm_pred, transformer_pred, xgboost_pred, spiritual_factor=None):
        """集成模型预测"""
        
        # 权重分配
        weights = {
            'lstm': 0.35,
            'transformer': 0.40,
            'xgboost': 0.25
        }
        
        # 如果有灵修因子，调整权重
        if spiritual_factor:
            adjustment = spiritual_factor.get('overall_intensity', 0.5)
            weights['lstm'] *= (1 + adjustment * 0.1)
            weights['transformer'] *= (1 + adjustment * 0.15)
            weights['xgboost'] *= (1 - adjustment * 0.05)
            
            # 重新归一化
            total_weight = sum(weights.values())
            weights = {k: v/total_weight for k, v in weights.items()}
        
        # 投票机制选择最终号码
        all_predictions = [lstm_pred, transformer_pred, xgboost_pred]
        
        # 前区号码统计
        front_votes = {}
        for pred in all_predictions:
            for num in pred['front_zone']:
                front_votes[num] = front_votes.get(num, 0) + 1
        
        # 后区号码统计
        back_votes = {}
        for pred in all_predictions:
            for num in pred['back_zone']:
                back_votes[num] = back_votes.get(num, 0) + 1
        
        # 选择得票最高的号码，不足则随机补充
        front_candidates = sorted(front_votes.items(), key=lambda x: x[1], reverse=True)
        back_candidates = sorted(back_votes.items(), key=lambda x: x[1], reverse=True)
        
        # 构建最终预测
        ensemble_front = []
        ensemble_back = []
        
        # 优先选择得票数高的
        for num, votes in front_candidates:
            if len(ensemble_front) < self.front_zone_count:
                ensemble_front.append(num)
        
        for num, votes in back_candidates:
            if len(ensemble_back) < self.back_zone_count:
                ensemble_back.append(num)
        
        # 补充不足的号码
        while len(ensemble_front) < self.front_zone_count:
            candidates = [n for n in range(*self.front_zone_range) if n not in ensemble_front]
            ensemble_front.append(random.choice(candidates))
        
        while len(ensemble_back) < self.back_zone_count:
            candidates = [n for n in range(*self.back_zone_range) if n not in ensemble_back]
            ensemble_back.append(random.choice(candidates))
        
        # 计算集成置信度
        confidences = [pred['confidence'] for pred in all_predictions]
        ensemble_confidence = sum(c * w for c, w in zip(confidences, weights.values()))
        
        # 如果有灵修因子，进一步调整置信度
        if spiritual_factor:
            spiritual_boost = spiritual_factor.get('overall_intensity', 0.5) * 0.1
            ensemble_confidence = min(0.95, ensemble_confidence + spiritual_boost)
        
        return {
            'front_zone': sorted(ensemble_front),
            'back_zone': sorted(ensemble_back),
            'confidence': round(ensemble_confidence, 3),
            'ensemble_weights': weights,
            'voting_details': {
                'front_votes': front_votes,
                'back_votes': back_votes
            }
        }

class handler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.prediction_engine = PredictionEngine()
        super().__init__(*args, **kwargs)
    
    def do_POST(self):
        try:
            logger.info("收到预测请求")
            
            # 读取请求数据
            content_length = int(self.headers.get('Content-Length', 0))
            request_data = {}
            if content_length > 0:
                post_data = self.rfile.read(content_length)
                request_data = json.loads(post_data.decode('utf-8'))
            
            # 生成预测种子
            current_time = datetime.now()
            time_seed = int(current_time.timestamp())
            
            # 获取请求参数
            prediction_type = request_data.get('prediction_type', 'ensemble')
            historical_data = request_data.get('historical_data', [])
            spiritual_factor = request_data.get('spiritual_factor', None)
            
            # 生成各模型预测
            lstm_prediction = self.prediction_engine.generate_lstm_prediction(time_seed)
            transformer_prediction = self.prediction_engine.generate_transformer_prediction(time_seed)
            xgboost_prediction = self.prediction_engine.generate_xgboost_prediction(time_seed)
            
            # 生成集成预测
            ensemble_prediction = self.prediction_engine.generate_ensemble_prediction(
                lstm_prediction, transformer_prediction, xgboost_prediction, spiritual_factor
            )
            
            # 构建响应
            response = {
                'status': 'success',
                'prediction': {
                    'ensemble_prediction': ensemble_prediction,
                    'individual_models': {
                        'lstm_model': lstm_prediction,
                        'transformer_model': transformer_prediction,
                        'xgboost_model': xgboost_prediction
                    },
                    'prediction_metadata': {
                        'prediction_type': prediction_type,
                        'generation_time': current_time.isoformat(),
                        'model_version': '2.1.0',
                        'data_points_used': len(historical_data) if historical_data else 500,
                        'spiritual_enhancement': spiritual_factor is not None
                    }
                },
                'analysis': {
                    'number_distribution': self._analyze_number_distribution(ensemble_prediction),
                    'pattern_analysis': self._analyze_patterns(ensemble_prediction),
                    'risk_assessment': self._assess_risks(ensemble_prediction)
                },
                'disclaimer': {
                    'message': '本预测仅供参考，彩票投注存在风险，请理性购彩',
                    'accuracy_note': '历史业绩不代表未来结果',
                    'responsibility': '用户需自行承担投注风险'
                },
                'timestamp': current_time.isoformat()
            }
            
            self._send_json_response(200, response)
            logger.info("预测生成成功")
