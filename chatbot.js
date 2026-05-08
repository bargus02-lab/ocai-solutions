// OCAI Solutions — guided FAQ chatbot widget.
// Self-contained: injects its own HTML/CSS, no external deps.
// Restricted to predefined topics. No free-text input → zero abuse risk.
(function () {
  'use strict';

  const TOPICS = {
    start: {
      greeting: "Hi! I'm the OCAI assistant. I can answer common questions about our services 24/7 — pick a topic below.",
      buttons: [
        { label: "What's an AI Website Rescue?", goto: "rescue" },
        { label: "How much does it cost?", goto: "pricing" },
        { label: "How fast is delivery?", goto: "turnaround" },
        { label: "Do you offer refunds?", goto: "refund" },
        { label: "Do you serve outside Orange County?", goto: "area" },
        { label: "Can I see a sample audit?", goto: "sample" },
        { label: "Email a real person", goto: "email" }
      ]
    },
    rescue: {
      answer: "An <b>AI Website Rescue</b> is a $197 audit and rewrite of your website's most important copy. You get:<br><br>• Rewritten homepage hero (headline + subheadline + CTA)<br>• Rewritten services section (problem → solution → proof)<br>• 3 SEO meta description options<br>• Top 5 conversion fixes ranked by revenue impact<br>• A 5-minute Loom walkthrough explaining every change<br><br>Delivered as a Google Doc within 24 hours of payment.",
      buttons: [
        { label: "How much does it cost?", goto: "pricing" },
        { label: "Show me a sample", goto: "sample" },
        { label: "← Other questions", goto: "start" }
      ]
    },
    pricing: {
      answer: "<b>AI Website Rescue:</b> flat $197. One payment, no upsells, no retainer. Includes everything listed for the Rescue plus a money-back guarantee.<br><br><b>AI Outreach Engine:</b> custom-quoted per project (typical scope $2,000–$5,000).<br><br><b>AI Workflow Automation:</b> custom-quoted per project — depends on tools and complexity.<br><br>For custom projects we send a written proposal with fixed price, scope, and delivery date before any work starts.",
      buttons: [
        { label: "What if I don't like it?", goto: "refund" },
        { label: "Start a Rescue", goto: "start_rescue" },
        { label: "← Other questions", goto: "start" }
      ]
    },
    turnaround: {
      answer: "Most Website Rescues are delivered within <b>24 hours of payment</b>, often sooner. Custom projects are scoped with a specific delivery date in your proposal.",
      buttons: [
        { label: "What if it's not useful?", goto: "refund" },
        { label: "← Other questions", goto: "start" }
      ]
    },
    refund: {
      answer: "Yes — the Website Rescue carries a <b>full money-back guarantee</b>. If the audit isn't useful, reply to the delivery email asking for a refund and we return all $197 within 5 business days. No questions, no calls. Custom projects have refund terms set in each individual proposal.",
      buttons: [
        { label: "Read the full refund policy", url: "refund.html" },
        { label: "← Other questions", goto: "start" }
      ]
    },
    area: {
      answer: "We're based in <b>Orange County, California</b> but the work is fully remote. We've worked with businesses across the U.S. — anywhere you have a website, we can audit it.",
      buttons: [
        { label: "Start a Rescue", goto: "start_rescue" },
        { label: "← Other questions", goto: "start" }
      ]
    },
    sample: {
      answer: "Yes — see what a real $197 audit looks like with the business name anonymized. Great way to understand what you'd actually get.",
      buttons: [
        { label: "View sample audit →", url: "sample-audit.html" },
        { label: "Start your own", goto: "start_rescue" },
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
    start_rescue: {
      answer: "Two paths.<br><br>1. <b>Pay $197 directly</b> — fastest. Reply to the Stripe receipt with your URL and the audit lands within 24 hours.<br>2. Or <b>email us first</b> if you want to ask questions before paying.<br><br>Either way, the audit ships within 24 hours.",
      buttons: [
        { label: "Pay $197 now →", url: "https://buy.stripe.com/5kQ14o08uetK6GG7Er3cc00" },
        { label: "✉ Email us first", url: "mailto:ocaisolution@gmail.com?subject=AI%20Website%20Rescue%20-%20%24197" },
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
