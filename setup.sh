#!/bin/bash

# PEAR React Native Clean Architecture Setup Script

echo "🌱 Setting up PEAR - Eco Cleaning Platform (Clean Architecture)"
echo "=============================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if Expo CLI is installed
if ! command -v expo &> /dev/null; then
    echo "📦 Installing Expo CLI..."
    npm install -g @expo/cli
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Setting up TypeScript configuration..."
# TypeScript config is already created

echo "🎨 Setting up project structure..."
# Project structure is already created

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development server:"
echo "   npm start"
echo ""
echo "📱 To run on device/simulator:"
echo "   npm run ios     # iOS"
echo "   npm run android # Android"
echo ""
echo "🧪 Demo accounts available:"
echo "   admin / admin123 (Admin)"
echo "   testuser / password123 (Trash Hero)"
echo "   volunteer / volunteer123 (Impact Warrior)"
echo "   jjmoore254 / business123 (Eco Defender)"
echo ""
echo "📚 Check README.md for more information"
echo ""
echo "Happy coding! 🌱"
