#!/bin/bash

# QUICK TEST GUIDE - Wibufy Backend API
# Test dengan Episode ID 178650 (Mushoku Tensei Season 3)

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                  QUICK TEST - STREAMING API ENDPOINTS                        ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

BASE_URL="http://localhost:3000/api/v1"
ANIME_ID="mushoku-tensei-jobless-reincarnation-season-3-9142"
EPISODE_ID="178650"
FULL_ID="${ANIME_ID}::ep=${EPISODE_ID}"

echo "🔍 Test 1: Search Anime"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE_URL}/search?keyword=mushoku" | jq '.data.response[0:3] | .[] | {title, id, episodes}'
echo ""

echo "📺 Test 2: Anime Detail"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE_URL}/anime/${ANIME_ID}" | jq '.data | {title, id, episodes, status, MAL_score}'
echo ""

echo "🎬 Test 3: Get Available Servers (Episode 178650)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE_URL}/servers?id=${FULL_ID}" | jq '.data | {episode, sub_count: (.sub | length), dub_count: (.dub | length), sub: .sub[0:2]}'
echo ""

echo "🎥 Test 4: Get Stream URL (HD-1, SUB)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE_URL}/stream?id=${FULL_ID}&server=HD-1&type=sub" | jq '.data | {episode_id, server, stream: {master_m3u8: .stream.master_m3u8, headers: .stream.headers}}'
echo ""

echo "🎥 Test 5: Get Stream URL (HD-2, SUB)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE_URL}/stream?id=${FULL_ID}&server=HD-2&type=sub" | jq '.data.stream.master_m3u8'
echo ""

echo "🎥 Test 6: Get Stream URL (HD-1, DUB)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE_URL}/stream?id=${FULL_ID}&server=HD-1&type=dub" | jq '.data.stream.master_m3u8'
echo ""

echo "✅ All tests completed!"
echo ""
echo "📖 For full documentation, see:"
echo "   - FINAL_SUMMARY.md"
echo "   - STREAMING_API_DOCUMENTATION.md"
echo "   - EXAMPLE_STREAM_RESPONSE.json"
