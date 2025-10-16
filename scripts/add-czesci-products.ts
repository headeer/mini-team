import { client } from '../sanity/lib/client';

async function addCzesciProducts() {
  try {
    // First, create the category if it doesn't exist
    const category = await client.create({
      _type: 'category',
      title: 'Części - Okazje',
      slug: {
        _type: 'slug',
        current: 'czesci'
      },
      description: 'Unikalne okazje na osprzęt do koparek! Części z nadwyżki produkcyjnej, nieodebrane zamówienia, wyprzedaże magazynowe.',
      range: 0,
      featured: true,
      visible: true,
    });

    console.log('✅ Created category:', category);

    // Sample products for the części category
    const sampleProducts = [
      {
        _type: 'product',
        name: 'Łyżka Kopiąca 60cm MS03 - Okazja',
        description: 'Dostępna natychmiast! Klient nie odebrał zamówienia - Twoja szansa na oszczędności!',
        price: 1200,
        originalPrice: 3000,
        status: 'nieodebrane',
        condition: 'nowy',
        category: {
          _type: 'reference',
          _ref: category._id
        },
        slug: {
          _type: 'slug',
          current: 'lyzka-kopiajaca-60cm-ms03-okazja'
        },
        image: '/images/lyzki/lyzka-kopiajaca-60cm.webp',
        featured: true,
        visible: true
      },
      {
        _type: 'product',
        name: 'Zrywak Korzeni 80cm - Okazja',
        description: 'Specjalna okazja! Część z nadwyżki produkcyjnej - minimalne ślady magazynowe.',
        price: 850,
        originalPrice: 1550,
        status: 'odrzut',
        condition: 'minimalne-slady',
        category: {
          _type: 'reference',
          _ref: category._id
        },
        slug: {
          _type: 'slug',
          current: 'zrywak-korzeni-80cm-okazja'
        },
        image: '/images/zrywaki/zrywak-korzeni-80cm.webp',
        featured: true,
        visible: true
      },
      {
        _type: 'product',
        name: 'Szybkozłącze MS03 - Okazja',
        description: 'Ostatni egzemplarz z serii! Nowy, w oryginalnym opakowaniu - nie przegap!',
        price: 450,
        originalPrice: 1500,
        status: 'ostatni',
        condition: 'nowy',
        category: {
          _type: 'reference',
          _ref: category._id
        },
        slug: {
          _type: 'slug',
          current: 'szybkozlacze-ms03-okazja'
        },
        image: '/images/mocowania/szybkozlacze-ms03.webp',
        featured: true,
        visible: true
      }
    ];

    // Create products
    const createdProducts = [];
    for (const product of sampleProducts) {
      const createdProduct = await client.create(product);
      createdProducts.push(createdProduct);
      console.log('✅ Created product:', createdProduct.name);
    }

    console.log('🎉 All products created successfully!');
    return { category, products: createdProducts };
  } catch (error) {
    console.error('❌ Error creating products:', error);
    throw error;
  }
}

// Run the script
addCzesciProducts()
  .then(() => {
    console.log('🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });

