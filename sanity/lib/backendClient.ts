import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const backendClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // For writes we must NOT use CDN
  useCdn: false,
  // Require a single explicit write token
  token: process.env.SANITY_TOKEN,
});
