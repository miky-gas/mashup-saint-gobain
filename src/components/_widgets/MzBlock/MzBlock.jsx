import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import store from '@store/store'; // Importa el store

function MzBlock() {
    const { t } = useTranslation();
    const [textoLoader, setTextoLoader] = useState(t("blockloading.label.openapp"));
    const [partials, setPartials] = useState(0);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        // Función que será llamada cada vez que el estado cambie
        const handleStateChange = () => {
            const state = store.getState();
            const partials = state.objectLoadedSlice.partials;
            const total = state.objectLoadedSlice.total;

            setPartials(partials);
            setTotal(total);
            if (total > 0) {
                setTextoLoader(`${t("blockloading.label.cargandoobjetos")}${partials}${t("blockloading.label.of")}${total}`);
            } else {
                setTextoLoader(t("blockloading.label.openapp"));
            }
        };

        // Suscribirse a los cambios del store
        const unsubscribe = store.subscribe(handleStateChange);

        // Llamar a la función de manejo de estado una vez al inicio
        handleStateChange();

        // Limpiar la suscripción cuando el componente se desmonte
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <React.Fragment>
            <div id="logo-block"></div>
            <div className="flex-loader-cover">
                <div className="boxes">
                    <div className="box">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className="box">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className="box">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className="box">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                <p>{t("common.label.esperar")}</p>
                <div className="texto-loader"> {textoLoader}</div>

            </div>
            {/* <img id="pont-1" src="assets/img/wellcomeImages/Point-001.png" alt="ImgFondo" />
            <img id="pont-2" src="assets/img/wellcomeImages/Point-002.png" alt="ImgFondo" />
            <img id="pont-3" src="assets/img/wellcomeImages/Point-003.png" alt="ImgFondo" />
            <img id="pont-4" src="assets/img/wellcomeImages/Point-004.png" alt="ImgFondo" /> */}
        </React.Fragment>
    );
}

export default MzBlock;
