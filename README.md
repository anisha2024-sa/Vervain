<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NexusGuard ??? Autonomous Vulnerability Management</title>
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #020b14;
    --surface: #041422;
    --surface2: #071e30;
    --border: #0a3a5c;
    --accent: #00e5ff;
    --accent2: #ff3d71;
    --accent3: #00ff9d;
    --warn: #ffb300;
    --critical: #ff1744;
    --high: #ff5722;
    --medium: #ffb300;
    --low: #00e676;
    --text: #c8e6f5;
    --text-dim: #4a7c9e;
    --glow: 0 0 20px rgba(0,229,255,0.3);
    --glow-red: 0 0 20px rgba(255,61,113,0.3);
    --glow-green: 0 0 20px rgba(0,255,157,0.3);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--bg);
    font-family: 'Rajdhani', sans-serif;
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
    cursor: crosshair;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.15) 2px,
      rgba(0,0,0,0.15) 4px
    );
    pointer-events: none;
    z-index: 9999;
    opacity: 0.4;
  }

  header {
    position: relative;
    z-index: 10;
    background: linear-gradient(180deg, rgba(0,229,255,0.06) 0%, transparent 100%);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  .logo {
    font-family: 'Orbitron', monospace;
    font-size: 1.4rem;
    font-weight: 900;
    color: var(--accent);
    text-shadow: var(--glow);
    letter-spacing: 4px;
  }

  .logo span { color: var(--accent2); }

  .header-status {
    display: flex;
    align-items: center;
    gap: 2rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    color: var(--text-dim);
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent3);
    box-shadow: 0 0 8px var(--accent3);
    animation: pulse 1.5s ease-in-out infinite;
  }

  .pulse-dot.red { background: var(--critical); box-shadow: 0 0 8px var(--critical); }
  .pulse-dot.yellow { background: var(--warn); box-shadow: 0 0 8px var(--warn); }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }

  .sys-time {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    color: var(--accent);
    border: 1px solid var(--border);
    padding: 0.25rem 0.75rem;
  }

  nav {
    position: relative;
    z-index: 10;
    display: flex;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    padding: 0 2rem;
    gap: 0;
    overflow-x: auto;
  }

  nav button {
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--text-dim);
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 0.9rem 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  nav button:hover { color: var(--text); border-bottom-color: var(--border); }
  nav button.active { color: var(--accent); border-bottom-color: var(--accent); }

  main {
    position: relative;
    z-index: 1;
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .tab-panel { display: none; }
  .tab-panel.active { display: contents; }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 1.25rem;
    position: relative;
    overflow: hidden;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0.5;
  }

  .card-title {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: var(--text-dim);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .card-title::before {
    content: '??????';
    color: var(--accent);
    font-size: 0.5rem;
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  .stat-card {
    background: var(--surface2);
    border: 1px solid var(--border);
    padding: 1.25rem;
    position: relative;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.5);
  }

  .stat-card.critical { border-left: 3px solid var(--critical); }
  .stat-card.high { border-left: 3px solid var(--high); }
  .stat-card.medium { border-left: 3px solid var(--medium); }
  .stat-card.resolved { border-left: 3px solid var(--accent3); }

  .stat-label {
    font-size: 0.7rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-family: 'Orbitron', monospace;
    font-size: 2.2rem;
    font-weight: 700;
    line-height: 1;
    animation: countup 1s ease-out forwards;
  }

  .stat-card.critical .stat-value { color: var(--critical); text-shadow: 0 0 15px rgba(255,23,68,0.5); }
  .stat-card.high .stat-value { color: var(--high); }
  .stat-card.medium .stat-value { color: var(--medium); }
  .stat-card.resolved .stat-value { color: var(--accent3); text-shadow: 0 0 15px rgba(0,255,157,0.3); }

  .stat-delta {
    font-size: 0.75rem;
    margin-top: 0.4rem;
    color: var(--text-dim);
  }

  .stat-delta.up { color: var(--critical); }
  .stat-delta.down { color: var(--accent3); }

  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 380px;
    gap: 1rem;
  }

  .dashboard-grid-2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .scan-container {
    background: var(--surface2);
    border: 1px solid var(--border);
    padding: 1rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }

  .scan-info { flex: 1; }

  .scan-title {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    color: var(--accent);
    letter-spacing: 2px;
    margin-bottom: 0.5rem;
  }

  .scan-target {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem;
    color: var(--text);
  }

  .progress-bar-wrap { flex: 2; }

  .progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    color: var(--text-dim);
    margin-bottom: 0.4rem;
    font-family: 'Share Tech Mono', monospace;
  }

  .progress-bar {
    height: 6px;
    background: var(--border);
    position: relative;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent3));
    box-shadow: 0 0 10px var(--accent);
    position: relative;
    transition: width 1s ease;
  }

  .progress-fill::after {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 30px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3));
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }

  .scan-btn {
    background: transparent;
    border: 1px solid var(--accent);
    color: var(--accent);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 2px;
    padding: 0.5rem 1.25rem;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .scan-btn:hover {
    background: var(--accent);
    color: var(--bg);
    box-shadow: var(--glow);
  }

  .scan-btn.danger { border-color: var(--critical); color: var(--critical); }
  .scan-btn.danger:hover { background: var(--critical); color: var(--bg); box-shadow: var(--glow-red); }
  .scan-btn.success { border-color: var(--accent3); color: var(--accent3); }
  .scan-btn.success:hover { background: var(--accent3); color: var(--bg); box-shadow: var(--glow-green); }

  .vuln-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.82rem;
  }

  .vuln-table th {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
    padding: 0.6rem 0.8rem;
    text-align: left;
    border-bottom: 1px solid var(--border);
  }

  .vuln-table td {
    padding: 0.7rem 0.8rem;
    border-bottom: 1px solid rgba(10,58,92,0.4);
    vertical-align: middle;
  }

  .vuln-table tr { transition: background 0.15s; }
  .vuln-table tr:hover td { background: rgba(0,229,255,0.04); }

  .severity-badge {
    display: inline-block;
    padding: 0.15rem 0.5rem;
    font-size: 0.65rem;
    font-family: 'Share Tech Mono', monospace;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 700;
  }

  .severity-badge.critical { background: rgba(255,23,68,0.15); color: var(--critical); border: 1px solid var(--critical); }
  .severity-badge.high { background: rgba(255,87,34,0.15); color: var(--high); border: 1px solid var(--high); }
  .severity-badge.medium { background: rgba(255,179,0,0.15); color: var(--medium); border: 1px solid var(--medium); }
  .severity-badge.low { background: rgba(0,230,118,0.1); color: var(--low); border: 1px solid var(--low); }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.7rem;
    font-family: 'Share Tech Mono', monospace;
  }

  .status-badge .dot { width: 6px; height: 6px; border-radius: 50%; }
  .status-badge.patching .dot { background: var(--accent); animation: pulse 1s infinite; }
  .status-badge.pending .dot { background: var(--warn); }
  .status-badge.patched .dot { background: var(--accent3); }
  .status-badge.failed .dot { background: var(--critical); }
  .status-badge.patching { color: var(--accent); }
  .status-badge.pending { color: var(--warn); }
  .status-badge.patched { color: var(--accent3); }
  .status-badge.failed { color: var(--critical); }

  .pkg-name {
    font-family: 'Share Tech Mono', monospace;
    color: var(--accent);
    font-size: 0.8rem;
  }

  .cve-id {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: var(--text-dim);
  }

  .score-bar { display: flex; align-items: center; gap: 0.5rem; }
  .score-track { flex: 1; height: 4px; background: var(--border); max-width: 80px; }
  .score-fill { height: 100%; }

  .terminal {
    background: #010810;
    border: 1px solid var(--border);
    height: 320px;
    overflow-y: auto;
    padding: 1rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    line-height: 1.7;
    scroll-behavior: smooth;
  }

  .terminal::-webkit-scrollbar { width: 4px; }
  .terminal::-webkit-scrollbar-track { background: var(--surface); }
  .terminal::-webkit-scrollbar-thumb { background: var(--border); }

  .log-line { display: flex; gap: 1rem; animation: fadeIn 0.3s ease; }

  @keyframes fadeIn { from { opacity: 0; transform: translateX(-5px); } to { opacity: 1; } }

  .log-time { color: var(--text-dim); min-width: 55px; }
  .log-type { min-width: 60px; }
  .log-type.INFO { color: var(--accent); }
  .log-type.WARN { color: var(--warn); }
  .log-type.PATCH { color: var(--accent3); }
  .log-type.ERROR { color: var(--critical); }
  .log-type.SCAN { color: #b388ff; }
  .log-type.ROLLB { color: var(--high); }
  .log-msg { color: var(--text); flex: 1; }

  .risk-list { display: flex; flex-direction: column; gap: 0.6rem; }

  .risk-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0.8rem;
    background: var(--surface2);
    border: 1px solid var(--border);
    transition: all 0.2s;
    cursor: pointer;
  }

  .risk-item:hover { border-color: var(--accent); background: rgba(0,229,255,0.04); }
  .risk-icon { font-size: 1.1rem; min-width: 24px; text-align: center; }
  .risk-body { flex: 1; }
  .risk-name { font-weight: 600; font-size: 0.85rem; margin-bottom: 0.1rem; }
  .risk-desc { font-size: 0.72rem; color: var(--text-dim); }
  .risk-score { font-family: 'Orbitron', monospace; font-size: 1rem; font-weight: 700; }

  .chart-wrap {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 80px;
    padding-top: 0.5rem;
  }

  .bar-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    height: 100%;
    justify-content: flex-end;
  }

  .bar-fill { width: 100%; min-height: 2px; transition: height 1s ease; }
  .bar-fill:hover { filter: brightness(1.3); }
  .bar-fill.c { background: var(--critical); }
  .bar-fill.h { background: var(--high); }
  .bar-fill.p { background: var(--accent); }
  .bar-label { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; color: var(--text-dim); }

  .network-svg-wrap {
    position: relative;
    height: 260px;
    background: #010810;
    border: 1px solid var(--border);
    overflow: hidden;
  }

  .network-svg-wrap svg { width: 100%; height: 100%; }

  .rollback-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.7rem 1rem;
    border-bottom: 1px solid rgba(10,58,92,0.4);
    transition: background 0.15s;
    font-size: 0.82rem;
  }

  .rollback-item:hover { background: rgba(0,229,255,0.03); }
  .rollback-version { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: var(--accent); min-width: 160px; }
  .rollback-time { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: var(--text-dim); min-width: 80px; }
  .rollback-reason { flex: 1; color: var(--text); }

  .donut-wrap { display: flex; justify-content: center; align-items: center; padding: 1rem; gap: 2rem; }
  .donut-chart { position: relative; width: 120px; height: 120px; }
  .donut-chart svg { transform: rotate(-90deg); }
  .donut-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .donut-pct { font-family: 'Orbitron', monospace; font-size: 1.4rem; font-weight: 700; color: var(--accent3); }
  .donut-lbl { font-size: 0.6rem; color: var(--text-dim); letter-spacing: 1px; }
  .donut-legend { display: flex; flex-direction: column; gap: 0.6rem; }
  .legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem; }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; }

  .timeline { display: flex; flex-direction: column; gap: 0; }

  .timeline-item {
    display: flex;
    gap: 1rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid rgba(10,58,92,0.3);
  }

  .timeline-dot {
    width: 10px; height: 10px; border-radius: 50%;
    margin-top: 4px; flex-shrink: 0; position: relative; z-index: 1;
  }

  .timeline-dot::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    width: 18px; height: 18px;
    border-radius: 50%;
    border: 1px solid currentColor;
    opacity: 0.3;
  }

  .timeline-content { flex: 1; }
  .timeline-title { font-weight: 600; font-size: 0.85rem; margin-bottom: 0.2rem; }
  .timeline-meta { font-family: 'Share Tech Mono', monospace; font-size: 0.68rem; color: var(--text-dim); }

  .action-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }

  .section-title {
    font-family: 'Orbitron', monospace;
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  @keyframes borderGlow {
    0%, 100% { border-color: var(--border); }
    50% { border-color: var(--accent); box-shadow: inset 0 0 20px rgba(0,229,255,0.05); }
  }

  .alert-card { animation: borderGlow 3s ease-in-out infinite; }

  @keyframes countup {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 1100px) {
    .dashboard-grid { grid-template-columns: 1fr 1fr; }
    .dashboard-grid > :last-child { grid-column: span 2; }
    .stat-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 700px) {
    .dashboard-grid { grid-template-columns: 1fr; }
    .dashboard-grid > :last-child { grid-column: auto; }
    .stat-grid { grid-template-columns: repeat(2, 1fr); }
    main { padding: 1rem; }
  }
</style>
</head>
<body>

<header>
  <div class="logo">NEXUS<span>GUARD</span></div>
  <div class="header-status">
    <div class="status-indicator">
      <div class="pulse-dot"></div>
      <span>SCANNING ACTIVE</span>
    </div>
    <div class="status-indicator">
      <div class="pulse-dot red"></div>
      <span>3 CRITICAL PENDING</span>
    </div>
    <div class="status-indicator">
      <div class="pulse-dot yellow"></div>
      <span>AUTO-PATCH ON</span>
    </div>
    <div class="sys-time" id="sysTime">00:00:00 UTC</div>
  </div>
</header>

<nav>
  <button class="active" onclick="switchTab('overview', this)">??? OVERVIEW</button>
  <button onclick="switchTab('threats', this)">??? THREAT DETECTION</button>
  <button onclick="switchTab('remediation', this)">??? AUTO REMEDIATION</button>
  <button onclick="switchTab('risk', this)">??? RISK ANALYSIS</button>
  <button onclick="switchTab('incidents', this)">??? INCIDENT RESPONSE</button>
  <button onclick="switchTab('logs', this)">??? AUDIT LOGS</button>
</nav>

<main>

  <!-- OVERVIEW TAB -->
  <div class="tab-panel active" id="tab-overview">

    <div class="scan-container">
      <div class="scan-info">
        <div class="scan-title">// CONTINUOUS SCAN</div>
        <div class="scan-target">TARGET: <span style="color:var(--accent)">myapp/node_modules</span> ??? 847 packages</div>
      </div>
      <div class="progress-bar-wrap">
        <div class="progress-label">
          <span>SCANNING DEPENDENCIES</span>
          <span id="scanPct">73%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" id="scanBar" style="width:73%"></div>
        </div>
      </div>
      <button class="scan-btn" onclick="triggerScan()">??? RESCAN</button>
      <button class="scan-btn success" onclick="patchAll()">??? PATCH ALL</button>
    </div>

    <div class="stat-grid">
      <div class="stat-card critical">
        <div class="stat-label">Critical Vulns</div>
        <div class="stat-value">07</div>
        <div class="stat-delta up">??? +2 since last scan</div>
      </div>
      <div class="stat-card high">
        <div class="stat-label">High Severity</div>
        <div class="stat-value">23</div>
        <div class="stat-delta up">??? +5 this week</div>
      </div>
      <div class="stat-card medium">
        <div class="stat-label">Medium / Low</div>
        <div class="stat-value">89</div>
        <div class="stat-delta">Stable</div>
      </div>
      <div class="stat-card resolved">
        <div class="stat-label">Auto-Patched</div>
        <div class="stat-value">142</div>
        <div class="stat-delta down">??? 94% auto-resolved</div>
      </div>
    </div>

    <div class="dashboard-grid">

      <div class="card" style="grid-column: span 2">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
          <div class="section-title">Active Vulnerabilities</div>
          <div style="display:flex;gap:0.5rem">
            <button class="scan-btn" style="font-size:0.65rem;padding:0.3rem 0.7rem">FILTER</button>
            <button class="scan-btn" style="font-size:0.65rem;padding:0.3rem 0.7rem">EXPORT</button>
          </div>
        </div>
        <table class="vuln-table">
          <thead>
            <tr>
              <th>Package</th><th>CVE ID</th><th>Severity</th>
              <th>CVSS</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody id="vulnTableBody"></tbody>
        </table>
      </div>

      <div style="display:flex;flex-direction:column;gap:1rem">
        <div class="card alert-card">
          <div class="card-title">Security Score</div>
          <div class="donut-wrap">
            <div class="donut-chart">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" stroke-width="12"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent3)" stroke-width="12"
                  stroke-dasharray="188 251" stroke-linecap="round"/>
              </svg>
              <div class="donut-center">
                <div class="donut-pct">75</div>
                <div class="donut-lbl">SCORE</div>
              </div>
            </div>
            <div class="donut-legend">
              <div class="legend-item"><div class="legend-dot" style="background:var(--critical)"></div>Critical: 7</div>
              <div class="legend-item"><div class="legend-dot" style="background:var(--high)"></div>High: 23</div>
              <div class="legend-item"><div class="legend-dot" style="background:var(--medium)"></div>Medium: 61</div>
              <div class="legend-item"><div class="legend-dot" style="background:var(--accent3)"></div>Low: 28</div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-title">7-Day Trend</div>
          <div class="chart-wrap" id="trendChart"></div>
        </div>
      </div>

    </div>
  </div>

  <!-- THREAT DETECTION TAB -->
  <div class="tab-panel" id="tab-threats">

    <div class="scan-container">
      <div class="scan-info">
        <div class="scan-title">// REAL-TIME DEPENDENCY SCANNER</div>
        <div class="scan-target">Monitoring <span style="color:var(--accent)">npm registry</span> ??? CVE feeds active</div>
      </div>
      <button class="scan-btn" onclick="addThreatLog()">SIMULATE THREAT</button>
    </div>

    <div class="dashboard-grid-2col">
      <div class="card">
        <div class="section-title" style="margin-bottom:1rem">Dependency Vulnerability Map</div>
        <div class="network-svg-wrap">
          <svg viewBox="0 0 600 260">
            <circle cx="300" cy="130" r="22" fill="rgba(0,229,255,0.15)" stroke="var(--accent)" stroke-width="1.5"/>
            <text x="300" y="134" text-anchor="middle" fill="var(--accent)" font-family="Share Tech Mono" font-size="9">APP</text>

            <line x1="300" y1="130" x2="120" y2="60" stroke="var(--border)" stroke-width="1"/>
            <circle cx="120" cy="60" r="16" fill="rgba(255,23,68,0.15)" stroke="var(--critical)" stroke-width="1.5"/>
            <text x="120" y="64" text-anchor="middle" fill="var(--critical)" font-family="Share Tech Mono" font-size="7">lodash</text>

            <line x1="300" y1="130" x2="200" y2="200" stroke="var(--border)" stroke-width="1"/>
            <circle cx="200" cy="200" r="16" fill="rgba(255,87,34,0.15)" stroke="var(--high)" stroke-width="1.5"/>
            <text x="200" y="204" text-anchor="middle" fill="var(--high)" font-family="Share Tech Mono" font-size="7">axios</text>

            <line x1="300" y1="130" x2="420" y2="55" stroke="var(--border)" stroke-width="1"/>
            <circle cx="420" cy="55" r="16" fill="rgba(255,179,0,0.1)" stroke="var(--medium)" stroke-width="1.5"/>
            <text x="420" y="59" text-anchor="middle" fill="var(--medium)" font-family="Share Tech Mono" font-size="7">express</text>

            <line x1="300" y1="130" x2="490" y2="170" stroke="var(--border)" stroke-width="1"/>
            <circle cx="490" cy="170" r="14" fill="rgba(0,255,157,0.1)" stroke="var(--accent3)" stroke-width="1.5"/>
            <text x="490" y="174" text-anchor="middle" fill="var(--accent3)" font-family="Share Tech Mono" font-size="7">chalk</text>

            <line x1="300" y1="130" x2="380" y2="210" stroke="var(--border)" stroke-width="1"/>
            <circle cx="380" cy="210" r="14" fill="rgba(255,23,68,0.15)" stroke="var(--critical)" stroke-width="1.5"/>
            <text x="380" y="214" text-anchor="middle" fill="var(--critical)" font-family="Share Tech Mono" font-size="7">moment</text>

            <line x1="300" y1="130" x2="100" y2="180" stroke="var(--border)" stroke-width="1"/>
            <circle cx="100" cy="180" r="14" fill="rgba(0,229,255,0.1)" stroke="var(--accent)" stroke-width="1.5"/>
            <text x="100" y="184" text-anchor="middle" fill="var(--accent)" font-family="Share Tech Mono" font-size="7">dotenv</text>

            <line x1="120" y1="60" x2="60" y2="130" stroke="rgba(10,58,92,0.6)" stroke-width="0.5" stroke-dasharray="3,3"/>
            <circle cx="60" cy="130" r="10" fill="rgba(255,23,68,0.1)" stroke="var(--critical)" stroke-width="1"/>
            <text x="60" y="134" text-anchor="middle" fill="var(--critical)" font-family="Share Tech Mono" font-size="6">qs</text>

            <circle cx="120" cy="60" r="22" fill="none" stroke="var(--critical)" stroke-width="0.5" opacity="0.5">
              <animate attributeName="r" from="16" to="30" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="380" cy="210" r="20" fill="none" stroke="var(--critical)" stroke-width="0.5" opacity="0.5">
              <animate attributeName="r" from="14" to="28" dur="2.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" from="0.5" to="0" dur="2.5s" repeatCount="indefinite"/>
            </circle>
          </svg>
        </div>
        <div style="display:flex;gap:1rem;margin-top:0.75rem;font-size:0.72rem;font-family:Share Tech Mono,monospace">
          <span><span style="color:var(--critical)">???</span> Critical</span>
          <span><span style="color:var(--high)">???</span> High</span>
          <span><span style="color:var(--medium)">???</span> Medium</span>
          <span><span style="color:var(--accent3)">???</span> Clean</span>
        </div>
      </div>

      <div class="card">
        <div class="section-title" style="margin-bottom:1rem">Live Threat Feed</div>
        <div class="terminal" id="threatFeed"></div>
      </div>
    </div>

    <div class="card">
      <div class="section-title" style="margin-bottom:1rem">Known CVE Database ??? Recently Added</div>
      <table class="vuln-table">
        <thead>
          <tr><th>CVE ID</th><th>Package</th><th>Affected Versions</th><th>Severity</th><th>Published</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td class="cve-id">CVE-2024-28849</td><td class="pkg-name">follow-redirects</td><td>&lt; 1.15.6</td><td><span class="severity-badge medium">MEDIUM</span></td><td>2024-03-14</td><td style="color:var(--text-dim);font-size:0.75rem">Credentials exposure via proxy</td></tr>
          <tr><td class="cve-id">CVE-2024-29041</td><td class="pkg-name">express</td><td>&lt; 4.19.2</td><td><span class="severity-badge medium">MEDIUM</span></td><td>2024-03-25</td><td style="color:var(--text-dim);font-size:0.75rem">Open redirect vulnerability</td></tr>
          <tr><td class="cve-id">CVE-2024-21538</td><td class="pkg-name">cross-spawn</td><td>&lt; 7.0.5</td><td><span class="severity-badge high">HIGH</span></td><td>2024-11-08</td><td style="color:var(--text-dim);font-size:0.75rem">ReDoS via malicious shell input</td></tr>
          <tr><td class="cve-id">CVE-2023-26159</td><td class="pkg-name">follow-redirects</td><td>&lt; 1.15.4</td><td><span class="severity-badge high">HIGH</span></td><td>2024-01-02</td><td style="color:var(--text-dim);font-size:0.75rem">URL redirection to untrusted site</td></tr>
          <tr><td class="cve-id">CVE-2024-4067</td><td class="pkg-name">micromatch</td><td>&lt; 4.0.8</td><td><span class="severity-badge medium">MEDIUM</span></td><td>2024-05-14</td><td style="color:var(--text-dim);font-size:0.75rem">Regular expression DoS</td></tr>
        </tbody>
      </table>
    </div>

  </div>

  <!-- AUTO REMEDIATION TAB -->
  <div class="tab-panel" id="tab-remediation">

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
      <div class="scan-container" style="flex-direction:column;align-items:flex-start;gap:0.75rem">
        <div class="scan-title">// AUTO-PATCH ENGINE STATUS</div>
        <div style="display:flex;gap:2rem;font-size:0.82rem">
          <span>Mode: <span style="color:var(--accent3)">AUTONOMOUS</span></span>
          <span>Queue: <span style="color:var(--warn)">12 pending</span></span>
          <span>Last run: <span style="color:var(--text-dim)">2 min ago</span></span>
        </div>
        <div class="action-row">
          <button class="scan-btn success" onclick="runPatch()">?????? RUN PATCH CYCLE</button>
          <button class="scan-btn danger" onclick="pausePatch()">??? PAUSE ENGINE</button>
          <button class="scan-btn" onclick="dryRun()">??? DRY RUN</button>
        </div>
      </div>
      <div class="scan-container" style="flex-direction:column;align-items:flex-start;gap:0.75rem">
        <div class="scan-title">// PATCH STRATEGY</div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
          <button class="scan-btn" id="stratMinor" onclick="setStrategy('minor')" style="background:rgba(0,229,255,0.1)">MINOR ONLY</button>
          <button class="scan-btn" id="stratPatch" onclick="setStrategy('patch')">PATCH ONLY</button>
          <button class="scan-btn" id="stratAll" onclick="setStrategy('all')">ALL UPDATES</button>
          <button class="scan-btn" id="stratAi" onclick="setStrategy('ai')" style="border-color:var(--accent3);color:var(--accent3)">AI-SELECTED</button>
        </div>
      </div>
    </div>

    <div class="dashboard-grid-2col">
      <div class="card">
        <div class="section-title" style="margin-bottom:1rem">Patch Queue</div>
        <table class="vuln-table">
          <thead>
            <tr><th>Package</th><th>Current ??? Target</th><th>Risk</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            <tr>
              <td class="pkg-name">lodash</td>
              <td style="font-family:Share Tech Mono,monospace;font-size:0.75rem"><span style="color:var(--critical)">4.17.20</span> ??? <span style="color:var(--accent3)">4.17.21</span></td>
              <td><span class="severity-badge critical">CRITICAL</span></td>
              <td><span class="status-badge patching"><span class="dot"></span>PATCHING</span></td>
              <td><button class="scan-btn" style="font-size:0.62rem;padding:0.2rem 0.5rem">VIEW</button></td>
            </tr>
            <tr>
              <td class="pkg-name">moment</td>
              <td style="font-family:Share Tech Mono,monospace;font-size:0.75rem"><span style="color:var(--critical)">2.29.3</span> ??? <span style="color:var(--accent3)">2.29.4</span></td>
              <td><span class="severity-badge critical">CRITICAL</span></td>
              <td><span class="status-badge pending"><span class="dot"></span>PENDING</span></td>
              <td><button class="scan-btn" style="font-size:0.62rem;padding:0.2rem 0.5rem">APPLY</button></td>
            </tr>
            <tr>
              <td class="pkg-name">axios</td>
              <td style="font-family:Share Tech Mono,monospace;font-size:0.75rem"><span style="color:var(--high)">1.3.4</span> ??? <span style="color:var(--accent3)">1.6.8</span></td>
              <td><span class="severity-badge high">HIGH</span></td>
              <td><span class="status-badge pending"><span class="dot"></span>PENDING</span></td>
              <td><button class="scan-btn" style="font-size:0.62rem;padding:0.2rem 0.5rem">APPLY</button></td>
            </tr>
            <tr>
              <td class="pkg-name">express</td>
              <td style="font-family:Share Tech Mono,monospace;font-size:0.75rem"><span style="color:var(--medium)">4.18.1</span> ??? <span style="color:var(--accent3)">4.19.2</span></td>
              <td><span class="severity-badge medium">MEDIUM</span></td>
              <td><span class="status-badge patched"><span class="dot"></span>PATCHED</span></td>
              <td><button class="scan-btn" style="font-size:0.62rem;padding:0.2rem 0.5rem">REVERT</button></td>
            </tr>
            <tr>
              <td class="pkg-name">cross-spawn</td>
              <td style="font-family:Share Tech Mono,monospace;font-size:0.75rem"><span style="color:var(--high)">7.0.3</span> ??? <span style="color:var(--accent3)">7.0.5</span></td>
              <td><span class="severity-badge high">HIGH</span></td>
              <td><span class="status-badge failed"><span class="dot"></span>FAILED</span></td>
              <td><button class="scan-btn danger" style="font-size:0.62rem;padding:0.2rem 0.5rem">RETRY</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="section-title" style="margin-bottom:1rem">Security Validation Pipeline</div>
        <div style="display:flex;flex-direction:column;gap:0.75rem" id="pipelineStages"></div>
      </div>
    </div>

    <div class="card">
      <div class="section-title" style="margin-bottom:1rem">Patch Execution Log</div>
      <div class="terminal" id="patchLog" style="height:200px"></div>
    </div>

  </div>

  <!-- RISK ANALYSIS TAB -->
  <div class="tab-panel" id="tab-risk">

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
      <div class="stat-card critical" style="background:var(--surface);border:1px solid var(--border);padding:1rem">
        <div class="stat-label">Overall Risk</div>
        <div class="stat-value" style="font-size:1.8rem">HIGH</div>
        <div class="stat-delta up">Score: 7.4 / 10</div>
      </div>
      <div class="stat-card medium" style="background:var(--surface);border:1px solid var(--border);padding:1rem">
        <div class="stat-label">Attack Surface</div>
        <div class="stat-value" style="font-size:1.8rem">847</div>
        <div class="stat-delta">Dependencies exposed</div>
      </div>
      <div class="stat-card resolved" style="background:var(--surface);border:1px solid var(--border);padding:1rem">
        <div class="stat-label">Risk Reduction</div>
        <div class="stat-value" style="font-size:1.8rem">68%</div>
        <div class="stat-delta down">vs 30 days ago</div>
      </div>
    </div>

    <div class="dashboard-grid-2col">
      <div class="card">
        <div class="section-title" style="margin-bottom:1rem">Context-Aware Risk Prioritization</div>
        <div class="risk-list" id="riskList"></div>
      </div>
      <div class="card">
        <div class="section-title" style="margin-bottom:1rem">Risk by Category</div>
        <div style="display:flex;flex-direction:column;gap:0.75rem;margin-top:0.5rem">
          <div>
            <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:0.35rem"><span>Supply Chain Attack</span><span style="color:var(--critical)">92%</span></div>
            <div class="progress-bar"><div class="progress-fill" style="width:92%;background:linear-gradient(90deg,var(--critical),var(--high))"></div></div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:0.35rem"><span>Prototype Pollution</span><span style="color:var(--high)">78%</span></div>
            <div class="progress-bar"><div class="progress-fill" style="width:78%;background:linear-gradient(90deg,var(--high),var(--medium))"></div></div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:0.35rem"><span>ReDoS Exposure</span><span style="color:var(--medium)">54%</span></div>
            <div class="progress-bar"><div class="progress-fill" style="width:54%;background:linear-gradient(90deg,var(--medium),var(--low))"></div></div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:0.35rem"><span>Outdated Packages</span><span style="color:var(--medium)">61%</span></div>
            <div class="progress-bar"><div class="progress-fill" style="width:61%;background:linear-gradient(90deg,var(--medium),var(--accent))"></div></div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:0.35rem"><span>License Compliance</span><span style="color:var(--low)">18%</span></div>
            <div class="progress-bar"><div class="progress-fill" style="width:18%;background:var(--accent3)"></div></div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- INCIDENT RESPONSE TAB -->
  <div class="tab-panel" id="tab-incidents">

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
      <div class="card">
        <div class="section-title" style="margin-bottom:1rem">Incident Timeline</div>
        <div class="timeline" id="incidentTimeline"></div>
      </div>
      <div class="card">
        <div class="section-title" style="margin-bottom:1rem">Rollback History</div>
        <div id="rollbackHistory"></div>
        <div style="margin-top:1rem">
          <button class="scan-btn danger" onclick="triggerRollback()">??? TRIGGER ROLLBACK</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title" style="margin-bottom:1rem">Recovery Actions</div>
      <div class="action-row">
        <button class="scan-btn danger">??? ROLLBACK ALL PATCHES</button>
        <button class="scan-btn">??? SNAPSHOT CURRENT STATE</button>
        <button class="scan-btn success">??? VERIFY FUNCTIONALITY</button>
        <button class="scan-btn">??? EXPORT INCIDENT REPORT</button>
        <button class="scan-btn" style="border-color:var(--warn);color:var(--warn)">??? ESCALATE TO TEAM</button>
      </div>
    </div>

  </div>

  <!-- AUDIT LOGS TAB -->
  <div class="tab-panel" id="tab-logs">

    <div class="scan-container" style="justify-content:flex-start;gap:1rem;flex-wrap:wrap">
      <div class="scan-title">// AUDIT LOG STREAM</div>
      <button class="scan-btn" onclick="filterLogs('ALL')">ALL</button>
      <button class="scan-btn" onclick="filterLogs('SCAN')">SCAN</button>
      <button class="scan-btn" onclick="filterLogs('PATCH')">PATCH</button>
      <button class="scan-btn" onclick="filterLogs('ERROR')">ERROR</button>
      <button class="scan-btn" onclick="filterLogs('ROLLB')">ROLLBACK</button>
      <button class="scan-btn success" style="margin-left:auto" onclick="exportLogs()">??? EXPORT CSV</button>
    </div>

    <div class="card">
      <div class="terminal" id="auditLog" style="height:500px"></div>
    </div>

  </div>

</main>

<script>
  // Clock
  function updateClock() {
    document.getElementById('sysTime').textContent =
      new Date().toUTCString().slice(17,25) + ' UTC';
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Tab switching
  function switchTab(id, btn) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + id).classList.add('active');
    btn.classList.add('active');
  }

  // Vuln data
  const vulns = [
    { pkg:'lodash',      cve:'CVE-2021-23337', sev:'critical', cvss:7.2, status:'patching' },
    { pkg:'moment',      cve:'CVE-2022-24785', sev:'critical', cvss:7.5, status:'pending'  },
    { pkg:'axios',       cve:'CVE-2023-45857', sev:'high',     cvss:6.5, status:'pending'  },
    { pkg:'cross-spawn', cve:'CVE-2024-21538', sev:'high',     cvss:6.9, status:'failed'   },
    { pkg:'express',     cve:'CVE-2024-29041', sev:'medium',   cvss:5.3, status:'patched'  },
    { pkg:'qs',          cve:'CVE-2022-24999', sev:'high',     cvss:7.5, status:'patched'  },
    { pkg:'micromatch',  cve:'CVE-2024-4067',  sev:'medium',   cvss:5.5, status:'pending'  },
  ];
  const colorMap = { critical:'var(--critical)', high:'var(--high)', medium:'var(--medium)', low:'var(--low)' };

  function buildVulnTable() {
    const tbody = document.getElementById('vulnTableBody');
    if (!tbody) return;
    tbody.innerHTML = vulns.map(v => {
      const pct = Math.round(v.cvss * 10);
      const c = colorMap[v.sev];
      return `<tr>
        <td class="pkg-name">${v.pkg}</td>
        <td class="cve-id">${v.cve}</td>
        <td><span class="severity-badge ${v.sev}">${v.sev.toUpperCase()}</span></td>
        <td>
          <div class="score-bar">
            <span style="font-family:Share Tech Mono,monospace;font-size:0.75rem;color:${c}">${v.cvss}</span>
            <div class="score-track"><div class="score-fill" style="width:${pct}%;background:${c}"></div></div>
          </div>
        </td>
        <td><span class="status-badge ${v.status}"><span class="dot"></span>${v.status.toUpperCase()}</span></td>
        <td>
          <button class="scan-btn" style="font-size:0.62rem;padding:0.2rem 0.6rem;border-color:${c};color:${c}"
            onclick="handleVulnAction('${v.pkg}','${v.status}')">
            ${v.status==='patched'?'REVERT':v.status==='failed'?'RETRY':'PATCH'}
          </button>
        </td>
      </tr>`;
    }).join('');
  }
  buildVulnTable();

  // Trend chart
  function buildTrendChart() {
    const days = ['M','T','W','T','F','S','S'];
    const crit = [3,5,4,7,6,7,7];
    const high = [18,20,19,22,24,23,23];
    const el = document.getElementById('trendChart');
    if (!el) return;
    el.innerHTML = days.map((d,i) => `
      <div class="bar-col">
        <div class="bar-fill c" style="height:${Math.round(crit[i]/10*70)}px" title="Critical:${crit[i]}"></div>
        <div class="bar-fill h" style="height:${Math.round(high[i]/30*70)}px" title="High:${high[i]}"></div>
        <div class="bar-label">${d}</div>
      </div>`).join('');
  }
  buildTrendChart();

  // Pipeline
  const pipelineData = [
    { name:'Dependency Resolution',       status:'done',    detail:'847 packages resolved' },
    { name:'CVE Matching',                status:'done',    detail:'119 matches found' },
    { name:'Intelligent Update Selection',status:'active',  detail:'AI selecting safe updates...' },
    { name:'Automated Testing Suite',     status:'pending', detail:'Jest + Mocha waiting' },
    { name:'Security Validation',         status:'pending', detail:'Post-patch verification' },
    { name:'Deployment / Integration',    status:'pending', detail:'CI/CD pipeline ready' },
  ];

  function buildPipeline() {
    const el = document.getElementById('pipelineStages');
    if (!el) return;
    el.innerHTML = pipelineData.map((s,i) => {
      const icon  = s.status==='done' ? '???' : s.status==='active' ? '???' : '???';
      const color = s.status==='done' ? 'var(--accent3)' : s.status==='active' ? 'var(--accent)' : 'var(--text-dim)';
      return `<div style="display:flex;align-items:center;gap:1rem;padding:0.6rem 0.8rem;background:var(--surface2);border:1px solid ${s.status==='active'?'var(--accent)':'var(--border)'}">
        <span style="font-family:Share Tech Mono,monospace;color:${color};font-size:1rem">${icon}</span>
        <div style="flex:1">
          <div style="font-size:0.82rem;color:${color};font-weight:600">${i+1}. ${s.name}</div>
          <div style="font-size:0.7rem;color:var(--text-dim);font-family:Share Tech Mono,monospace">${s.detail}</div>
        </div>
        ${s.status==='active'?'<div class="pulse-dot"></div>':''}
      </div>`;
    }).join('');
  }
  buildPipeline();

  // Risk list
  const risks = [
    { icon:'???', name:'lodash (CVE-2021-23337)', desc:'Command injection via template',    score:'9.8', color:'var(--critical)', level:'critical' },
    { icon:'????', name:'moment (CVE-2022-24785)', desc:'Path traversal vulnerability',      score:'7.5', color:'var(--critical)', level:'critical' },
    { icon:'???',  name:'axios (CVE-2023-45857)',  desc:'CSRF token exposure',               score:'6.5', color:'var(--high)',     level:'high'     },
    { icon:'???',  name:'cross-spawn (CVE-2024-21538)', desc:'ReDoS via shell metacharacters',score:'6.9', color:'var(--high)',   level:'high'     },
    { icon:'???',  name:'micromatch (CVE-2024-4067)',desc:'Regular expression denial of service',score:'5.5',color:'var(--medium)',level:'medium'  },
  ];

  function buildRiskList() {
    const el = document.getElementById('riskList');
    if (!el) return;
    el.innerHTML = risks.map(r => `
      <div class="risk-item">
        <div class="risk-icon">${r.icon}</div>
        <div class="risk-body">
          <div class="risk-name" style="color:${r.color}">${r.name}</div>
          <div class="risk-desc">${r.desc}</div>
        </div>
        <span class="severity-badge ${r.level}">${r.level.toUpperCase()}</span>
        <div class="risk-score" style="color:${r.color}">${r.score}</div>
      </div>`).join('');
  }
  buildRiskList();

  // Timeline
  const incidents = [
    { title:'Critical CVE Detected ??? lodash',    meta:'Today 09:14 UTC ?? Auto-response triggered', color:'var(--critical)' },
    { title:'Patch Applied ??? express 4.19.2',    meta:'Today 08:51 UTC ?? Validated ???',             color:'var(--accent3)'  },
    { title:'Rollback Executed ??? cross-spawn',   meta:'Today 08:03 UTC ?? Test failure detected',   color:'var(--high)'     },
    { title:'Scan Complete ??? 847 packages',      meta:'Yesterday 22:00 UTC ?? 119 vulns found',     color:'var(--accent)'   },
    { title:'New CVE Feed Update',               meta:'Yesterday 18:30 UTC ?? 14 new CVEs added',   color:'var(--medium)'   },
  ];

  function buildTimeline() {
    const el = document.getElementById('incidentTimeline');
    if (!el) return;
    el.innerHTML = incidents.map(i => `
      <div class="timeline-item">
        <div class="timeline-dot" style="background:${i.color};box-shadow:0 0 6px ${i.color}"></div>
        <div class="timeline-content">
          <div class="timeline-title" style="color:${i.color}">${i.title}</div>
          <div class="timeline-meta">${i.meta}</div>
        </div>
      </div>`).join('');
  }
  buildTimeline();

  // Rollback history
  const rollbacks = [
    { version:'cross-spawn@7.0.3', time:'08:03 UTC',    reason:'Integration test failure',       color:'var(--high)'   },
    { version:'webpack@5.90.0',    time:'Yesterday',     reason:'Build break ??? incompatible API', color:'var(--medium)' },
    { version:'babel-core@7.23.0', time:'3 days ago',   reason:'Transpile error in CI',           color:'var(--accent)' },
  ];

  function buildRollback() {
    const el = document.getElementById('rollbackHistory');
    if (!el) return;
    el.innerHTML = rollbacks.map(r => `
      <div class="rollback-item">
        <div class="rollback-version" style="color:${r.color}">${r.version}</div>
        <div class="rollback-time">${r.time}</div>
        <div class="rollback-reason">${r.reason}</div>
        <button class="scan-btn" style="font-size:0.62rem;padding:0.2rem 0.5rem">RESTORE</button>
      </div>`).join('');
  }
  buildRollback();

  // Log system
  function addLog(containerId, type, msg) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const t = new Date().toTimeString().slice(0,8);
    const div = document.createElement('div');
    div.className = 'log-line';
    div.dataset.type = type;
    div.innerHTML = `<span class="log-time">${t}</span><span class="log-type ${type}">[${type}]</span><span class="log-msg">${msg}</span>`;
    el.appendChild(div);
    el.scrollTop = el.scrollHeight;
  }

  function filterLogs(type) {
    document.querySelectorAll('#auditLog .log-line').forEach(l => {
      l.style.display = (type === 'ALL' || l.dataset.type === type) ? 'flex' : 'none';
    });
  }

  // Seed logs
  const seedLogs = [
    ['SCAN', 'Initiating full dependency scan ??? 847 packages queued'],
    ['INFO', 'CVE feed updated ??? NVD sync complete (14 new entries)'],
    ['SCAN', 'lodash@4.17.20 ??? CVE-2021-23337 matched (CVSS 7.2)'],
    ['WARN', 'moment@2.29.3 ??? CVE-2022-24785 detected (CVSS 7.5)'],
    ['PATCH','Applying patch: lodash 4.17.20 ??? 4.17.21'],
    ['PATCH','Running test suite for lodash patch...'],
    ['INFO', 'All 47 tests passed ??? lodash patch validated'],
    ['PATCH','Applying patch: express 4.18.1 ??? 4.19.2'],
    ['INFO', 'express patch deployed successfully'],
    ['PATCH','Applying patch: cross-spawn 7.0.3 ??? 7.0.5'],
    ['ERROR','Test failure detected in cross-spawn integration tests'],
    ['ROLLB','Initiating rollback: cross-spawn ??? 7.0.3'],
    ['ROLLB','Rollback complete ??? state restored'],
    ['WARN', 'axios@1.3.4 ??? CVE-2023-45857 pending remediation'],
    ['INFO', 'Scan cycle complete ??? next scan in 6 hours'],
  ];

  let seedIdx = 0;
  const seedInterval = setInterval(() => {
    if (seedIdx >= seedLogs.length) { clearInterval(seedInterval); return; }
    const [t, m] = seedLogs[seedIdx++];
    addLog('auditLog', t, m);
    addLog('patchLog', t, m);
    addLog('threatFeed', t, m);
  }, 200);

  // Live log injection
  const liveMsgs = [
    ['SCAN', 'Scanning node_modules/lodash/dist...'],
    ['INFO', 'Package integrity check: sha512 verified'],
    ['SCAN', 'Cross-referencing CVE database...'],
    ['WARN', 'Deprecated transitive dependency: inflight@1.0.6'],
    ['PATCH','Intelligent update selection: choosing semver-safe patch'],
    ['INFO', 'CI/CD pipeline integration: webhook triggered'],
    ['SCAN', 'Analyzing dependency tree depth: 12 levels'],
    ['INFO', 'Supply chain validation: 3 packages require audit'],
    ['ERROR','Network timeout fetching npm registry ??? retrying...'],
    ['INFO', 'Registry connection restored'],
    ['PATCH','Security test: injection patterns checked ??? clean'],
    ['ROLLB','Snapshot saved before batch patch cycle'],
  ];
  let liveIdx = 0;
  setInterval(() => {
    const [t, m] = liveMsgs[liveIdx++ % liveMsgs.length];
    addLog('auditLog', t, m);
    if (Math.random() > 0.6) addLog('patchLog', t, m);
    if (Math.random() > 0.5) addLog('threatFeed', t, m);
  }, 3500);

  // Scan progress
  let scanVal = 73;
  setInterval(() => {
    scanVal = scanVal < 100 ? Math.min(100, scanVal + Math.random() * 2) : Math.random() * 30 + 50;
    const bar = document.getElementById('scanBar');
    const pct = document.getElementById('scanPct');
    if (bar) bar.style.width = scanVal.toFixed(0) + '%';
    if (pct) pct.textContent = scanVal.toFixed(0) + '%';
  }, 1500);

  // Button handlers
  function triggerScan()  { scanVal = 0; addLog('auditLog','SCAN','Manual scan triggered by operator'); addLog('threatFeed','SCAN','Full re-scan initiated ??? 847 packages queued'); }
  function patchAll()     { addLog('auditLog','PATCH','Batch patch initiated ??? AI selecting safe updates'); addLog('patchLog','PATCH','Batch patch mode: processing 12 pending vulnerabilities'); }
  function runPatch()     { addLog('patchLog','PATCH','Patch engine started ??? processing queue'); }
  function pausePatch()   { addLog('patchLog','WARN','Patch engine paused by operator'); }
  function dryRun()       { addLog('patchLog','INFO','Dry run mode: simulating patches without applying'); }
  function triggerRollback() { addLog('auditLog','ROLLB','Manual rollback initiated by operator'); }
  function exportLogs()   { addLog('auditLog','INFO','Audit log exported to CSV'); }
  function addThreatLog() {
    const pkgs = ['ws','semver','tough-cookie','request','uuid'];
    const pkg  = pkgs[Math.floor(Math.random()*pkgs.length)];
    const cve  = 'CVE-2024-' + (Math.floor(Math.random()*90000)+10000);
    const cvss = (Math.random()*4+5).toFixed(1);
    addLog('threatFeed','WARN',`New threat: ${pkg} ??? ${cve} (CVSS ${cvss}) detected`);
    addLog('auditLog','WARN',`New threat: ${pkg} ??? ${cve} (CVSS ${cvss}) detected`);
  }
  function setStrategy(s) {
    ['minor','patch','all','ai'].forEach(id => {
      const b = document.getElementById('strat'+id.charAt(0).toUpperCase()+id.slice(1));
      if (b) b.style.background = '';
    });
    const active = document.getElementById('strat'+s.charAt(0).toUpperCase()+s.slice(1));
    if (active) active.style.background = 'rgba(0,229,255,0.1)';
    addLog('auditLog','INFO',`Patch strategy updated: ${s.toUpperCase()}`);
  }
  function handleVulnAction(pkg, status) {
    addLog('auditLog', status==='patched'?'ROLLB':'PATCH',
      status==='patched'?`Manual revert requested: ${pkg}`:`Manual patch initiated: ${pkg}`);
  }
</script>
</body>
</html>
