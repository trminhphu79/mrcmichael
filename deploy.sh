#!/bin/bash

echo "🔑 Setting up SSH authentication..."
mkdir -p ~/.ssh
echo "${SSH_PRIVATE_KEY}" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

# Add VPS IP to known_hosts with port 2222
ssh-keyscan -p 2222 -H "${VPS_IP}" >> ~/.ssh/known_hosts

echo "🚀 Connecting to VPS on port 2222..."
ssh -p 2222 -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no "${VPS_USER}@${VPS_IP}" "echo '✅ SSH Connection Successful!'"

if [ $? -ne 0 ]; then
  echo "❌ SSH Connection Failed!"
  exit 1
fi

# Deploy the application
echo "📦 Deploying application..."
scp -P 2222 -r dist/apps/my-app "${VPS_USER}@${VPS_IP}:/var/www/html/my-app"

if [ $? -eq 0 ]; then
  echo "✅ Deployment Successful!"
else
  echo "❌ Deployment Failed!"
  exit 1
fi