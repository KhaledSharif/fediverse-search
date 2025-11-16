#!/bin/bash

# Build the project
echo "Building project..."
npm run build

# Check if build succeeded
if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo ""
echo "Running search..."
echo ""

# Run the built application with all passed arguments
node dist/index.js "$@"
