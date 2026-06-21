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
  <meta name="description" content="منصة لإدارة الأعمال والفرق والمهام من مكان واحد." />
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
      overflow-x: hidden;
      background:
        radial-gradient(circle at 20% 20%, rgba(255, 138, 61, 0.22), transparent 28rem),
        radial-gradient(circle at 82% 76%, rgba(245, 234, 215, 0.12), transparent 24rem),
        linear-gradient(135deg, #0c0b0a, var(--bg));
      color: var(--ink);
      font-family: Georgia, 'Times New Roman', serif;
    }

    main {
      width: min(92vw, 1120px);
      margin: 7vh auto;
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

    nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: clamp(48px, 8vw, 96px);
    }

    .brand {
      font: 800 22px/1 ui-monospace, SFMono-Regular, Consolas, monospace;
      letter-spacing: -0.04em;
    }

    .nav-links {
      display: flex;
      gap: 22px;
      color: var(--muted);
      font: 700 14px/1.2 ui-monospace, SFMono-Regular, Consolas, monospace;
    }

    .nav-links a {
      color: inherit;
      text-decoration: none;
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
      max-width: 13ch;
      font-size: clamp(48px, 9vw, 112px);
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

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      margin-top: 36px;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 52px;
      padding: 0 22px;
      border-radius: 999px;
      border: 1px solid var(--line);
      color: var(--ink);
      text-decoration: none;
      font: 800 15px/1 ui-monospace, SFMono-Regular, Consolas, monospace;
      background: rgba(245, 234, 215, 0.06);
    }

    .button.primary {
      border-color: transparent;
      background: var(--accent);
      color: #1b0f07;
      box-shadow: 0 18px 40px rgba(255, 138, 61, 0.25);
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: clamp(48px, 8vw, 86px);
    }

    .card {
      min-height: 170px;
      padding: 24px;
      border: 1px solid var(--line);
      border-radius: 22px;
      background: rgba(245, 234, 215, 0.04);
    }

    .card strong {
      display: block;
      margin-bottom: 14px;
      font-size: 22px;
    }

    .card span {
      color: var(--muted);
      font-size: 17px;
      line-height: 1.7;
    }

    .footer {
      margin-top: 56px;
      padding-top: 22px;
      border-top: 1px solid var(--line);
      color: rgba(245, 234, 215, 0.62);
      font: 600 13px/1.6 ui-monospace, SFMono-Regular, Consolas, monospace;
      direction: ltr;
      text-align: left;
    }

    @media (max-width: 760px) {
      nav { align-items: flex-start; }
      .nav-links { display: none; }
      .cards { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <main>
    <nav>
      <div class="brand">Management</div>
      <div class="nav-links">
        <a href="/">الرئيسية</a>
        <a href="/services/">الخدمات</a>
        <a href="/contact/">تواصل معنا</a>
      </div>
    </nav>

    <section>
      <div class="eyebrow"><span class="dot"></span> منصة إدارة الأعمال</div>
      <h1>نظّم عملك بثقة ووضوح</h1>
      <p>حل بسيط لإدارة المهام، متابعة الفريق، وترتيب أولويات العمل من مكان واحد بسرعة وبدون تعقيد.</p>
      <div class="actions">
        <a class="button primary" href="/contact/">ابدأ الآن</a>
        <a class="button" href="/services/">استعرض الخدمات</a>
      </div>
    </section>

    <section id="features" class="cards">
      <div class="card"><strong>إدارة المهام</strong><span>قسّم العمل، تابع التنفيذ، واعرف حالة كل مهمة بوضوح.</span></div>
      <div class="card"><strong>متابعة الفريق</strong><span>رؤية واحدة لكل الأعضاء والإنجازات والأولويات اليومية.</span></div>
      <div class="card"><strong>تقارير مختصرة</strong><span>مؤشرات سهلة تساعدك على اتخاذ القرار بسرعة.</span></div>
    </section>

    <div class="footer">Published on Vercel</div>
  </main>
</body>
</html>
`

fs.writeFileSync(path.join(publicDir, 'index.html'), html)
fs.writeFileSync(path.join(publicDir, 'robots.txt'), 'User-agent: *\nDisallow:\n')

const page = ({ title, description, body }) => `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} | Management</title>
  <meta name="description" content="${description}" />
  <style>
    :root { color-scheme: dark; --bg: #11110f; --ink: #f5ead7; --muted: #b9aa93; --line: #3a3024; --accent: #ff8a3d; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; background: radial-gradient(circle at 20% 20%, rgba(255, 138, 61, .2), transparent 28rem), linear-gradient(135deg, #0c0b0a, var(--bg)); color: var(--ink); font-family: Georgia, 'Times New Roman', serif; }
    main { width: min(92vw, 980px); margin: 7vh auto; padding: clamp(28px, 6vw, 64px); border: 1px solid var(--line); border-radius: 30px; background: rgba(27, 25, 21, .9); box-shadow: 0 28px 90px rgba(0,0,0,.45); }
    nav { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 70px; font: 800 15px/1 ui-monospace, SFMono-Regular, Consolas, monospace; }
    nav a { color: var(--muted); text-decoration: none; margin-inline-start: 18px; }
    h1 { margin: 0; font-size: clamp(46px, 8vw, 92px); line-height: .95; letter-spacing: -.05em; }
    p { color: var(--muted); font-size: clamp(18px, 2.2vw, 24px); line-height: 1.8; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 42px; }
    .card { padding: 24px; border: 1px solid var(--line); border-radius: 22px; background: rgba(245,234,215,.04); }
    .card strong { display: block; margin-bottom: 10px; font-size: 22px; }
    .button { display: inline-flex; margin-top: 28px; min-height: 52px; padding: 0 22px; align-items: center; border-radius: 999px; background: var(--accent); color: #1b0f07; text-decoration: none; font: 800 15px/1 ui-monospace, SFMono-Regular, Consolas, monospace; }
    @media (max-width: 760px) { .grid { grid-template-columns: 1fr; } nav { display: block; } nav div:last-child { margin-top: 18px; } }
  </style>
</head>
<body><main><nav><div>Management</div><div><a href="/">الرئيسية</a><a href="/services/">الخدمات</a><a href="/contact/">تواصل معنا</a></div></nav>${body}</main></body>
</html>`

const writePage = (route, content) => {
    const dir = path.join(publicDir, route)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'index.html'), content)
}

writePage(
    'services',
    page({
        title: 'الخدمات',
        description: 'خدمات إدارة الأعمال والمهام والفرق.',
        body: `<h1>خدمات تساعدك على السيطرة على العمل</h1><p>نقدم حلولًا واضحة لإدارة المهام، متابعة الفريق، وتنظيم التقارير اليومية.</p><section class="grid"><div class="card"><strong>تنظيم المهام</strong><p>ترتيب العمل حسب الأولوية والمسؤول والموعد.</p></div><div class="card"><strong>متابعة الأداء</strong><p>صورة مختصرة عن تقدم الفريق والإنجاز.</p></div><div class="card"><strong>تخطيط المشاريع</strong><p>تقسيم المشروع إلى مراحل قابلة للمتابعة.</p></div><div class="card"><strong>تقارير تنفيذية</strong><p>ملخصات سهلة تساعد في اتخاذ القرار.</p></div></section><a class="button" href="/contact/">اطلب الخدمة</a>`,
    })
)

writePage(
    'contact',
    page({
        title: 'تواصل معنا',
        description: 'تواصل معنا لبدء تنظيم عملك.',
        body: `<h1>ابدأ بتنظيم عملك اليوم</h1><p>راسلنا وسنساعدك في اختيار أفضل طريقة لإدارة أعمالك وفريقك.</p><a class="button" href="mailto:hello@example.com">hello@example.com</a>`,
    })
)

console.log('Created lightweight Vercel build in public/')
