import React from "react";
import Title from "./Title";
import { getLatestBlogs } from "@/sanity/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/pl";

const LatestBlog = async () => {
  const blogs = await getLatestBlogs();
  dayjs.locale("pl");
  return (
    <div className="mb-10 lg:mb-20">
      <Title>Najnowsze wpisy</Title>
      {blogs?.length ? (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Featured */}
          <article className="lg:col-span-2 rounded-xl overflow-hidden border bg-white">
            <Link href={`/blog/${blogs[0]?.slug?.current}`}>
              {blogs[0]?.mainImage && (
                <Image
                  src={urlFor(blogs[0]?.mainImage).url()}
                  alt={blogs[0]?.title || "Blog Image"}
                  width={1200}
                  height={600}
                  className="w-full h-72 object-cover"
                  priority
                />
              )}
            </Link>
            <div className="p-5 space-y-2">
              <div className="text-xs flex items-center gap-4 text-lightColor">
                <div className="flex items-center gap-2">
                  {blogs[0]?.blogcategories?.map((item: any, index: number) => (
                    <span key={index} className="font-semibold text-shop_dark_green tracking-wider">{item?.title}</span>
                  ))}
                </div>
                {blogs[0]?.publishedAt ? (
                  <span className="flex items-center gap-1"><Calendar size={14} /> {dayjs(blogs[0]?.publishedAt).format("D MMMM YYYY")}</span>
                ) : null}
              </div>
              <Link href={`/blog/${blogs[0]?.slug?.current}`} className="text-2xl font-bold tracking-tight hover:text-shop_dark_green">
                {blogs[0]?.title}
              </Link>
            </div>
          </article>
          {/* Others */}
          <div className="grid grid-cols-1 gap-5">
            {blogs.slice(1, 4).map((blog) => (
              <article key={blog?._id} className="rounded-xl overflow-hidden border bg-white">
                <Link href={`/blog/${blog?.slug?.current}`}>
                  {blog?.mainImage && (
                    <Image
                      src={urlFor(blog?.mainImage).url()}
                      alt={blog?.title || "Blog Image"}
                      width={800}
                      height={450}
                      className="w-full h-32 object-cover"
                    />
                  )}
                </Link>
                <div className="p-4 space-y-1">
                  <div className="text-[11px] flex items-center gap-3 text-lightColor">
                    <div className="flex items-center gap-2">
                      {blog?.blogcategories?.map((item: any, index: number) => (
                        <span key={index} className="font-semibold text-shop_dark_green tracking-wider">{item?.title}</span>
                      ))}
                    </div>
                    {blog?.publishedAt ? (
                      <span className="flex items-center gap-1"><Calendar size={12} /> {dayjs(blog.publishedAt).format("D MMMM")}</span>
                    ) : null}
                  </div>
                  <Link href={`/blog/${blog?.slug?.current}`} className="text-sm font-semibold tracking-wide line-clamp-2 hover:text-shop_dark_green">
                    {blog?.title}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LatestBlog;
