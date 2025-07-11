import pickle
import json
import sys
import numpy as np
import os
from datetime import datetime

def load_model():
    """Load the trained model and scaler"""
    try:
        model_path = os.path.join(os.path.dirname(__file__), 'trained_model.pkl')
        
        if not os.path.exists(model_path):
            raise FileNotFoundError("Trained model not found")
        
        with open(model_path, 'rb') as f:
            model_data = pickle.load(f)
        
        return model_data['model'], model_data['scaler'], model_data['feature_columns']
        
    except Exception as e:
        raise Exception(f"Error loading model: {e}")

def prepare_features(features_dict, expected_columns):
    """Prepare features for prediction"""
    try:
        # Create feature array in the correct order
        feature_array = []
        for col in expected_columns:
            if col in features_dict:
                feature_array.append(features_dict[col])
            else:
                feature_array.append(0)  # Default value for missing features
        
        return np.array(feature_array).reshape(1, -1)
        
    except Exception as e:
        raise Exception(f"Error preparing features: {e}")

def predict_spoilage(features_dict):
    """Make spoilage prediction"""
    try:
        # Load model
        model, scaler, feature_columns = load_model()
        
        # Prepare features
        X = prepare_features(features_dict, feature_columns)
        
        # Scale features
        X_scaled = scaler.transform(X)
        
        # Make prediction
        prediction_proba = model.predict_proba(X_scaled)[0]
        prediction = model.predict(X_scaled)[0]
        
        # Get confidence (max probability)
        confidence = max(prediction_proba)
        
        # Get spoilage probability (probability of class 1)
        spoilage_probability = prediction_proba[1] if len(prediction_proba) > 1 else prediction_proba[0]
        
        return {
            'spoilage_probability': float(spoilage_probability),
            'confidence': float(confidence),
            'prediction': int(prediction),
            'predicted_at': datetime.now().isoformat()
        }
        
    except Exception as e:
        raise Exception(f"Prediction error: {e}")

def main():
    """Main prediction function"""
    try:
        if len(sys.argv) < 2:
            raise ValueError("Features JSON not provided")
        
        # Parse features from command line argument
        features_json = sys.argv[1]
        features_dict = json.loads(features_json)
        
        # Make prediction
        result = predict_spoilage(features_dict)
        
        # Output result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            'error': str(e),
            'predicted_at': datetime.now().isoformat()
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    main()

