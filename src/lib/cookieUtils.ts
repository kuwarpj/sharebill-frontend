// src/lib/cookieUtils.ts

/**
 * Sets a cookie.
 * @param name The name of the cookie.
 * @param value The value of the cookie.
 * @param options Optional settings for the cookie.
 */
export function setCookie(
    name: string,
    value: string,
    options: {
      path?: string;
      maxAge?: number; // in seconds
      expires?: Date;
      secure?: boolean;
      sameSite?: 'Lax' | 'Strict' | 'None';
    } = {}
  ): void {
    if (typeof document === 'undefined') {
      return; // Cannot set cookies on the server side
    }
  
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
    options.path = options.path || '/';
    cookieString += `; path=${options.path}`;
  
    if (options.maxAge) {
      cookieString += `; max-age=${options.maxAge}`;
    }
  
    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }
  
    if (options.secure) {
      cookieString += '; Secure';
    }
  
    if (options.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`;
    }
  
    document.cookie = cookieString;
  }
  
  /**
   * Gets a cookie by name.
   * @param name The name of the cookie.
   * @returns The cookie value or null if not found.
   */
  export function getCookie(name: string): string | null {
    if (typeof document === 'undefined') {
      return null; // Cannot get cookies on the server side
    }
  
    const nameEQ = `${encodeURIComponent(name)}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }
  
  /**
   * Deletes a cookie by name.
   * @param name The name of the cookie.
   * @param path Optional path for the cookie, defaults to '/'.
   */
  export function deleteCookie(name: string, path: string = '/'): void {
    if (typeof document === 'undefined') {
      return; // Cannot delete cookies on the server side
    }
    // Set the cookie with an expiration date in the past
    document.cookie = `${encodeURIComponent(name)}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`;
  }
  