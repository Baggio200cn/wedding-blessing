from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime
import random
import hashlib

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            perturbation_result = self._generate_spiritual_perturbation()
            
            response = {
                \"status\": \"success\",
                \"spiritual_perturbation\": perturbation_result,
                \"timestamp\": datetime.now().isoformat(),
                \"energy_reading\": self._get_energy_reading()
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            error_response = {
                \"status\": \"error\",
                \"message\": f\"灵修扰动生成失败: {str(e)}\",
                \"timestamp\": datetime.now().isoformat()
            }
            
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def _generate_spiritual_perturbation(self):
        time_seed = int(datetime.now().timestamp()) % 10000
        random.seed(time_seed)
        
        spiritual_images = [
            \"lotus_meditation.jpg\",
            \"mountain_zen.jpg\", 
            \"ocean_waves.jpg\",
            \"forest_tranquility.jpg\",
            \"sunset_chakra.jpg\"
        ]
        
        selected_image = random.choice(spiritual_images)
        
        perturbation_factors = {
            \"chaos_factor\": round(random.uniform(0.1, 0.9), 3),
            \"harmony_factor\": round(random.uniform(0.1, 0.9), 3),
            \"energy_level\": random.choice([\"极高\", \"高\", \"中等\", \"低\", \"极低\"]),
            \"cosmic_alignment\": round(random.uniform(0.0, 1.0), 3)
        }
        
        overall_intensity = (
            perturbation_factors[\"chaos_factor\"] * 0.3 +
            perturbation_factors[\"harmony_factor\"] * 0.3 +
            perturbation_factors[\"cosmic_alignment\"] * 0.4
        )
        
        return {
            \"spiritual_image\": {
                \"filename\": selected_image,
                \"description\": self._get_image_description(selected_image)
            },
            \"perturbation_factors\": perturbation_factors,
            \"overall_intensity\": round(overall_intensity, 3),
            \"spiritual_guidance\": {
                \"meditation_time\": f\"{random.randint(5, 30)}分钟\",
                \"recommended_mantra\": random.choice([
                    \"愿智慧照亮前路\",
                    \"心静自然凉\",
                    \"随缘不变，不变随缘\"
                ])
            }
        }
    
    def _get_energy_reading(self):
        return {
            \"cosmic_energy\": f\"{random.randint(60, 95)}%\",
            \"earth_energy\": f\"{random.randint(50, 90)}%\",
            \"personal_energy\": f\"{random.randint(70, 100)}%\"
        }
    
    def _get_image_description(self, filename):
        descriptions = {
            \"lotus_meditation.jpg\": \"莲花冥想图，象征纯净与觉醒\",
            \"mountain_zen.jpg\": \"高山禅境图，代表稳定与高远\",
            \"ocean_waves.jpg\": \"海浪律动图，体现流动与变化\",
            \"forest_tranquility.jpg\": \"森林宁静图，传递自然与和谐\",
            \"sunset_chakra.jpg\": \"夕阳脉轮图，展现能量与平衡\"
        }
        return descriptions.get(filename, \"神秘灵修图像，蕴含无限可能\")
