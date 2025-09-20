from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime
import random

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # 设置CORS头
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            # 生成模拟数据分析结果
            response = {
                'status': 'success',
                'analysis': {
                    'total_draws': random.randint(800, 1200),
                    'last_update': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'hot_numbers': {
                        'front': [1, 7, 12, 23, 28],
                        'back': [3, 7, 11]
                    },
                    'cold_numbers': {
                        'front': [2, 8, 15, 31, 34],
                        'back': [1, 5, 12]
                    },
                    'frequency_analysis': {
                        'most_frequent_front': [7, 12, 23, 28, 35],
                        'least_frequent_front': [2, 8, 15, 31, 34],
                        'most_frequent_back': [3, 7],
                        'least_frequent_back': [1, 12]
                    }
                },
                'timestamp': datetime.now().isoformat()
            }
            
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_response = {'status': 'error', 'message': str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
