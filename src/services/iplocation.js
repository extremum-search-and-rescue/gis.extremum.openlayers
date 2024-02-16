import { Config } from '../config';

/**
 * @type {{
  * update: () => void
 * country: string,
 * timezone: string
 * ip?: string
 * city?: string
 * loc: Array<number>
 * }}
 */
export const IpToLocation = {
  country: 'RU',
  timezone: 'Europe/Moscow',
  city: undefined,
  ip: undefined,
  loc: [30, 60],
  update() {
    if (navigator.onLine) {
      const timeoutSignal = new AbortController();
      const timeout = setTimeout(() => timeoutSignal.abort(), 5000);
      fetch(`https://ipinfo.io/?token=${Config.IpInfoToken}`, {
        method: 'get',
        signal: timeoutSignal.signal,
        headers: {
          'Accept': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          clearTimeout(timeout);
          return response.text();
        }
      }).then(text => {
        const result = JSON.parse(text);
        if (result && result.loc && result.country) {
          const location = result.loc.split(',');
          IpToLocation.timezone = result.timezone;
          Config.center[location];

          IpToLocation.country = result.country;
          if (window.localStorage){
            localStorage.setItem('ipinfo-country', result.country);
            localStorage.setItem('ipinfo-city', result.city);
          }
        }
      }).catch(err => {
        // eslint-disable-next-line no-console
        console.debug(err);
      });
    }
  }
};