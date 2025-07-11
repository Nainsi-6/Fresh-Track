import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_squared_error, accuracy_score
import pickle
import warnings
warnings.filterwarnings('ignore')

class DataProcessor:
    def __init__(self):
        self.data_path = os.path.join(os.path.dirname(__file__), 'data')
        self.scaler = StandardScaler()
        self.label_encoders = {}
        
    def load_sample_data(self):
        """Generate comprehensive sample dataset based on real grocery patterns"""
        np.random.seed(42)
        
        # Product categories with realistic spoilage patterns
        categories = {
            'dairy': {'base_life': 7, 'temp_sensitivity': 0.8, 'humidity_sensitivity': 0.6},
            'meat': {'base_life': 5, 'temp_sensitivity': 0.9, 'humidity_sensitivity': 0.4},
            'produce': {'base_life': 10, 'temp_sensitivity': 0.7, 'humidity_sensitivity': 0.8},
            'bakery': {'base_life': 3, 'temp_sensitivity': 0.5, 'humidity_sensitivity': 0.7},
            'frozen': {'base_life': 90, 'temp_sensitivity': 0.95, 'humidity_sensitivity': 0.1},
            'pantry': {'base_life': 365, 'temp_sensitivity': 0.2, 'humidity_sensitivity': 0.3}
        }
        
        # Generate 2000 product records
        n_samples = 2000
        data = []
        
        for i in range(n_samples):
            category = np.random.choice(list(categories.keys()))
            cat_info = categories[category]
            
            # Basic product info
            product_id = f"PROD_{i+1:04d}"
            batch_id = f"BATCH_{np.random.randint(1000, 9999)}"
            
            # Dates
            arrival_date = datetime.now() - timedelta(days=np.random.randint(0, 30))
            base_shelf_life = cat_info['base_life'] + np.random.randint(-2, 3)
            expiry_date = arrival_date + timedelta(days=base_shelf_life)
            
            # Environmental conditions
            temperature = np.random.normal(4, 2) if category in ['dairy', 'meat'] else np.random.normal(20, 5)
            humidity = np.random.normal(65, 10)
            
            # Product characteristics
            quantity = np.random.randint(10, 200)
            price = np.random.uniform(1.99, 49.99)
            
            # Calculate spoilage factors
            days_since_arrival = (datetime.now() - arrival_date).days
            days_to_expiry = (expiry_date - datetime.now()).days
            
            # Temperature impact
            temp_optimal = 4 if category in ['dairy', 'meat'] else 20
            temp_deviation = abs(temperature - temp_optimal)
            temp_impact = temp_deviation * cat_info['temp_sensitivity']
            
            # Humidity impact
            humidity_optimal = 65
            humidity_deviation = abs(humidity - humidity_optimal)
            humidity_impact = humidity_deviation * cat_info['humidity_sensitivity'] * 0.01
            
            # Customer feedback simulation
            feedback_score = np.random.uniform(1, 5)
            feedback_count = np.random.randint(0, 50)
            
            # Calculate spoilage probability
            base_spoilage = max(0, (days_since_arrival / base_shelf_life) * 100)
            spoilage_risk = min(100, base_spoilage + temp_impact + humidity_impact + 
                              (5 - feedback_score) * 5 + np.random.normal(0, 5))
            
            # Determine actual spoilage status
            spoilage_threshold = 70 + np.random.normal(0, 10)
            is_spoiled = 1 if spoilage_risk > spoilage_threshold else 0
            
            # Store information
            store_id = f"STORE_{np.random.randint(1, 10):03d}"
            
            data.append({
                'product_id': product_id,
                'batch_id': batch_id,
                'category': category,
                'arrival_date': arrival_date.isoformat(),
                'expiry_date': expiry_date.isoformat(),
                'temperature': round(temperature, 2),
                'humidity': round(humidity, 2),
                'quantity': quantity,
                'price': round(price, 2),
                'days_since_arrival': days_since_arrival,
                'days_to_expiry': days_to_expiry,
                'feedback_score': round(feedback_score, 2),
                'feedback_count': feedback_count,
                'spoilage_risk': round(spoilage_risk, 2),
                'is_spoiled': is_spoiled,
                'store_id': store_id
            })
        
        return pd.DataFrame(data)
    
    def generate_customer_feedback(self, n_reviews=500):
        """Generate realistic customer feedback data"""
        np.random.seed(42)
        
        positive_reviews = [
            "Fresh and delicious!", "Great quality product", "Very satisfied with freshness",
            "Perfect condition", "Excellent taste", "Will buy again", "Fresh as expected",
            "Good quality for the price", "Arrived in perfect condition", "Highly recommend"
        ]
        
        negative_reviews = [
            "Product was already spoiled", "Expired before date", "Poor quality",
            "Smelled bad when opened", "Not fresh at all", "Waste of money",
            "Moldy when I got home", "Terrible condition", "Already going bad",
            "Quality has declined", "Spoiled quickly", "Not worth the price"
        ]
        
        neutral_reviews = [
            "Average quality", "Okay for the price", "Nothing special",
            "Standard product", "Could be better", "Acceptable quality",
            "Fair condition", "As expected", "Regular quality", "Decent product"
        ]
        
        reviews = []
        for i in range(n_reviews):
            rating = np.random.choice([1, 2, 3, 4, 5], p=[0.1, 0.1, 0.2, 0.3, 0.3])
            
            if rating >= 4:
                review_text = np.random.choice(positive_reviews)
                sentiment = 'positive'
            elif rating <= 2:
                review_text = np.random.choice(negative_reviews)
                sentiment = 'negative'
            else:
                review_text = np.random.choice(neutral_reviews)
                sentiment = 'neutral'
            
            reviews.append({
                'review_id': f"REV_{i+1:04d}",
                'product_id': f"PROD_{np.random.randint(1, 2001):04d}",
                'rating': rating,
                'review_text': review_text,
                'sentiment': sentiment,
                'date': (datetime.now() - timedelta(days=np.random.randint(0, 90))).isoformat()
            })
        
        return pd.DataFrame(reviews)
    
    def prepare_training_data(self):
        """Prepare data for ML training"""
        # Load main dataset
        df = self.load_sample_data()
        
        # Feature engineering
        df['arrival_date'] = pd.to_datetime(df['arrival_date'])
        df['expiry_date'] = pd.to_datetime(df['expiry_date'])
        
        # Create additional features
        df['shelf_life_total'] = (df['expiry_date'] - df['arrival_date']).dt.days
        df['shelf_life_remaining_ratio'] = df['days_to_expiry'] / df['shelf_life_total']
        df['temperature_deviation'] = abs(df['temperature'] - df['temperature'].mean())
        df['humidity_deviation'] = abs(df['humidity'] - df['humidity'].mean())
        df['price_per_unit'] = df['price'] / df['quantity']
        
        # Encode categorical variables
        categorical_features = ['category', 'store_id']
        for feature in categorical_features:
            le = LabelEncoder()
            df[f'{feature}_encoded'] = le.fit_transform(df[feature])
            self.label_encoders[feature] = le
        
        # Select features for training
        feature_columns = [
            'days_since_arrival', 'days_to_expiry', 'temperature', 'humidity',
            'quantity', 'price', 'shelf_life_total', 'shelf_life_remaining_ratio',
            'temperature_deviation', 'humidity_deviation', 'price_per_unit',
            'feedback_score', 'feedback_count', 'category_encoded', 'store_id_encoded'
        ]
        
        X = df[feature_columns]
        y_regression = df['spoilage_risk']  # For predicting spoilage percentage
        y_classification = df['is_spoiled']  # For predicting spoilage yes/no
        
        return X, y_regression, y_classification, feature_columns, df
    
    def save_processed_data(self, df, reviews_df):
        """Save processed data to files"""
        os.makedirs(self.data_path, exist_ok=True)
        
        # Save main dataset
        df.to_csv(os.path.join(self.data_path, 'inventory_data.csv'), index=False)
        
        # Save reviews dataset
        reviews_df.to_csv(os.path.join(self.data_path, 'customer_reviews.csv'), index=False)
        
        # Save label encoders
        with open(os.path.join(self.data_path, 'label_encoders.pkl'), 'wb') as f:
            pickle.dump(self.label_encoders, f)
        
        print(f"✅ Saved {len(df)} inventory records and {len(reviews_df)} reviews")
        return True

if __name__ == "__main__":
    processor = DataProcessor()
    
    # Generate datasets
    print("🔄 Generating inventory dataset...")
    inventory_df = processor.load_sample_data()
    
    print("🔄 Generating customer reviews...")
    reviews_df = processor.generate_customer_feedback()
    
    # Save data
    processor.save_processed_data(inventory_df, reviews_df)
    
    print("✅ Data processing complete!")
