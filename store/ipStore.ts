// store/ipStore.ts
import { create } from 'zustand';

const RESTRICTED_COUNTRIES = new Set([
  'CN', 'HK', 'MO', 'RU', 'BY', 'IR', 'KP', 'SY', 'CU', 'SD', 'VE', 'MM'
]);

const COUNTRY_NAMES_AR: Record<string, string> = {
  'CN': 'الصين',
  'HK': 'هونج كونج',
  'MO': 'ماكاو',
  'RU': 'روسيا',
  'BY': 'بيلاروسيا',
  'IR': 'إيران',
  'KP': 'كوريا الشمالية',
  'SY': 'سوريا',
  'CU': 'كوبا',
  'SD': 'السودان',
  'VE': 'فنزويلا',
  'MM': 'ميانمار',
};

interface IpState {
  isChecking: boolean;
  isRestricted: boolean;
  detectedCountry: string;
  hasChecked: boolean;
  checkLocation: () => Promise<void>;
  dismissDialog: () => void;
  reset: () => void;
}

export const useIpStore = create<IpState>((set, get) => ({
  isChecking: false,
  isRestricted: false,
  detectedCountry: '',
  hasChecked: false,

  checkLocation: async () => {
    if (get().hasChecked) return;
    set({ isChecking: true });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch('https://ipapi.co/json/', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const countryCode = (data.country_code || '').toUpperCase();
        const countryNameEn = data.country_name || 'Unknown';
        const countryNameAr = COUNTRY_NAMES_AR[countryCode] || countryNameEn;
        const isCountryRestricted = RESTRICTED_COUNTRIES.has(countryCode);

        set({
          detectedCountry: countryNameAr,
          isRestricted: isCountryRestricted,
          hasChecked: true,
          isChecking: false,
        });
      } else {
        set({ isRestricted: false, hasChecked: true, isChecking: false });
      }
    } catch {
      set({ isRestricted: false, hasChecked: true, isChecking: false });
    }
  },

  dismissDialog: () => set({ isRestricted: false }),
  reset: () => set({ hasChecked: false, isRestricted: false, detectedCountry: '' }),
}));
