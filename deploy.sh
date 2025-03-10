#!/bin/bash

echo "🔍 Getting affected applications..."
apps=$(npx nx show projects --affected --type=app)

if [ -z "$apps" ]; then
  echo "✅ No affected apps to deploy. Exiting..."
  exit 0
fi

VPS_USER="${VPS_USER:-root}"
VPS_IP="${VPS_IP:-1ss}"
DEPLOY_DIR="/var/www/html"

echo "🔑 Setting up SSH authentication..."
mkdir -p ~/.ssh
echo "${SSH_PRIVATE_KEY}" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
ssh-keyscan -H "$VPS_IP" >> ~/.ssh/known_hosts

echo "🚀 Starting deployment process..."

for app in $apps; do
  echo "🚧 Building $app..."
  npx nx build $app --prod & # Run build in parallel

  if [ $? -ne 0 ]; then
    echo "❌ Build failed for $app. Skipping deployment..."
    continue
  fi

  echo "📦 Deploying $app to VPS..."
  rsync -avz --progress dist/apps/$app "$VPS_USER@$VPS_IP:$DEPLOY_DIR/$app"

  if [ $? -eq 0 ]; then
    echo "✅ Successfully deployed $app!"
  else
    echo "❌ Deployment failed for $app!"
  fi
done

wait 
echo "🎉 Deployment process completed!"