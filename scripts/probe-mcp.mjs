// probe-mcp.mjs — Minimal dependency-free MCP stdio client probe.
// Usage: node probe-mcp.mjs <exe> [args...]   (GH_PAT env is forwarded if set)
// Proves: initialize -> notifications/initialized -> tools/list
// Exit codes: 0 = fully working, 3 = init OK but tools failed, 2 = no/late response
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';

const [, , exe, ...args] = process.argv;
if (!exe) {
  console.error('usage: node probe-mcp.mjs <exe> [args...]');
  process.exit(2);
}
const t0 = Date.now();
const log = (m) => console.log(`[${Math.round((Date.now() - t0) / 1000)}s] ${m}`);

const env = { ...process.env };
if (process.env.GH_PAT) env.GITHUB_PERSONAL_ACCESS_TOKEN = process.env.GH_PAT;

const child = spawn(exe, args, { stdio: ['pipe', 'pipe', 'pipe'], env });
child.on('error', (e) => { log(`SPAWN_ERROR: ${e.message}`); process.exit(2); });

// Drain stderr (avoid pipe-buffer deadlock); keep the first lines for diagnosis.
let errHead = [];
child.stderr.on('data', (d) => {
  if (errHead.length < 5) errHead.push(String(d).trim().slice(0, 160));
});

const rl = createInterface({ input: child.stdout });

child.stdin.write(JSON.stringify({
  jsonrpc: '2.0', id: 1, method: 'initialize',
  params: {
    protocolVersion: '2024-11-05', capabilities: {},
    clientInfo: { name: 'cline-probe', version: '1.0' }
  }
}) + '\n');

rl.on('line', (line) => {
  let msg;
  try { msg = JSON.parse(line); } catch { log(`RAW_NONJSON: ${line.slice(0, 120)}`); return; }
  if (msg.error) { log(`RPC_ERROR id=${msg.id}: ${JSON.stringify(msg.error).slice(0, 200)}`); }
  if (msg.id === 1 && msg.result) {
    log(`INIT_OK server=${msg.result.serverInfo?.name} v${msg.result.serverInfo?.version}`);
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }) + '\n');
  } else if (msg.id === 2 && msg.result) {
    const tools = (msg.result.tools || []).map(t => t.name);
    log(`TOOLS_OK count=${tools.length}`);
    log(`SAMPLE: ${tools.slice(0, 8).join(', ')}`);
    console.log('PROBE_RESULT: FULLY_WORKING');
    child.kill();
    process.exit(0);
  }
});

const TIMEOUT_MS = 150000;
setTimeout(() => {
  log(`TIMEOUT after ${TIMEOUT_MS / 1000}s exited=${child.hasExited() === undefined ? child.exitCode : child.exitCode}`);
  if (errHead.length) log(`STDERR_HEAD: ${errHead.join(' | ')}`);
  console.log('PROBE_RESULT: NO_RESPONSE');
  child.kill();
  process.exit(2);
}, TIMEOUT_MS);