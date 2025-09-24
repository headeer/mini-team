import { defineQuery } from "next-sanity";

const BRANDS_QUERY = defineQuery(`*[_type=='brand'] | order(name asc) `);

const LATEST_BLOG_QUERY = defineQuery(
  `*[_type == 'blog'] | order(publishedAt desc)[0...4]{
    ...,
    blogcategories[]->{ title },
    "slug": slug.current
  }`
);

const DEAL_PRODUCTS = defineQuery(
  `*[_type == 'product' && status == 'hot' && coalesce(hidden, false) != true] | order(name asc){
    ...,"categories": categories[]->title
  }`
);

const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug && coalesce(hidden, false) != true] | order(name asc) [0]{
    ...,
    toothCost,
    toothQty,
    technicalDrawing,
    technicalDrawings[]{
      title,
      code,
      "imageUrl": image.asset->url,
      "fileUrl": file.asset->url,
      externalUrl
    },
    mountSystems[]{
      code,
      title,
      price,
      "drawingImageUrl": drawingImage.asset->url,
      "drawingFileUrl": drawingFileAsset.asset->url,
      drawingFile,
      productRef->{
        _id,
        name,
        "slug": slug.current,
        price,
        basePrice,
        images
      }
    },
    dimensions,
    teethEnabled,
    drillBits[]{
      title,
      price,
      productRef->{
        _id,
        name,
        "slug": slug.current,
        price,
        basePrice,
        images
      }
    },
    "categories": categories[]->{title, "slug": slug.current},
    "similarProducts": similarProducts[]->{
      _id,
      name,
      description,
      "slug": slug.current,
      price,
      basePrice,
      priceOlx,
      discount,
      stock,
      images,
      "categories": categories[]->{title}
    },
    recommendationSettings
  }`
);

const BRAND_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug && coalesce(hidden, false) != true]{
  "brandName": brand->title
  }`);

const MY_ORDERS_QUERY =
  defineQuery(`*[_type == 'order' && defined(clerkUserId) && clerkUserId == $userId] | order(orderDate desc){
...,products[]{
  ...,product->
}
}`);
const GET_ALL_BLOG = defineQuery(
  `*[_type == 'blog'] | order(publishedAt desc)[0...$quantity]{
  ...,  
     blogcategories[]->{
    title
}
    }
  `
);

const SINGLE_BLOG_QUERY =
  defineQuery(`*[_type == "blog" && slug.current == $slug][0]{
  ..., 
    author->{
    name,
    image,
  },
  blogcategories[]->{
    title,
    "slug": slug.current,
  },
}`);

const BLOG_CATEGORIES = defineQuery(
  `*[_type == "blog"]{
     blogcategories[]->{
    ...
    }
  }`
);

const OTHERS_BLOG_QUERY = defineQuery(`*[
  _type == "blog"
  && defined(slug.current)
  && slug.current != $slug
]|order(publishedAt desc)[0...$quantity]{
...
  publishedAt,
  title,
  mainImage,
  slug,
  author->{
    name,
    image,
  },
  categories[]->{
    title,
    "slug": slug.current,
  }
}`);
export {
  BRANDS_QUERY,
  LATEST_BLOG_QUERY,
  DEAL_PRODUCTS,
  PRODUCT_BY_SLUG_QUERY,
  BRAND_QUERY,
  MY_ORDERS_QUERY,
  GET_ALL_BLOG,
  SINGLE_BLOG_QUERY,
  BLOG_CATEGORIES,
  OTHERS_BLOG_QUERY,
};
