// OCAI Solutions — guided FAQ chatbot widget.
// Self-contained: injects its own HTML/CSS, no external deps.
// Restricted to predefined topics. No free-text input → zero abuse risk.
(function () {
  'use strict';

  const TOPICS = {
    start: {
      greeting: "Hi! I'm the OCAI assistant. Three productized automations, available 24/7 for questions. Pick a topic.",
      buttons: [
        { label: "What's Instant Lead Response?", goto: "flagship" },
        { label: "Show me all three services", goto: "trio" },
        { label: "Pricing breakdown", goto: "pricing" },
        { label: "How fast is setup?", goto: "setup_speed" },
        { label: "Can I cancel anytime?", goto: "cancel" },
        { label: "Email a real person", goto: "email" }
      ]
    },
    flagship: {
      answer: "<b>Instant Lead Response</b> is the flagship — $750 setup + $99/mo.<br><br>Your contact form fills out, your lead gets an SMS confirmation within 30 seconds, you get a text alert, and the lead is logged to your CRM or Google Sheet. Built in tools you already pay for (Zapier, Make, n8n). Setup in 1 week. Month-to-month — cancel anytime.<br><br>Great for roofers, HVAC, plumbers, dentists, contractors — any business with inbound form leads.",
      buttons: [
        { label: "Start setup", goto: "start_flagship" },
        { label: "Show me all three", goto: "trio" },
        { label: "← Other questions", goto: "start" }
      ]
    },
    trio: {
      answer: "<b>Three productized automations:</b><br><br>★ <b>Instant Lead Response</b> — $750 + $99/mo · Capture: SMS reply to leads within 30 seconds.<br>★ <b>Instant Quote Widget</b> — $600 + $79/mo · Qualify: site visitor picks scope, AI returns a price range, contact captured.<br>★ <b>Review Engine</b> — $600 + $79/mo · Repeat: auto-request reviews after every completed job.<br><br>Bundle all three and save 15% on combined setup.",
      buttons: [
        { label: "See full details", url: "services.html" },
        { label: "Start with the flagship", goto: "start_flagship" },
        { label: "← Other questions", goto: "start" }
      ]
    },

    pricing: {
      answer: "<b>The trio:</b><br>• Instant Lead Response — $750 setup + $99/mo<br>• Instant Quote Widget — $600 setup + $79/mo<br>• Review Engine — $600 setup + $79/mo<br><br>Bundle all three and save 15% on combined setup. All month-to-month — no annual contracts.",
      buttons: [
        { label: "How fast is setup?", goto: "setup_speed" },
        { label: "Can I cancel?", goto: "cancel" },
        { label: "← Other questions", goto: "start" }
      ]
    },
    setup_speed: {
      answer: "Most automations are <b>live within 3–7 business days</b> of the kickoff call. Review Engine is fastest (3 days), Quote Widget next (5 days), Lead Response a full week. After setup, you get a 30-minute walkthrough call before the monthly retainer starts.",
      buttons: [
        { label: "Start setup", goto: "start_flagship" },
        { label: "← Other questions", goto: "start" }
      ]
    },
    cancel: {
      answer: "Yes — <b>month-to-month, cancel anytime</b> by email. No annual contracts, no early-termination fees. The automation keeps running in your tools after you cancel — you just lose our monitoring and tuning. If something breaks later, we offer one-off hourly fixes.",
      buttons: [
        { label: "Start setup", goto: "start_flagship" },
        { label: "← Other questions", goto: "start" }
      ]
    },
    email: {
      answer: "Easiest way to reach a real human is email — we reply within one business day, usually faster.",
      buttons: [
        { label: "✉ Email ocaisolution@gmail.com", url: "mailto:ocaisolution@gmail.com?subject=Question%20from%20site" },
        { label: "Use the contact form", url: "contact.html" },
        { label: "← Other questions", goto: "start" }
      ]
    },
    start_flagship: {
      answer: "Two paths:<br><br>1. <b>Email us</b> at ocaisolution@gmail.com with which service you want — we'll schedule a 20-min discovery call.<br>2. Or use the <b>contact form</b> with your details — we'll reach out within one business day.<br><br>After the call, you get a written proposal with fixed setup price, start date, and what's included. You pay setup, we install, and the retainer kicks in month two.",
      buttons: [
        { label: "Email us", url: "mailto:ocaisolution@gmail.com?subject=Instant%20Lead%20Response%20setup" },
        { label: "Open contact form", url: "contact.html?service=lead-response" },
        { label: "← Other questions", goto: "start" }
      ]
    }
  };

  const STYLE = `
    .ocai-cb-toggle {
      position: fixed; bottom: 20px; right: 20px; z-index: 9998;
      width: 56px; height: 56px; border-radius: 28px; border: none;
      background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%);
      color: white; cursor: pointer; box-shadow: 0 8px 24px rgba(245,158,11,.35);
      display: flex; align-items: center; justify-content: center;
      transition: transform .15s ease, box-shadow .15s ease;
    }
    .ocai-cb-toggle:hover { transform: scale(1.05); box-shadow: 0 12px 32px rgba(245,158,11,.45); }
    .ocai-cb-toggle svg { width: 24px; height: 24px; }
    .ocai-cb-panel {
      position: fixed; bottom: 88px; right: 20px; z-index: 9999;
      width: min(380px, calc(100vw - 40px));
      max-height: min(560px, calc(100vh - 120px));
      background: #0A0F1C; color: #F1F5F9;
      border: 1px solid #1F2937; border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,.6);
      display: none; flex-direction: column; overflow: hidden;
      font-family: Inter, system-ui, sans-serif; font-size: 14px;
    }
    .ocai-cb-panel.open { display: flex; animation: ocai-cb-in .18s ease-out; }
    @keyframes ocai-cb-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .ocai-cb-header {
      padding: 16px 18px; border-bottom: 1px solid #1F2937;
      background: linear-gradient(135deg, rgba(245,158,11,.12), rgba(249,115,22,.06));
      display: flex; align-items: center; justify-content: space-between;
    }
    .ocai-cb-header h3 { margin: 0; font-size: 15px; font-weight: 700; letter-spacing: -.01em; }
    .ocai-cb-header p { margin: 2px 0 0; font-size: 11px; color: #94A3B8; }
    .ocai-cb-close {
      background: none; border: none; color: #94A3B8; cursor: pointer;
      padding: 4px; border-radius: 4px; line-height: 0;
    }
    .ocai-cb-close:hover { color: white; background: rgba(255,255,255,.06); }
    .ocai-cb-body {
      flex: 1; overflow-y: auto; padding: 16px 18px;
      display: flex; flex-direction: column; gap: 14px;
    }
    .ocai-cb-message {
      background: #111827; border: 1px solid #1F2937;
      padding: 12px 14px; border-radius: 10px; line-height: 1.55;
      color: #E2E8F0;
    }
    .ocai-cb-options { display: flex; flex-direction: column; gap: 6px; }
    .ocai-cb-option {
      background: transparent; border: 1px solid #1F2937; color: #CBD5E1;
      padding: 9px 12px; border-radius: 8px; cursor: pointer; text-align: left;
      font-family: inherit; font-size: 13px; line-height: 1.4;
      transition: all .12s ease; text-decoration: none; display: block;
    }
    .ocai-cb-option:hover {
      border-color: #F59E0B; color: white; background: rgba(245,158,11,.08);
    }
    .ocai-cb-option-primary {
      background: linear-gradient(135deg, #F59E0B, #F97316);
      border-color: transparent; color: white; font-weight: 600;
    }
    .ocai-cb-option-primary:hover {
      background: linear-gradient(135deg, #D97706, #EA580C);
      color: white;
    }
    .ocai-cb-footer {
      padding: 10px 18px; border-top: 1px solid #1F2937;
      font-size: 11px; color: #94A3B8; text-align: center;
    }
    .ocai-cb-footer a { color: #FBBF24; text-decoration: none; }
    .ocai-cb-footer a:hover { text-decoration: underline; }
  `;

  function el(tag, attrs, ...children) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'className') e.className = attrs[k];
      else if (k === 'onclick') e.addEventListener('click', attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    for (const c of children) {
      if (typeof c === 'string') e.appendChild(document.createTextNode(c));
      else if (c) e.appendChild(c);
    }
    return e;
  }

  function init() {
    const style = el('style');
    style.textContent = STYLE;
    document.head.appendChild(style);

    const toggle = el('button', {
      className: 'ocai-cb-toggle',
      'aria-label': 'Open OCAI assistant',
      title: 'Ask a question'
    });
    toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

    const panel = el('div', { className: 'ocai-cb-panel', 'role': 'dialog', 'aria-label': 'OCAI assistant' });

    const header = el('div', { className: 'ocai-cb-header' },
      el('div', null,
        el('h3', null, 'OCAI Assistant'),
        el('p', null, 'Answers questions about our services 24/7')
      ),
      el('button', {
        className: 'ocai-cb-close',
        'aria-label': 'Close assistant',
        onclick: () => panel.classList.remove('open')
      })
    );
    header.querySelector('.ocai-cb-close').innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6L18 18M18 6L6 18"/></svg>';

    const body = el('div', { className: 'ocai-cb-body' });
    const footer = el('div', { className: 'ocai-cb-footer' });
    footer.innerHTML = 'Need a real person? <a href="mailto:ocaisolution@gmail.com">Email us</a>';

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(footer);

    function renderTopic(key) {
      const topic = TOPICS[key];
      if (!topic) return;
      body.innerHTML = '';
      const text = topic.greeting || topic.answer || '';
      const msg = el('div', { className: 'ocai-cb-message' });
      msg.innerHTML = text;
      body.appendChild(msg);
      if (topic.buttons && topic.buttons.length) {
        const opts = el('div', { className: 'ocai-cb-options' });
        topic.buttons.forEach((b, i) => {
          const isPrimary = i === 0 && (b.url || b.goto === 'start_rescue');
          let btn;
          if (b.url) {
            btn = el('a', {
              className: 'ocai-cb-option' + (isPrimary ? ' ocai-cb-option-primary' : ''),
              href: b.url,
              target: b.url.startsWith('mailto:') ? '_self' : '_self'
            }, b.label);
          } else {
            btn = el('button', {
              className: 'ocai-cb-option' + (isPrimary ? ' ocai-cb-option-primary' : ''),
              onclick: () => renderTopic(b.goto)
            }, b.label);
          }
          opts.appendChild(btn);
        });
        body.appendChild(opts);
      }
      body.scrollTop = 0;
    }

    toggle.addEventListener('click', () => {
      const opening = !panel.classList.contains('open');
      panel.classList.toggle('open');
      if (opening) renderTopic('start');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') panel.classList.remove('open');
    });

    document.body.appendChild(toggle);
    document.body.appendChild(panel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
