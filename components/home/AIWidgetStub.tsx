import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AIWidgetStub = () => {
  return (
    <section id="chat" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Masz pytanie? Zapytaj naszego AI‑asystenta</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700 mb-6">Szybkie odpowiedzi na temat kompatybilności, cen i specyfikacji.</p>
            <div className="rounded-xl border bg-white p-6 text-gray-600">
              Tutaj pojawi się widget AI (połączenie z /api/ai).
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AIWidgetStub;

