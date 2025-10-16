import { client } from '../sanity/lib/client';

async function createCzesciCategory() {
  try {
    // Create the "części" category
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
    return category;
  } catch (error) {
    console.error('❌ Error creating category:', error);
    throw error;
  }
}

// Run the script
createCzesciCategory()
  .then(() => {
    console.log('🎉 Category creation completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });

