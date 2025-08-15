🍎 FreshTrack: Predictive Food Waste & Donation Assistant
FreshTrack is a smart, AI-powered platform designed to help retailers combat food waste by predicting spoilage and facilitating timely intervention. By leveraging machine learning and real-time data, the system recommends optimal actions like discounting, stock rotation, or donation, turning potential waste into social and business value. The project was developed as part of the Walmart Sparkathon 2025.

🎯 Problem Statement
Retailers globally face significant financial losses and environmental burden due to avoidable food waste. Much of this food is still edible, but is discarded because there's a lack of a streamlined system for timely intervention or donation. FreshTrack bridges this gap by providing predictive insights and automated processes to minimize waste and fight hunger.

💡 Core Solution
An intelligent, role-based platform that tracks inventory shelf life in real time. FreshTrack uses machine learning to forecast spoilage and provides actionable recommendations to minimize waste, boost community aid, and generate ESG insights for stakeholders.

🛠 Key Features

Inventory Dashboard: Provides real-time monitoring of all products, highlighting items that require immediate attention with color-coded urgency alerts.
ML Prediction Engine: Uses machine learning models trained on historical data (expiry dates, storage temperatures, sales velocity) to forecast the likelihood of spoilage.
NLP Feedback Miner: Analyzes customer reviews and return reasons using natural language processing to identify potential freshness issues not visible in inventory data.
Donation Integrator: Automatically matches soon-to-expire, edible food with nearby NGOs and food banks based on location and capacity via a simple API.
Notification Engine: Sends timely alerts to managers and staff, prioritizing actions based on the urgency of each case.

🚀 Tech Stack
Frontend: React.js for dynamic UI with role-based views (Manager, Staff, NGO), and Redux/Context API for state management.
Backend: Node.js and Express.js for API endpoints, role-based routing, and ML integrations.
Database: MongoDB for user and action logs.
AI/ML: Natural (NLP) for sentiment analysis and a rule-based ML system for spoilage prediction and donation mapping.
Data: A managed, retail-specific dataset of over 3,000 perishable product entries, including metadata on expiry, storage, and simulated environmental conditions.
