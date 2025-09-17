from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime
import random
import hashlib
import urllib.parse

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # 解析路径
            path = self.path.split('?')[0]
            
            if path == '/api/health':
                self._handle_health()
            elif path == '/api/data-analysis':
                self._handle_data_analysis()
            else:
                self._send_error(404, 'API endpoint not found')
                
        except Exception as e:
            self._send_error(500, str(e))
    
    def do_POST(self):
        try:
            path = self.path.split('?')[0]
            
            # 读取请求数据
            content_length = int(self.headers.get('Content-Length', 0))
            request_data = {}
            if content_length > 0:
                post_data = self.rfile.read(content_length)
                request_data = json.loads(post_data.decode('utf-8'))
            
            if path == '/api/predict':
                self._handle_predict(request_data)
            elif path == '/api/generate-tweet':
                self._handle_generate_tweet(request_data)
            else:
                self._send_error(404, 'API endpoint not found')
                
        except Exception as e:
            self._send_error(500, str(e))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def _handle_health(self):
        response = {
            \"status\": \"healthy\",
            \"service\": \"大乐透预测系统\",
            \"version\": \"1.0.0\",
            \"timestamp\": datetime.now().isoformat()
        }
        self._send_json_response(response)
    
    def _handle_predict(self, request_data):
        # 模拟预测
        front_zone = sorted(random.sample(range(1, 36), 5))
        back_zone = sorted(random.sample(range(1, 13), 2))
        
        response = {
            \"status\": \"success\",
            \"prediction\": {
                \"ensemble_prediction\": {
                    \"front_zone\": front_zone,
                    \"back_zone\": back_zone,
                    \"confidence\": round(random.uniform(0.7, 0.9), 3)
                }
            },
            \"timestamp\": datetime.now().isoformat()
        }
        self._send_json_response(response)
    
    def _handle_data_analysis(self):
        response = {
            \"status\": \"success\",
            \"analysis\": {
                \"data_overview\": {
                    \"total_draws\": 1000,
                    \"last_update\": datetime.now().strftime(\"%Y-%m-%d %H:%M:%S\")
                },
                \"front_zone_analysis\": {
                    \"hot_numbers\": [7, 12, 23, 28, 35]
                },
                \"back_zone_analysis\": {
                    \"hot_numbers\": [3, 7]
                }
            },
            \"timestamp\": datetime.now().isoformat()
        }
        self._send_json_response(response)
    
    def _handle_generate_tweet(self, request_data):
        content = f\"\"\"🎯 大乐透AI预测 {datetime.now().strftime('%m月%d日')}

前区：7 12 23 28 35
后区：3 7

AI置信度：85.2%
祝好运！理性购彩\"\"\"
        
        response = {
            \"status\": \"success\",
            \"tweet\": {
                \"content\": content,
                \"word_count\": len(content)
            },
            \"timestamp\": datetime.now().isoformat()
        }
        self._send_json_response(response)
    
    def _send_json_response(self, data):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
    
    def _send_error(self, code, message):
        self.send_response(code)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        error_response = {\"status\": \"error\", \"message\": message}
        self.wfile.write(json.dumps(error_response).encode('utf-8'))
