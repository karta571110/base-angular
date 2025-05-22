import { enUS, type Locale, zhCN, zhTW } from 'date-fns/locale';

export const locale: Record<string, Locale> = {
  zh: zhTW,
  cn: zhCN,
  en: enUS,
} as const;
