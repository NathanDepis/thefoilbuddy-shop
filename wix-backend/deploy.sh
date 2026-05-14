#!/usr/bin/env bash
# Wix Velo deploy helper for classic Editor sites.
#
# Wix doesn't expose a programmatic deploy path for Velo backend code on
# classic Editor sites (only Wix Studio has CLI/GitHub push). So we automate
# everything except the literal Cmd+V + click "Publish" inside the editor.
#
# Usage: ./wix-backend/deploy.sh
#
# Requires macOS (uses pbcopy, open, osascript). For Linux, swap pbcopy for
# xclip and osascript for notify-send.

set -euo pipefail

SITE_ID="44b2951f-1b4a-4649-8986-dd295c5a5ca7"
SECRET="687e1ad74d0df5eb292e0849f569e2f984b4525f10429800c91ee7ba837c0b27"
SECRET_NAME="PASCALOU_BACKEND_SECRET"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HTTP_FN_FILE="${SCRIPT_DIR}/http-functions.js"

EDITOR_URL="https://editor.wix.com/html/editor/web/renderer/edit/${SITE_ID}"
SECRETS_URL="https://manage.wix.com/dashboard/${SITE_ID}/secrets-manager"
PING_URL="https://thefoilbuddy.wixsite.com/the-foil-buddy/_functions/ping"
INV_URL="https://thefoilbuddy.wixsite.com/the-foil-buddy/_functions/invoices?limit=2"

notify() {
  local title="$1" msg="$2"
  osascript -e "display notification \"${msg}\" with title \"${title}\" sound name \"Pop\"" 2>/dev/null || true
}

hr() { printf '\n──────────────────────────────────────────────────────────────\n'; }

if [[ ! -f "$HTTP_FN_FILE" ]]; then
  echo "ERROR: $HTTP_FN_FILE not found" >&2
  exit 1
fi

hr
echo "STEP 1/3 — copy Velo code to clipboard, open Wix Editor"
echo "  • Code source: $HTTP_FN_FILE"
echo "  • Once the editor opens, enable Dev Mode (if not already)"
echo "  • Open backend/http-functions.js in the file tree"
echo "  • Cmd+A then Cmd+V to replace the whole file"
echo "  • Click 'Publish' (top right)"
pbcopy < "$HTTP_FN_FILE"
open "$EDITOR_URL"
notify "Wix deploy 1/3" "Code copié — colle dans backend/http-functions.js puis Publish"
read -rp "Appuie sur Entrée quand t'as collé + publié → "

hr
echo "STEP 2/3 — copy secret to clipboard, open Secrets Manager"
echo "  • In the page that opens, click '+ Add Secret'"
echo "  • Name:  ${SECRET_NAME}"
echo "  • Value: <paste with Cmd+V>"
echo "  • Save"
printf "%s" "$SECRET" | pbcopy
open "$SECRETS_URL"
notify "Wix deploy 2/3" "Secret copié — Add Secret, nom: ${SECRET_NAME}"
read -rp "Appuie sur Entrée quand t'as ajouté le secret → "

# Best effort: wipe the secret from the clipboard so it doesn't linger.
printf "" | pbcopy

hr
echo "STEP 3/3 — running tests"

echo
echo "▸ GET $PING_URL"
echo "  expecting: 200 {\"ok\":true,\"ts\":\"...\"}"
echo
curl -s -i -m 15 "$PING_URL" | sed -n '1,20p'

echo
echo "▸ GET $INV_URL  (auth)"
echo "  expecting: 200 with {invoices:[...]} array of up to 2 items"
echo
curl -s -i -m 15 -H "Authorization: Bearer $SECRET" "$INV_URL" | sed -n '1,40p'

hr
notify "Wix deploy" "Tests terminés — regarde le terminal"
echo "Done."
