import { Clock, Mail, MapPin, Phone } from "lucide-react";
import React from "react";

interface ContactItemData {
  title: string;
  subtitle: React.ReactNode;
  icon: React.ReactNode;
}

const data: ContactItemData[] = [
  { title: "Adres", subtitle: "Ujazd 11, 56-330 Ujazd", icon: (<MapPin className="h-5 w-5 text-gray-700" />) },
  { title: "Telefon", subtitle: (<a href="tel:+48782851962" className="hover:underline">782-851-962</a>), icon: (<Phone className="h-5 w-5 text-gray-700" />) },
  { title: "Godziny pracy", subtitle: "Pn - Sb: 8:00 - 18:00", icon: (<Clock className="h-5 w-5 text-gray-700" />) },
  { title: "Email", subtitle: (<a href="mailto:teodorczykpt@gmail.com" className="hover:underline">teodorczykpt@gmail.com</a>), icon: (<Mail className="h-5 w-5 text-gray-700" />) },
];

const FooterTop = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 border-b py-4">
      {data?.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-xl p-3 sm:p-4 bg-white hover:bg-gray-50 border border-gray-200 transition-colors"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 border border-gray-200">
            {item?.icon}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {item?.title}
            </h3>
            <p className="text-gray-600 text-xs mt-0.5 truncate">
              {item?.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterTop;
