# 🔧 Node.js Version Fix Guide

## **Current Issue**
- **Your Node.js**: v12.22.12 ❌
- **Required**: v14+ (v18 LTS recommended) ✅
- **Problem**: Modern JavaScript features not supported

## **Quick Fix Commands**

### **Option 1: Using nvm (Recommended)**
```bash
# Install nvm (if not installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or reload profile
source ~/.zshrc

# Install and use Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# Verify
node --version  # Should show v18.x.x
```

### **Option 2: Using Homebrew**
```bash
# Update Homebrew
brew update

# Install Node.js 18 LTS
brew install node@18

# Link it
brew link node@18 --force

# Verify
node --version
```

## **After Updating Node.js**

### **1. Reinstall Dependencies**
```bash
cd /Users/piotrkowalczyk/Client's\ projects/mini-team-project/shopcartyt
rm -rf node_modules package-lock.json
npm install
```

### **2. Test the Scripts**
```bash
# Test category import
npx tsx scripts/import-grabie-categories.ts

# Test products import
npx tsx scripts/import-products-from-json.ts

# Test build
npm run build
```

### **3. Verify Everything Works**
```bash
# Start development server
npm run dev
```

## **Why This Happened**
- **Modern JavaScript**: Optional chaining (`?.`) was added in Node.js 14
- **tsx/esbuild**: Requires Node.js 14+ for proper compilation
- **Next.js**: Your project likely needs Node.js 14+ features

## **Benefits of Updating**
- ✅ All modern JavaScript features work
- ✅ Better performance and security
- ✅ Latest npm features
- ✅ Compatible with all your project dependencies

## **Troubleshooting**

### **If nvm command not found:**
1. Install nvm first: https://github.com/nvm-sh/nvm#installing-and-updating
2. Restart your terminal
3. Try again

### **If Homebrew not available:**
1. Install Homebrew: https://brew.sh/
2. Or download Node.js directly from: https://nodejs.org/

### **If still having issues:**
1. Check your shell profile: `echo $SHELL`
2. For zsh users: Add to `~/.zshrc`
3. For bash users: Add to `~/.bashrc`

## **Next Steps After Update**
1. ✅ Update Node.js to v18+
2. ✅ Reinstall project dependencies
3. ✅ Run the category/product import scripts
4. ✅ Test the development server
5. ✅ Update Sanity categories
6. ✅ Verify everything displays correctly
