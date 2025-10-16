"use client";

import { useState } from "react";
import { useRecaptchaContext } from "@/components/RecaptchaProvider";
import { Button } from "@/components/ui/button";

export default function ContactForm() {
  const { executeRecaptcha, isLoaded } = useRecaptchaContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Execute reCAPTCHA
      const recaptchaToken = await executeRecaptcha('contact_form');
      
      if (!recaptchaToken) {
        setSubmitMessage("Błąd weryfikacji reCAPTCHA. Spróbuj ponownie.");
        setIsSubmitting(false);
        return;
      }

      // Get form data
      const formData = new FormData(e.currentTarget);
      formData.append('recaptchaToken', recaptchaToken);

      // Submit form
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage("Dziękujemy za wiadomość! Odpowiemy w ciągu 24 godzin.");
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitMessage(result.error || "Wystąpił błąd podczas wysyłania wiadomości.");
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitMessage("Wystąpił błąd podczas wysyłania wiadomości.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Imię i nazwisko*
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]"
            placeholder="Jan Kowalski"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-mail*
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]"
            placeholder="jan@firma.pl"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Telefon
          </label>
          <input
            id="phone"
            name="phone"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]"
            placeholder="+48 600 000 000"
          />
        </div>
        <div>
          <label htmlFor="sizeCm" className="block text-sm font-medium text-gray-700">
            Rozmiar (cm)
          </label>
          <input
            id="sizeCm"
            name="sizeCm"
            type="number"
            min={0}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]"
            placeholder="np. 80"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="machineWeight" className="block text-sm font-medium text-gray-700">
            Waga maszyny (t)
          </label>
          <input
            id="machineWeight"
            name="machineWeight"
            type="number"
            step="0.1"
            min={0}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]"
            placeholder="np. 3.5"
          />
        </div>
        <div>
          <label htmlFor="machineBrand" className="block text-sm font-medium text-gray-700">
            Marka maszyny
          </label>
          <input
            id="machineBrand"
            name="machineBrand"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]"
            placeholder="np. JCB, CAT, Volvo"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Wiadomość*
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]"
          placeholder="Opisz swoje potrzeby..."
        />
      </div>

      {submitMessage && (
        <div className={`p-3 rounded-md text-sm ${
          submitMessage.includes("Dziękujemy") 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {submitMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !isLoaded}
          className="bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] w-full sm:w-auto font-semibold py-3"
        >
          {isSubmitting ? "Wysyłanie..." : "Wyślij zapytanie"}
        </Button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Ta strona jest chroniona przez reCAPTCHA Google. Obowiązują{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
          Polityka prywatności
        </a>{" "}
        i{" "}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">
          Warunki korzystania z usługi
        </a>.
      </div>
    </form>
  );
}

