# MongoDB Atlas Setup Instructions

## 1. Create MongoDB Atlas Account
- Go to https://www.mongodb.com/atlas
- Sign up with: rmt.jodhpur@gmail.com
- Password: Gunjan!@#2025

## 2. Create Free Cluster
- Choose "Build a Database" → "M0 Sandbox (Free)"
- Provider: AWS
- Region: Mumbai (ap-south-1) - closest to India
- Cluster Name: Cluster0

## 3. Database Access
- Username: rmt-jodhpur
- Password: Gunjan!@#2025
- Role: Atlas Admin

## 4. Network Access
- Add IP: 0.0.0.0/0 (Allow access from anywhere)

## 5. Connection String
Your connection string is already configured in .env.local:
```
mongodb+srv://rmt-jodhpur:Gunjan%21%40%232025@cluster0.mongodb.net/rmt_db?retryWrites=true&w=majority
```

## 6. Test Connection
Run: `npm run dev` and visit `/api/seed` to create admin user.

## Database Structure
- Database: rmt_db
- Collections: admins, products