echo "🔑 Setting up SSH authentication..."
mkdir -p ~/.ssh
echo "${SSH_PRIVATE_KEY}" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

echo "🚀 Adding SSH host to known_hosts..."
ssh-keyscan -p 2222 -H "${VPS_IP}" >> ~/.ssh/known_hosts

echo "🚀 Connecting to VPS on port 2222..."
ssh -v -i ~/.ssh/id_rsa -p 2222 -o StrictHostKeyChecking=no "lelinh781@36.50.26.31" "echo '✅ SSH Connection Successful!'"

if [ $? -ne 0 ]; then
  echo "❌ SSH Connection Failed!"
  exit 1
fi

# **Step 1: Build Affected Apps**
echo "🏗 Building affected applications..."
APPS=$(npx nx show projects --affected --type=app)

if [ -z "$APPS" ]; then
  echo "✅ No affected apps to deploy. Exiting..."
  exit 0
fi

for app in $APPS; do
  echo "🚀 Building $app..."
  npx nx build $app --prod
done

# **Step 2: Copy Built Files to VPS (New Deployment Path)**
DEPLOY_DIR="/home/lelinh781/application/mcrmichael"
SSH_CMD="ssh -i ~/.ssh/id_rsa -p 2222 lelinh781@36.50.26.31"
echo "📦 Copying built files to VPS..."
rsync -avz -e "ssh -i ~/.ssh/id_rsa -p 2222" dist/apps/ lelinh781@36.50.26.31:/home/lelinh781/application/mcrmichael/


echo "🚀 Stopping apps..."
if $SSH_CMD "cd /home/lelinh781/application/mcrmichael && ./stop-apps.sh"; then
    echo "✅ Apps stopped successfully"
else
    echo "❌ Failed to stop apps"
    exit 1
fi

echo "🚀 Starting apps..."
if $SSH_CMD "cd /home/lelinh781/application/mcrmichael && ./start.sh"; then
    echo "✅ Apps started successfully"
else
    echo "❌ Failed to start apps"
    exit 1
fi

echo "🎉 Deployment completed successfully!"

echo "🎉 Deployment completed!"








