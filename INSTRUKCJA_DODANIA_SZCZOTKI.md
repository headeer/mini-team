# Instrukcja dodania produktu "Szczotka zamiatarka"

## Krok 1: Uruchomienie Sanity Studio

1. **Uruchom serwer deweloperski:**
   ```bash
   npm run dev
   ```

2. **Otwórz Sanity Studio:**
   - Przejdź do: `http://localhost:3000/studio`
   - Lub jeśli masz skonfigurowane zmienne środowiskowe, użyj domeny produkcyjnej + `/studio`

## Krok 2: Utworzenie kategorii "Szczotki zamiatarki"

1. **W Sanity Studio:**
   - Kliknij **"Kategoria"** w menu po lewej stronie
   - Kliknij **"Create"** → **"Kategoria"**

2. **Wypełnij dane kategorii:**
   ```
   Tytuł: Szczotki zamiatarki
   Slug: szczotki-zamiatarki (generuje się automatycznie)
   Opis: Szczotki zamiatarki do koparek i minikoparek - idealne do prac porządkowych
   Widoczna dla użytkowników: ✅ (zaznaczone)
   Wyróżniona: ✅ (zaznaczone)
   ```

3. **Zapisz kategorię:**
   - Kliknij **"Publish"** w prawym górnym rogu

## Krok 3: Utworzenie produktu "Szczotka zamiatarka"

1. **W Sanity Studio:**
   - Kliknij **"Produkt"** w menu po lewej stronie
   - Kliknij **"Create"** → **"Produkt"**

2. **Wypełnij podstawowe informacje:**
   ```
   Tytuł: Szczotka zamiatarka do koparki minikoparki JCB CAT Kubota Yanmar Bob
   Slug: szczotka-zamiatarka-do-koparki-minikoparki-jcb-cat-kubota-yanmar-bob
   Opis: W ofercie nowa szczotka do zamiatania do minikoparki/koparki.
   Solidna i wytrzymała, idealna do prac porządkowych w terenie.

   Specyfikacja:
   - Wymiary: 120 × 40 cm
   - Długość włosia: 250 mm
   - Grubość włosia: 3 mm
   - Mocna i trwała konstrukcja
   - Łatwa w montażu i obsłudze

   Zastosowanie:
   - zamiatanie chodników i ulic
   - usuwanie błota, piasku, żwiru
   - zamiatanie placów, kostki brukowej, parkingów
   - idealna do utrzymania czystości na budowie

   Pasuje do minikoparek oraz koparek różnych marek.
   ```

3. **Ustaw ceny:**
   ```
   Cena netto (zł): 2200.00
   Cena brutto (zł): 2706.00
   Cena OLX (zł): 2500.00
   Rabat (%): 0
   ```

4. **Dodaj specyfikacje:**
   ```
   Szerokość (cm): 120
   Średnica sworznia (mm): (pozostaw puste)
   Pojemność (m³): (pozostaw puste)
   Lemiesz (opis): (pozostaw puste)
   Grubość zęba (mm): 3
   Liczba zębów (szt): (pozostaw puste)
   Cechy: 
   - Mocna i trwała konstrukcja
   - Łatwa w montażu i obsłudze
   - Wysokiej jakości włosie
   - Odporna na warunki atmosferyczne
   Kompatybilność maszyn:
   - JCB
   - CAT
   - Kubota
   - Yanmar
   - Bob
   - Komatsu
   - Volvo
   - Hitachi
   Szybkozłącze: (pozostaw puste)
   Kinetyka (°): (pozostaw puste)
   Ramię (mm): (pozostaw puste)
   ```

5. **Ustaw magazyn i dostępność:**
   ```
   Stan magazynowy: 5
   Zamówienia telefoniczne: ❌ (odznaczone)
   Zewnętrzne ID: SZCZOTKA-001
   Lokalizacja: Magazyn A
   ```

6. **Wybierz kategorię:**
   - W sekcji **"Kategorie"** kliknij **"Add item"**
   - Wybierz **"Szczotki zamiatarki"** (kategorię utworzoną w kroku 2)

7. **Dodaj obrazy:**
   - W sekcji **"Product Images"** kliknij **"Add item"**
   - Kliknij **"Upload"** aby dodać zdjęcie szczotki
   - **Uwaga:** Jeśli nie masz zdjęcia, możesz dodać placeholder lub dodać później

8. **Ustaw dodatkowe opcje:**
   ```
   Ukryj w sklepie: ❌ (odznaczone)
   Status: active
   Data aktualizacji: (automatycznie ustawi się na dzisiaj)
   Liczba wyświetleń: 0
   Ranking polecanych: 0
   Produkt wyróżniony: ❌ (odznaczone)
   ```

9. **Zapisz produkt:**
   - Kliknij **"Publish"** w prawym górnym rogu

## Krok 4: Weryfikacja

1. **Sprawdź w sklepie:**
   - Przejdź do: `http://localhost:3000/shop`
   - Znajdź kategorię "Szczotki zamiatarki"
   - Sprawdź czy produkt się wyświetla

2. **Sprawdź stronę produktu:**
   - Kliknij na produkt
   - Sprawdź czy wszystkie informacje się wyświetlają poprawnie
   - Sprawdź czy cena jest poprawna (2706 zł brutto)

## Alternatywne rozwiązanie: Użycie skryptu

Jeśli masz skonfigurowane zmienne środowiskowe, możesz użyć skryptu:

1. **Utwórz plik `.env.local`:**
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=twoj_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_PROJECT_ID=twoj_project_id
   SANITY_DATASET=production
   SANITY_API_TOKEN=twoj_api_token
   ```

2. **Uruchom skrypt:**
   ```bash
   npx tsx scripts/add-sweeper-product.ts
   ```

## Informacje o produkcie

**Nazwa:** Szczotka zamiatarka do koparki minikoparki JCB CAT Kubota Yanmar Bob  
**Cena:** 2706 zł (brutto) / 2200 zł (netto)  
**Kategoria:** Szczotki zamiatarki  
**Stan magazynowy:** 5 sztuk  
**Zastosowanie:** Prace porządkowe, zamiatanie, usuwanie błota i piasku  

## Kontakt w przypadku problemów

Jeśli masz problemy z dodaniem produktu:
1. Sprawdź czy wszystkie wymagane pola są wypełnione
2. Upewnij się, że kategoria została utworzona przed produktem
3. Sprawdź czy masz odpowiednie uprawnienia w Sanity Studio

---

*Instrukcja utworzona: Styczeń 2024*
