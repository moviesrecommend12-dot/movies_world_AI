// قائمة برموز الدول المحظورة من خدمات Gemini (أمثلة شائعة ويمكنك التعديل عليها)
const RESTRICTED_COUNTRIES: Record<string, string> = {
  SY: "سوريا",
  IR: "إيران",
  CU: "كوبا",
  KP: "كوريا الشمالية",
  SD: "السودان",
};

// دالة لمعرفة اسم الدولة بالعربية بناءً على رمزها
export function countryNameAr(code: string): string {
  return RESTRICTED_COUNTRIES[code.toUpperCase()] || "منطقة غير مدعومة";
}

// دالة تفحص هل الدولة الحالية موجودة في قائمة الحظر أم لا
export function isCountryRestricted(code: string): boolean {
  if (!code) return false;
  return Object.keys(RESTRICTED_COUNTRIES).includes(code.toUpperCase());
}