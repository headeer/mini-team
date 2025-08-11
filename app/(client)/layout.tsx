import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import TopBenefitsBar from "@/components/TopBenefitsBar";
import FloatingMachineSelector from "@/components/FloatingMachineSelector";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    template: "%s – MTT Osprzęt do koparek",
    default: "MTT Osprzęt do koparek – Łyżki, zrywaki, osprzęt",
  },
  description: "Osprzęt do koparek: łyżki, zrywaki, szybkozłącza. Hardox HB500, dostawa 48h, polska produkcja.",
  applicationName: "MTT Sklep",
  authors: [{ name: "MTT" }],
  keywords: [
    "osprzęt do koparek",
    "łyżki kopiące",
    "łyżki skarpowe",
    "zrywak korzeni",
    "szybkozłącza",
    "Hardox HB500",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "MTT Osprzęt do koparek",
    type: "website",
    title: "MTT Osprzęt do koparek – Łyżki, zrywaki, osprzęt",
    description: "Osprzęt do koparek: łyżki, zrywaki, szybkozłącza. Hardox HB500, dostawa 48h, polska produkcja.",
    images: [{ url: "/images/main/excavator-2025-03-15-06-31-29-utc.webp" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MTT Osprzęt do koparek",
    description: "Osprzęt do koparek: łyżki, zrywak, szybkozłącza.",
    images: ["/images/main/excavator-2025-03-15-06-31-29-utc.webp"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div className="flex flex-col min-h-screen">
        <AccessibilityPanel />
        <TopBenefitsBar />
        <Header />
        <main id="content" className="flex-1">{children}</main>
        <Footer />
        <FloatingMachineSelector />
        {/* Tawk.to chat */}
        <Script id="tawk-chat" strategy="afterInteractive">
          {`
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
  s1.async=true;
  s1.src='https://embed.tawk.to/6899b3aa3df3eb1928b7d199/1j2c6bkn1';
  s1.charset='UTF-8';
  s1.setAttribute('crossorigin','*');
  s0.parentNode.insertBefore(s1,s0);
})();
          `}
        </Script>
      </div>
    </ClerkProvider>
  );
}
