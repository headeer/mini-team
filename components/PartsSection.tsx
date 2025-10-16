"use client";
import React, { useState, useEffect } from "react";
import PartsGrid from "./PartsGrid";
import { AlertTriangle, RefreshCw } from "lucide-react";

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

const PartsSection: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/parts');
        const data = await response.json();
        
        if (data.success) {
          setParts(data.data);
        } else {
          setError("Nie udało się załadować części");
        }
      } catch (err) {
        setError("Wystąpił błąd podczas ładowania danych");
        console.error("Error fetching parts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, []);

  if (error) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border shadow-sm">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Wystąpił błąd
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return <PartsGrid parts={parts} loading={loading} />;
};

export default PartsSection;
