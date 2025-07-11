import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import os
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_squared_error, accuracy_score
import pickle
import warnings
warnings.filterwarnings('ignore')

class FreshTrackExcelProcessor:
    def __init__(self):
        self.data_path = os.path.join(os.path.dirname(__file__), 'data')
        self.scaler = StandardScaler()
        self.label_encoders = {}
        
    def load_freshtrack_excel_files(self):
        """Load all FreshTrack Excel files"""
        datasets = {}
        
        # Define expected FreshTrack files
        expected_files = {
            'inventory': 'FreshTrack_Inventory.xlsx',
            'environment': 'FreshTrack_Environment.xlsx', 
            'spoilage_log': 'FreshTrack_SpoilageLog.xlsx',
            'feedback': 'FreshTrack_Feedback.xlsx',
            'donations': 'FreshTrack_Donations.xlsx',
            'action_log': 'FreshTrack_ActionLog.xlsx'
        }
        
        print(f"🔍 Loading FreshTrack Excel files from: {self.data_path}")
        
        if not os.path.exists(self.data_path):
            print(f"❌ Data folder not found: {self.data_path}")
            return None
            
        # Load each expected file
        for file_type, filename in expected_files.items():
            file_path = os.path.join(self.data_path, filename)
            try:
                if os.path.exists(file_path):
                    df = pd.read_excel(file_path)
                    datasets[file_type] = df
                    print(f"✅ Loaded {filename}: {len(df)} rows, {len(df.columns)} columns")
                    print(f"   Columns: {list(df.columns)}")
                else:
                    print(f"⚠️ File not found: {filename}")
            except Exception as e:
                print(f"❌ Error loading {filename}: {e}")
        
        return datasets if datasets else None
    
    def merge_freshtrack_data(self, datasets):
        """Merge FreshTrack datasets into comprehensive training data"""
        print("🔗 Merging FreshTrack datasets...")
        
        # Start with inventory as base
        main_df = datasets['inventory'].copy()
        print(f"📦 Base inventory: {len(main_df)} products")
        
        # Add environment data (store averages)
        if 'environment' in datasets:
            env_df = datasets['environment'].copy()
            # Calculate store averages
            env_avg = env_df.groupby('store_id').agg({
                'avg_temp_C': 'mean',
                'humidity_percent': 'mean'
            }).round(2).reset_index()
            env_avg.columns = ['store_id', 'avg_temperature', 'avg_humidity']
            
            main_df = main_df.merge(env_avg, on='store_id', how='left')
            print(f"🌡️ Added environment data for {len(env_avg)} stores")
        
        # Add spoilage information
        if 'spoilage_log' in datasets:
            spoilage_df = datasets['spoilage_log'].copy()
            # Convert spoilage status to numeric
            spoilage_df['is_spoiled'] = (spoilage_df['spoilage_status'] == 'Yes').astype(int)
            spoilage_df['spoilage_risk'] = spoilage_df['predicted_spoilage_window'] * 15  # Convert to percentage
            
            main_df = main_df.merge(
                spoilage_df[['batch_id', 'is_spoiled', 'spoilage_risk', 'predicted_spoilage_window']], 
                on='batch_id', 
                how='left'
            )
            print(f"🦠 Added spoilage data: {spoilage_df['is_spoiled'].sum()} spoiled items")
        
        # Add feedback sentiment
        if 'feedback' in datasets:
            feedback_df = datasets['feedback'].copy()
            # Calculate product feedback averages
            feedback_agg = feedback_df.groupby('product_id').agg({
                'rating': 'mean',
                'freshness_flag': 'mean',
                'review_text': 'count'
            }).round(2).reset_index()
            feedback_agg.columns = ['product_id', 'avg_rating', 'freshness_score', 'review_count']
            
            main_df = main_df.merge(feedback_agg, on='product_id', how='left')
            print(f"💬 Added feedback data: {len(feedback_agg)} products with reviews")
        
        # Add donation history
        if 'donations' in datasets:
            donations_df = datasets['donations'].copy()
            donation_counts = donations_df.groupby('product_id').agg({
                'quantity': 'sum',
                'donation_id': 'count'
            }).reset_index()
            donation_counts.columns = ['product_id', 'total_donated', 'donation_count']
            
            main_df = main_df.merge(donation_counts, on='product_id', how='left')
            print(f"❤️ Added donation data: {len(donation_counts)} products donated")
        
        # Add action history
        if 'action_log' in datasets:
            actions_df = datasets['action_log'].copy()
            action_counts = actions_df.groupby('batch_id').agg({
                'action_type': lambda x: x.value_counts().index[0] if len(x) > 0 else 'none',
                'action_id': 'count'
            }).reset_index()
            action_counts.columns = ['batch_id', 'last_action_type', 'action_count']
            
            main_df = main_df.merge(action_counts, on='batch_id', how='left')
            print(f"⚡ Added action data: {len(action_counts)} batches with actions")
        
        # Fill missing values
        main_df = self.fill_missing_values(main_df)
        
        print(f"✅ Final merged dataset: {len(main_df)} rows, {len(main_df.columns)} columns")
        return main_df
    
    def fill_missing_values(self, df):
        """Fill missing values with appropriate defaults"""
        # Environmental defaults
        df['avg_temperature'] = df['avg_temperature'].fillna(6.0)
        df['avg_humidity'] = df['avg_humidity'].fillna(65.0)
        
        # Spoilage defaults
        df['is_spoiled'] = df['is_spoiled'].fillna(0)
        df['spoilage_risk'] = df['spoilage_risk'].fillna(30.0)
        df['predicted_spoilage_window'] = df['predicted_spoilage_window'].fillna(5)
        
        # Feedback defaults
        df['avg_rating'] = df['avg_rating'].fillna(4.0)
        df['freshness_score'] = df['freshness_score'].fillna(0.8)
        df['review_count'] = df['review_count'].fillna(0)
        
        # Donation defaults
        df['total_donated'] = df['total_donated'].fillna(0)
        df['donation_count'] = df['donation_count'].fillna(0)
        
        # Action defaults
        df['last_action_type'] = df['last_action_type'].fillna('none')
        df['action_count'] = df['action_count'].fillna(0)
        
        return df
    
    def engineer_freshtrack_features(self, df):
        """Engineer features specific to FreshTrack data structure"""
        print("⚙️ Engineering FreshTrack-specific features...")
        
        # Convert dates
        df['arrival_date'] = pd.to_datetime(df['arrival_date'])
        df['expiry_date'] = pd.to_datetime(df['expiry_date'])
        
        # Time-based features
        now = pd.Timestamp.now()
        df['days_since_arrival'] = (now - df['arrival_date']).dt.days
        df['days_to_expiry'] = (df['expiry_date'] - now).dt.days
        df['shelf_life_total'] = (df['expiry_date'] - df['arrival_date']).dt.days
        df['shelf_life_remaining_ratio'] = df['days_to_expiry'] / (df['shelf_life_total'] + 1)
        
        # Category-based features
        category_risk_map = {
            'Dairy': 2.0, 'Bakery': 2.0, 'Produce': 3.0, 
            'Meat': 4.0, 'Frozen': 1.0
        }
        df['category_risk_factor'] = df['category'].map(category_risk_map).fillna(2.0)
        
        # Environmental risk
        df['temp_risk'] = abs(df['avg_temperature'] - 6.0)  # Optimal temp around 6°C
        df['humidity_risk'] = abs(df['avg_humidity'] - 65.0) / 65.0
        
        # Stock and demand features
        df['stock_level'] = df['current_stock']
        df['stock_risk'] = np.where(df['current_stock'] > 100, 1.2, 1.0)  # High stock = higher risk
        
        # Feedback-based risk
        df['feedback_risk'] = (5 - df['avg_rating']) / 4.0
        df['freshness_risk'] = 1 - df['freshness_score']
        
        # Historical patterns
        df['donation_tendency'] = df['donation_count'] / (df['donation_count'] + 1)
        df['action_frequency'] = df['action_count'] / (df['days_since_arrival'] + 1)
        
        # Enhanced spoilage risk calculation
        df['calculated_spoilage_risk'] = self.calculate_enhanced_spoilage_risk(df)
        
        # Use actual spoilage risk if available, otherwise use calculated
        df['final_spoilage_risk'] = df['spoilage_risk'].fillna(df['calculated_spoilage_risk'])
        
        print(f"✅ Feature engineering complete. Dataset shape: {df.shape}")
        return df
    
    def calculate_enhanced_spoilage_risk(self, df):
        """Calculate enhanced spoilage risk using FreshTrack logic"""
        risk = np.zeros(len(df))
        
        # Base time risk (most important)
        days_to_expiry = df['days_to_expiry'].fillna(5)
        risk += np.where(days_to_expiry <= 0, 100,
                np.where(days_to_expiry <= 1, 85,
                np.where(days_to_expiry <= 2, 65,
                np.where(days_to_expiry <= 3, 45,
                np.maximum(10, 60 - days_to_expiry * 8)))))
        
        # Category sensitivity (from your original logic)
        risk += df['category_risk_factor'] * 10
        
        # Environmental factors
        risk += df['temp_risk'] * 3
        risk += df['humidity_risk'] * 15
        
        # Stock pressure
        risk += df['stock_risk'] * 5
        
        # Feedback influence
        risk += df['feedback_risk'] * 10
        risk += df['freshness_risk'] * 15
        
        # Historical patterns
        risk += df['action_frequency'] * 20  # Frequent actions indicate problems
        
        # Add some realistic variance
        risk += np.random.normal(0, 3, len(df))
        
        return np.clip(risk, 0, 100)
    
    def prepare_ml_features(self, df):
        """Prepare features for ML training"""
        # Select numerical features
        feature_columns = [
            'days_since_arrival', 'days_to_expiry', 'shelf_life_total', 
            'shelf_life_remaining_ratio', 'avg_temperature', 'avg_humidity',
            'temp_risk', 'humidity_risk', 'stock_level', 'stock_risk',
            'avg_rating', 'freshness_score', 'review_count', 'feedback_risk',
            'freshness_risk', 'total_donated', 'donation_count', 
            'donation_tendency', 'action_count', 'action_frequency',
            'category_risk_factor'
        ]
        
        # Add category dummies
        category_dummies = pd.get_dummies(df['category'], prefix='cat')
        df = pd.concat([df, category_dummies], axis=1)
        feature_columns.extend(category_dummies.columns.tolist())
        
        # Add store dummies
        store_dummies = pd.get_dummies(df['store_id'], prefix='store')
        df = pd.concat([df, store_dummies], axis=1)
        feature_columns.extend(store_dummies.columns.tolist())
        
        # Add action type dummies
        action_dummies = pd.get_dummies(df['last_action_type'], prefix='action')
        df = pd.concat([df, action_dummies], axis=1)
        feature_columns.extend(action_dummies.columns.tolist())
        
        # Ensure all feature columns exist
        for col in feature_columns:
            if col not in df.columns:
                df[col] = 0
        
        X = df[feature_columns].fillna(0)
        y_regression = df['final_spoilage_risk']
        y_classification = df['is_spoiled']
        
        return X, y_regression, y_classification, feature_columns
    
    def process_freshtrack_data(self):
        """Main function to process FreshTrack Excel files"""
        print("🚀 Processing FreshTrack Excel datasets...")
        
        # Load Excel files
        datasets = self.load_freshtrack_excel_files()
        if not datasets:
            print("❌ No FreshTrack datasets found")
            return None, None, None, None, None
        
        # Merge datasets
        merged_df = self.merge_freshtrack_data(datasets)
        
        # Engineer features
        processed_df = self.engineer_freshtrack_features(merged_df)
        
        # Prepare ML features
        X, y_regression, y_classification, feature_columns = self.prepare_ml_features(processed_df)
        
        print(f"✅ FreshTrack data processing complete!")
        print(f"   Products processed: {len(processed_df)}")
        print(f"   Features for ML: {len(feature_columns)}")
        print(f"   Average spoilage risk: {y_regression.mean():.1f}%")
        print(f"   Spoiled products: {y_classification.sum()} ({y_classification.mean()*100:.1f}%)")
        
        # Display category breakdown
        print(f"\n📊 Category Breakdown:")
        category_stats = processed_df.groupby('category').agg({
            'final_spoilage_risk': 'mean',
            'is_spoiled': 'sum',
            'product_id': 'count'
        }).round(2)
        category_stats.columns = ['Avg_Risk_%', 'Spoiled_Count', 'Total_Products']
        print(category_stats)
        
        # Display store breakdown
        print(f"\n🏪 Store Breakdown:")
        store_stats = processed_df.groupby('store_id').agg({
            'final_spoilage_risk': 'mean',
            'avg_temperature': 'mean',
            'avg_humidity': 'mean',
            'product_id': 'count'
        }).round(2)
        store_stats.columns = ['Avg_Risk_%', 'Avg_Temp_C', 'Avg_Humidity_%', 'Total_Products']
        print(store_stats)
        
        return X, y_regression, y_classification, feature_columns, processed_df

if __name__ == "__main__":
    processor = FreshTrackExcelProcessor()
    result = processor.process_freshtrack_data()
    
    if result[0] is not None:
        X, y_reg, y_clf, features, df = result
        print(f"\n📈 Processing Summary:")
        print(f"   Dataset shape: {df.shape}")
        print(f"   Features: {len(features)}")
        print(f"   High-risk products (>70%): {sum(y_reg > 70)} ({sum(y_reg > 70)/len(y_reg)*100:.1f}%)")
        print(f"   Critical products (>85%): {sum(y_reg > 85)} ({sum(y_reg > 85)/len(y_reg)*100:.1f}%)")
        
        # Save processed data
        output_path = os.path.join(processor.data_path, 'processed_freshtrack_data.csv')
        df.to_csv(output_path, index=False)
        print(f"💾 Processed data saved to: {output_path}")
    else:
        print("❌ FreshTrack data processing failed")
