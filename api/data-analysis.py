from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime
import random

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            response = {
                'status': 'success',
                'analysis': {
                    'data_overview': {
                        'total_draws': random.randint(800, 1200),
                        'analysis_period': '2020-01-01 至 2024-01-01',
                        'last_update': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    },
                    'front_zone_analysis': {
                        'most_frequent': [7, 12, 23, 28, 35],
                        'least_frequent': [2, 8, 15, 31, 34],
                        'hot_numbers': [1, 9, 17, 25, 33],
                        'cold_numbers': [4, 11, 19, 27, 32]
                    },
                    'back_zone_analysis': {
                        'most_frequent': [3, 7],
                        'least_frequent': [1, 12],
                        'hot_numbers': [2, 5],
                        'cold_numbers': [9, 11]
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
