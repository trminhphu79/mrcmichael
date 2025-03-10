#!/bin/bash

# Kill any existing http-server processes
pkill -f http-server
echo "Cleaned up existing processes"

# Function to start server and verify
start_server() {
    local app_name=$1
    local port=$2
    local dir=$3
    
    echo "Starting $app_name from directory: $dir"
    
    # Check if directory exists
    if [ ! -d "$dir" ]; then
        echo "❌ Directory $dir not found!"
        return 1
    fi
    
    # Navigate to directory and start server
    cd "$dir"
    echo "Current directory: $(pwd)"
    
    # Start server with no-cache headers
    http-server ./ \
        --cors \
        -a 0.0.0.0 \
        --port "$port" \
        -P "http://localhost:$port?" \
        --no-cache \
        --no-dotfiles \
        -c-1 \
        --proxy http://localhost:$port? \
        --headers '{"Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0", "Pragma": "no-cache", "Expires": "0"}' &
    
    # Wait a moment and verify
    sleep 2
    if netstat -tuln | grep ":$port "; then
        echo "✅ $app_name started successfully on port $port"
    else
        echo "❌ Failed to start $app_name on port $port"
    fi
    
    cd ..
}

# Get absolute path of script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "Script running from: $SCRIPT_DIR"

# Clear browser cache directory if it exists (optional)
echo "Clearing browser cache directories..."
rm -rf ~/.cache/google-chrome/Default/Cache/*
rm -rf ~/.cache/mozilla/firefox/*.default/cache2/*

# Start each application
start_server "Shell" 4200 "$SCRIPT_DIR/shell"
start_server "Blog" 4201 "$SCRIPT_DIR/blog"
start_server "Angular" 4204 "$SCRIPT_DIR/angular"
start_server "Admin" 4203 "$SCRIPT_DIR/admin"

# Display running processes
echo -e "\nRunning http-server processes:"
ps aux | grep http-server

# Display listening ports
echo -e "\nListening ports:"
netstat -tuln | grep -E '420[0-3]'

# Test endpoints
echo -e "\nTesting endpoints and headers..."
for port in 4200 4201 4204 4203; do
    echo "Testing port $port..."
    curl -I "http://localhost:$port" 2>/dev/null || echo "Failed to connect to port $port"
done

echo -e "\nAll applications should be running!"
echo "Access URLs:"
echo "- Shell: http://localhost:4200"
echo "- Blog: http://localhost:4201"
echo "- Angular: http://localhost:4204"
echo "- Admin: http://localhost:4203"

# Add a cleanup function for Ctrl+C
cleanup() {
    echo -e "\nStopping all servers..."
    pkill -f http-server
    exit 0
}

# Register the cleanup function
trap cleanup SIGINT SIGTERM

echo -e "\nPress Ctrl+C to stop all servers"
wait