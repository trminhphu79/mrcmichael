#!/bin/bash

echo "🔑 Setting up SSH authentication..."
mkdir -p ~/.ssh
echo "${SSH_PRIVATE_KEY}" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

echo "🚀 Adding SSH host to known_hosts..."
ssh-keyscan -p 2222 -H "${VPS_IP}" >> ~/.ssh/known_hosts

echo "🚀 Connecting to VPS on port 2222..."
ssh -v -i ~/.ssh/id_rsa -p 2222 -o StrictHostKeyChecking=no "${VPS_USER}@${VPS_IP}" "echo '✅ SSH Connection Successful!'"

if [ $? -ne 0 ]; then
  echo "❌ SSH Connection Failed!"
  exit 1
fi