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

class handler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.spiritual_images = [
            {
                'filename': 'lotus_meditation.jpg',
                'description': '莲花冥想图，象征纯净与觉醒，适合提升内心平静',
                'energy_type': 'purification',
                'chakra_alignment': 'crown'
            },
            {
                'filename': 'mountain_zen.jpg', 
                'description': '高山禅境图，代表稳定与高远，增强意志力',
                'energy_type': 'stability',
                'chakra_alignment': 'root'
            },
            {
                'filename': 'ocean_waves.jpg',
                'description': '海浪律动图，体现流动与变化，激发直觉力',
                'energy_type': 'flow',
                'chakra_alignment': 'sacral'
            },
            {
                'filename': 'forest_tranquility.jpg',
                'description': '森林宁静图，传递自然与和谐，平衡心境',
                'energy_type': 'harmony',
                'chakra_alignment': 'heart'
            },
            {
                'filename': 'sunset_chakra.jpg',
                'description': '夕阳脉轮图，展现能量与平衡，开启智慧',
                'energy_type': 'wisdom',
                'chakra_alignment': 'third_eye'
            },
            {
                'filename': 'crystal_formation.jpg',
                'description': '水晶阵列图，聚集宇宙能量，增强感知力',
                'energy_type': 'amplification',
                'chakra_alignment': 'throat'
            }
        ]
        super().__init__(*args, **kwargs)

    def do_GET(self):
        try:
            logger.info("收到灵修扰动请求")
            
            # 基于时间和随机因子的种子
            current_time = datetime.now()
            time_seed = int(current_time.timestamp()) % 100000
            
            # 使用时间哈希确保一定的随机性但又有规律
            time_hash = hashlib.md5(str(time_seed).encode()).hexdigest()
            random.seed(int(time_hash[:8], 16))
            
            # 选择灵修图像
            selected_image = random.choice(self.spiritual_images)
            
            # 生成扰动因子
            perturbation_factors = self._generate_perturbation_factors(current_time)
            
            # 生成灵修指导
            spiritual_guidance = self._generate_spiritual_guidance(selected_image, perturbation_factors)
            
            # 计算整体强度
            overall_intensity = self._calculate_overall_intensity(perturbation_factors)
            
            # 生成能量读数
            energy_reading = self._generate_energy_reading(current_time)
            
            response = {
                'status': 'success',
                'spiritual_perturbation': {
                    'spiritual_image': selected_image,
                    'perturbation_factors': perturbation_factors,
                    'overall_intensity': overall_intensity,
                    'spiritual_guidance': spiritual_guidance,
                    'cosmic_timing': {
                        'current_phase': self._get_cosmic_phase(current_time),
                        'optimal_meditation_time': self._get_optimal_meditation_time(current_time),
                        'lunar_influence': self._get_lunar_influence(current_time)
                    }
                },
                'energy_reading': energy_reading,
                'quantum_resonance': {
                    'frequency_hz': round(random.uniform(7.83, 40.0), 2),  # 舒曼共振范围
                    'coherence_level': round(random.uniform(0.6, 0.95), 3),
                    'dimensional_alignment': random.choice(['第三密度', '第四密度过渡', '第五密度共振'])
                },
                'timestamp': current_time.isoformat(),
                'session_id': time_hash[:16]
            }
            
            self._send_json_response(200, response)
            logger.info("灵修扰动数据生成成功")
            
        except Exception as e:
            logger.error(f"灵修扰动处理错误: {str(e)}")
            logger.error(traceback.format_exc())
            self._send_error_response(500, f"灵修能量获取失败: {str(e)}")
    
    def do_OPTIONS(self):
        self._send_cors_headers()
    
    def _generate_perturbation_factors(self, current_time):
        """生成基于时间的扰动因子"""
        hour = current_time.hour
        minute = current_time.minute
        day = current_time.day
        
        # 基于时间的能量波动
        time_factor = (hour * 60 + minute) / 1440  # 0-1之间的时间因子
        day_factor = day / 31  # 月相因子
        
        # 混沌因子 - 基于分钟数的波动
        chaos_base = (minute % 7) / 7
        chaos_factor = round(chaos_base * random.uniform(0.8, 1.2), 3)
        
        # 和谐因子 - 基于小时数的稳定性
        harmony_base = 1 - abs(hour - 12) / 12  # 中午12点最和谐
        harmony_factor = round(harmony_base * random.uniform(0.7, 1.0), 3)
        
        # 宇宙调谐 - 综合时间因子
        cosmic_alignment = round((time_factor + day_factor) / 2 * random.uniform(0.6, 1.0), 3)
        
        # 能量等级 - 基于时间段
        energy_levels = ['极低', '低', '中等', '高', '极高']
        if 6 <= hour <= 9 or 18 <= hour <= 21:  # 黄金时间
            energy_level = random.choice(['高', '极高'])
        elif 22 <= hour <= 5:  # 深夜时间
            energy_level = random.choice(['极低', '低'])
        else:
            energy_level = random.choice(['中等', '高'])
        
        return {
            'chaos_factor': chaos_factor,
            'harmony_factor': harmony_factor,
            'energy_level': energy_level,
            'cosmic_alignment': cosmic_alignment,
            'time_resonance': round(time_factor, 3),
            'lunar_phase_influence': round(day_factor, 3)
        }
    
    def _generate_spiritual_guidance(self, selected_image, perturbation_factors):
        """生成灵修指导"""
        mantras = {
            'purification': ['愿智慧照亮前路', '心如莲花，纯净无染', '清净本心，回归本源'],
            'stability': ['稳如磐石，心如止水', '根植大地，直指苍穹', '不动如山，应变如风'],
            'flow': ['随缘不变，不变随缘', '如水般柔顺，如风般自由', '顺应自然，与道合一'],
            'harmony': ['天人合一，万物归心', '内外和谐，身心平衡', '众生平等，慈悲为怀'],
            'wisdom': ['智慧如日，照破无明', '直觉如灯，指引前路', '洞察本质，超越表象'],
            'amplification': ['能量聚集，意念专注', '共振宇宙，感应万物', '扩展意识，提升振频']
        }
        
        energy_type = selected_image.get('energy_type', 'harmony')
        mantra_list = mantras.get(energy_type, mantras['harmony'])
        
        # 基于能量等级调整冥想时间
        energy_level = perturbation_factors['energy_level']
        if energy_level in ['极高', '高']:
            meditation_time = f'{random.randint(20, 45)}分钟'
        elif energy_level == '中等':
            meditation_time = f'{random.randint(10, 25)}分钟'
        else:
            meditation_time = f'{random.randint(5, 15)}分钟'
        
        return {
            'recommended_mantra': random.choice(mantra_list),
            'meditation_time': meditation_time,
            'breathing_pattern': random.choice(['4-7-8呼吸法', '箱式呼吸法', '自然呼吸法', '数息观呼吸法']),
            'posture_suggestion': random.choice(['莲花坐', '金刚坐', '简易坐', '椅子冥想坐']),
            'focus_point': selected_image.get('chakra_alignment', 'heart'),
            'preparation_ritual': random.choice([
                '点燃一支香，净化空间',
                '播放轻柔的冥想音乐',
                '在面前放置一杯清水',
                '面向东方，迎接晨光',
                '在心中感恩宇宙万物'
            ])
        }
    
    def _calculate_overall_intensity(self, perturbation_factors):
        """计算整体扰动强度"""
        chaos = perturbation_factors['chaos_factor']
        harmony = perturbation_factors['harmony_factor']
        cosmic = perturbation_factors['cosmic_alignment']
        
        # 综合计算强度，考虑平衡性
        intensity = (chaos * 0.3 + harmony * 0.4 + cosmic * 0.3)
        return round(intensity, 3)
    
    def _generate_energy_reading(self, current_time):
        """生成能量读数"""
        hour = current_time.hour
        
        # 基于时间的能量波动
        base_cosmic = 60 + (hour % 12) * 3  # 60-95范围
        base_earth = 50 + (24 - abs(hour - 12)) * 2  # 50-90范围
        base_personal = 70 + random.randint(-20, 30)  # 50-100范围
        
        return {
            'cosmic_energy': f'{min(95, max(60, base_cosmic + random.randint(-5, 10)))}%',
            'earth_energy': f'{min(90, max(50, base_earth + random.randint(-5, 10)))}%',
            'personal_energy': f'{min(100, max(50, base_personal))}%',
            'chakra_balance': {
                'root': round(random.uniform(0.6, 1.0), 2),
                'sacral': round(random.uniform(0.6, 1.0), 2),
                'solar_plexus': round(random.uniform(0.6, 1.0), 2),
                'heart': round(random.uniform(0.7, 1.0), 2),
                'throat': round(random.uniform(0.6, 1.0), 2),
                'third_eye': round(random.uniform(0.5, 0.9), 2),
                'crown': round(random.uniform(0.5, 0.9), 2)
            }
        }
    
    def _get_cosmic_phase(self, current_time):
        """获取宇宙相位"""
        phases = [
            '新月相位 - 新的开始',
            '上弦月相位 - 积累能量',
            '满月相位 - 能量高峰',
            '下弦月相位 - 释放净化',
            '日食相位 - 重大转变',
            '水逆相位 - 内省反思',
            '火星冲相位 - 行动力强',
            '金星合相位 - 和谐美好'
        ]
        return random.choice(phases)
    
    def _get_optimal_meditation_time(self, current_time):
        """获取最佳冥想时间"""
        hour = current_time.hour
        
        if 5 <= hour <= 7:
            return "日出时分 - 迎接新能量"
        elif 11 <= hour <= 13:
            return "正午时分 - 阳气最盛"
        elif 17 <= hour <= 19:
            return "日落时分 - 阴阳转换"
        elif 23 <= hour or hour <= 1:
            return "子时时分 - 静心内观"
        else:
            return "当下即是最佳时机"
    
    def _get_lunar_influence(self, current_time):
        """获取月相影响"""
        day = current_time.day
        if day <= 7:
            return "新月影响 - 适合种下意愿"
        elif day <= 14:
            return "上弦月影响 - 适合行动实践"
        elif day <= 21:
            return "满月影响 - 适合感恩庆祝"
        else:
            return "下弦月影响 - 适合释放清理"
    
    def _send_json_response(self, status_code, data):
        """发送JSON响应"""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json; charset=utf-8')
        self._send_cors_headers()
        self.end_headers()
        
        json_str = json.dumps(data, ensure_ascii=False, indent=2)
        self.wfile.write(json_str.encode('utf-8'))
    
    def _send_error_response(self, status_code, message):
        """发送错误响应"""
        error_response = {
            'status': 'error', 
            'message': message,
            'timestamp': datetime.now().isoformat()
        }
        self._send_json_response(status_code, error_response)
    
    def _send_cors_headers(self):
        """发送CORS头部"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        self.send_header('Access-Control-Max-Age', '86400')
        self.end_headers()
