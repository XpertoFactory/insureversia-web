import en from './en.json';
import es from './es.json';

const translations: Record<string, typeof en> = { en, es };

export type Locale = 'en' | 'es';
export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'es'];

export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale] || translations[defaultLocale];
  for (const k of keys) {
    value = value?.[k];
  }
  return value ?? key;
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, locale] = url.pathname.split('/');
  if (locales.includes(locale as Locale)) return locale as Locale;
  return defaultLocale;
}

export function getLocalePath(locale: Locale, path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return cleanPath;
  return `/${locale}${cleanPath}`;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'en' ? 'es' : 'en';
}

export function getAlternateLocales(locale: Locale): Locale[] {
  return locales.filter(l => l !== locale);
}

export function getAlternatePath(currentUrl: URL): string {
  const locale = getLocaleFromUrl(currentUrl);
  const alternate = getAlternateLocale(locale);
  return getPathForLocale(currentUrl, alternate);
}

export function getPathForLocale(currentUrl: URL, targetLocale: Locale): string {
  const currentLocale = getLocaleFromUrl(currentUrl);
  const path = currentUrl.pathname;

  // Strip current locale prefix
  let basePath: string;
  if (currentLocale === defaultLocale) {
    basePath = path;
  } else {
    basePath = path.replace(`/${currentLocale}`, '') || '/';
  }

  // Add target locale prefix
  if (targetLocale === defaultLocale) {
    return basePath;
  }
  return `/${targetLocale}${basePath}`;
}
