#!/bin/bash

# Navigate to the project root directory
cd "$(dirname "$0")/.."

# Fetch the auth token using the Node.js script and store it in a variable
AUTH_TOKEN=$(node src/scripts/authTokenFetcher.js)

# Check if the command was successful
if [ $? -eq 0 ]; then
  # Export the token as an environment variable
  export AUTH_TOKEN
  echo "Auth token set successfully"
else
  echo "Failed to fetch the auth token"
fi
