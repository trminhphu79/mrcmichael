#!/bin/bash

echo "🔑 Setting up SSH authentication..."
mkdir -p ~/.ssh
echo "${SSH_PRIVATE_KEY}" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

# Add VPS IP to known_hosts to prevent SSH prompt
ssh-keyscan -H "${VPS_IP}" >> ~/.ssh/known_hosts

echo "🚀 Connecting to VPS..."
ssh -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no "${VPS_USER}@${VPS_IP}" "echo '✅ SSH Connection Successful!'"

if [ $? -ne 0 ]; then
  echo "❌ SSH Connection Failed!"
  exit 1
fi