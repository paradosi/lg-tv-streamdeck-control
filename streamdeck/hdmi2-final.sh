#!/bin/bash
export NODE_TLS_REJECT_UNAUTHORIZED=0
cd "$(dirname "$0")/.."
/opt/homebrew/bin/node scripts/switch-only.js HDMI_2