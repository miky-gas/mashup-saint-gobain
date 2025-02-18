import { createRoot } from 'react-dom/client';
import React from 'react'; // Asegúrate de importar React
import Main from "./Main";
import { Provider } from 'react-redux';
import store from '@store/store'; // Importa tu store Redux

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Main />
    </Provider>
  </React.StrictMode>
);
