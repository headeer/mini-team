"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useRecaptcha } from '@/hooks/useRecaptcha';

interface RecaptchaContextType {
  isLoaded: boolean;
  executeRecaptcha: (action: string) => Promise<string | null>;
}

const RecaptchaContext = createContext<RecaptchaContextType | undefined>(undefined);

export const useRecaptchaContext = () => {
  const context = useContext(RecaptchaContext);
  if (context === undefined) {
    throw new Error('useRecaptchaContext must be used within a RecaptchaProvider');
  }
  return context;
};

interface RecaptchaProviderProps {
  children: ReactNode;
}

export const RecaptchaProvider: React.FC<RecaptchaProviderProps> = ({ children }) => {
  const { isLoaded, executeRecaptcha } = useRecaptcha();

  return (
    <RecaptchaContext.Provider value={{ isLoaded, executeRecaptcha }}>
      {children}
    </RecaptchaContext.Provider>
  );
};

