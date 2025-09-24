"use client";

import useStore from "@/store";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { motion } from "motion/react";
import { Check, Home, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";

const SuccessPageContent = () => {
  const { resetCart } = useStore();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const finalize = async () => {
      try {
        if (!orderNumber || !sessionId) return;
        await fetch('/api/finalize-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderNumber, session_id: sessionId }),
        });
        resetCart();
      } catch (e) {
        // ignore errors, order page will still show UI
      }
    };
    finalize();
  }, [orderNumber, sessionId, resetCart]);
  return (
    <div className="py-5 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mx-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl flex flex-col gap-8 shadow-2xl p-6 max-w-xl w-full text-center border border-gray-200"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)]"
        >
          <Check className="text-white w-10 h-10" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Zamówienie potwierdzone!
        </h1>
        <div className="space-y-4 mb-4 text-left">
          <p className="text-gray-700">
            Dziękujemy za zakup. Przetwarzamy Twoje zamówienie i wkrótce je wyślemy.
            Wkrótce otrzymasz e‑mail z potwierdzeniem oraz szczegółami zamówienia.
          </p>
          <p className="text-gray-700">
            Numer zamówienia:{" "}
            <span className="text-black font-semibold">{orderNumber}</span>
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold rounded-full text-white bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] hover:opacity-95 transition-all duration-300 shadow-md"
          >
            <Home className="w-5 h-5 mr-2" />
            Strona główna
          </Link>
          <Link
            href="/orders"
            className="flex items-center justify-center px-4 py-3 font-semibold rounded-full border border-[var(--color-brand-orange)] text-[var(--color-brand-orange)] bg-white hover:bg-orange-50 transition-all duration-300 shadow-md"
          >
            <Package className="w-5 h-5 mr-2" />
            Zamówienia
          </Link>
          <Link
            href="/shop"
            className="flex items-center justify-center px-4 py-3 font-semibold rounded-full text-white bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] hover:opacity-95 transition-all duration-300 shadow-md"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Sklep
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
};

export default SuccessPage;
