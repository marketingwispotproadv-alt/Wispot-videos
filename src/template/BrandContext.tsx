import React, { createContext, useContext } from "react";
import type { Brand } from "./types";

const BrandContext = createContext<Brand | null>(null);

export const BrandProvider: React.FC<{
  brand: Brand;
  children: React.ReactNode;
}> = ({ brand, children }) => (
  <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>
);

export const useBrand = (): Brand => {
  const brand = useContext(BrandContext);
  if (!brand) {
    throw new Error("Componente do template usado fora de um <BrandProvider>.");
  }
  return brand;
};
