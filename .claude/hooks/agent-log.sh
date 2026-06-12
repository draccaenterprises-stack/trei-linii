#!/bin/bash
# Trimite un log către agent-factory pentru agentul curent.
# Utilizare: bash .claude/hooks/agent-log.sh <nume-agent> <mesaj>
#
# Subagentul nu cunoaște id-ul numeric generat de server pentru stația lui,
# așa că îl căutăm: cel mai recent agent "working" cu numele dat din proiectul 3linii.
# Iese mereu cu 0 — log-ul e best-effort, nu blochează munca.

NAME="$1"; shift
MSG="$*"
SERVER="${AGENT_FACTORY_URL:-http://localhost:3001}"

[ -z "$NAME" ] || [ -z "$MSG" ] && exit 0

ID=$(curl -s -m 3 "$SERVER/agents?project=3linii" | node -e '
let d = "";
process.stdin.on("data", (c) => (d += c)).on("end", () => {
  try {
    const a = JSON.parse(d).agents
      .filter((x) => x.name === process.argv[1] && x.status === "working")
      .pop();
    console.log(a ? a.id : "");
  } catch {}
});' "$NAME" 2>/dev/null)

[ -z "$ID" ] && exit 0

node -e 'console.log(JSON.stringify({ agent_id: Number(process.argv[1]), message: process.argv[2] }))' "$ID" "$MSG" \
  | curl -s -m 3 -X POST "$SERVER/log" -H 'Content-Type: application/json' -d @- >/dev/null 2>&1

exit 0
