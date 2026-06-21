const fs = require('fs')
const path = require('path')

const publicDir = path.resolve(__dirname, '../public')

fs.rmSync(publicDir, { recursive: true, force: true })
fs.mkdirSync(publicDir, { recursive: true })

const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Management</title>
  <meta name="description" content="Management website is being prepared." />
  <style>
    :root {
      color-scheme: dark;
      --bg: #11110f;
      --panel: #1b1915;
      --ink: #f5ead7;
      --muted: #b9aa93;
      --line: #3a3024;
      --accent: #ff8a3d;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      overflow: hidden;
      background:
        radial-gradient(circle at 20% 20%, rgba(255, 138, 61, 0.22), transparent 28rem),
        radial-gradient(circle at 82% 76%, rgba(245, 234, 215, 0.12), transparent 24rem),
        linear-gradient(135deg, #0c0b0a, var(--bg));
      color: var(--ink);
      font-family: Georgia, 'Times New Roman', serif;
    }

    main {
      width: min(92vw, 820px);
      padding: clamp(28px, 6vw, 72px);
      position: relative;
      border: 1px solid var(--line);
      border-radius: 30px;
      background: linear-gradient(145deg, rgba(27, 25, 21, 0.92), rgba(16, 15, 13, 0.76));
      box-shadow: 0 28px 90px rgba(0, 0, 0, 0.45);
    }

    main::before {
      content: '';
      position: absolute;
      inset: 18px;
      border: 1px dashed rgba(245, 234, 215, 0.18);
      border-radius: 22px;
      pointer-events: none;
    }

    .eyebrow {
      display: inline-flex;
      gap: 10px;
      align-items: center;
      margin: 0 0 24px;
      color: var(--accent);
      font: 700 13px/1.2 ui-monospace, SFMono-Regular, Consolas, monospace;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: var(--accent);
      box-shadow: 0 0 30px var(--accent);
    }

    h1 {
      margin: 0;
      max-width: 12ch;
      font-size: clamp(48px, 10vw, 104px);
      line-height: 0.92;
      letter-spacing: -0.06em;
    }

    p {
      max-width: 620px;
      margin: 28px 0 0;
      color: var(--muted);
      font-size: clamp(18px, 2.4vw, 24px);
      line-height: 1.75;
    }

    .footer {
      margin-top: 42px;
      padding-top: 22px;
      border-top: 1px solid var(--line);
      color: rgba(245, 234, 215, 0.62);
      font: 600 13px/1.6 ui-monospace, SFMono-Regular, Consolas, monospace;
      direction: ltr;
      text-align: left;
    }
  </style>
</head>
<body>
  <main>
    <div class="eyebrow"><span class="dot"></span> Deployment online</div>
    <h1>الموقع قيد التجهيز</h1>
    <p>تم نشر نسخة خفيفة مؤقتة بنجاح. سنعيد تشغيل النسخة الكاملة بعد ضبط حدود البناء والموارد المناسبة.</p>
    <div class="footer">Temporary Vercel lite build</div>
  </main>
</body>
</html>
`

fs.writeFileSync(path.join(publicDir, 'index.html'), html)
fs.writeFileSync(path.join(publicDir, 'robots.txt'), 'User-agent: *\nDisallow:\n')

console.log('Created lightweight Vercel build in public/')
