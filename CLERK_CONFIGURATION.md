# Konfiguracja Clerk - Rozwiązanie problemu CAPTCHA

## Problem
Podczas rejestracji użytkownicy otrzymują błąd:
```
"The CAPTCHA failed to load. This may be due to an unsupported browser or a browser extension."
```

## Rozwiązanie - Wyłączenie CAPTCHA w Clerk Dashboard

Ponieważ używamy własnego systemu reCAPTCHA (w formularzach kontaktowych), możemy wyłączyć CAPTCHA w Clerk:

1. **Zaloguj się do Clerk Dashboard**: https://dashboard.clerk.com
2. **Przejdź do swojego projektu**
3. **Otwórz sekcję "Settings"**
4. **Znajdź opcję "Security" lub "CAPTCHA"**
5. **Wyłącz CAPTCHA** dla operacji sign-up i sign-in
6. **Zapisz zmiany**

Alternatywnie:
- Jeśli nie możesz znaleźć opcji wyłączenia, skontaktuj się z supportem Clerk
- Możesz również włączyć "CAPTCHA bypass" dla zaufanych domen w ustawieniach

## Lokalizacja polska

Lokalizacja polska została już skonfigurowana w kodzie:
- Instalowany pakiet: `@clerk/localizations`
- Używana lokalizacja: `plPL`
- Plik konfiguracji: `app/(client)/layout.tsx`

Interfejs Clerk będzie teraz wyświetlany w języku polskim.

## Sprawdzenie konfiguracji

Po wyłączeniu CAPTCHA w dashboardzie, spróbuj ponownie zarejestrować konto. Powinno działać bez problemów z CAPTCHA.

