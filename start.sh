#!/bin/bash

# ANSI Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================================${NC}"
echo -e "${GREEN}         Starting ZenGuard AI (macOS)${NC}"
echo -e "${CYAN}========================================================${NC}"
echo ""

# Check if Ollama is running, if not start it
if ! curl -s http://localhost:11434 > /dev/null; then
    echo -e "${YELLOW}Starting Ollama...${NC}"
    open -a Ollama
    sleep 3
fi

# Start Backend
echo -e "${GREEN}Starting Data Privacy Engine (Backend)...${NC}"
cd backend || exit
source venv/bin/activate
python -m uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Start Frontend
echo -e "${GREEN}Starting Visual Interface (Frontend)...${NC}"
cd frontend || exit
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}All systems operational!${NC}"
echo -e "${YELLOW}Press [CTRL+C] to gracefully shut down the servers.${NC}"
echo ""

# Give it a second to boot up
sleep 3
open http://localhost:3000

# Cleanup function to kill processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down ZenGuard AI gracefully...${NC}"
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 0
}

# Trap CTRL+C
trap cleanup SIGINT SIGTERM

# Wait for background processes
wait
