# Main Entry Point
from utils.data_processing import load_and_process_data
from models.lstm_model import build_lstm_model

def main():
    # Example usage
    data = load_and_process_data('data/raw_data/sample.csv')
    model = build_lstm_model(input_shape=(None, data.shape[1]))
    print("Model built successfully.")

if __name__ == '__main__':
    main()
