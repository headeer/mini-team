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
        {/* Tawk.to chat - do not auto-open on mobile; push away from floating buttons; open via #chat */}
        <Script id="tawk-chat" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            
            // Set initial widget positioning before loading
            Tawk_API = Tawk_API || {};
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            
            // Configure widget positioning during initialization
            Tawk_API.embedded = 'tawk-container';
            if (isMobile) {
              // Mobile positioning - higher up to avoid conflicts
              Tawk_API.customStyle = {
                'visibility': {
                  'desktop': {
                    'position': 'br',
                    'xOffset': '16px',
                    'yOffset': '350px'
                  },
                  'mobile': {
                    'position': 'br', 
                    'xOffset': '16px',
                    'yOffset': '350px'
                  }
                }
              };
            } else {
              // Desktop positioning
              Tawk_API.customStyle = {
                'visibility': {
                  'desktop': {
                    'position': 'br',
                    'xOffset': '24px', 
                    'yOffset': '180px'
                  },
                  'mobile': {
                    'position': 'br',
                    'xOffset': '16px',
                    'yOffset': '350px'
                  }
                }
              };
            }
            
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6899b3aa3df3eb1928b7d199/1j2c6bkn1';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
            Tawk_API.onLoad = function(){
              try {
                // Force positioning with CSS override - more aggressive approach
                function forceRepositionChat() {
                  const isMobile = window.matchMedia('(max-width: 768px)').matches;
                  
                  if (isMobile) {
                    // On mobile: position much higher to avoid all conflicts
                    Tawk_API.setAttributes({ position: 'br', bottom: 350, right: 16 }, function(){});
                    // Don't auto-minimize on mobile - let users control chat state
                  } else {
                    // On desktop: position higher on right
                    Tawk_API.setAttributes({ position: 'br', bottom: 180, right: 24 }, function(){});
                  }
                  
                  // Force CSS override with !important
                  setTimeout(function() {
                    const tawkWidget = document.getElementById('tawk-widget');
                    const tawkContainer = document.querySelector('[id^="tawk-"]');
                    const tawkFrame = document.querySelector('iframe[src*="tawk"]');
                    
                    [tawkWidget, tawkContainer, tawkFrame].forEach(function(element) {
                      if (element) {
                        element.style.setProperty('bottom', isMobile ? '350px' : '180px', 'important');
                        element.style.setProperty('right', isMobile ? '16px' : '24px', 'important');
                        element.style.setProperty('z-index', '9999', 'important');
                      }
                    });
                    
                    // Find parent container and style it too
                    const tawkElements = document.querySelectorAll('[id*="tawk"], [class*="tawk"]');
                    tawkElements.forEach(function(el) {
                      if (el && el.style) {
                        el.style.setProperty('bottom', isMobile ? '350px' : '180px', 'important');
                        el.style.setProperty('right', isMobile ? '16px' : '24px', 'important');
                      }
                    });
                  }, 500);
                }
                
                // Initial positioning
                forceRepositionChat();
                
                // Reposition on resize
                window.addEventListener('resize', function() {
                  setTimeout(forceRepositionChat, 100);
                });
                
                // Mobile-specific initialization
                const isMobile = window.matchMedia('(max-width: 768px)').matches;
                if (isMobile) {
                  // Ensure chat widget is properly initialized on mobile
                  setTimeout(function() {
                    try {
                      // Don't auto-minimize, let it stay in default state
                      Tawk_API.showWidget();
                    } catch(e){}
                  }, 1000);
                }
                
                // Watch for DOM changes (Tawk.to loads dynamically)
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length > 0) {
                      mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && (
                          node.id && node.id.includes('tawk') ||
                          node.className && node.className.includes('tawk') ||
                          node.tagName === 'IFRAME' && node.src && node.src.includes('tawk')
                        )) {
                          setTimeout(forceRepositionChat, 200);
                        }
                      });
                    }
                  });
                });
                
                observer.observe(document.body, {
                  childList: true,
                  subtree: true
                });
                
                // Periodic check as fallback
                setInterval(forceRepositionChat, 3000);
                // Open chat when #chat present or clicked
                function openChat() { 
                  try { 
                    Tawk_API.maximize(); 
                    // Ensure chat stays open on mobile
                    setTimeout(function() {
                      const isMobile = window.matchMedia('(max-width: 768px)').matches;
                      if (isMobile) {
                        // Force chat to stay maximized on mobile
                        try { Tawk_API.maximize(); } catch(e){}
                      }
                    }, 100);
                  } catch(e){} 
                }
                
                if (window.location.hash === '#chat') {
                  setTimeout(openChat, 200);
                }
                window.addEventListener('hashchange', function(){
                  if (window.location.hash === '#chat') setTimeout(openChat, 200);
                });
                
                // Prevent auto-minimization on mobile
                Tawk_API.onChatMinimized = function(){
                  const isMobile = window.matchMedia('(max-width: 768px)').matches;
                  if (isMobile && window.location.hash === '#chat') {
                    // Re-maximize if user specifically requested chat
                    setTimeout(function() {
                      try { Tawk_API.maximize(); } catch(e){}
                    }, 100);
                  }
                };
              } catch(e){}
            };
          `}
        </Script>
      </div>
    </ClerkProvider>
  );
}
