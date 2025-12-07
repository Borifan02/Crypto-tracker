# MongoDB Setup for Vercel Deployment

## 1. Create MongoDB Atlas Account
- Go to https://www.mongodb.com/cloud/atlas
- Sign up for free account
- Create a new cluster (free tier)

## 2. Get Connection String
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string
- Replace `<password>` with your database password

## 3. Add to Vercel
- Go to your Vercel project settings
- Navigate to "Environment Variables"
- Add: `MONGODB_URI` = `your_connection_string`
- Redeploy your project

## 4. Local Development
- Create `.env` file in root directory
- Add: `MONGODB_URI=your_connection_string`
- Run: `npm install` in backend folder
- Run: `npm start`
