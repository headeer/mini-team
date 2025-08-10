<<<<<<< HEAD
# mini-team
=======
To jest projekt [Next.js](https://nextjs.org) zintegrowany z Sanity, Clerk i Stripe. Polska konfiguracja sklepu MiniTeam.

## Szybki start

1) Utwórz plik `.env.local` (patrz `DOCS.md`) i ustaw klucze: Sanity, Clerk, Stripe.
2) Zainstaluj zależności i uruchom serwer developerski:

```bash
npm install && npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Otwórz [http://localhost:3000](http://localhost:3000).

Sanity Studio dostępne pod `/studio` (po dodaniu projektu Sanity). Import produktów: `DOCS.md` sekcja Import.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Więcej

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

Przygotowanie do wdrożenia na Vercel (Next.js App Router, Sanity, Stripe):

1) Zmienne środowiskowe (Vercel → Project → Settings → Environment Variables):

- NEXT_PUBLIC_BASE_URL = https://twoja-domena.pl
- NEXT_PUBLIC_SUCCESS_URL = https://twoja-domena.pl/success
- NEXT_PUBLIC_CANCEL_URL = https://twoja-domena.pl/cart
- NEXT_PUBLIC_SANITY_PROJECT_ID = <Sanity Project ID>
- NEXT_PUBLIC_SANITY_DATASET = production
- SANITY_PROJECT_ID = <Sanity Project ID>
- SANITY_DATASET = production
- STRIPE_SECRET_KEY = sk_live_xxx
- STRIPE_WEBHOOK_SECRET = whsec_xxx (jeśli używasz webhooków)
- CLERK_PUBLISHABLE_KEY = pk_live_xxx (jeśli Clerk aktywny)
- CLERK_SECRET_KEY = sk_live_xxx (jeśli Clerk aktywny)

2) Dozwolone obrazy (już ustawione w `next.config.ts`):
- `cdn.sanity.io`, `miniteamproject.pl`, `www.miniteamproject.pl` (http/https). W razie potrzeby dodaj kolejne hosty.

3) Sanity (dane produktów):
- Upewnij się, że projekt Sanity jest publicznie czytelny (lub skonfiguruj token i API route do serwera).
- Zaimportuj kategorie/produkty (lokalnie):
  - `npx ts-node -e "require('./scripts/ensure-olx-pricing.ts')"`
  - `npx ts-node -e "require('./scripts/import-products-from-json.ts')"`
  - `npx sanity dataset import ./.sanity-import/products.ndjson production --replace`

4) Stripe:
- W Stripe Dashboard dodaj `https://twoja-domena.pl/api/webhook` jako endpoint (lub Vercel preview URL) z sekretem `STRIPE_WEBHOOK_SECRET`.

5) Vercel Deploy:
- Po ustawieniu env → kliknij Deploy. Vercel wykryje Next.js i zbuduje projekt.
- Routey: strona główna `/`, sklep `/shop`, produkt `/product/[slug]`, studio `/studio`.

6) Domeny i protokół:
- Podłącz domenę w Vercel (Project → Settings → Domains). Warto wymusić https.

7) Testy po wdrożeniu:
- Sprawdź ładowanie obrazów (czy hostname jest na liście w `next.config.ts`).
- Sprawdź ceny (OLX przekreślone), działanie koszyka, wishlisty, checkoutu Stripe.

Linki:
- Next.js Deploy: https://nextjs.org/docs/app/building-your-application/deploying
- Vercel: https://vercel.com
>>>>>>> feature/integracja-backend
