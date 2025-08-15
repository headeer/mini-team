# 🔧 Sanity Environment Setup Guide

## **🚨 CURRENT ISSUE**
```
Error: Configuration must contain `projectId`
```

This means your Sanity environment variables are missing!

## **📋 QUICK FIX**

### **Step 1: Create Environment File**
Create a file named `.env.local` in your project root with these values:

```bash
# Create the environment file
touch .env.local
```

### **Step 2: Add Your Sanity Configuration**
Add these lines to your `.env.local` file:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_WRITE_TOKEN=your_write_token
```

## **🔍 HOW TO GET YOUR VALUES**

### **1. Get Project ID**
1. Go to https://sanity.io/manage
2. Select your project
3. Copy the **Project ID** from the dashboard

### **2. Get Dataset Name**
- Usually `production` 
- Check in your Sanity dashboard under "Datasets"

### **3. Get Write Token (For Imports)**
1. Go to https://sanity.io/manage
2. Select your project
3. Go to **API** → **Tokens**
4. Click **Add API Token**
5. Name: "Import Script"
6. Permissions: **Editor** or **Admin**
7. Copy the token

## **📝 EXAMPLE .env.local**
```env
# Replace with your actual values
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123def
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_WRITE_TOKEN=skABCDEF123456789...
```

## **🚀 AFTER SETUP**

### **Test the Import Script**
```bash
npx tsx scripts/import-grabie-categories.ts
```

### **Should see:**
```
🚀 Starting Grabie categories import...
Successfully imported/updated category: Grabie
Successfully imported/updated category: Grabie 100cm • 12mm zęby
Successfully imported/updated category: Grabie 100cm • 15mm zęby
Successfully imported/updated category: Grabie 120cm • 12mm zęby
Successfully imported/updated category: Grabie 120cm • 15mm zęby
✅ Category import process completed.
```

## **🔐 SECURITY NOTES**

- ✅ `.env.local` is already in `.gitignore`
- ✅ Never commit API tokens to git
- ✅ Keep your write token secure
- ✅ You can regenerate tokens if needed

## **🆘 TROUBLESHOOTING**

### **Still getting projectId error?**
1. Check your `.env.local` file exists
2. Restart your terminal
3. Make sure no spaces around the `=` sign
4. Values should NOT be in quotes

### **Permission denied errors?**
1. Check your API token has **Editor** or **Admin** permissions
2. Make sure the token is active (not expired)

### **Wrong dataset?**
1. Check your Sanity dashboard for available datasets
2. Usually it's `production`, but could be `development`

## **✅ VERIFICATION CHECKLIST**

- [ ] `.env.local` file created
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` set
- [ ] `NEXT_PUBLIC_SANITY_DATASET` set  
- [ ] `SANITY_API_WRITE_TOKEN` set with Editor permissions
- [ ] No spaces around equals signs
- [ ] Values are your actual Sanity project values
- [ ] Terminal restarted after creating `.env.local`
