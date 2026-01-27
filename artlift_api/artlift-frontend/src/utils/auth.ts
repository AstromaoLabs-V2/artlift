const tokenCache = new Map<string, { valid: boolean; expiry: number }>();

export async function verifyJWT(token: string) {
  const cached = tokenCache.get(token);
  if (cached && cached.expiry > Date.now()) {
    console.log("to verify caches -kai");
    return cached.valid;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
      cache: "no-store",
    });

    const isValid = res.ok;

    tokenCache.set(token, {
      valid: isValid,
      expiry: Date.now() + 5 * 60 * 1000,
    });

    return isValid;
  } catch (error) {
    console.error("error", error);
    return false;
  }
}

export function clearTokenCache() {
  tokenCache.clear();
  console.log("try to clear token");
}