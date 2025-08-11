import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const backendClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // For writes we must NOT use CDN
  useCdn: false,
  // Try common env names for the write token
  token:
    process.env.SANITY_TOKEN ||
    process.env.SANITY_WRITE_TOKEN ||
    process.env.SANITY_API_TOKEN,
});
