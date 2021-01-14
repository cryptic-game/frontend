#!/usr/bin/env sh

if [ -n "$API_URL" ]; then
  jq -cn --arg api_url "$API_URL" '{url: $api_url}' > /usr/share/nginx/html/assets/api.json
fi
