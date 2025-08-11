import Container from "@/components/Container";
import Link from "next/link";

const posts = [
  {
    slug: "jak-dobrac-lyzke-do-minikoparki-przewodnik-operatora",
    title: "Jak dobrać łyżkę do minikoparki – przewodnik operatora",
    excerpt: "Na co zwrócić uwagę: waga maszyny, szybkozłącze (MS03/S40), szerokość robocza i Hardox HB500.",
    href: "/shop",
  },
  {
    slug: "hardox-hb500-w-praktyce-dlaczego-zuzywa-sie-3x-wolniej",
    title: "Hardox HB500 w praktyce – dlaczego zużywa się 3× wolniej",
    excerpt: "Porównanie z klasyczną stalą, realne korzyści: mniej przestojów i niższe koszty.",
    href: "/shop",
  },
  {
    slug: "szybkozlacza-ms03-s40-cw05-co-wybrac-i-dla-kogo",
    title: "Szybkozłącza MS03, S40, CW05 – co wybrać i dla kogo?",
    excerpt: "Różnice funkcjonalne, kompatybilność i dobór pod typ pracy.",
    href: "/shop",
  },
];

export default function BlogIndex() {
  return (
    <div className="bg-white">
      <Container className="py-10 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((p) => (
            <article key={p.slug} className="rounded-xl border bg-white p-4 hover:shadow-md transition">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                <Link href={`/blog/${p.slug}`} className="hover:underline">
                  {p.title}
                </Link>
              </h2>
              <p className="text-sm text-gray-700 mb-3">{p.excerpt}</p>
              <div className="text-sm">
                <Link href={p.href} className="text-[var(--color-brand-orange)] hover:underline">Przejdź do sklepu</Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}

import Container from "@/components/Container";
import Title from "@/components/Title";
import { urlFor } from "@/sanity/lib/image";
import { getAllBlogs } from "@/sanity/queries";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogPage = async () => {
  const blogs = await getAllBlogs(6);

  return (
    <div>
      <Container>
        <Title>Blog page</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 md:mt-10">
          {blogs?.map((blog) => (
            <div key={blog?._id} className="rounded-md overflow-hidden group">
              {blog?.mainImage && (
                <Image
                  src={urlFor(blog?.mainImage).url()}
                  alt="blogImage"
                  width={500}
                  height={500}
                  className="w-full max-h-80 object-cover"
                />
              )}
              <div className="bg-gray-100 p-5">
                <div className="text-xs flex items-center gap-5">
                  <div className="flex items-center relative group cursor-pointer">
                    {blog?.blogcategories?.map((item, index) => (
                      <p
                        key={index}
                        className="font-semibold text-shop_dark_green tracking-wider"
                      >
                        {item?.title}
                      </p>
                    ))}
                    <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hover:cursor-pointer hoverEffect" />
                  </div>
                  <p className="flex items-center gap-1 text-lightColor relative group hover:cursor-pointer hover:text-shop_dark_green hoverEffect">
                    <Calendar size={15} />{" "}
                    {dayjs(blog.publishedAt).format("MMMM D, YYYY")}
                    <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hoverEffect" />
                  </p>
                </div>
                <Link
                  href={`/blog/${blog?.slug?.current}`}
                  className="text-base font-bold tracking-wide mt-5 line-clamp-2 hover:text-shop_dark_green hoverEffect"
                >
                  {blog?.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default BlogPage;
