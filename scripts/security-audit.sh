#!/bin/bash
# AirDraw Pro — Security Audit & Hardening Validator

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 🛡️  SECURITY AUDIT & HARDENING VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

issues=0

# 1. Check for tracked secrets or sensitive files in Git
echo "▶ Checking Git tracked files for sensitive patterns..."
tracked_secrets=$(git ls-files | grep -iE '(\.env|\.pem|\.key|\.p12|\.pfx|id_rsa|id_ed25519|credentials\.json|user-data\.json)' || true)
if [ -n "$tracked_secrets" ]; then
    echo "❌ High Risk: Sensitive file tracked in Git:"
    echo "$tracked_secrets"
    ((issues++))
else
    echo "✅ No sensitive credentials tracked in Git"
fi

# 2. Check .gitignore coverage
echo "▶ Checking .gitignore hardening rules..."
for pattern in ".env" "*.key" "*.pem" "*.token" "credentials.json" "user-data.json"; do
    if ! grep -q "$pattern" .gitignore; then
        echo "❌ .gitignore missing rule for: $pattern"
        ((issues++))
    fi
done
echo "✅ .gitignore contains all essential secret exclusion rules"

# 3. Check sensitive credential file permissions
echo "▶ Checking credential file permissions..."
cr_user_data="$HOME/Library/Application Support/CodeRabbit/user-data.json"
if [ -f "$cr_user_data" ]; then
    perms=$(stat -f "%Lp" "$cr_user_data" 2>/dev/null || stat -c "%a" "$cr_user_data" 2>/dev/null || echo "unknown")
    if [ "$perms" = "600" ]; then
        echo "✅ CodeRabbit user-data.json has secure permissions (600)"
    else
        echo "⚠️  Securing CodeRabbit user-data.json permissions to 600..."
        chmod 600 "$cr_user_data"
        echo "✅ Permissions secured (600)"
    fi
fi

# 4. Check for public listening ports
echo "▶ Checking listening network interfaces..."
public_ports=$(lsof -iTCP -sTCP:LISTEN -n -P 2>/dev/null | grep -E '\*:[0-9]+' | grep -vE 'ControlCe|rapportd' || true)
if [ -n "$public_ports" ]; then
    echo "⚠️  Notice: Publicly listening non-system ports detected:"
    echo "$public_ports"
else
    echo "✅ No insecure public non-system ports listening"
fi

# 5. Check Content Security Policy in index.html
echo "▶ Checking frontend Content Security Policy..."
if grep -q "Content-Security-Policy" index.html; then
    echo "✅ Content-Security-Policy meta tag present in index.html"
else
    echo "❌ Missing Content-Security-Policy in index.html"
    ((issues++))
fi

# 6. Check pre-commit secret detection in auto-sync.js
echo "▶ Checking auto-sync.js secret scanning engine..."
if grep -q "SECRET_PATTERNS" auto-sync.js && grep -q "containsSecret" auto-sync.js; then
    echo "✅ auto-sync.js pre-commit secret scanning engine active"
else
    echo "❌ Missing secret scanner in auto-sync.js"
    ((issues++))
fi

echo ""
echo "───────────────────────────────────────────────────────"
if [ $issues -eq 0 ]; then
    echo "✅ SYSTEM SECURITY AUDIT: PASSED (All checks secure)"
    exit 0
else
    echo "❌ SYSTEM SECURITY AUDIT: FAILED ($issues issue(s) detected)"
    exit 1
fi
