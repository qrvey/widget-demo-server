/* firewall.js 
   Blocks POST / PUT / PATCH / DELETE when the URL matches any regex in
   PATTERNS, then returns 201 â€œBlocked (demo)â€ so DevTools stays clean.      */

/* 1 â–¸ write methods to trap */
const METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

/* 2 â–¸ structural patterns to block */
const PATTERNS = [
    /*  v3 / v4  */

  /* builder page */
  /^\/?devapi\/v[34]\/user\/[^/]+\/app\/[^/]+\/builder\/page\/[^/]+$/,

  /* qrvey root */
  /^\/?devapi\/v[34]\/user\/[^/]+\/app\/[^/]+\/qrvey\/[^/]+$/,

  /* qrvey analytiq chart */
  /^\/?devapi\/v[34]\/user\/[^/]+\/app\/[^/]+\/qrvey\/[^/]+\/analytiq\/chart\/?.*$/,

  /* qrvey analytiq themes */
  /^\/?devapi\/v[34]\/user\/[^/]+\/app\/[^/]+\/qrvey\/[^/]+\/analytiq\/themes\/.*$/,

  /* qrvey analytiq formula (create, update, delete) */
  /^\/?devapi\/v[34]\/user\/[^/]+\/app\/[^/]+\/qrvey\/[^/]+\/analytiq\/formula(?:\/[^/]+)?\/?$/,

  /* qrvey analytiq model (list / duplicate) */
  /^\/?devapi\/v[34]\/user\/[^/]+\/app\/[^/]+\/qrvey\/[^/]+\/analytiq\/model\/?$/,

  /* automatiq workflow root (create) */
  /^\/?devapi\/v[34]\/user\/[^/]+\/app\/[^/]+\/automatiq\/workflow\/?$/,

  /* automatiq workflow id + optional sub-action */
  /^\/?devapi\/v[34]\/user\/[^/]+\/app\/[^/]+\/automatiq\/workflow\/[^/]+(?:\/(?:pause|activate|duplicate))?$/,

  /*  v5  */

  /* export schedule download */
  /^\/?devapi\/v5\/export\/user\/[^/]+\/downloads\/schedule\/[^/]+$/,

  /* export_init */
  /^\/?devapi\/v5\/export\/user\/[^/]+\/export_init$/,

  /* qrvey analytiq model rows (same shape as v4 pattern above, but keep for clarity) */
  /^\/?devapi\/v5\/user\/[^/]+\/app\/[^/]+\/qrvey\/[^/]+\/analytics\/results\/rows$/,

  /*  v6  */

  /* builder report root (create) */
  /^\/?devapi\/v6\/user\/[^/]+\/app\/[^/]+\/builder\/report\/?$/,

  /* builder report id (update / delete / star) */
  /^\/?devapi\/v6\/user\/[^/]+\/app\/[^/]+\/builder\/report\/[^/]+$/,

  /* builder report section (already existed) */
  /^\/?devapi\/v6\/user\/[^/]+\/app\/[^/]+\/builder\/report\/[^/]+\/section\/[^/]+$/,

  /*  dx/v1 (unchanged)  */

  /* dashboard root or :id */
  /^\/?dx\/v1\/dashboard(?:\/[^/]+)?$/,

  /* element root or :id */
  /^\/?dx\/v1\/element(?:\/[^/]+)?$/,

  /*  sharing  */

  /* unsubscribe asset */
  /^\/?sharing\/v1\/asset\/[^/]+$/
];

/* helper */
function isBlocked(method, url) {
  if (!METHODS.includes(method)) return false;
  const path = new URL(url, location).pathname;
  return PATTERNS.some(re => re.test(path));
}

/*  fetch() interceptor  */
const realFetch = window.fetch.bind(window);

window.fetch = async (input, init = {}) => {
  const method = (init.method || 'GET').toUpperCase();
  const url    = typeof input === 'string' ? input : input.url;

  if (isBlocked(method, url)) {
    return new Response(null, { status: 201, statusText: 'Blocked (demo)' });
  }
  return realFetch(input, init);
};

/*  XMLHttpRequest interceptor (Zone-safe)  */
(() => {
  const XHR      = XMLHttpRequest.prototype;
  const openReal = XHR.open;
  const sendReal = XHR.send;

  /* redefine read-only props so Zone.js wonâ€™t complain */
  function spoofReadonly(xhr, status, statusText) {
    const fake = {
      readyState   : () => 4,
      status       : () => status,
      statusText   : () => statusText,
      response     : () => null,
      responseText : () => ''
    };
    for (const [k, g] of Object.entries(fake)) {
      Object.defineProperty(xhr, k, { configurable: true, get: g });
    }
  }

  XHR.open = function (method, url, ...rest) {
    this.__blocked = isBlocked(method.toUpperCase(), url);
    return openReal.call(this, method, url, ...rest);
  };

  XHR.send = function (...args) {
    if (this.__blocked) {
      spoofReadonly(this, 201, 'Blocked (demo)');
      Promise.resolve().then(() => {
        ['readystatechange', 'load', 'loadend'].forEach(ev =>
          this.dispatchEvent(new Event(ev))
        );
      });
      return;  // skip the real network
    }
    return sendReal.apply(this, args);
  };
})();