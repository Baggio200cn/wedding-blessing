from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime
import random

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                post_data = self.rfile.read(content_length)
                request_data = json.loads(post_data.decode('utf-8'))
            else:
                request_data = {}
            
            training_result = self._start_model_training(request_data)
            
            response = {
                \"status\": \"success\",
                \"training_result\": training_result,
                \"timestamp\": datetime.now().isoformat()
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
                \"message\": f\"模型训练启动失败: {str(e)}\",
                \"timestamp\": datetime.now().isoformat()
            }
            
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_GET(self):
        try:
            training_status = self._get_training_status()
            
            response = {
                \"status\": \"success\",
                \"training_status\": training_status,
                \"timestamp\": datetime.now().isoformat()
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            error_response = {
                \"status\": \"error\",
                \"message\": f\"获取训练状态失败: {str(e)}\",
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
    
    def _start_model_training(self, request_data):
        model_type = request_data.get('model_type', 'all')
        
        models = [\"lstm\", \"transformer\", \"xgboost\", \"random_forest\"]
        training_results = {}
        
        for model in models:
            training_results[model] = {
                \"status\": \"started\",
                \"progress\": 0,
                \"estimated_completion\": self._get_completion_time(),
                \"current_epoch\": 0,
                \"total_epochs\": random.randint(50, 100)
            }
        
        return {
            \"training_type\": \"全模型训练\",
            \"models\": training_results,
            \"overall_progress\": 0,
            \"estimated_duration\": \"90-120分钟\"
        }
    
    def _get_training_status(self):
        current_trainings = [
            {
                \"model_type\": \"lstm\",
                \"status\": \"running\",
                \"progress\": random.randint(20, 80),
                \"current_epoch\": random.randint(10, 50),
                \"total_epochs\": 100,
                \"current_loss\": round(random.uniform(0.1, 0.5), 4),
                \"elapsed_time\": f\"{random.randint(5, 30)}分钟\"
            }
        ]
        
        completed_trainings = [
            {
                \"model_type\": \"transformer\",
                \"status\": \"completed\",
                \"final_accuracy\": round(random.uniform(0.75, 0.92), 4),
                \"training_duration\": f\"{random.randint(15, 45)}分钟\"
            }
        ]
        
        return {
            \"current_trainings\": current_trainings,
            \"completed_trainings\": completed_trainings,
            \"system_status\": {
                \"gpu_usage\": f\"{random.randint(60, 95)}%\",
                \"memory_usage\": f\"{random.randint(70, 90)}%\"
            }
        }
    
    def _get_completion_time(self):
        completion_time = datetime.now()
        return completion_time.isoformat()
