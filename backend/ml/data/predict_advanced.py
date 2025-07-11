import sys
import json
from datetime import datetime
from advanced_predictor import AdvancedSpoilagePredictor

def main():
    try:
        if len(sys.argv) < 2:
            raise ValueError("Product data not provided")
        
        # Parse product data
        product_data = json.loads(sys.argv[1])
        
        # Initialize predictor
        predictor = AdvancedSpoilagePredictor()
        
        # Make prediction
        result = predictor.predict_product_spoilage(product_data)
        
        # Output result
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            'error': str(e),
            'predicted_at': datetime.now().isoformat(),
            'model_version': 'error'
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    main()
