#!/bin/bash

# NepFit - Push to GitHub Script
# Run this script to push the code to your GitHub repository

echo "🚀 Pushing NepFit to GitHub..."
echo ""

# Set the remote URL (you can change this if needed)
REPO_URL="https://github.com/izzzthisssagar/nepfit.git"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the nepfit project directory"
    exit 1
fi

# Configure git if needed
git config user.email "illuminatitechpvtltd@gmail.com" 2>/dev/null
git config user.name "ILLUUMINATI_TECH" 2>/dev/null

# Set the remote
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"

# Push to GitHub
echo "📤 Pushing to $REPO_URL"
echo ""
echo "You may be prompted for your GitHub credentials."
echo "Use a Personal Access Token (PAT) as the password."
echo ""

git push -u origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🔗 View your repository at: https://github.com/izzzthisssagar/nepfit"
else
    echo ""
    echo "❌ Push failed. Please check your credentials."
    echo ""
    echo "To create a Personal Access Token:"
    echo "1. Go to https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Give it 'repo' permissions"
    echo "4. Copy the token and use it as password"
fi
