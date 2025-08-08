### Integracja sklepu (PL) – Sanity, Clerk, Stripe, Vercel

#### 1) Branch i env

Utwórz branch: `git checkout -b feature/integracja-backend`

Utwórz `.env.local` w katalogu głównym:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_PROJECT_ID=
SANITY_DATASET=production
SANITY_API_TOKEN=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SUCCESS_URL=http://localhost:3000/success
NEXT_PUBLIC_CANCEL_URL=http://localhost:3000/cart

OPENAI_API_KEY=
```

Obsługujemy zarówno `NEXT_PUBLIC_SANITY_*` jak i `SANITY_*`.

#### 2) Sanity – schematy i import

- Schemat produktu rozszerzony o: `basePrice`, `toothCost`, `toothQty`, `priceTier`, `specifications`, `dateUpdated`, `externalId`.
- Dodane dokumenty: `company`, `customer`.

Import JSON z `sample_products.json` (format źródłowy → Sanity):

1. Zbuduj plik importu: `npm run build:import` (patrz niżej skrypt) albo użyj narzędzia jednorazowego: `node scripts/convert-sample-products.js`.
2. Zaimportuj do Sanity:

```
sanity dataset import ./.sanity-import/products.ndjson production --replace
```

Uwaga: Wymagany `SANITY_API_TOKEN` i `sanity` CLI zalogowany do projektu.

#### 3) API i płatności

- Endpoint `POST /api/checkout` – użyj akcji serwerowej `createCheckoutSession` (waluta PLN, sukces/blad URL z env).
- Webhook Stripe: `app/(client)/api/webhook/route.ts` – tworzy dokument `order` w Sanity i aktualizuje stany magazynowe.
- Endpoint `GET /api/products` – lista produktów z Sanity.

#### 4) Frontend i PL

- Formatowanie cen PL: komponent `PriceFormatter` używa `pl-PL`, `PLN`.
- W razie potrzeby przetłumacz komponenty na PL (teksty UI w `components/*`).
- Stan koszyka i ulubionych: `zustand` (`store.ts`).

#### 5) Wdrożenie Vercel

- Ustaw zmienne środowiskowe z `.env.local` w projekcie Vercel.
- Build: `npm run build`, Start: Next.js.
- Rewrites do `/studio` jeśli Studio hostowane w tym samym projekcie.

---

### Skrypt: konwersja `sample_products.json` → NDJSON (Sanity import)

Plik: `scripts/convert-sample-products.js`

Uruchomienie:

```
node scripts/convert-sample-products.js
```

Wynik zapisuje do `./.sanity-import/products.ndjson`.

Mapowanie pól (przykład):
- `title` → `name`
- `description` → `description`
- `price` (liczba z tekstu "zł") → `price`
- `category` (string) → referencja do `category` według dopasowania nazwy (jeśli brak, zapis string w `specifications.features`)
- `date_updated` → `dateUpdated`
- `id` → `externalId`

Wartości bez obrazów będą miały puste `images`.

---

### Dobre praktyki (na bazie kodu)

- Waluta: zawsze `PLN` (Stripe, formatter, PriceView).
- Dane: czytaj z Sanity przez `sanity/lib/client` i GROQ (zob. `sanity/queries`).
- Stan: `zustand` z `persist` (klucz `cart-store`).
- Auth: routes wymagające logowania – użyj `@clerk/nextjs` (middleware skonfigurowany).
- Webhook Stripe: zweryfikuj sygnaturę i użyj `STRIPE_WEBHOOK_SECRET`.
- Schematy trzymać w `sanity/schemaTypes`, zmiany wersjonować i generować typy przez `npm run typegen`.

