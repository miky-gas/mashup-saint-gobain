//Licencia DEVEXTREME
import config from 'devextreme/core/config'; 
import { licenseKey } from './devextreme-license'; 
config({ licenseKey }); 

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { UIRouter, UIRouterReact, UIView, hashLocationPlugin } from "@uirouter/react";
import { STATESROUTES } from "@routes/_routes.jsx";
import { QlikProvider } from "@context/QlikContext.jsx";
import i18next from 'i18next';
import GSenseApp from '@config/configGlobal.jsx';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '@lib/translate/traducciones_en.jsx';
import translationES from '@lib/translate/traducciones_es.jsx';
import MzApiGlobalService from '@services/mzApiGlobalService';
import { useSelector, useDispatch } from 'react-redux';
import { reset, hideOptionsPanel, setOptions, setOptionsFallback, setVideos } from "@store/store";
import { createRoot } from 'react-dom/client';
import QlikConnection from './components/QlikConnection';
import MzBlock from "@components/_widgets/MzBlock/MzBlock";

const { language } = GSenseApp.init;
i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      es: { translation: translationES }
    },
    lng: language,
    fallbackLng: language,
    debug: false,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: true
    }
  });

function Main() {
  const { t } = useTranslation();
  const [qlikConnected, setQlikConnected] = useState(false);
  const [removeScreenBlock, setRemoveScreenBlock] = useState(false); // Estado para eliminar bloqueo de pantalla
  const dispatch = useDispatch();
  const router = new UIRouterReact();
  router.plugin(hashLocationPlugin);
  const configRouter = useCallback((router) => {
    router.urlRouter.otherwise("/welcome");
    router.transitionService.onStart({}, async transition => {
      GSenseApp.removeVisualObject();
      dispatch(reset());
      dispatch(hideOptionsPanel());
    });
  }, [dispatch]);

  function qlikConnectionSuccess() {
    setQlikConnected(true);

    // console.log('Success in Main.jsx:');
  }


  useEffect(() => {
    if (qlikConnected) {
      setRemoveScreenBlock(true); // Permitir eliminar el bloqueo de pantalla
    }
  }, [qlikConnected]);

  useEffect(() => {
    if (removeScreenBlock) {
      if (window.location.hash === '#/welcome' || window.location.hash === '') {
        const el = document.getElementById('load_app');
        if (el && el.parentNode) {
          el.classList.add('animate__animated', 'animate__fadeOut');
          setTimeout(() => {
            if (el && el.parentNode) {
              el.parentNode.removeChild(el);
            }
          }, 0);

        }
      }
    }
  }, [removeScreenBlock]); // Ejecutar eliminación cuando removeScreenBlock sea true
  return (

    <QlikProvider>
      <QlikConnection onConnection={qlikConnectionSuccess} />
      <I18nextProvider i18n={i18next}>
        {qlikConnected  &&(
          <UIRouter
            plugins={[hashLocationPlugin]}
            states={STATESROUTES}
            config={configRouter}
          >
            <div className="content col-12 mzh-100 m-0 p-0">
              <React.Suspense fallback={<div className="initLoading">{t('AddData.Loading')}</div>}>
                <UIView />
              </React.Suspense>
            </div>
          </UIRouter>
        )}
      </I18nextProvider>
    </QlikProvider>

  );
}

export default Main;
