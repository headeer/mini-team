import React from "react";
import Link from "next/link";

interface KeyCategoriesProps {
  categories: { title: string; slug?: { current: string } }[];
}

const KeyCategories: React.FC<KeyCategoriesProps> = ({ categories }) => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Nasze kategorie osprzętu</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((cat) => (
            <Link key={cat.title} href={cat?.slug?.current ? `/category/${cat.slug.current}` : "/shop"} className="block p-6 rounded-xl border bg-white hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-900">{cat.title}</h3>
              <p className="text-sm text-gray-700 mt-1">Zobacz kategorię</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyCategories;

