import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import QlikContext from "@context/QlikContext"; // Importa el contexto
import GSenseApp from '@config/configGlobal.jsx';
import i18n from 'i18next';
import { useRouter } from "@uirouter/react";
import i18next from 'i18next';
let _app = '';

const CurrentSelectionsObject = (props) => {
    const [PROPERTIES] = useState(props.properties);
    const [loaded, setLoaded] = useState(false);
    const [open, setOpen] = useState(false);
    const [app, setApp] = useState(null);
    const { qlik, connConfig } = useContext(QlikContext);
    const visualRef = useRef(null);
    const ROUTER = useRouter();
    const idioma = i18next.language;
    useEffect(() => {
        loadObject(props.aplication, qlik);

        return () => {
            if (visualRef.current && typeof visualRef.current.close === 'function') {
                visualRef.current.close();
            }
            // Realiza las limpiezas necesarias cuando el componente se desmonta
        };
    }, [props.aplication, props.qlikObjectID]); // Se ejecuta cada vez que cambian aplication o qlikObjectID

    useEffect(() => {
        const handleLanguageChange = (newLang) => {
            // Realizar acciones específicas cuando cambie el idioma
            //console.log('El idioma ha cambiado a:', newLang);
            // Por ejemplo, podrías actualizar la interfaz de usuario para reflejar el nuevo idioma
            if (visualRef.current) {
                visualRef.current.close().then(() => {
                    setTimeout(() => {
                        loadObject(props.aplication, qlik);
                    }, 600);

                }).catch((error) => {
                    console.error('Error closing visual:', error);
                });
            } else {
                setTimeout(() => {
                    loadObject(props.aplication, qlik);
                }, 600);
            }

        };

        i18next.on('languageChanged', handleLanguageChange);

        return () => {
            if (visualRef.current && typeof visualRef.current.close === 'function') {
                visualRef.current.close().then(() => {
                    //console.log('Visual closed');
                }).catch((error) => {
                    console.error('Error closing visual:', error);
                });
            }
            i18next.off('languageChanged', handleLanguageChange);
        };
    }, []); // Se ejecuta solo una vez al montar el componente

    const loadObject = (ap, qs) => {
        if (ap) {
            _app = ap;
            _app.getObject(props.qlikObjectID, props.qlikObjectID).then((vis) => {
                setOpen(true);
                GSenseApp.qlikVisualsCurrentSelections = vis;
                visualRef.current = vis;
                handleLoad();
            });
        }

    };

    const handleLoad = () => {
        setLoaded(true);
        // Llamamos a la función pasada desde el componente padre
        props.onObjectLoaded(true);
    };

    const handleGoToInsightAdvisor = () => {
        ROUTER.stateService.go('home.InsightAdvisor.Dashboard', {
            aplication: props.aplication,
            MENUTOP: PROPERTIES.$stateParams.MENUTOP,
            IDFILTRO: PROPERTIES.$stateParams.IDFILTRO
        })
    }
    const viewInsightAdvisor = useMemo(() => {
        return GSenseApp.init.viewInsightAdvisor;
    }, []);

    return (
        <React.Fragment>
            <div id="box-current-selecctions">
                <div className="CurrentSelections native-chart native-chart-selection qvobject qlik-embed" id={props.qlikObjectID}></div>
                {viewInsightAdvisor && (
                    <div id="addInsightAdvisor">
                        <a onClick={() => handleGoToInsightAdvisor()} data-ui-sref="App.insightadvisor.View.insightadvisor">
                            <i class="ri-lightbulb-flash-line ico-14"></i>
                            <span class="texto-enlaces">Insight Advisor</span>
                        </a>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};

export default CurrentSelectionsObject;
