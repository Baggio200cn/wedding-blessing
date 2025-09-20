from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # 构建响应数据
            response_data = {
                'status': 'healthy',
                'service': '大乐透预测系统',
                'version': '1.0.0',
                'timestamp': datetime.now().isoformat(),
                'message': 'API服务正常运行'
            }
            
            # 发送响应头
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            # 发送响应体
            json_str = json.dumps(response_data, ensure_ascii=False)
            self.wfile.write(json_str.encode('utf-8'))
            
        except Exception as e:
            # 错误处理
            self.send_response(500)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_response = {
                'status': 'error',
                'message': str(e),
                'timestamp': datetime.now().isoformat()
            }
            
            json_str = json.dumps(error_response, ensure_ascii=False)
            self.wfile.write(json_str.encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
