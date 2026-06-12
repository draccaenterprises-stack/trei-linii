#!/bin/bash
# Cere lansarea unui agent nou în agent-factory (semnal vizual + cerere).
# Utilizare: bash .claude/hooks/agent-spawn.sh <agent-părinte> <agent-nou> <task> <motiv>
#
# Creează în DB o stație nouă "idle" legată de părinte. Lansarea EFECTIVĂ a
# subagentului rămâne la orchestrator (prin Task tool) — când acesta îl pornește,
# hook-ul agent-status.js refolosește stația idle creată aici.
# Iese mereu cu 0 — best-effort.

PARENT_NAME="$1"
CHILD_NAME="$2"
TASK="$3"
REASON="$4"
SERVER="${AGENT_FACTORY_URL:-http://localhost:3001}"

[ -z "$PARENT_NAME" ] || [ -z "$CHILD_NAME" ] && exit 0

PARENT_ID=$(curl -s -m 3 "$SERVER/agents?project=3linii" | node -e '
let d = "";
process.stdin.on("data", (c) => (d += c)).on("end", () => {
  try {
    const a = JSON.parse(d).agents
      .filter((x) => x.name === process.argv[1] && x.status === "working")
      .pop();
    console.log(a ? a.id : "");
  } catch {}
});' "$PARENT_NAME" 2>/dev/null)

node -e '
const [parentId, name, task, reason] = process.argv.slice(1);
const body = { name, project: "3linii", task, reason };
if (parentId) body.parent_agent_id = Number(parentId);
console.log(JSON.stringify(body));' "$PARENT_ID" "$CHILD_NAME" "$TASK" "$REASON" \
  | curl -s -m 3 -X POST "$SERVER/spawn" -H 'Content-Type: application/json' -d @- >/dev/null 2>&1

exit 0
