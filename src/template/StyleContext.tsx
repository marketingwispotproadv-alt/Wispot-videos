import React, { createContext, useContext } from "react";
import { FICHAS } from "./style";
import type { Style } from "./types";

const StyleContext = createContext<Style>(FICHAS);

export const StyleProvider: React.FC<{
  style: Style;
  children: React.ReactNode;
}> = ({ style, children }) => (
  <StyleContext.Provider value={style}>{children}</StyleContext.Provider>
);

export const useStyle = (): Style => useContext(StyleContext);
