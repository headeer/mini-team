import { client } from '../sanity/lib/client';

interface ProductData {
  name: string;
  slug: string;
  description: string;
  priceNet: number;
  priceGross: number;
  priceOlx: number;
  specifications: {
    widthCm: number;
    hairLengthMm: number;
    hairThicknessMm: number;
    features: string[];
    machineCompatibility: string[];
  };
  categories: string[];
  stock: number;
  externalId: string;
  status: string;
  dateUpdated: string;
}

async function createSweeperCategory() {
  const categoryData = {
    _type: 'category',
    title: 'Szczotki zamiatarki',
    slug: {
      _type: 'slug',
      current: 'szczotki-zamiatarki'
    },
    description: 'Szczotki zamiatarki do koparek i minikoparek - idealne do prac porządkowych',
    visible: true,
    featured: true
  };

  try {
    const result = await client.create(categoryData);
    console.log('✅ Kategoria "Szczotki zamiatarki" została utworzona:', result._id);
    return result._id;
  } catch (error) {
    console.error('❌ Błąd podczas tworzenia kategorii:', error);
    throw error;
  }
}

async function createSweeperProduct(categoryId: string) {
  const productData: ProductData = {
    name: 'Szczotka zamiatarka do koparki minikoparki JCB CAT Kubota Yanmar Bob',
    slug: 'szczotka-zamiatarka-do-koparki-minikoparki-jcb-cat-kubota-yanmar-bob',
    description: `W ofercie nowa szczotka do zamiatania do minikoparki/koparki.
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

Pasuje do minikoparek oraz koparek różnych marek.`,
    priceNet: 2200.00,
    priceGross: 2706.00,
    priceOlx: 2500.00,
    specifications: {
      widthCm: 120,
      hairLengthMm: 250,
      hairThicknessMm: 3,
      features: [
        'Mocna i trwała konstrukcja',
        'Łatwa w montażu i obsłudze',
        'Wysokiej jakości włosie',
        'Odporna na warunki atmosferyczne'
      ],
      machineCompatibility: [
        'JCB',
        'CAT',
        'Kubota',
        'Yanmar',
        'Bob',
        'Komatsu',
        'Volvo',
        'Hitachi'
      ]
    },
    categories: [categoryId],
    stock: 5,
    externalId: 'SZCZOTKA-001',
    status: 'active',
    dateUpdated: new Date().toISOString()
  };

  try {
    const result = await client.create({
      _type: 'product',
      ...productData,
      hidden: false,
      discount: 0,
      phoneOrderOnly: false,
      viewsCount: 0,
      featuredRank: 0,
      isFeatured: false
    });
    
    console.log('✅ Produkt "Szczotka zamiatarka" został utworzony:', result._id);
    return result._id;
  } catch (error) {
    console.error('❌ Błąd podczas tworzenia produktu:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Rozpoczynam dodawanie produktu "Szczotka zamiatarka"...');
    
    // Sprawdź czy kategoria już istnieje
    const existingCategory = await client.fetch(
      `*[_type == "category" && slug.current == "szczotki-zamiatarki"][0]`
    );
    
    let categoryId: string;
    
    if (existingCategory) {
      console.log('ℹ️ Kategoria "Szczotki zamiatarki" już istnieje:', existingCategory._id);
      categoryId = existingCategory._id;
    } else {
      console.log('📁 Tworzę nową kategorię...');
      categoryId = await createSweeperCategory();
    }
    
    // Sprawdź czy produkt już istnieje
    const existingProduct = await client.fetch(
      `*[_type == "product" && slug.current == "szczotka-zamiatarka-do-koparki-minikoparki-jcb-cat-kubota-yanmar-bob"][0]`
    );
    
    if (existingProduct) {
      console.log('ℹ️ Produkt "Szczotka zamiatarka" już istnieje:', existingProduct._id);
      console.log('🔄 Aktualizuję istniejący produkt...');
      
      // Aktualizuj istniejący produkt
      await client.patch(existingProduct._id).set({
        priceNet: 2200.00,
        priceGross: 2706.00,
        priceOlx: 2500.00,
        dateUpdated: new Date().toISOString()
      }).commit();
      
      console.log('✅ Produkt został zaktualizowany!');
    } else {
      console.log('🛍️ Tworzę nowy produkt...');
      await createSweeperProduct(categoryId);
    }
    
    console.log('🎉 Proces zakończony pomyślnie!');
    console.log('📋 Produkt będzie widoczny w sklepie po opublikowaniu w Sanity Studio');
    
  } catch (error) {
    console.error('💥 Błąd podczas wykonywania skryptu:', error);
    process.exit(1);
  }
}

// Uruchom skrypt
main();
