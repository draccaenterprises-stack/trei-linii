#!/usr/bin/env node
/**
 * Hook Claude Code → agent-factory (localhost:3001).
 *
 * Folosit ca PreToolUse/PostToolUse cu matcher "Task":
 *   node agent-status.js start   — la lansarea unui subagent: POST /status "working"
 *   node agent-status.js stop    — la finalul subagentului:   POST /status "done"
 *
 * Claude Code nu are un hook "SubagentStart"; interceptăm în schimb apelul
 * Task tool-ului din sesiunea principală, care conține subagent_type și
 * description — suficient pentru name + current_task.
 *
 * Serverul agent-factory își generează singur id-urile (INTEGER AUTOINCREMENT),
 * deci nu putem impune un id de forma "nume+timestamp". În schimb: la start
 * salvăm id-ul returnat de server într-un fișier de mapare per sesiune
 * (FIFO per tip de agent), iar la stop îl consumăm pentru POST-ul "done".
 *
 * Orice eroare (server oprit etc.) iese cu cod 0 — monitorizarea nu trebuie
 * să blocheze niciodată munca agenților.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const SERVER = process.env.AGENT_FACTORY_URL || 'http://localhost:3001';
const PROJECT = '3linii';
const phase = process.argv[2]; // "start" | "stop"

const DEBUG = '/tmp/agent-hook-debug.log';
const dbg = (msg) => {
  try { fs.appendFileSync(DEBUG, `[${phase}] ${msg}\n`); } catch {}
};

let input = '';
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', async () => {
  try {
    dbg(`input: ${input.slice(0, 300)}`);
    const hook = JSON.parse(input);
    // Tool-ul de subagenți se numește "Task" în versiunile mai vechi de
    // Claude Code și "Agent" în cele recente (2.1.x) — acceptăm ambele.
    if (hook.tool_name !== 'Task' && hook.tool_name !== 'Agent')
      return dbg(`skip: tool_name=${hook.tool_name}`);

    const name = hook.tool_input?.subagent_type || 'unknown-agent';
    const task =
      hook.tool_input?.description ||
      (hook.tool_input?.prompt || '').slice(0, 120) ||
      'task nedetaliat';
    const mapFile = path.join(
      os.tmpdir(),
      `agent-factory-${hook.session_id || 'default'}.json`
    );
    const map = fs.existsSync(mapFile)
      ? JSON.parse(fs.readFileSync(mapFile, 'utf8'))
      : {};

    if (phase === 'start') {
      // Dacă există deja o stație idle cu același nume (anunțată prin /spawn),
      // o refolosim ca să păstrăm legătura părinte-copil de pe factory floor.
      const body = { project: PROJECT, name, status: 'working', current_task: task };
      try {
        const res = await fetch(`${SERVER}/agents?project=${PROJECT}`);
        const { agents } = await res.json();
        const idle = agents.filter((a) => a.name === name && a.status === 'idle').pop();
        if (idle) body.agent_id = idle.id;
      } catch {}

      const res = await fetch(`${SERVER}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      dbg(`start response: ${JSON.stringify(data).slice(0, 200)}`);
      if (data.agent?.id != null) {
        (map[name] ||= []).push(data.agent.id);
        fs.writeFileSync(mapFile, JSON.stringify(map));
      }
    } else if (phase === 'stop') {
      const ids = map[name] || [];
      const agentId = ids.shift(); // FIFO: primul pornit, primul terminat
      fs.writeFileSync(mapFile, JSON.stringify(map));
      if (agentId != null) {
        await fetch(`${SERVER}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agent_id: agentId, status: 'done' }),
        });
      }
    }
  } catch (err) {
    // niciodată nu blocăm Claude Code din cauza monitorizării
    dbg(`error: ${err?.message}`);
  }
});
