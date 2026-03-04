#!/bin/bash
# PermitPath Implementation Monitor
# Polls subagent status and logs progress

LOG_FILE="/home/node/.openclaw/workspace/permitpath-build-monitor.log"
SESSION_KEY="agent:main:subagent:73848e8d-3e96-4856-bcde-b4aa90f4dbb0"

echo "=== PermitPath Implementation Monitor ===" >> $LOG_FILE
echo "Started: $(date)" >> $LOG_FILE
echo "" >> $LOG_FILE

while true; do
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Checking status..." >> $LOG_FILE
    
    # Check git for new commits
    cd /home/node/.openclaw/workspace/permitpath-simple 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "Latest commits:" >> $LOG_FILE
        git log --oneline -3 >> $LOG_FILE 2>/dev/null || echo "No git access" >> $LOG_FILE
        echo "" >> $LOG_FILE
    fi
    
    # Check for build status
    if [ -f "dist/index.html" ]; then
        echo "Build exists - last modified: $(stat -c %y dist/index.html 2>/dev/null || stat -f %Sm dist/index.html 2>/dev/null)" >> $LOG_FILE
    fi
    
    echo "---" >> $LOG_FILE
    
    # Poll every 2 minutes
    sleep 120
done
