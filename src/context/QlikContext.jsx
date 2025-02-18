import React, { createContext, useState } from "react";

// Creamos el contexto
const QlikContext = createContext();

// Creamos un componente proveedor para envolver nuestra aplicación y proporcionar el contexto a todos los componentes descendientes
export const QlikProvider = ({ children }) => {
  const [qlik, setQlik] = useState(null); // Aquí puedes inicializar el estado de qlik según tus necesidades
  const [connConfig, setConnConfig] = useState(null); // Agregamos el estado para la configuración de conexión
  const [currentApp, setCurrentApp] = useState(null); // Agregamos el estado para la app activa

  return (
    <QlikContext.Provider value={{ qlik, setQlik, connConfig, setConnConfig, currentApp, setCurrentApp }}>
      {children}
    </QlikContext.Provider>
  );
};

export default QlikContext;
