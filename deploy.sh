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

# **Step 3: Restart PM2 Services for Affected Apps**
echo "🔄 Restarting services for affected apps..."

# Create a temporary script to restart only affected services
RESTART_SCRIPT=$(cat <<EOF
#!/bin/bash
cd $DEPLOY_DIR

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Function to restart or create PM2 service
restart_service() {
    local app=\$1
    local port=\$2
    
    echo "Restarting \$app on port \$port..."
    
    # Check if service exists
    if pm2 list | grep -q "\$app"; then
        # Restart existing service
        pm2 restart \$app
    else
        # Create new service
        pm2 serve ./\$app \$port --spa --name "\$app"
    fi
}

# Map app names to ports
EOF
)

# Add restart commands for each affected app
for app in $APPS; do
  case $app in
    "shell")
      RESTART_SCRIPT+="restart_service shell 4200\n"
      ;;
    "blog")
      RESTART_SCRIPT+="restart_service blog 4201\n"
      ;;
    "angular")
      RESTART_SCRIPT+="restart_service angular 4204\n"
      ;;
    "admin")
      RESTART_SCRIPT+="restart_service admin 4203\n"
      ;;
  esac
done

RESTART_SCRIPT+="
# Save PM2 configuration
pm2 save

# List running services
pm2 list

echo '✅ Services restarted successfully!'
"

# Execute the restart script on the VPS
echo "Executing restart script on VPS..."
if $SSH_CMD "echo '$RESTART_SCRIPT' > $DEPLOY_DIR/restart-affected.sh && chmod +x $DEPLOY_DIR/restart-affected.sh && $DEPLOY_DIR/restart-affected.sh"; then
    echo "✅ Services restarted successfully"
else
    echo "❌ Failed to restart services"
    exit 1
fi

echo "🎉 Deployment completed successfully!"

echo "🎉 Deployment completed!"








