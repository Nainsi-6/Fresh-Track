import pandas as pd
import numpy as np
import pickle
import json
import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error
import joblib
from textblob import TextBlob
import warnings
warnings.filterwarnings('ignore')

class AdvancedSpoilagePredictor:
    def __init__(self):
        self.data_path = os.path.join(os.path.dirname(__file__), 'data')
        self.models_path = os.path.join(os.path.dirname(__file__), 'models')
        os.makedirs(self.models_path, exist_ok=True)
        
        self.spoilage_model = None
        self.classification_model = None
        self.scaler = StandardScaler()
        self.feature_columns = []
        self.label_encoders = {}
        
        # Load models if they exist
        self.load_models()
    
    def load_data(self):
        """Load processed datasets"""
        try:
            inventory_path = os.path.join(self.data_path, 'inventory_data.csv')
            reviews_path = os.path.join(self.data_path, 'customer_reviews.csv')
            
            if os.path.exists(inventory_path):
                inventory_df = pd.read_csv(inventory_path)
                inventory_df['arrival_date'] = pd.to_datetime(inventory_df['arrival_date'])
                inventory_df['expiry_date'] = pd.to_datetime(inventory_df['expiry_date'])
            else:
                # Generate data if not exists
                from .data_processor import DataProcessor
                processor = DataProcessor()
                inventory_df = processor.load_sample_data()
                reviews_df = processor.generate_customer_feedback()
                processor.save_processed_data(inventory_df, reviews_df)
            
            if os.path.exists(reviews_path):
                reviews_df = pd.read_csv(reviews_path)
            else:
                from .data_processor import DataProcessor
                processor = DataProcessor()
                reviews_df = processor.generate_customer_feedback()
            
            return inventory_df, reviews_df
        except Exception as e:
            print(f"Error loading data: {e}")
            return None, None
    
    def analyze_customer_sentiment(self, reviews_df):
        """Analyze customer reviews using NLP"""
        sentiment_scores = []
        
        for _, review in reviews_df.iterrows():
            try:
                blob = TextBlob(review['review_text'])
                sentiment_score = blob.sentiment.polarity
                sentiment_scores.append({
                    'product_id': review['product_id'],
                    'sentiment_score': sentiment_score,
                    'rating': review['rating']
                })
            except:
                sentiment_scores.append({
                    'product_id': review['product_id'],
                    'sentiment_score': 0,
                    'rating': review['rating']
                })
        
        sentiment_df = pd.DataFrame(sentiment_scores)
        
        # Aggregate sentiment by product
        product_sentiment = sentiment_df.groupby('product_id').agg({
            'sentiment_score': 'mean',
            'rating': 'mean'
        }).reset_index()
        
        return product_sentiment
    
    def prepare_features(self, inventory_df, sentiment_df=None):
        """Prepare features for ML training"""
        df = inventory_df.copy()
        
        # Add sentiment data if available
        if sentiment_df is not None:
            df = df.merge(sentiment_df, on='product_id', how='left', suffixes=('', '_sentiment'))
            df['sentiment_score'] = df['sentiment_score'].fillna(0)
            df['rating_sentiment'] = df['rating'].fillna(df['feedback_score'])
        else:
            df['sentiment_score'] = 0
            df['rating_sentiment'] = df['feedback_score']
        
        # Feature engineering
        df['shelf_life_total'] = (df['expiry_date'] - df['arrival_date']).dt.days
        df['shelf_life_remaining_ratio'] = df['days_to_expiry'] / (df['shelf_life_total'] + 1)
        df['temperature_risk'] = np.where(df['category'].isin(['dairy', 'meat']), 
                                        abs(df['temperature'] - 4), 
                                        abs(df['temperature'] - 20))
        df['humidity_risk'] = abs(df['humidity'] - 65) / 65
        df['feedback_risk'] = (5 - df['feedback_score']) / 4
        df['sentiment_risk'] = (1 - (df['sentiment_score'] + 1) / 2)  # Convert -1,1 to 1,0
        
        # Category encoding
        category_dummies = pd.get_dummies(df['category'], prefix='cat')
        df = pd.concat([df, category_dummies], axis=1)
        
        # Select features
        feature_cols = [
            'days_since_arrival', 'days_to_expiry', 'temperature', 'humidity',
            'quantity', 'price', 'shelf_life_remaining_ratio', 'temperature_risk',
            'humidity_risk', 'feedback_risk', 'sentiment_risk', 'feedback_count'
        ]
        
        # Add category dummies
        feature_cols.extend([col for col in df.columns if col.startswith('cat_')])
        
        self.feature_columns = feature_cols
        return df[feature_cols], df['spoilage_risk'], df['is_spoiled']
    
    def train_models(self):
        """Train ML models on the dataset"""
        print("🤖 Loading and preparing data...")
        inventory_df, reviews_df = self.load_data()
        
        if inventory_df is None:
            print("❌ Failed to load data")
            return False
        
        # Analyze sentiment
        print("🔍 Analyzing customer sentiment...")
        sentiment_df = self.analyze_customer_sentiment(reviews_df)
        
        # Prepare features
        print("⚙️ Preparing features...")
        X, y_regression, y_classification = self.prepare_features(inventory_df, sentiment_df)
        
        # Split data
        X_train, X_test, y_reg_train, y_reg_test, y_clf_train, y_clf_test = train_test_split(
            X, y_regression, y_classification, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train regression model (spoilage percentage)
        print("🎯 Training spoilage prediction model...")
        self.spoilage_model = RandomForestRegressor(
            n_estimators=100, 
            max_depth=10, 
            random_state=42,
            n_jobs=-1
        )
        self.spoilage_model.fit(X_train_scaled, y_reg_train)
        
        # Train classification model (spoiled yes/no)
        print("🎯 Training spoilage classification model...")
        self.classification_model = RandomForestClassifier(
            n_estimators=100, 
            max_depth=10, 
            random_state=42,
            n_jobs=-1
        )
        self.classification_model.fit(X_train_scaled, y_clf_train)
        
        # Evaluate models
        reg_pred = self.spoilage_model.predict(X_test_scaled)
        clf_pred = self.classification_model.predict(X_test_scaled)
        
        reg_score = mean_squared_error(y_reg_test, reg_pred) ** 0.5
        clf_score = accuracy_score(y_clf_test, clf_pred)
        
        print(f"✅ Regression RMSE: {reg_score:.2f}")
        print(f"✅ Classification Accuracy: {clf_score:.2f}")
        
        # Save models
        self.save_models()
        
        return True
    
    def save_models(self):
        """Save trained models"""
        try:
            joblib.dump(self.spoilage_model, os.path.join(self.models_path, 'spoilage_model.pkl'))
            joblib.dump(self.classification_model, os.path.join(self.models_path, 'classification_model.pkl'))
            joblib.dump(self.scaler, os.path.join(self.models_path, 'scaler.pkl'))
            
            # Save metadata
            metadata = {
                'feature_columns': self.feature_columns,
                'trained_at': datetime.now().isoformat(),
                'model_version': '2.0.0'
            }
            
            with open(os.path.join(self.models_path, 'model_metadata.json'), 'w') as f:
                json.dump(metadata, f, indent=2)
            
            print("✅ Models saved successfully")
            return True
        except Exception as e:
            print(f"❌ Error saving models: {e}")
            return False
    
    def load_models(self):
        """Load trained models"""
        try:
            spoilage_path = os.path.join(self.models_path, 'spoilage_model.pkl')
            classification_path = os.path.join(self.models_path, 'classification_model.pkl')
            scaler_path = os.path.join(self.models_path, 'scaler.pkl')
            metadata_path = os.path.join(self.models_path, 'model_metadata.json')
            
            if all(os.path.exists(p) for p in [spoilage_path, classification_path, scaler_path]):
                self.spoilage_model = joblib.load(spoilage_path)
                self.classification_model = joblib.load(classification_path)
                self.scaler = joblib.load(scaler_path)
                
                if os.path.exists(metadata_path):
                    with open(metadata_path, 'r') as f:
                        metadata = json.load(f)
                        self.feature_columns = metadata.get('feature_columns', [])
                
                print("✅ Models loaded successfully")
                return True
        except Exception as e:
            print(f"⚠️ Could not load models: {e}")
        
        return False
    
    def predict_product_spoilage(self, product_data):
        """Predict spoilage for a single product"""
        if not self.spoilage_model or not self.classification_model:
            print("⚠️ Models not loaded, training new models...")
            if not self.train_models():
                return self.fallback_prediction(product_data)
        
        try:
            # Prepare features
            features = self.extract_features(product_data)
            features_scaled = self.scaler.transform([features])
            
            # Make predictions
            spoilage_percentage = self.spoilage_model.predict(features_scaled)[0]
            spoilage_probability = self.classification_model.predict_proba(features_scaled)[0][1]
            
            # Calculate confidence
            confidence = max(spoilage_probability, 1 - spoilage_probability)
            
            # Generate recommendations
            recommendations = self.generate_recommendations(spoilage_percentage, product_data)
            
            return {
                'spoilage_risk': max(0, min(100, spoilage_percentage)),
                'spoilage_probability': spoilage_probability,
                'confidence': confidence * 100,
                'days_until_critical': self.calculate_days_until_critical(spoilage_percentage),
                'recommendations': recommendations,
                'predicted_at': datetime.now().isoformat(),
                'model_version': '2.0.0'
            }
            
        except Exception as e:
            print(f"Prediction error: {e}")
            return self.fallback_prediction(product_data)
    
    def extract_features(self, product_data):
        """Extract features from product data"""
        # Calculate time-based features
        now = datetime.now()
        arrival_date = datetime.fromisoformat(product_data.get('dates', {}).get('received', now.isoformat()))
        expiry_date = datetime.fromisoformat(product_data.get('dates', {}).get('expiry', (now + timedelta(days=7)).isoformat()))
        
        days_since_arrival = (now - arrival_date).days
        days_to_expiry = (expiry_date - now).days
        shelf_life_total = (expiry_date - arrival_date).days
        shelf_life_remaining_ratio = days_to_expiry / max(1, shelf_life_total)
        
        # Environmental features
        temperature = product_data.get('storage', {}).get('temperature', 4)
        humidity = product_data.get('storage', {}).get('humidity', 65)
        
        # Product features
        quantity = product_data.get('quantity', 1)
        price = product_data.get('price', {}).get('current', 0)
        category = product_data.get('category', 'dairy')
        
        # Risk calculations
        temp_optimal = 4 if category in ['dairy', 'meat'] else 20
        temperature_risk = abs(temperature - temp_optimal)
        humidity_risk = abs(humidity - 65) / 65
        
        # Feedback features (mock for now)
        feedback_score = 4.0  # Default good rating
        feedback_count = 10
        feedback_risk = (5 - feedback_score) / 4
        sentiment_risk = 0.2  # Default low sentiment risk
        
        # Base features
        features = [
            days_since_arrival, days_to_expiry, temperature, humidity,
            quantity, price, shelf_life_remaining_ratio, temperature_risk,
            humidity_risk, feedback_risk, sentiment_risk, feedback_count
        ]
        
        # Category encoding
        categories = ['bakery', 'dairy', 'frozen', 'meat', 'pantry', 'produce']
        for cat in categories:
            features.append(1 if category == cat else 0)
        
        return features
    
    def generate_recommendations(self, spoilage_risk, product_data):
        """Generate actionable recommendations"""
        recommendations = []
        
        if spoilage_risk > 80:
            recommendations.extend([
                {"action": "urgent_discount", "priority": "critical", "message": "Apply 50-70% discount immediately"},
                {"action": "donate_now", "priority": "critical", "message": "Contact NGOs for immediate pickup"},
                {"action": "staff_alert", "priority": "high", "message": "Alert staff to prioritize this product"}
            ])
        elif spoilage_risk > 60:
            recommendations.extend([
                {"action": "apply_discount", "priority": "high", "message": "Apply 25-40% discount"},
                {"action": "schedule_donation", "priority": "medium", "message": "Schedule donation pickup within 24 hours"},
                {"action": "move_to_front", "priority": "medium", "message": "Move to front of display"}
            ])
        elif spoilage_risk > 40:
            recommendations.extend([
                {"action": "monitor_closely", "priority": "medium", "message": "Monitor daily for quality changes"},
                {"action": "prepare_discount", "priority": "low", "message": "Prepare for potential discount in 1-2 days"}
            ])
        else:
            recommendations.append({
                "action": "normal_monitoring", "priority": "low", "message": "Continue normal monitoring"
            })
        
        return recommendations
    
    def calculate_days_until_critical(self, spoilage_risk):
        """Calculate days until product reaches critical spoilage level"""
        if spoilage_risk >= 80:
            return 0
        elif spoilage_risk >= 60:
            return 1
        elif spoilage_risk >= 40:
            return 2
        else:
            return max(1, int((80 - spoilage_risk) / 10))
    
    def fallback_prediction(self, product_data):
        """Fallback prediction when ML models are not available"""
        now = datetime.now()
        expiry_date = datetime.fromisoformat(product_data.get('dates', {}).get('expiry', (now + timedelta(days=7)).isoformat()))
        days_to_expiry = (expiry_date - now).days
        
        # Simple rule-based prediction
        if days_to_expiry <= 0:
            spoilage_risk = 100
        elif days_to_expiry <= 1:
            spoilage_risk = 85
        elif days_to_expiry <= 2:
            spoilage_risk = 65
        elif days_to_expiry <= 3:
            spoilage_risk = 45
        else:
            spoilage_risk = max(10, 40 - days_to_expiry * 5)
        
        return {
            'spoilage_risk': spoilage_risk,
            'spoilage_probability': spoilage_risk / 100,
            'confidence': 70,
            'days_until_critical': max(0, days_to_expiry - 1),
            'recommendations': self.generate_recommendations(spoilage_risk, product_data),
            'predicted_at': datetime.now().isoformat(),
            'model_version': 'fallback-1.0.0'
        }

if __name__ == "__main__":
    predictor = AdvancedSpoilagePredictor()
    
    # Train models
    print("🚀 Starting model training...")
    success = predictor.train_models()
    
    if success:
        print("✅ Training completed successfully!")
        
        # Test prediction
        test_product = {
            'name': 'Organic Milk 2L',
            'category': 'dairy',
            'quantity': 24,
            'price': {'current': 4.99},
            'dates': {
                'received': (datetime.now() - timedelta(days=2)).isoformat(),
                'expiry': (datetime.now() + timedelta(days=1)).isoformat()
            },
            'storage': {'temperature': 6, 'humidity': 70}
        }
        
        result = predictor.predict_product_spoilage(test_product)
        print(f"\n🧪 Test Prediction:")
        print(f"Spoilage Risk: {result['spoilage_risk']:.1f}%")
        print(f"Confidence: {result['confidence']:.1f}%")
        print(f"Days Until Critical: {result['days_until_critical']}")
        print(f"Recommendations: {len(result['recommendations'])}")
    else:
        print("❌ Training failed!")
