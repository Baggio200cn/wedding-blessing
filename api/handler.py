from http.server import BaseHTTPRequestHandler
import json

class MyAPIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Prepare the response
            response_data = {
                "message": "API is working correctly!",
                "status": "success"
            }
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode("utf-8"))
        except Exception as e:
            # Handle errors in the response
            error_response = {
                "message": "Internal Server Error",
                "error": str(e),
                "status": "failure"
            }
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(error_response).encode("utf-8"))

# Ensure the handler is a valid subclass of BaseHTTPRequestHandler
if not issubclass(MyAPIHandler, BaseHTTPRequestHandler):
    raise TypeError("MyAPIHandler must be a subclass of BaseHTTPRequestHandler")
