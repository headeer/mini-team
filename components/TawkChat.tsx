"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function TawkChat() {
  const pathname = usePathname() || "";
  const isBlocked = pathname === "/shop" || pathname.startsWith("/product/") || pathname.startsWith("/checkout") || pathname.startsWith("/cart");
  if (isBlocked) return null;

  return (
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
  );
}


