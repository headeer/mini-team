import { Clock, Mail, MapPin, Phone } from "lucide-react";
import React from "react";

interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const data: ContactItemData[] = [
  { title: "Adres", subtitle: "Ujazd 11, 56-330 Cieszków", icon: (<MapPin className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />) },
  { title: "Telefon", subtitle: "+48 782 851 962", icon: (<Phone className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />) },
  { title: "Godziny pracy", subtitle: "Pn - Sb: 8:00 - 18:00", icon: (<Clock className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />) },
  { title: "Email", subtitle: "teodorczykpt@gmail.com", icon: (<Mail className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />) },
];

const FooterTop = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-b">
      {data?.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors hoverEffect"
        >
          {item?.icon}
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-black hoverEffect">
              {item?.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 hoverEffect">
              {item?.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterTop;
