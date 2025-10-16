"use client";
import React, { useState, useEffect } from "react";
import PartsCard from "./PartsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Package } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmailSubscription from "./EmailSubscription";

interface Part {
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
}

interface PartsGridProps {
  parts: Part[];
  loading?: boolean;
}

const PartsGrid: React.FC<PartsGridProps> = ({ parts, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "discount-desc" | "newest">("discount-desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [conditionFilter, setConditionFilter] = useState<string>("all");
  const [filteredParts, setFilteredParts] = useState<Part[]>(parts);

  useEffect(() => {
    let filtered = [...parts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(part =>
        part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(part => part.status === statusFilter);
    }

    // Condition filter
    if (conditionFilter !== "all") {
      filtered = filtered.filter(part => part.condition === conditionFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return (a.price || 0) - (b.price || 0);
        case "price-desc":
          return (b.price || 0) - (a.price || 0);
        case "discount-desc":
          const discountA = a.discount || (a.originalPrice && a.price ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0);
          const discountB = b.discount || (b.originalPrice && b.price ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0);
          return discountB - discountA;
        case "newest":
          return 0; // For now, just keep original order
        default:
          return 0;
      }
    });

    setFilteredParts(filtered);
  }, [parts, searchTerm, sortBy, statusFilter, conditionFilter]);

  const getStatusCounts = () => {
    const counts = {
      all: parts.length,
      odrzut: 0,
      nieodebrane: 0,
      wyprzedaz: 0,
      ostatni: 0,
    };

    parts.forEach(part => {
      if (counts.hasOwnProperty(part.status)) {
        counts[part.status as keyof typeof counts]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Filters */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Loading Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Szukaj części..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sortuj według" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="discount-desc">
                Największa zniżka
              </SelectItem>
              <SelectItem value="price-asc">
                Cena rosnąco
              </SelectItem>
              <SelectItem value="price-desc">
                Cena malejąco
              </SelectItem>
              <SelectItem value="newest">Najnowsze</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                Wszystkie ({statusCounts.all})
              </SelectItem>
              <SelectItem value="odrzut">
                Odrzuty ({statusCounts.odrzut})
              </SelectItem>
              <SelectItem value="nieodebrane">
                Nieodebrane ({statusCounts.nieodebrane})
              </SelectItem>
              <SelectItem value="wyprzedaz">
                Wyprzedaż ({statusCounts.wyprzedaz})
              </SelectItem>
              <SelectItem value="ostatni">
                Ostatnie ({statusCounts.ostatni})
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Condition Filter */}
          <Select value={conditionFilter} onValueChange={setConditionFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Stan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie</SelectItem>
              <SelectItem value="nowy">Nowe</SelectItem>
              <SelectItem value="minimalne-slady">Min. ślady</SelectItem>
              <SelectItem value="dobry">Dobry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {(searchTerm || statusFilter !== "all" || conditionFilter !== "all") && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            <span className="text-sm text-gray-600">Aktywne filtry:</span>
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Szukaj: &quot;{searchTerm}&quot;
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter("all")}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {conditionFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Stan: {conditionFilter}
                <button
                  onClick={() => setConditionFilter("all")}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setConditionFilter("all");
              }}
              className="text-xs"
            >
              Wyczyść wszystkie
            </Button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Znaleziono: <span className="font-semibold text-gray-900">{filteredParts.length}</span> części
          {filteredParts.length !== parts.length && (
            <span className="text-sm text-gray-500 ml-2">
              (z {parts.length} dostępnych)
            </span>
          )}
        </p>
      </div>

      {/* Parts Grid */}
      {filteredParts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParts.map((part) => (
            <PartsCard key={part._id} product={part} />
          ))}
        </div>
      ) : (
    <div className="space-y-8">
      <div className="text-center py-16 bg-white rounded-xl border shadow-sm">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Nie znaleziono części
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Spróbuj zmienić kryteria wyszukiwania lub filtry, aby znaleźć to czego szukasz
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("all");
            setConditionFilter("all");
          }}
          className="px-6 py-2"
        >
          Wyczyść filtry
        </Button>
      </div>
      
      {/* Email Subscription */}
      <div className="max-w-md mx-auto">
        <EmailSubscription />
      </div>
    </div>
      )}
    </div>
  );
};

export default PartsGrid;
