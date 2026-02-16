/**
 * Skrypt do wklejenia w konsoli przeglądarki (F12 → Console)
 * Uruchom go NA STRONIE PRODUKCYJNEJ: https://www.miniteamproject.pl
 * (albo Twoja domena Vercel)
 *
 * Sprawdza: robots.txt, sitemap.xml, canonical, meta description.
 * NIE zastępuje Google Search Console – tylko weryfikuje, że wszystko jest OK technicznie.
 */

(function () {
  const origin = window.location.origin;
  const results = { ok: [], err: [] };

  function log(msg, isError = false) {
    (isError ? results.err : results.ok).push(msg);
    console.log('%c' + msg, isError ? 'color: red' : 'color: green');
  }

  function logWarn(msg) {
    results.ok.push('(uwaga) ' + msg);
    console.log('%c' + msg, 'color: orange');
  }

  console.log('%c--- Weryfikacja SEO (robots, sitemap, meta) ---', 'font-weight: bold');
  console.log('Origin:', origin);

  // 1. Robots.txt
  fetch(origin + '/robots.txt')
    .then((r) => {
      if (!r.ok) {
        log('robots.txt: brak lub błąd HTTP ' + r.status, true);
        return null;
      }
      return r.text();
    })
    .then((body) => {
      if (!body) return;
      log('robots.txt: OK (dostępny)');
      const sitemapMatch = body.match(/Sitemap:\s*(.+)/);
      if (sitemapMatch) {
        const sitemapUrl = sitemapMatch[1].trim();
        if (sitemapUrl.startsWith(origin)) {
          log('robots.txt: Sitemap wskazuje na tę domenę: ' + sitemapUrl);
        } else {
          logWarn('robots.txt: Sitemap wskazuje na inną domenę: ' + sitemapUrl);
        }
      } else {
        log('robots.txt: brak linii Sitemap:', true);
      }
    })
    .catch(() => log('robots.txt: nie udało się pobrać', true));

  // 2. Sitemap.xml
  fetch(origin + '/sitemap.xml')
    .then((r) => {
      if (!r.ok) {
        log('sitemap.xml: brak lub błąd HTTP ' + r.status, true);
        return null;
      }
      return r.text();
    })
    .then((body) => {
      if (!body) return;
      log('sitemap.xml: OK (dostępny)');
      const locs = body.match(/<loc>([^<]+)<\/loc>/g);
      const count = locs ? locs.length : 0;
      log('sitemap.xml: liczba URL-i: ' + count);
      if (count > 0 && !body.includes(origin)) {
        logWarn('sitemap.xml: adresy w sitemapie mogą być z innej domeny (sprawdź w zakładce Network)');
      }
    })
    .catch(() => log('sitemap.xml: nie udało się pobrać', true));

  // 3. Meta / canonical na bieżącej stronie
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical && canonical.href) {
    if (canonical.href.startsWith(origin)) {
      log('Canonical: OK – ' + canonical.href);
    } else {
      logWarn('Canonical wskazuje na inną domenę: ' + canonical.href);
    }
  } else {
    logWarn('Brak <link rel="canonical"> na tej stronie');
  }

  const desc = document.querySelector('meta[name="description"]');
  if (desc && desc.content && desc.content.length >= 50) {
    log('Meta description: OK (' + desc.content.length + ' znaków)');
  } else if (desc && desc.content) {
    logWarn('Meta description jest krótkie (' + (desc.content?.length || 0) + ' znaków)');
  } else {
    logWarn('Brak lub pusta meta description');
  }

  // Podsumowanie po chwili (fetch jest async)
  setTimeout(() => {
    console.log('%c--- Podsumowanie ---', 'font-weight: bold');
    console.log('OK:', results.ok.length);
    if (results.err.length) console.log('Błędy:', results.err.length);
    console.log('Jeśli wszystko OK – dodaj sitemapę w Google Search Console (wymaga dostępu do konta Google).');
  }, 2500);
})();
