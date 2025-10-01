# Dokumentacja Dodatkowa - Stripe

## Spis treści
1. [Zarządzanie zamówieniami w Stripe](#zarządzanie-zamówieniami-w-stripe)
2. [Integracja systemów](#integracja-systemów)

---

## Zarządzanie zamówieniami w Stripe

### Co to jest Stripe
**Stripe** to platforma płatności online, która obsługuje wszystkie transakcje w sklepie internetowym.

### Gdzie znaleźć zamówienia
- **Panel Stripe:** Dostęp przez przeglądarkę na [dashboard.stripe.com](https://dashboard.stripe.com)
- **Email powiadomienia:** Automatyczne powiadomienia o nowych zamówieniach

### Jak uzyskać dostęp do panelu Stripe

#### Krok 1: Otrzymanie dostępu
1. **Skontaktuj się z administratorem** systemu
2. Administrator wyśle Ci:
   - Link do panelu Stripe
   - Dane logowania (email + hasło)
   - Instrukcje dostępu

#### Krok 2: Logowanie
1. Przejdź do [dashboard.stripe.com](https://dashboard.stripe.com)
2. Kliknij **"Sign in"**
3. Wprowadź otrzymane dane logowania
4. Kliknij **"Sign in"**

### Podstawowe funkcje panelu Stripe

#### 1. Widok główny (Dashboard)
- **Przegląd sprzedaży:** Dzienne, tygodniowe, miesięczne statystyki
- **Ostatnie płatności:** Lista najnowszych transakcji
- **Alerty:** Ważne powiadomienia o problemach z płatnościami

#### 2. Zarządzanie płatnościami
- **Lista płatności:** Wszystkie transakcje z filtrami
- **Szczegóły płatności:** Pełne informacje o każdej transakcji
- **Zwroty:** Obsługa zwrotów i anulowań
- **Rozliczenia:** Historia wypłat na konto bankowe

#### 3. Ustawienia
- **Profil firmy:** Dane firmy i adresy
- **Integracje:** Połączenia z innymi systemami
- **Bezpieczeństwo:** Ustawienia dostępu i uwierzytelniania

### Jak obsługiwać zamówienia

#### 1. Sprawdzanie nowych zamówień
1. **Sprawdź panel główny** - nowe zamówienia będą widoczne w sekcji "Recent payments"
2. **Kliknij na płatność** aby zobaczyć szczegóły
3. **Sprawdź dane klienta** i szczegóły zamówienia
4. **Zweryfikuj kwotę** i status płatności

#### 2. Przetwarzanie zamówienia
1. **Sprawdź czy płatność została zrealizowana** (status: "Succeeded")
2. **Pobierz dane klienta** z sekcji "Customer details"
3. **Przekaż zamówienie do realizacji** (email, telefon, adres dostawy)
4. **Oznacz jako przetworzone** w systemie zarządzania

#### 3. Obsługa problemów z płatnościami
- **Płatność nieudana:** Sprawdź przyczynę w sekcji "Failure reason"
- **Płatność w toku:** Poczekaj na potwierdzenie lub skontaktuj się z klientem
- **Podejrzana transakcja:** Sprawdź szczegóły i rozważ anulowanie

### Najczęstsze problemy z płatnościami

#### Płatności nieudane
- **Brak środków na karcie:** Klient musi użyć innej karty
- **Błędne dane karty:** Sprawdź numer, datę ważności, CVV
- **Karta zablokowana:** Klient musi skontaktować się z bankiem
- **Przekroczony limit:** Klient musi użyć innej karty lub poczekać

#### Płatności w toku
- **3D Secure:** Klient musi potwierdzić płatność w banku
- **Weryfikacja:** Płatność wymaga dodatkowej weryfikacji
- **Przetwarzanie:** Płatność jest w trakcie przetwarzania

#### Podejrzane transakcje
- **Duże kwoty:** Sprawdź czy klient to prawdziwa osoba
- **Różne adresy:** Adres karty różni się od adresu dostawy
- **Wielokrotne próby:** Klient próbował zapłacić wielokrotnie

### Zasady obsługi zamówień

#### 1. Czas przetwarzania
- **Maksymalnie 2 godziny** na przetworzenie zamówienia
- **W dni robocze:** 8:00-16:00
- **W weekendy:** Sprawdź w poniedziałek rano

#### 2. Weryfikacja zamówienia
- **Sprawdź dane klienta** - imię, nazwisko, adres
- **Zweryfikuj kwotę** - czy odpowiada cennikowi
- **Sprawdź dostępność** - czy produkty są na magazynie
- **Potwierdź adres dostawy** - czy jest kompletny

#### 3. Komunikacja z klientem
- **Potwierdź zamówienie** emailem w ciągu 2 godzin
- **Podaj numer zamówienia** i przewidywany czas dostawy
- **Poinformuj o problemach** jeśli coś nie gra
- **Zaproponuj rozwiązanie** jeśli zamówienie nie może być zrealizowane

### Raporty i statystyki

#### 1. Jak sprawdzić statystyki
1. W panelu Stripe przejdź do sekcji **"Analytics"**
2. Wybierz okres (dzień, tydzień, miesiąc)
3. Sprawdź kluczowe metryki:
   - Liczba transakcji
   - Łączna kwota sprzedaży
   - Średnia wartość zamówienia
   - Wskaźnik udanych płatności

#### 2. Kluczowe wskaźniki (KPI)
- **Wskaźnik udanych płatności:** > 95%
- **Średnia wartość zamówienia:** Według celów biznesowych
- **Czas przetwarzania:** < 2 godziny
- **Liczba zwrotów:** < 5%

### Rozwiązywanie problemów technicznych

#### 1. Panel nie działa
- **Sprawdź połączenie internetowe**
- **Odśwież stronę** (F5)
- **Wyczyść cache przeglądarki**
- **Spróbuj innej przeglądarki**

#### 2. Nie otrzymujesz powiadomień
- **Sprawdź ustawienia powiadomień** w przeglądarce
- **Sprawdź ustawienia w panelu Stripe**
- **Sprawdź folder spam** w emailu

#### 3. Problemy z logowaniem
- **Sprawdź dane logowania**
- **Wyczyść cookies**
- **Skontaktuj się z administratorem**

---

## Integracja systemów

### Przegląd systemów
Sklep internetowy składa się z kilku połączonych systemów:

#### 1. Frontend (Strona sklepu)
- **Lokalizacja:** [miniteamproject.pl](https://miniteamproject.pl)
- **Funkcje:** Katalog produktów, koszyk, proces zakupu
- **Technologia:** Next.js, React, TypeScript

#### 2. Backend (API)
- **Lokalizacja:** Serwer aplikacji
- **Funkcje:** Przetwarzanie zamówień, integracje
- **Technologia:** Next.js API Routes

#### 3. Baza danych (Sanity)
- **Lokalizacja:** [sanity.io](https://sanity.io)
- **Funkcje:** Przechowywanie produktów, kategorii, treści
- **Dostęp:** Panel administracyjny Sanity

#### 4. Płatności (Stripe)
- **Lokalizacja:** [dashboard.stripe.com](https://dashboard.stripe.com)
- **Funkcje:** Przetwarzanie płatności, zarządzanie zamówieniami
- **Dostęp:** Panel administracyjny Stripe

### Przepływ zamówienia

#### 1. Klient składa zamówienie
- **Wybierze produkty** w sklepie
- **Dodaje do koszyka** i przechodzi do kasy
- **Wypełnia dane** i wybiera sposób płatności
- **Potwierdza zamówienie** i płaci

#### 2. System przetwarza płatność
- **Stripe otrzymuje** dane płatności
- **Weryfikuje kartę** i przetwarza płatność
- **Wysyła potwierdzenie** do systemu sklepu
- **Tworzy zamówienie** w bazie danych

#### 3. Powiadomienia
- **Email do klienta:** Potwierdzenie zamówienia
- **Email do administratora:** Nowe zamówienie do przetworzenia
- **Powiadomienie w panelu:** Nowa płatność w Stripe

#### 4. Realizacja zamówienia
- **Administrator sprawdza** zamówienie w Stripe
- **Pobiera dane klienta** i szczegóły zamówienia
- **Przekazuje do realizacji** (wysyłka, produkcja)
- **Aktualizuje status** w systemie

### Zarządzanie dostępem

#### 1. Administrator systemu
- **Pełny dostęp** do wszystkich systemów
- **Zarządzanie użytkownikami** i uprawnieniami
- **Konfiguracja integracji** między systemami
- **Rozwiązywanie problemów** technicznych

#### 2. Operator sklepu
- **Dostęp do Stripe** - zarządzanie zamówieniami
- **Dostęp do Sanity** - edycja produktów i treści
- **Ograniczony dostęp** do ustawień systemu

#### 3. Pracownik obsługi
- **Dostęp do Stripe** - tylko przeglądanie zamówień
- **Brak dostępu** do ustawień systemu
- **Tylko odczyt** danych

### Bezpieczeństwo

#### 1. Dane klientów
- **Szyfrowanie:** Wszystkie dane są szyfrowane
- **RODO:** Zgodność z przepisami o ochronie danych
- **Dostęp:** Tylko uprawnione osoby mają dostęp

#### 2. Płatności
- **PCI DSS:** Stripe jest certyfikowane do obsługi kart
- **Tokenizacja:** Numery kart nie są przechowywane
- **Audyt:** Wszystkie transakcje są logowane

#### 3. System
- **HTTPS:** Wszystkie połączenia są szyfrowane
- **Uwierzytelnianie:** Dwuskładnikowe uwierzytelnianie
- **Backup:** Regularne kopie zapasowe danych

### Kontakt i wsparcie

#### 1. Problemy techniczne
- **Email:** [teodorczykpt@gmail.com](mailto:teodorczykpt@gmail.com)
- **Telefon:** 782-851-962
- **Godziny:** Pon-Pt 8:00-16:00

#### 2. Problemy z płatnościami
- **Stripe Support:** [support.stripe.com](https://support.stripe.com)
- **Dokumentacja:** [stripe.com/docs](https://stripe.com/docs)
- **Status:** [status.stripe.com](https://status.stripe.com)

#### 3. Problemy z produktami
- **Sanity Support:** [sanity.io/support](https://sanity.io/support)
- **Dokumentacja:** [sanity.io/docs](https://sanity.io/docs)
- **Status:** [status.sanity.io](https://status.sanity.io)

---

*Ostatnia aktualizacja: 2024*