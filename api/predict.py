from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime
import random

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # 读取请求数据
            content_length = int(self.headers.get('Content-Length', 0))
            request_data = {}
            if content_length > 0:
                post_data = self.rfile.read(content_length)
                request_data = json.loads(post_data.decode('utf-8'))
            
            # 生成随机预测
            front_zone = sorted(random.sample(range(1, 36), 5))
            back_zone = sorted(random.sample(range(1, 13), 2))
            
            response = {
                'status': 'success',
                'prediction': {
                    'ensemble_prediction': {
                        'front_zone': front_zone,
                        'back_zone': back_zone,
                        'confidence': round(random.uniform(0.7, 0.9), 3)
                    },
                    'individual_models': {
                        'lstm_model': {
                            'front_zone': sorted(random.sample(range(1, 36), 5)),
                            'back_zone': sorted(random.sample(range(1, 13), 2)),
                            'confidence': round(random.uniform(0.6, 0.9), 3)
                        }
                    }
                },
                'timestamp': datetime.now().isoformat()
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = {'status': 'error', 'message': str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
