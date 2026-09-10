#!/bin/bash
# Script to get cf_clearance cookie from hianime.dk

echo "🔍 Fetching cookies from hianime.dk..."
echo ""

# Make request and save cookies
curl -c cookies.txt -L -A "Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36" "https://hianime.dk" > /dev/null 2>&1

echo "📋 Cookies saved to cookies.txt"
echo ""

# Try to find cf_clearance
if grep -q "cf_clearance" cookies.txt; then
    echo "✅ Found cf_clearance cookie:"
    echo ""
    grep "cf_clearance" cookies.txt | awk '{print "Cookie Value: " $7}'
    echo ""
    echo "⚠️  Note: This might not work if Cloudflare requires JavaScript challenge"
    echo "   If value looks wrong, use browser method instead"
else
    echo "❌ cf_clearance cookie not found"
    echo ""
    echo "This means Cloudflare is showing JavaScript challenge."
    echo "You need to use a browser method (Kiwi/Firefox) instead."
fi

echo ""
echo "Full cookie file content:"
cat cookies.txt
