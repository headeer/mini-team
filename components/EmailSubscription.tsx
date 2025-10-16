"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Bell, CheckCircle } from "lucide-react";

interface EmailSubscriptionProps {
  onSubscribe?: (email: string) => void;
}

const EmailSubscription: React.FC<EmailSubscriptionProps> = ({ onSubscribe }) => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      // Here you would typically send the email to your backend
      // For now, we'll just simulate a successful subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      onSubscribe?.(email);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className="border-0 shadow-lg bg-green-50 border-green-200">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Dziękujemy za subskrypcję!
          </h3>
          <p className="text-gray-600">
            Będziemy informować Cię o nowych okazjach na części do koparek. 
            <strong> Nie przegapisz żadnej promocji!</strong>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Bell className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Nie Przegap Nowych Okazji!
        </h3>
        <p className="text-gray-600 mb-6">
          <strong>Zapisz się do naszego newslettera</strong> i otrzymuj informacje o nowych 
          częściach do koparek w promocyjnych cenach. <strong>Pierwszy dowiesz się o najlepszych okazjach!</strong>
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Twój adres email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !email}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 h-12"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Mail className="w-5 h-5" />
              )}
            </Button>
          </div>
        </form>
        
        <p className="text-xs text-gray-500 mt-4">
          Wysyłamy maksymalnie 2 emaile miesięcznie. Możesz zrezygnować w każdej chwili.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmailSubscription;

