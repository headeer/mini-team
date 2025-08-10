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

Przydatne komendy:

```
# Logowanie i wybór projektu
sanity login
sanity init --reconfigure

# Studio lokalnie
sanity docs
sanity start

# Generowanie typów TS
npm run typegen
```

#### 3) API i płatności

- Endpoint `POST /api/checkout` – użyj akcji serwerowej `createCheckoutSession` (waluta PLN, sukces/blad URL z env).
- Webhook Stripe: `app/(client)/api/webhook/route.ts` – tworzy dokument `order` w Sanity i aktualizuje stany magazynowe.
- Endpoint `GET /api/products` – lista produktów z Sanity.

Dodatkowo:
- `GET /api/orders` – zamówienia zalogowanego użytkownika.
- `POST /api/contact` – przyjmuje zapytania z formularza kontaktowego.

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

---

### Jak dodać produkt (krok po kroku)

1) Wejdź do Sanity Studio (`/studio`) i otwórz typ `Produkt`.
2) Uzupełnij:
- Tytuł i `slug` (generowany automatycznie z tytułu),
- `Kategoria` (referencja),
- `Zakres maszyn (priceTier)` – np. `1-1.5t`, `2.3-3t`,
- `Cena bazowa (basePrice)` w zł,
- `Zęby`: `toothCost` (zł) i `toothQty` (szt) – jeśli dotyczy,
- `Specyfikacje`: `widthCm`, `pinDiameterMm`, `volumeM3`, `quickCoupler`, `features`,
- `Opis`, `Zdjęcia` (min. 1 dla listingu),
- `Status` = `active`, `Data aktualizacji` (now), `externalId` (opcjonalnie), `location` (opcjonalnie).

3) Zapisz. Produkt będzie widoczny w sklepie po publikacji (Publish).

Uwagi:
- Ceny w UI liczymy jako: łączna cena pozycji = `basePrice + toothCost × toothQty`.
- Jeśli `toothCost/toothQty` puste – przyjmujemy 0.

---

### Jak dodać kategorię / markę

- Kategoria: w Studio otwórz `Kategoria`, dodaj `title` i `slug`, zapisz.
- Marki: jeśli używasz typu `brand` – dodaj dokumenty marek i połącz referencjami z produktami.

---

### Konfiguracja środowiska i kluczy

1) `.env.local` – wypełnij wszystkie klucze (Sanity, Clerk, Stripe, URL‑e).
2) Vercel – dodaj te same zmienne w Project Settings → Environment Variables.
3) Stripe – utwórz endpoint webhooka i podaj `STRIPE_WEBHOOK_SECRET`.

Lokalny webhook (Stripe CLI):

```
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

---

### API – przydatne endpointy

- `GET /api/products` – listuje produkty (GROQ, z kategoriami).
- `GET /api/orders` – zamówienia zalogowanego użytkownika (Clerk auth).
- `POST /api/contact` – wysyła dane formularza (możesz rozszerzyć o email/CRM/Sanity).
- Webhook `POST /api/webhook` – obsługa `checkout.session.completed` i zapis `order` w Sanity.

---

### Checkout i płatności

- Akcja: `actions/createCheckoutSession.ts` – tworzy Stripe Checkout (PLN, success/cancel z env),
- Front: `/cart` i `/checkout` – przekazują pozycje, liczą cenę pozycji jako `basePrice + toothCost × toothQty`.
- Po płatności webhook tworzy dokument `order` w Sanity z pozycjami.

---

### Dostęp do panelu admin (Studio)

- Lokalnie: `npm run dev`, a następnie przejdź do `/studio`.
- Produkcja: skonfiguruj rewrite / zabezpieczenia wg potrzeb (np. Basic Auth lub role w Vercel Edge / middleware Clerk).

---

### Deployment – checklista

- [ ] `.env.local` uzupełniony i przeniesiony do Vercel.
- [ ] Sanity: dataset `production`, schematy zaktualizowane, typy wygenerowane.
- [ ] Import produktów wykonany (NDJSON) lub dodane ręcznie.
- [ ] Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` ustawione, webhook aktywny.
- [ ] Clerk: klucze ustawione, middleware działa na trasach wymagających logowania.
- [ ] Budowa i test płatności (tryb testowy Stripe) – przejście success/cancel, webhook zapisuje zamówienie.

---

## Opis projektu i architektura

- Next.js (App Router) – UI, API routes, SSR/ISR.
- Sanity – CMS dla produktów, kategorii, klientów i zamówień (przez webhook Stripe).
- Clerk – logowanie użytkowników (koszyk, zamówienia).
- Stripe – płatności (Checkout, webhooki).
- Zustand – koszyk i ulubione z `persist`.
- Tailwind CSS – stylowanie (kolory markowe w `app/globals.css`).

## Mapa stron (App Router)

- Home: `app/(client)/page.tsx` – hero, kategorie, powody, realizacje, FAQ, CTA.
- Oferta/Sklep: `app/(client)/shop/page.tsx` – listing + filtry.
- Produkt: `app/(client)/product/[slug]/page.tsx` – szczegóły.
- Koszyk: `app/(client)/cart/page.tsx` – pozycje, podsumowanie, checkout.
- Checkout: `app/(client)/checkout/page.tsx` – dane, adres, płatność, zgody.
- Zamówienia: `app/(client)/orders/page.tsx` – historia zamówień.
- Realizacje: `app/(client)/realizacje/page.tsx`.
- Blog: `app/(client)/blog/*`.
- API: `app/(client)/api/*` (products, orders, webhook, contact).
- Studio (admin): `app/studio/[[...tool]]/page.tsx` → `/studio`.

## Zarządzanie treściami i copy

- Teksty sekcji Home znajdują się w komponentach:
  - `components/home/HomeHero.tsx` (nagłówki, CTA, link do `#products`).
  - `components/home/WhyUs.tsx`, `components/home/SevenReasons.tsx`.
  - `components/home/RealizacjeCarousel.tsx`, `components/home/FAQ.tsx`, `components/home/FinalCTA.tsx`.
  - Pasek korzyści: `components/TopBenefitsBar.tsx`.
- Menu i linki: `constants/data.ts` (Start / Oferta / Realizacje / Cennik / Kontakt).
- Logo/branding: `components/Logo.tsx`, kolory w `app/globals.css` (`--color-brand-orange`, `--color-brand-red`).

## Produkty i filtry – wymagane pola

- Aby filtry działały, uzupełnij w Sanity:
  - `category` (ref), `priceTier` (np. `1-1.5t`, `2.3-3t`),
  - `specifications.widthCm`, `specifications.pinDiameterMm`, `specifications.quickCoupler`,
  - `specifications.features` (np. „Zęby w komplecie”, „Wersja Skandynawska”),
  - `location` (opcjonalnie), `dateUpdated`.
- Ceny: `basePrice` (wymagane), opcjonalnie `toothCost` i `toothQty`.
- Obrazy: dodaj min. 1 zdjęcie, dla lepszego UX używaj proporcji 4:3 lub 1:1.

## Dostosowanie brandingu i UI

- Zmiana kolorów: `app/globals.css` (CSS variables) i `tailwind.config.ts` (jeśli rozszerzasz paletę).
- Zmiana hero: `HomeHero.tsx` – nagłówki, tło, CTA.
- MegaMenu „Oferta”: `components/HeaderMenu.tsx` (pobieranie kategorii z Sanity – jeśli nie ma, dodaj). 

## SEO i wydajność

- Używaj `next/image` oraz Sanity image builder (`sanity/lib/image.ts`) do optymalizacji.
- Dodaj metadane na stronach (export `metadata`) – przykłady w istniejących plikach.
- Rozważ dodanie `sitemap.xml` i `robots.txt` (Next.js route handlers).

## Analityka i monitoring (opcjonalnie)

- Możesz dodać Vercel Analytics lub GA4 – integracja w `app/layout.tsx`.
- Logi/webhooki Stripe – sprawdzaj w Stripe Dashboard i w logach Vercel.

## Autoryzacja i role

- Clerk – komponenty `SignedIn`, `SignedOut`, `UserButton`; ochrona tras przez middleware.
- Studio (admin) – rozważ ograniczenie dostępu (Basic Auth / Clerk / IP allowlist) w produkcji.

## Najczęstsze modyfikacje

- Dodanie nowej kategorii: Sanity → `Kategoria` → użyj w filtrach i menu.
- Dodanie nowego pola produktu: dopisz w schemacie `product`, uruchom `npm run typegen`, zaktualizuj GROQ i UI.
- Zmiana kosztu wysyłki/progu darmowej dostawy: logika w koszyku/checkout (39 zł, próg 1000 zł).

## AI chat – wdrożenie

- Przygotuj endpoint `/api/ai` (OpenAI SDK / RAG pod produkt):
  - Wejście: pytanie + kontekst produktu/kategorii.
  - Wyjście: zwięzła odpowiedź i sugestie produktów.
- Podmień `components/home/AIWidgetStub.tsx` na realny widget, wywołujący `/api/ai`.


