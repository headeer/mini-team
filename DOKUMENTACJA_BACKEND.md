# Dokumentacja Backend - System Zarządzania Sklepem

## Spis treści
1. [Przegląd systemu](#przegląd-systemu)
2. [Zarządzanie zamówieniami](#zarządzanie-zamówieniami)
3. [Zarządzanie produktami](#zarządzanie-produktami)
4. [API Endpoints](#api-endpoints)
5. [Struktura danych](#struktura-danych)
6. [Instrukcje krok po kroku](#instrukcje-krok-po-kroku)

---

## Przegląd systemu

System sklepu internetowego oparty jest na następujących technologiach:
- **Sanity CMS** - zarządzanie treścią i danymi
- **Stripe** - obsługa płatności
- **Clerk** - autoryzacja użytkowników
- **Next.js** - framework aplikacji

### Główne funkcjonalności:
- ✅ Zarządzanie produktami
- ✅ Obsługa zamówień
- ✅ System płatności
- ✅ Panel administracyjny
- ✅ API dla integracji

---

## Zarządzanie zamówieniami

### Gdzie znajdować zamówienia

#### 1. Panel Sanity Studio
**Lokalizacja:** `/studio` (lokalnie) lub domena + `/studio` (produkcja)

**Jak dostać się do zamówień:**
1. Otwórz Sanity Studio
2. W menu po lewej stronie znajdź sekcję **"Zamówienie"**
3. Kliknij na nią, aby zobaczyć wszystkie zamówienia

#### 2. API Endpoint dla administratorów
**URL:** `GET /api/admin/orders?key=TWÓJ_KLUCZ_API`

**Parametry:**
- `key` - klucz API (wymagany dla bezpieczeństwa)

**Przykład użycia:**
```
https://twoja-domena.com/api/admin/orders?key=twoj-klucz-api
```

### Struktura zamówienia

Każde zamówienie zawiera następujące pola:

```json
{
  "_id": "unikalny-id-zamówienia",
  "orderNumber": "ZAM-2024-001",
  "customerName": "Jan Kowalski",
  "email": "jan.kowalski@email.com",
  "totalPrice": 1250.00,
  "currency": "PLN",
  "status": "paid",
  "orderDate": "2024-01-15T10:30:00Z",
  "products": [
    {
      "product": {
        "_ref": "id-produktu",
        "name": "Łyżka koparki 1.2m³"
      },
      "quantity": 2
    }
  ],
  "address": {
    "name": "Jan Kowalski",
    "address": "ul. Przykładowa 123",
    "city": "Warszawa",
    "zip": "00-001",
    "state": "Mazowieckie"
  },
  "stripeCheckoutSessionId": "cs_test_...",
  "stripePaymentIntentId": "pi_...",
  "amountDiscount": 0
}
```

### Statusy zamówień

| Status | Opis | Kolor w panelu |
|--------|------|----------------|
| `pending` | Oczekujące | Żółty |
| `processing` | W realizacji | Niebieski |
| `paid` | Opłacone | Zielony |
| `shipped` | Wysłane | Fioletowy |
| `out_for_delivery` | W doręczeniu | Pomarańczowy |
| `delivered` | Dostarczone | Ciemnozielony |
| `cancelled` | Anulowane | Czerwony |

### Jak zmienić status zamówienia

1. Otwórz Sanity Studio
2. Znajdź zamówienie w sekcji "Zamówienie"
3. Kliknij na zamówienie, aby je edytować
4. W polu "Status zamówienia" wybierz nowy status
5. Kliknij "Publish" aby zapisać zmiany

---

## Zarządzanie produktami

### Gdzie dodawać produkty

#### 1. Panel Sanity Studio
**Lokalizacja:** `/studio` → sekcja **"Produkt"**

### Struktura produktu

Każdy produkt zawiera następujące pola:

#### Podstawowe informacje
```json
{
  "name": "Łyżka koparki 1.2m³",
  "slug": "lyzka-koparki-1-2m3",
  "description": "Opis produktu...",
  "hidden": false,
  "status": "active"
}
```

#### Ceny
```json
{
  "priceNet": 1000.00,
  "priceGross": 1230.00,
  "priceOlx": 1100.00,
  "basePrice": 800.00,
  "toothCost": 50.00,
  "toothQty": 4,
  "priceTier": "standard",
  "discount": 0
}
```

**Objaśnienie pól cenowych:**
- `priceNet` - cena netto (bez VAT)
- `priceGross` - cena brutto (z VAT 23%)
- `priceOlx` - cena dla portalu OLX
- `basePrice` - cena bazowa produktu
- `toothCost` - koszt jednego zęba
- `toothQty` - liczba zębów
- `priceTier` - poziom cenowy (standard/premium/luxury)
- `discount` - rabat w procentach

**Obliczanie ceny końcowej:**
```
Cena końcowa = basePrice + (toothCost × toothQty)
```

#### Specyfikacje techniczne
```json
{
  "specifications": {
    "widthCm": 120,
    "pinDiameterMm": 80,
    "volumeM3": 1.2,
    "cuttingEdge": "Hardox 400",
    "toothThickness": 25,
    "toothCount": 4,
    "features": ["Szybkozłącze", "Wzmocnione krawędzie"],
    "machineCompatibility": ["CAT 320", "JCB 220"],
    "quickCoupler": "ISO 15110",
    "kinetyka": 45,
    "ramie": 1200
  }
}
```

#### Magazyn i dostępność
```json
{
  "stock": 5,
  "phoneOrderOnly": false,
  "externalId": "LYZKA-001",
  "location": "Magazyn A"
}
```

#### Kategorie i marki
```json
{
  "categories": [
    {
      "_ref": "id-kategorii",
      "title": "Łyżki koparek"
    }
  ],
  "brand": {
    "_ref": "id-marki",
    "title": "Mini Team Project"
  }
}
```

#### Obrazy
```json
{
  "images": [
    {
      "asset": {
        "_ref": "id-obrazu",
        "url": "https://cdn.sanity.io/..."
      }
    }
  ]
}
```

### Jak dodać nowy produkt

#### Krok 1: Otwórz panel produktów
1. Przejdź do Sanity Studio (`/studio`)
2. Kliknij **"Produkt"** w menu po lewej
3. Kliknij **"Create"** → **"Produkt"**

#### Krok 2: Wypełnij podstawowe informacje
```
Tytuł: Łyżka koparki 1.2m³
Slug: lyzka-koparki-1-2m3 (generuje się automatycznie)
Opis: Szczegółowy opis produktu...
```

#### Krok 3: Ustaw ceny
```
Cena netto (zł): 1000.00
Cena brutto (zł): 1230.00
Cena OLX (zł): 1100.00
Cena bazowa: 800.00
Koszt zęba: 50.00
Liczba zębów: 4
Poziom cenowy: standard
Rabat (%): 0
```

#### Krok 4: Dodaj specyfikacje
```
Szerokość (cm): 120
Średnica sworznia (mm): 80
Pojemność (m³): 1.2
Lemiesz (opis): Hardox 400
Grubość zęba (mm): 25
Liczba zębów (szt): 4
Cechy: Szybkozłącze, Wzmocnione krawędzie
Kompatybilność maszyn: CAT 320, JCB 220
Szybkozłącze: ISO 15110
Kinetyka (°): 45
Ramię (mm): 1200
```

#### Krok 5: Ustaw magazyn
```
Stan magazynowy: 5
Zamówienia telefoniczne: Nie (odznaczone)
Zewnętrzne ID: LYZKA-001
Lokalizacja: Magazyn A
```

#### Krok 6: Wybierz kategorie i markę
1. W sekcji **"Kategorie"** kliknij **"Add item"**
2. Wybierz odpowiednią kategorię z listy
3. W sekcji **"Marka"** wybierz markę produktu

#### Krok 7: Dodaj obrazy
1. W sekcji **"Product Images"** kliknij **"Add item"**
2. Kliknij **"Upload"** lub **"Select"** aby wybrać obraz
3. Dodaj minimum 1 obraz (pierwszy będzie głównym)

#### Krok 8: Zapisz i opublikuj
1. Kliknij **"Publish"** w prawym górnym rogu
2. Produkt będzie widoczny w sklepie

### Jak edytować istniejący produkt

1. Otwórz Sanity Studio
2. Przejdź do sekcji **"Produkt"**
3. Znajdź produkt na liście
4. Kliknij na produkt, aby go edytować
5. Wprowadź zmiany
6. Kliknij **"Publish"** aby zapisać

### Jak ukryć produkt w sklepie

1. Otwórz produkt do edycji
2. W sekcji **"Ukryj w sklepie"** zaznacz checkbox
3. Kliknij **"Publish"**

---

## API Endpoints

### Produkty

#### Pobierz wszystkie produkty
```
GET /api/products
```

**Odpowiedź:**
```json
{
  "data": [
    {
      "_id": "id-produktu",
      "name": "Łyżka koparki",
      "slug": "lyzka-koparki",
      "priceNet": 1000.00,
      "priceGross": 1230.00,
      "images": [...],
      "categories": [...],
      "stock": 5
    }
  ]
}
```

#### Eksport produktów
```
GET /api/products/export
```

**Odpowiedź:** Plik JSON z wszystkimi produktami

### Zamówienia

#### Pobierz zamówienia użytkownika
```
GET /api/orders
```

**Wymagania:** Użytkownik musi być zalogowany

#### Pobierz zamówienia (admin)
```
GET /api/admin/orders?key=KLUCZ_API
```

**Parametry:**
- `key` - klucz API administratora

### Płatności

#### Utwórz sesję płatności
```
POST /api/checkout
```

**Body:**
```json
{
  "items": [
    {
      "productId": "id-produktu",
      "quantity": 2
    }
  ],
  "customerEmail": "klient@email.com",
  "customerName": "Jan Kowalski"
}
```

#### Webhook Stripe
```
POST /api/webhook
```

**Automatycznie tworzy zamówienie po udanej płatności**

---

## Struktura danych

### Tabele/Grupy danych

#### 1. Produkty (`product`)
- **Lokalizacja:** Sanity Studio → Produkt
- **Główne pola:** name, price, images, categories, stock
- **Kluczowe:** `hidden` (ukryj w sklepie), `stock` (stan magazynowy)

#### 2. Zamówienia (`order`)
- **Lokalizacja:** Sanity Studio → Zamówienie
- **Główne pola:** orderNumber, customerName, totalPrice, status
- **Kluczowe:** `status` (status zamówienia), `products` (lista produktów)

#### 3. Kategorie (`category`)
- **Lokalizacja:** Sanity Studio → Kategoria
- **Główne pola:** title, slug, description, image
- **Kluczowe:** `visible` (widoczna dla użytkowników)

#### 4. Marki (`brand`)
- **Lokalizacja:** Sanity Studio → Marka
- **Główne pola:** title, slug, description

### Relacje między danymi

```
Zamówienie → Produkty (referencje)
Produkt → Kategorie (referencje)
Produkt → Marka (referencja)
```

---

## Instrukcje krok po kroku

### Jak sprawdzić wszystkie zamówienia

1. **Przez Sanity Studio:**
   - Otwórz `/studio`
   - Kliknij "Zamówienie" w menu
   - Zobaczysz listę wszystkich zamówień

2. **Przez API:**
   - Użyj endpointu: `GET /api/admin/orders?key=TWÓJ_KLUCZ`
   - Otrzymasz JSON z ostatnimi 20 zamówieniami

### Jak dodać nowy produkt

1. Otwórz Sanity Studio (`/studio`)
2. Kliknij "Produkt" → "Create" → "Produkt"
3. Wypełnij wszystkie wymagane pola:
   - Tytuł (wymagane)
   - Slug (generuje się automatycznie)
   - Cena netto (wymagane, chyba że "Zamówienia telefoniczne")
   - Kategorie (wymagane)
   - Obrazy (minimum 1)
4. Kliknij "Publish"

### Jak zmienić status zamówienia

1. Otwórz Sanity Studio
2. Przejdź do "Zamówienie"
3. Kliknij na zamówienie
4. Zmień pole "Status zamówienia"
5. Kliknij "Publish"

### Jak ukryć produkt w sklepie

1. Otwórz produkt w Sanity Studio
2. Zaznacz checkbox "Ukryj w sklepie"
3. Kliknij "Publish"

### Jak sprawdzić stan magazynowy

1. Otwórz produkt w Sanity Studio
2. Sprawdź pole "Stan magazynowy"
3. Aby zaktualizować, zmień wartość i kliknij "Publish"

### Jak dodać nową kategorię

1. Otwórz Sanity Studio
2. Kliknij "Kategoria" → "Create" → "Kategoria"
3. Wypełnij:
   - Tytuł (wymagane)
   - Slug (generuje się automatycznie)
   - Opis (opcjonalne)
   - Obraz kategorii (opcjonalne)
4. Kliknij "Publish"

---

## Ważne uwagi

### Bezpieczeństwo
- Klucz API dla endpointów admin jest wymagany
- Użytkownicy muszą być zalogowani, aby zobaczyć swoje zamówienia
- Webhook Stripe jest zabezpieczony podpisem

### Wydajność
- API produktów zwraca maksymalnie 20 zamówień na raz
- Obrazy są optymalizowane automatycznie przez Sanity
- Ceny są obliczane dynamicznie na podstawie basePrice + toothCost × toothQty

### Backup i eksport
- Wszystkie dane są przechowywane w Sanity
- Można eksportować produkty przez `/api/products/export`
- Zamówienia są automatycznie tworzone po płatności

### Kontakt i wsparcie
- W przypadku problemów sprawdź logi w Sanity Studio
- API endpoints zwracają szczegółowe komunikaty błędów
- Webhook Stripe loguje wszystkie transakcje

---

*Dokumentacja aktualizowana: Styczeń 2024*
*Wersja systemu: 1.0*
