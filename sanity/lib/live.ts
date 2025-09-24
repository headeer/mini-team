// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity";
import { client } from "./client";

const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_TOKEN;

// Safe fallback: if token is missing (dev/local), provide non-live fetch to avoid runtime errors
let sanityFetch: typeof client.fetch;
let SanityLive: (props: { children?: React.ReactNode }) => JSX.Element | null;

if (token) {
  const live = defineLive({
    client,
    serverToken: token,
    // Do not expose token to browser
    browserToken: undefined as any,
    fetchOptions: { revalidate: 0 },
  });
  sanityFetch = live.sanityFetch;
  SanityLive = live.SanityLive as any;
} else {
  sanityFetch = client.fetch.bind(client);
  SanityLive = () => null;
}

export { sanityFetch, SanityLive };
