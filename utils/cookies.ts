// utils/cookies.ts
export function setCookie(name: string, value: string, days = 7) {
   const d = new Date();
   d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
   document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

export function deleteCookie(name: string) {
   document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
}
