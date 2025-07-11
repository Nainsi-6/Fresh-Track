import pandas as pd
import numpy as np
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle
import json
import sys
import os
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

def load_data(data_path=None):
    """Load training data from Excel files or generate sample data"""
    try:
        if data_path and os.path.exists(data_path):
            print(f"Loading data from {data_path}")
            df = pd.read_excel(data_path)
        else:
            # Generate sample training data
            print("Generating sample training data...")
            np.random.seed(42)
            n_samples = 1000
            
            # Generate features
            data = {
                'quantity': np.random.randint(1, 100, n_samples),
                'price': np.random.uniform(1, 50, n_samples),
                'temperature': np.random.normal(4, 2, n_samples),
                'humidity': np.random.normal(65, 10, n_samples),
                'days_to_expiry_from_arrival': np.random.randint(0, 14, n_samples),
                'category_Bakery': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
                'category_Dairy': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
                'category_Frozen': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
                'category_Meat': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),
                'category_Produce': np.random.choice([0, 1], n_samples, p=[0.75, 0.25]),
                'store_id_S002': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
                'store_id_S003': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
                'store_id_S004': np.random.choice([0, 1], n_samples, p=[0.7, 0.3])
            }
            
            df = pd.DataFrame(data)
            
            # Generate target variable (spoilage risk)
            spoilage_risk = (
                (14 - df['days_to_expiry_from_arrival']) * 6 +
                (df['temperature'] - 4) * 3 +
                (df['humidity'] - 65) * 0.5 +
                df['category_Dairy'] * 15 +
                df['category_Produce'] * 12 +
                df['category_Meat'] * 20 +
                np.random.normal(0, 5, n_samples)
            )
            
            # Normalize to 0-100 range
            spoilage_risk = np.clip(spoilage_risk, 0, 100)
            df['spoilage_risk'] = spoilage_risk
            
            # Create binary target for classification
            df['is_spoiled'] = (df['spoilage_risk'] > 70).astype(int)
        
        print(f"Data loaded successfully. Shape: {df.shape}")
        return df
        
    except Exception as e:
        print(f"Error loading data: {e}")
        return None

def preprocess_data(df):
    """Preprocess the data for training"""
    try:
        # Separate features and target
        feature_columns = [col for col in df.columns if col not in ['spoilage_risk', 'is_spoiled']]
        X = df[feature_columns]
        y = df['is_spoiled'] if 'is_spoiled' in df.columns else (df['spoilage_risk'] > 70).astype(int)
        
        # Handle missing values
        X = X.fillna(X.mean())
        
        # Scale numerical features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        return X_scaled, y, feature_columns, scaler
        
    except Exception as e:
        print(f"Error preprocessing data: {e}")
        return None, None, None, None

def train_model(X, y):
    """Train the Random Forest model"""
    try:
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Train Random Forest model
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42
        )
        
        model.fit(X_train, y_train)
        
        # Make predictions
        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)
        
        # Calculate metrics
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"Model trained successfully!")
        print(f"Accuracy: {accuracy:.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        return model, accuracy, X_test, y_test, y_pred_proba
        
    except Exception as e:
        print(f"Error training model: {e}")
        return None, None, None, None, None

def save_model(model, scaler, feature_columns, accuracy):
    """Save the trained model and metadata"""
    try:
        # Save the model
        model_path = os.path.join(os.path.dirname(__file__), 'trained_model.pkl')
        with open(model_path, 'wb') as f:
            pickle.dump({
                'model': model,
                'scaler': scaler,
                'feature_columns': feature_columns
            }, f)
        
        # Save metadata
        metadata = {
            'version': '1.0.0',
            'accuracy': float(accuracy),
            'feature_columns': feature_columns,
            'trained_at': datetime.now().isoformat(),
            'model_type': 'RandomForestClassifier',
            'n_features': len(feature_columns)
        }
        
        metadata_path = os.path.join(os.path.dirname(__file__), 'trained_model.json')
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"Model saved successfully!")
        print(f"Model path: {model_path}")
        print(f"Metadata path: {metadata_path}")
        
        return True
        
    except Exception as e:
        print(f"Error saving model: {e}")
        return False

def main():
    """Main training function"""
    try:
        # Get data path from command line argument
        data_path = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1] else None
        
        print("🤖 Starting ML model training...")
        
        # Load data
        df = load_data(data_path)
        if df is None:
            print("❌ Failed to load data")
            sys.exit(1)
        
        # Preprocess data
        X, y, feature_columns, scaler = preprocess_data(df)
        if X is None:
            print("❌ Failed to preprocess data")
            sys.exit(1)
        
        # Train model
        model, accuracy, X_test, y_test, y_pred_proba = train_model(X, y)
        if model is None:
            print("❌ Failed to train model")
            sys.exit(1)
        
        # Save model
        if save_model(model, scaler, feature_columns, accuracy):
            print("✅ Model training completed successfully!")
        else:
            print("❌ Failed to save model")
            sys.exit(1)
            
    except Exception as e:
        print(f"❌ Training failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

