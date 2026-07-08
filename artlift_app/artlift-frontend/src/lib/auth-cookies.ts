export function setAuthCookies(access: string, refresh: string) {
  document.cookie = `access_token=${access}; path=/; max-age=3600; samesite=lax`;
  document.cookie = `refresh_token=${refresh}; path=/; max-age=604800; samesite=lax`;

  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}
