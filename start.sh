#!/usr/bin/env bash
echo "==================================================="
echo "  Starting Queen Clozet Dev Server & Opening Browser"
echo "==================================================="
echo ""

if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Installing dependencies..."
  npm install
fi

echo "Starting development server..."
npm run start
