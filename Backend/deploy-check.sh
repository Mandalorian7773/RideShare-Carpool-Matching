#!/bin/bash

echo "Checking deployment readiness..."

# Check if required files exist
REQUIRED_FILES=(
    "Dockerfile"
    "package.json"
    "tsconfig.json"
    "src/app.ts"
    "src/modules/rides/ride.controller.ts"
    "src/modules/rides/ride.service.ts"
    "src/modules/rides/ride.repository.ts"
    "src/modules/rides/ride.routes.ts"
    "src/plugins/jwt.ts"
    "src/plugins/websocket.ts"
    "src/plugins/fcm.ts"
    "src/services/database.service.ts"
    "database/init.sql"
)

MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
        echo "❌ Missing file: $file"
    else
        echo "✅ Found file: $file"
    fi
done

# Check if build script exists and is executable
if [ ! -f "build.sh" ]; then
    echo "❌ Missing build script"
    MISSING_FILES+=("build.sh")
else
    if [ ! -x "build.sh" ]; then
        echo "❌ Build script is not executable"
        MISSING_FILES+=("build.sh (not executable)")
    else
        echo "✅ Build script is executable"
    fi
fi

# Check if start script exists and is executable
if [ ! -f "start.sh" ]; then
    echo "❌ Missing start script"
    MISSING_FILES+=("start.sh")
else
    if [ ! -x "start.sh" ]; then
        echo "❌ Start script is not executable"
        MISSING_FILES+=("start.sh (not executable)")
    else
        echo "✅ Start script is executable"
    fi
fi

# Check if production environment file exists
if [ ! -f ".env.production" ]; then
    echo "❌ Missing production environment file"
    MISSING_FILES+=(".env.production")
else
    echo "✅ Production environment file exists"
fi

# Report results
if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    echo ""
    echo "🎉 All deployment files are in place!"
    echo "✅ Application is ready for deployment"
    exit 0
else
    echo ""
    echo "❌ Missing ${#MISSING_FILES[@]} required files:"
    for file in "${MISSING_FILES[@]}"; do
        echo "  - $file"
    done
    echo ""
    echo "⚠️  Please fix the missing files before deploying"
    exit 1
fi