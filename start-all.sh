#!/bin/bash

# Startup script for attendance system with email functionality
echo "🚀 Starting Attendance System with Email..."
echo "This will start both backend email server and frontend app"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the main project directory"
    exit 1
fi

echo "1️⃣ Starting Backend Email Server..."
cd email-backend
node server.js &
BACKEND_PID=$!
cd ..

echo "2️⃣ Starting Frontend App..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers starting..."
echo "📧 Backend Email Server: http://localhost:3001"
echo "🖥️  Frontend App: http://localhost:5193"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait