import { createContext, useContext } from 'react';

// The site has one page per language: / is English, /es is Spanish. The
// language comes from the URL, so each page can be prerendered and indexed
// on its own.
export const LANGS = ['en', 'es'];

const LangContext = createContext('en');

export const LangProvider = LangContext.Provider;

export function langFromPath(pathname) {
  return /^\/es(\/|$)/.test(pathname) ? 'es' : 'en';
}

export function useLang() {
  return useContext(LangContext);
}

/** Picks the current language's entry from a `{ en, es }` copy object. */
export function useCopy(copy) {
  return copy[useLang()];
}
