# Dokumentacja Dodatkowa - Chat i Stripe

## Spis treści
1. [System czatu Tawk.to](#system-czatu-tawkto)
2. [Zarządzanie zamówieniami w Stripe](#zarządzanie-zamówieniami-w-stripe)
3. [Integracja systemów](#integracja-systemów)

---

## System czatu Tawk.to

### Co to jest Tawk.to
**Tawk.to** to system czatu na żywo, który pozwala na komunikację z klientami bezpośrednio na stronie sklepu.

### Gdzie znaleźć chat
- **Na stronie sklepu:** Chat pojawia się automatycznie w prawym dolnym rogu
- **Panel administracyjny:** Dostęp przez przeglądarkę na [tawk.to](https://tawk.to)

### Jak uzyskać dostęp do panelu Tawk.to

#### Krok 1: Otrzymanie dostępu
1. **Skontaktuj się z administratorem** systemu
2. Administrator wyśle Ci:
   - Link do panelu Tawk.to
   - Dane logowania (email + hasło)
   - Instrukcje dostępu

#### Krok 2: Logowanie
1. Przejdź do [tawk.to](https://tawk.to)
2. Kliknij **"Sign In"**
3. Wprowadź otrzymane dane logowania
4. Kliknij **"Login"**

### Funkcjonalności czatu

#### Podstawowe funkcje
- ✅ **Czat na żywo** z klientami
- ✅ **Historia rozmów** - wszystkie poprzednie konwersacje
- ✅ **Powiadomienia** - dźwiękowe i wizualne o nowych wiadomościach
- ✅ **Status online/offline** - możliwość ustawienia dostępności
- ✅ **Przekierowania** - przekazywanie rozmów między operatorami

#### Zaawansowane funkcje
- ✅ **Szablony odpowiedzi** - gotowe odpowiedzi na częste pytania
- ✅ **Statystyki** - liczba rozmów, czas odpowiedzi
- ✅ **Tagowanie** - kategoryzowanie rozmów
- ✅ **Eksport rozmów** - pobieranie historii w PDF/CSV

### Jak obsługiwać klientów przez chat

#### 1. Odpowiadanie na wiadomości
1. Gdy pojawi się nowa wiadomość, usłyszysz dźwięk
2. Kliknij na okno czatu
3. Wpisz odpowiedź w polu tekstowym
4. Naciśnij **Enter** lub kliknij **"Send"**

#### 2. Ustawianie statusu
- **Online** - jesteś dostępny dla klientów
- **Away** - jesteś zajęty, ale możesz odpowiadać
- **Offline** - nie jesteś dostępny

#### 3. Używanie szablonów
1. Kliknij ikonę **"Templates"** w oknie czatu
2. Wybierz odpowiedni szablon
3. Dostosuj treść jeśli potrzeba
4. Wyślij wiadomość

### Częste pytania klientów i odpowiedzi

#### Pytania o produkty
**Q:** "Czy ten produkt jest dostępny?"
**A:** "Sprawdzę dostępność w naszym magazynie. Proszę o chwilę cierpliwości."

**Q:** "Jaka jest cena produktu?"
**A:** "Cena jest widoczna na stronie produktu. Czy mogę pomóc w czymś jeszcze?"

#### Pytania o zamówienia
**Q:** "Gdzie mogę sprawdzić status mojego zamówienia?"
**A:** "Możesz sprawdzić status w sekcji 'Moje zamówienia' po zalogowaniu lub podaj mi numer zamówienia, a sprawdzę to dla Ciebie."

**Q:** "Jak długo trwa dostawa?"
**A:** "Standardowy czas dostawy to 3-5 dni roboczych. Czy to pilne zamówienie?"

#### Pytania techniczne
**Q:** "Czy ten produkt pasuje do mojej maszyny?"
**A:** "Sprawdzę kompatybilność w specyfikacjach produktu. Jaki model maszyny posiadasz?"

### Statystyki i raporty

#### Gdzie znaleźć statystyki
1. W panelu Tawk.to przejdź do sekcji **"Reports"**
2. Wybierz okres (dzień/tydzień/miesiąc)
3. Zobaczysz:
   - Liczbę rozmów
   - Średni czas odpowiedzi
   - Liczbę zadowolonych klientów
   - Najczęstsze pytania

---

## Zarządzanie zamówieniami w Stripe

### Co to jest Stripe
**Stripe** to system płatności, który obsługuje wszystkie transakcje w sklepie. Oprócz płatności, można tam również zarządzać zamówieniami.

### Gdzie znaleźć zamówienia w Stripe

#### Krok 1: Logowanie do Stripe
1. Przejdź do [stripe.com](https://stripe.com)
2. Kliknij **"Sign in"**
3. Wprowadź dane logowania (otrzymasz od administratora)
4. Kliknij **"Log in"**

#### Krok 2: Nawigacja do zamówień
1. W panelu głównym kliknij **"Payments"** w menu po lewej
2. Zobaczysz listę wszystkich transakcji
3. Każda transakcja to jedno zamówienie

### Funkcjonalności Stripe dla zamówień

#### Podstawowe informacje o zamówieniu
- ✅ **Kwota** - ile klient zapłacił
- ✅ **Status płatności** - czy płatność została zrealizowana
- ✅ **Data** - kiedy została dokonana płatność
- ✅ **Klient** - dane klienta (email, nazwa)
- ✅ **Metoda płatności** - karta, BLIK, przelew

#### Zaawansowane funkcje
- ✅ **Refundy** - zwroty pieniędzy
- ✅ **Częściowe zwroty** - zwrot części kwoty
- ✅ **Faktury** - generowanie faktur
- ✅ **Eksport danych** - pobieranie raportów
- ✅ **Webhooks** - automatyczne powiadomienia

### Jak obsługiwać zamówienia w Stripe

#### 1. Sprawdzanie statusu płatności
1. Przejdź do **"Payments"**
2. Znajdź zamówienie po:
   - Emailu klienta
   - Kwocie
   - Dacie
3. Kliknij na zamówienie, aby zobaczyć szczegóły

#### 2. Wykonywanie zwrotów
1. Otwórz szczegóły zamówienia
2. Kliknij **"Refund"**
3. Wybierz:
   - **Full refund** - pełny zwrot
   - **Partial refund** - częściowy zwrot
4. Wprowadź kwotę (jeśli częściowy)
5. Kliknij **"Refund"**

#### 3. Generowanie faktur
1. W szczegółach zamówienia kliknij **"Invoice"**
2. Stripe automatycznie wygeneruje fakturę
3. Możesz ją pobrać lub wysłać do klienta

### Statusy płatności w Stripe

| Status | Opis | Co oznacza |
|--------|------|------------|
| `succeeded` | Zakończone pomyślnie | Płatność została zrealizowana |
| `pending` | Oczekujące | Płatność w trakcie realizacji |
| `failed` | Nieudane | Płatność została odrzucona |
| `canceled` | Anulowane | Płatność została anulowana |
| `refunded` | Zwrócone | Pieniądze zostały zwrócone |

### Raporty i eksport danych

#### Jak pobrać raporty
1. Przejdź do **"Reports"** w menu Stripe
2. Wybierz:
   - **Payments** - raport płatności
   - **Refunds** - raport zwrotów
   - **Disputes** - raport sporów
3. Ustaw okres (dzień/tydzień/miesiąc)
4. Kliknij **"Export"**

#### Dostępne formaty
- **CSV** - do analizy w Excelu
- **PDF** - do druku
- **JSON** - do systemów informatycznych

---

## Integracja systemów

### Jak systemy współpracują

#### Przepływ zamówienia
```
1. Klient składa zamówienie → Sklep
2. Płatność → Stripe
3. Potwierdzenie płatności → Webhook
4. Utworzenie zamówienia → Sanity
5. Powiadomienie → Email + Chat
```

#### Synchronizacja danych
- **Stripe** ↔ **Sanity**: Automatyczna synchronizacja przez webhook
- **Chat** ↔ **Sklep**: Integracja przez Tawk.to widget
- **Email** ↔ **Wszystkie systemy**: Powiadomienia o statusach

### Gdzie szukać informacji o zamówieniu

#### 1. Sanity Studio (główne miejsce)
- **Lokalizacja:** `/studio` → "Zamówienie"
- **Zawiera:** Pełne dane zamówienia, status, produkty
- **Użycie:** Codzienne zarządzanie zamówieniami

#### 2. Stripe (płatności)
- **Lokalizacja:** [stripe.com](https://stripe.com) → "Payments"
- **Zawiera:** Dane płatności, zwroty, faktury
- **Użycie:** Obsługa płatności i zwrotów

#### 3. Tawk.to (komunikacja)
- **Lokalizacja:** [tawk.to](https://tawk.to)
- **Zawiera:** Historia rozmów z klientami
- **Użycie:** Obsługa klienta, odpowiedzi na pytania

### Najlepsze praktyki

#### Codzienna obsługa
1. **Rano:** Sprawdź nowe zamówienia w Sanity
2. **W ciągu dnia:** Odpowiadaj na chat w Tawk.to
3. **Wieczorem:** Sprawdź płatności w Stripe

#### W przypadku problemów
1. **Problem z płatnością:** Sprawdź w Stripe
2. **Problem z zamówieniem:** Sprawdź w Sanity
3. **Problem z klientem:** Sprawdź historię w Tawk.to

#### Backup i bezpieczeństwo
- Wszystkie dane są automatycznie kopiowane
- Dostęp do systemów jest zabezpieczony hasłami
- Regularne eksporty danych są dostępne

---

## Kontakt i wsparcie

### Dostęp do systemów
- **Sanity Studio:** `/studio` (lokalnie) lub domena + `/studio`
- **Stripe:** [stripe.com](https://stripe.com)
- **Tawk.to:** [tawk.to](https://tawk.to)

### W przypadku problemów
1. **Sprawdź logi** w odpowiednim systemie
2. **Skontaktuj się z administratorem** jeśli problem się powtarza
3. **Użyj funkcji pomocy** w każdym z systemów

### Regularne zadania
- **Codziennie:** Sprawdź nowe zamówienia i chat
- **Tygodniowo:** Sprawdź statystyki w Tawk.to
- **Miesięcznie:** Pobierz raporty z Stripe

---

*Dokumentacja dodatkowa - Styczeń 2024*
*Systemy: Tawk.to + Stripe + Sanity*
