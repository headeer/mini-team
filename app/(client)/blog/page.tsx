import React from "react";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { urlFor } from "@/sanity/lib/image";
import { getAllBlogs } from "@/sanity/queries";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FALLBACK_POSTS = [
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

export default async function BlogPage() {
  const blogs = await getAllBlogs(9);

  return (
    <div className="bg-white">
      <Container className="py-10">
        <Title>Blog</Title>
        {blogs?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 md:mt-10">
            {blogs.map((blog) => (
              <article key={blog?._id} className="rounded-md overflow-hidden border bg-white">
                {blog?.mainImage && (
                  <Image
                    src={urlFor(blog?.mainImage).url()}
                    alt={blog.title || "Blog Image"}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5 space-y-2">
                  <div className="text-xs flex items-center gap-5 text-lightColor">
                    <div className="flex items-center gap-2">
                      {blog?.blogcategories?.map((item, index) => (
                        <span key={index} className="font-semibold text-shop_dark_green tracking-wider">
                          {item?.title}
                        </span>
                      ))}
                    </div>
                    {blog?.publishedAt ? (
                      <span className="flex items-center gap-1"><Calendar size={14} /> {dayjs(blog.publishedAt).format("MMMM D, YYYY")}</span>
                    ) : null}
                  </div>
                  <Link href={`/blog/${blog?.slug?.current}`} className="text-base font-bold tracking-wide line-clamp-2 hover:text-shop_dark_green">
                    {blog?.title}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-sm text-gray-600">Brak wpisów na blogu. Zobacz też polecane artykuły:</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
              {FALLBACK_POSTS.map((p) => (
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
          </div>
        )}
      </Container>
    </div>
  );
}
