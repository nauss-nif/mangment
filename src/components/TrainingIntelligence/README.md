# منصة ذكاء الاحتياج التدريبي

مكون MVP مستقل داخل موقع Gatsby يعرض منظومة عربية لوكالة التدريب بجامعة نايف العربية للعلوم الأمنية. يعتمد على React وTypeScript وTailwind CSS، ويستخدم دليل الدورات الرسمي المستخرج من ملفات PDF الخاصة بوكالة التدريب.

## التشغيل

من جذر المشروع:

```bash
pnpm install
pnpm start
```

ثم افتح:

```text
http://localhost:8001/training-intelligence
```

## البنية

- `TrainingIntelligenceApp.tsx`: واجهة المنتج الكاملة، التبويبات، النماذج، البطاقات، والحالات التفاعلية.
- `naussCourseCatalog.json`: كتالوج الدورات المستخرج من ملفات PDF، ويحتوي 64 دورة قابلة للتوصية.
- `naussCourseCatalog.ts`: واجهة TypeScript للكتالوج.
- `naussRecommendationService.ts`: منطق التوصية المبني على اختيارات العميل والمجال التدريبي.
- `data.ts`: بيانات قديمة/مساندة للطلبات ومركز المحتوى.
- `mockAiService.ts`: منطق تجريبي سابق، محفوظ كمرجع وقابل للإزالة لاحقًا.
- `costing.ts`: حاسبة التكلفة الداخلية وتنسيق العملة.
- `documentGenerator.ts`: توليد الخطابات والعروض والملخصات العربية.
- `types.ts`: الأنواع المشتركة للبرامج، القطاعات، التحليل، التكلفة، والطلبات.

## تحديث الدليل

روابط ملفات PDF استخرجت من ملف `index.html` المرفق، ثم حملت إلى:

```text
training-intelligence-source-pdfs/
```

لإعادة استخراج الكتالوج بعد تحديث الدليل:

```bash
python scripts/extract_nauss_catalog.py
```

ينتج السكربت:

```text
src/components/TrainingIntelligence/naussCourseCatalog.json
src/components/TrainingIntelligence/naussCourseCatalog.ts
```

## ملاحظات تصميمية

- الواجهة عربية بالكامل وRTL.
- تستخدم خط Cairo عبر رابط Google Fonts في الصفحة.
- الألوان الأساسية: `#016564` و`#d0b284` و`#f8f9f9` مع درجات هادئة من Teal وGrey.
- لم يتم نسخ هوية PostHog أو محتواه، بل تم استخدام الفكرة المعمارية فقط: برامج كمنتجات، قطاعات كحالات استخدام، ومركز محتوى عملي.

## استبدال Mock AI لاحقًا

يمكن لاحقًا استبدال `naussRecommendationService.ts` بنداء API أو نموذج حقيقي، مع الإبقاء على نفس كتالوج الدورات الرسمي.
