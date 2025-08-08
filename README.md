To jest projekt [Next.js](https://nextjs.org) zintegrowany z Sanity, Clerk i Stripe. Polska konfiguracja sklepu MiniTeam.

## Szybki start

1) Utwórz plik `.env.local` (patrz `DOCS.md`) i ustaw klucze: Sanity, Clerk, Stripe.
2) Zainstaluj zależności i uruchom serwer developerski:

```bash
npm install && npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Otwórz [http://localhost:3000](http://localhost:3000).

Sanity Studio dostępne pod `/studio` (po dodaniu projektu Sanity). Import produktów: `DOCS.md` sekcja Import.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Więcej

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
