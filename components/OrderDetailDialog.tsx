import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";

interface OrderDetailsDialogProps {
  order: MY_ORDERS_QUERYResult[number] | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[92vw] max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Zamówienie #{order?.orderNumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600">Klient</div>
            <div className="text-gray-900 font-medium text-right">{order.customerName}</div>
            <div className="text-gray-600">Email</div>
            <div className="text-gray-900 font-medium text-right break-all">{order.email}</div>
            <div className="text-gray-600">Data</div>
            <div className="text-gray-900 font-medium text-right">{order.orderDate && new Date(order.orderDate).toLocaleDateString()}</div>
            <div className="text-gray-600">Status</div>
            <div className="text-right">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-green-100 text-green-700">
                {order.status}
              </span>
            </div>
          </div>

          {order?.invoice?.hosted_invoice_url ? (
            <div className="flex justify-end">
              <Button asChild className="bg-[var(--color-brand-orange)] hover:brightness-95">
                <Link href={order.invoice.hosted_invoice_url} target="_blank">Pobierz fakturę</Link>
              </Button>
            </div>
          ) : null}

          <div className="border-t pt-3">
            <div className="space-y-2">
              {order.products?.map((product, index) => (
                <div key={index} className="flex items-center gap-3">
                  {product?.product?.images && (() => {
                    const toSrc = (img: any): string | null => {
                      if (!img) return null;
                      if (typeof img === "string") return img || null;
                      if (typeof img === "object" && img.url) return img.url || null;
                      if (typeof img === "object" && img.asset?._ref) {
                        try { return urlFor(img).url(); } catch { return null; }
                      }
                      return null;
                    };
                    const src = toSrc(product?.product?.images?.[0]);
                    return src ? (
                      <Image src={src} alt="produkt" width={44} height={44} className="rounded border" />
                    ) : (
                      <div className="h-11 w-11 rounded border bg-gray-50" />
                    );
                  })()}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{product?.product?.name}</div>
                    <div className="text-xs text-gray-600">Ilość: {product?.quantity}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    <PriceFormatter amount={product?.product?.price} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-600">Razem</div>
              <div className="font-bold text-gray-900">
                <PriceFormatter amount={order?.totalPrice} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
