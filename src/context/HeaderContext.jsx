import React, { createContext, useState } from "react";

// Creamos el contexto
const HeaderContext = createContext();

// Creamos un componente proveedor para envolver nuestra aplicación y proporcionar el contexto a todos los componentes descendientes
export const HeaderProvider = ({ children }) => {
  const [openBookmark, setOpenBookmark] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openGlossary, setOpenGlossary] = useState(false);
  const [openAlerts, setOpenAlerts] = useState(false);
  const [openFilterSelected, setOpenFilterSelected ] = useState(false);
  const [totalFiltros, setTotalFiltros ] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed ] = useState(false);


  return (
    <HeaderContext.Provider value={{ openBookmark, setOpenBookmark, openFilter, setOpenFilter, openGlossary, setOpenGlossary, openAlerts, setOpenAlerts, openFilterSelected, setOpenFilterSelected, totalFiltros, setTotalFiltros, sidebarCollapsed, setSidebarCollapsed  }}>
      {children}
    </HeaderContext.Provider>
  );
};

export default HeaderContext;
