
import Cookies from 'js-cookie';

export const cookieManager = {
  setCookie: (name: string, value: string, days: number = 30) => {
    Cookies.set(name, value, { expires: days, sameSite: 'strict' });
  },
  
  getCookie: (name: string): string | undefined => {
    return Cookies.get(name);
  },
  
  removeCookie: (name: string) => {
    Cookies.remove(name);
  },
  
  checkCookieExists: (name: string): boolean => {
    return Cookies.get(name) !== undefined;
  }
};
