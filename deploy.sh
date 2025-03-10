#!/bin/bash

echo "🔍 Getting affected applications..."
apps=$(npx nx show projects --affected)

if [ -z "$apps" ]; then
  echo "✅ No affected apps to deploy. Exiting..."
  exit 0
fi

for app in $apps; do
  echo "🚀 Building $app..."
  npx nx build $app --prod

  if [ $? -ne 0 ]; then
    echo "❌ Build failed for $app. Exiting..."
    exit 1
  fi

  echo "📦 Deploying $app to VPS..."
  scp -r dist/apps/$app user@your-vps-ip:/var/www/html/$app

  if [ $? -eq 0 ]; then
    echo "✅ Successfully deployed $app!"
  else
    echo "❌ Deployment failed for $app!"
  fi
done

echo "🎉 Deployment complete!"