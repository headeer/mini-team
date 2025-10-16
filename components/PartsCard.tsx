"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Wrench, 
  CheckCircle, 
  Clock, 
  Star,
  Sparkles,
  Zap,
  Target,
  Crown,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

interface PartsCardProps {
  product: {
    _id: string;
    name: string;
    description?: string;
    price?: number;
    originalPrice?: number;
    discount?: number;
    status: "odrzut" | "nieodebrane" | "wyprzedaz" | "ostatni";
    condition: "nowy" | "minimalne-slady" | "dobry";
    image?: string;
    slug?: string;
    category?: string;
  };
}

const PartsCard: React.FC<PartsCardProps> = ({ product }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "odrzut":
        return { label: "Specjalna Okazja", color: "bg-gradient-to-r from-orange-500 to-red-500", icon: Sparkles };
      case "nieodebrane":
        return { label: "Dostępne Teraz", color: "bg-gradient-to-r from-blue-500 to-cyan-500", icon: Clock };
      case "wyprzedaz":
        return { label: "Wyprzedaż", color: "bg-gradient-to-r from-red-500 to-pink-500", icon: TrendingUp };
      case "ostatni":
        return { label: "Ostatni", color: "bg-gradient-to-r from-green-500 to-emerald-500", icon: Zap };
      case "promocja":
        return { label: "Promocja", color: "bg-gradient-to-r from-purple-500 to-indigo-500", icon: Target };
      default:
        return { label: "Okazja", color: "bg-gradient-to-r from-red-500 to-orange-500", icon: Crown };
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case "nowy":
        return "Stan: nowy, bez śladów użytkowania";
      case "minimalne-slady":
        return "Minimalne ślady magazynowe - jak nowy";
      case "dobry":
        return "Stan: dobry, gotowy do użycia";
      case "premium":
        return "Stan: premium, wyjątkowa jakość";
      default:
        return "Sprawdź szczegóły";
    }
  };

  const statusConfig = getStatusConfig(product.status);
  const StatusIcon = statusConfig.icon;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const discountPercentage = product.discount || 
    (product.originalPrice && product.price 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0);

  return (
    <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-white">
      <div className="relative">
        {/* Product Image Placeholder */}
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <Wrench className="w-16 h-16 text-gray-400 group-hover:text-orange-500 transition-colors duration-300" />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <Badge className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold shadow-lg">
            -{discountPercentage}%
          </Badge>
        )}

        {/* Status Badge */}
        <Badge className={`absolute top-4 right-4 ${statusConfig.color} text-white text-xs font-semibold shadow-lg flex items-center gap-1.5 px-2 py-1`}>
          <StatusIcon className="w-3 h-3" />
          {statusConfig.label}
        </Badge>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button 
            size="sm" 
            className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
            asChild
          >
            <Link href={product.slug ? `/product/${product.slug}` : "#"}>
              Szybki Podgląd
            </Link>
          </Button>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Category */}
        {product.category && (
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            {product.category}
          </div>
        )}

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {getConditionText(product.condition)}
        </p>

        {/* Additional Description */}
        {product.description && (
          <p className="text-gray-500 text-xs mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            {product.price && (
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(product.price)}
              </span>
            )}
            {product.originalPrice && product.originalPrice > (product.price || 0) && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          {/* Savings Amount */}
          {product.originalPrice && product.price && (
            <div className="text-right">
              <div className="text-sm font-semibold text-green-600">
                Oszczędzasz
              </div>
              <div className="text-lg font-bold text-green-600">
                {formatPrice(product.originalPrice - product.price)}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
            asChild
          >
            <Link href={product.slug ? `/product/${product.slug}` : "#"}>
              Sprawdź
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-orange-500 text-orange-600 hover:bg-orange-50"
            asChild
          >
            <Link href="/kontakt">
              Zapytaj
            </Link>
          </Button>
        </div>

        {/* Urgency Indicators */}
        {product.status === "ostatni" && (
          <div className="mt-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 text-xs font-semibold">
              <Zap className="w-4 h-4" />
              Ostatni egzemplarz - nie zwlekaj!
            </div>
          </div>
        )}
        
        {product.status === "wyprzedaz" && (
          <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 text-purple-700 text-xs font-semibold">
              <TrendingUp className="w-4 h-4" />
              Ograniczona ilość - szybko się kończy!
            </div>
          </div>
        )}
        
        {discountPercentage > 50 && (
          <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 text-xs font-semibold">
              <TrendingUp className="w-4 h-4" />
              Mega oszczędności - nie przegap!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PartsCard;
