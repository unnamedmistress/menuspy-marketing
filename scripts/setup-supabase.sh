#!/bin/bash
# Supabase Setup Script for PermitPath

set -e

echo "🚀 Setting up Supabase for PermitPath..."

# Check for required env vars
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo "❌ Error: SUPABASE_ACCESS_TOKEN is required"
  echo "Get it from: https://supabase.com/dashboard/account/tokens"
  exit 1
fi

if [ -z "$GITHUB_CLIENT_ID" ] || [ -z "$GITHUB_SECRET" ]; then
  echo "⚠️  Warning: GitHub OAuth credentials not set"
  echo "Set GITHUB_CLIENT_ID and GITHUB_SECRET for OAuth login"
fi

# Login to Supabase
npx supabase login --token "$SUPABASE_ACCESS_TOKEN"

# Link to project (or create new one)
if [ -z "$SUPABASE_PROJECT_ID" ]; then
  echo "📝 Creating new Supabase project..."
  read -p "Enter project name: " PROJECT_NAME
  read -p "Enter database password: " -s DB_PASSWORD
  echo
  
  # Create project via API
  PROJECT=$(curl -s -X POST \
    "https://api.supabase.com/v1/projects" \
    -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"$PROJECT_NAME\",
      \"region\": \"us-east-1\",
      \"db_pass\": \"$DB_PASSWORD\"
    }")
  
  PROJECT_ID=$(echo "$PROJECT" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
  echo "✅ Project created: $PROJECT_ID"
else
  PROJECT_ID="$SUPABASE_PROJECT_ID"
fi

# Link local project
echo "🔗 Linking local project to $PROJECT_ID..."
npx supabase link --project-ref "$PROJECT_ID"

# Push migrations
echo "📤 Pushing database schema..."
npx supabase db push

# Get project URL and keys
echo "🔑 Getting project credentials..."
PROJECT_DETAILS=$(curl -s \
  "https://api.supabase.com/v1/projects/$PROJECT_ID" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN")

PROJECT_URL=$(echo "$PROJECT_DETAILS" | grep -o '"api_url":"[^"]*"' | cut -d'"' -f4)
ANON_KEY=$(curl -s \
  "https://api.supabase.com/v1/projects/$PROJECT_ID/api-keys" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" | \
  grep -o '"api_key":"[^"]*"' | head -1 | cut -d'"' -f4)

# Update .env file
echo "📝 Updating environment variables..."
cat > permitpath-simple/.env << EOF
VITE_SUPABASE_URL=$PROJECT_URL
VITE_SUPABASE_ANON_KEY=$ANON_KEY
VITE_APP_ENV=production
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Project Details:"
echo "   URL: $PROJECT_URL"
echo "   Add these to your Vercel/Netlify environment variables:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo "   - OPENAI_API_KEY"
echo ""
echo "🔗 Dashboard: https://supabase.com/dashboard/project/$PROJECT_ID"