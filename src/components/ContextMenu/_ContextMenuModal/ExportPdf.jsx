import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

function ExportPdf(props) {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const _app = props.aplication
    const ID = props.qlikObjectID;
    const vis = props.visual;
    const [printUrl, setPrintUrl] = useState('');

    const [printSetting, setPrintSetting] = useState({
        dpi: 200,
        aspectRatio: 0,
        orientacion: 'landscape',
        tamanio: 'a3',
        height: props.visual._elements[0].clientHeight, 
        width: props.visual._elements[0].clientWidth 
    });

    const states = {
        NODATA: -4,
        CANCELED: -3,
        TIMEOUT: -2,
        FAILED: -1,
        IDLE: 0,
        PENDING: 1,
        COMPLETED: 2
    };
    const layout = [
        {
            label: 'Vertical',
            orientation: 'portrait',
            translationKey: "Print.Portrait"
        },
        {
            label: 'Apaisado',
            orientation: 'landscape',
            translationKey: 'Print.Landscape'
        }
    ]

    const [state, setState] = useState(states.IDLE);
    const [selectedLayout, setSelectedLayout] = useState(layout[1]);





    useEffect(() => {
        props.onDatosListos();
        setLabelPaperSize();

    }, []);

    const getPaperFormats = (val) => {
        switch (val) {
            case 'a3':
                if (currentLanguage === 'en') {
                    return selectedLayout.orientation === 'portrait' ? 'A3 (16.55" x 11.7")' : 'A3 (11.7" x 16.55")';
                } else {
                    return selectedLayout.orientation === 'portrait' ? 'A3 (297mm x 420 mm)' : 'A3 (420 mm x 297mm)';
                }
            case 'a4':
                if (currentLanguage === 'en') {
                    return selectedLayout.orientation === 'portrait' ? 'A4 (8.275" x 11.7")' : 'A4 (11.7" x 8.275")';
                } else {
                    return selectedLayout.orientation === 'portrait' ? 'A4 (210 mm x 297 mm)' : 'A4 (297 mm x 210mm)';
                }
            case 'a5':
                if (currentLanguage === 'en') {
                    return selectedLayout.orientation === 'portrait' ? 'A5 (5.85" x 8.275")' : 'A5 (8.275" x 5.85")';
                } else {
                    return selectedLayout.orientation === 'portrait' ? 'A5 (148 mm x 210 mm)' : 'A5 (210 mm x 148mm)';
                }
            case 'a6':
                if (currentLanguage === 'en') {
                    return selectedLayout.orientation === 'portrait' ? 'A6 (4.1375" x 5.85")' : 'A6 (5.85" x 4.1375")';
                } else {
                    return selectedLayout.orientation === 'portrait' ? 'A6 (105 mm x 148 mm)' : 'A6 (148 mm x 105 mm)';
                }
            case 'a7':
                if (currentLanguage === 'en') {
                    return selectedLayout.orientation === 'portrait' ? 'A7 (2.925" x 4.1375")' : 'A7 (4.1375" x 2.925")';
                } else {
                    return selectedLayout.orientation === 'portrait' ? 'A7 (74 mm x 105 mm)' : 'A7 (105 mm x 74 mm)';
                }
            case 'letter':
                if (currentLanguage === 'en') {
                    return selectedLayout.orientation === 'portrait' ? 'Letter (8.5" x 11")' : 'Letter (11" x 8.5")';
                } else {
                    return selectedLayout.orientation === 'portrait' ? 'Carta (215mm x 279 mm)' : 'Carta (279 mm x 215mm)';
                }
            default:
                return '';
        }
    };
    const [paperSizes, setPaperSizes] = useState({
        a3: {
            label: getPaperFormats('a3'),
            tamanio: 'a3',
            height: 420,
            width: 297
        },
        a4: {
            label: getPaperFormats('a4'),
            tamanio: 'a4',
            height: 297,
            width: 210
        },
        a5: {
            label: getPaperFormats('a5'),
            tamanio: 'a5',
            height: 210,
            width: 148
        },
        a6: {
            label: getPaperFormats('a6'),
            tamanio: 'a6',
            height: 148,
            width: 105
        },
        a7: {
            label: getPaperFormats('a7'),
            tamanio: 'a7',
            height: 105,
            width: 74
        },
        letter: {
            label: getPaperFormats('letter'),
            tamanio: 'letter',
            height: 279.4,
            width: 215.9
        }
    });
    const [selectedSize, setSelectedSize] = useState('a4');

    const setLabelPaperSize = () => {
        setPaperSizes(prevPaperSizes => ({
            ...prevPaperSizes,
            a3: {
                ...prevPaperSizes.a3,
                label: getPaperFormats('a3', selectedLayout)
            },
            a4: {
                ...prevPaperSizes.a4,
                label: getPaperFormats('a4')
            },
            a5: {
                ...prevPaperSizes.a5,
                label: getPaperFormats('a5')
            },
            a6: {
                ...prevPaperSizes.a6,
                label: getPaperFormats('a6')
            },
            a7: {
                ...prevPaperSizes.a7,
                label: getPaperFormats('a7')
            },
            letter: {
                ...prevPaperSizes.letter,
                label: getPaperFormats('letter')
            }
        }));
    }


    const handleSizeChange = (size) => {
        setSelectedSize(size);
        setPrintSetting(prevPrintSetting => ({
            ...prevPrintSetting,
            tamanio: size
        })); 
    };

    const handleChangeDpi = (increment) => {
        const newDpi = Math.max(72, Math.min(300, printSetting.dpi + increment));
        setPrintSetting(prevPrintSetting => ({
            ...prevPrintSetting,
            dpi: newDpi
        }));        
    };
    
    const handleChangeInputDpi = (event) => {
        const newDpi = parseInt(event.target.value, 10);
        setPrintSetting(prevPrintSetting => ({
            ...prevPrintSetting,
            dpi: newDpi
        }));
    };
    
    const handleBlurInputDpi = (event) => {
        let newDpi = parseInt(event.target.value, 10);
        if (isNaN(newDpi)) {
            newDpi = 72; // Si el valor es NaN o está vacío, establecerlo como el mínimo (72)
        } else {
            newDpi = Math.max(72, Math.min(300, newDpi)); // Asegurar que esté entre 72 y 300
        }
        setPrintSetting(prevPrintSetting => ({
            ...prevPrintSetting,
            dpi: newDpi
        }));
    };

    const handleChangeAspect = (val)=>{
        setPrintSetting(prevPrintSetting => ({
            ...prevPrintSetting,
            aspectRatio: val
        }));
    }
    const handleLayoutChange = (val, nameLayout)=>{
        setSelectedLayout(layout[val])
        setPrintSetting(prevPrintSetting => ({
            ...prevPrintSetting,
            orientacion: nameLayout
        }));
    }
    



    const handleDownloadPDF = ()=>{
        // console.log(printSetting, 'printSetting para exportar'); 
        setState(states.PENDING);
        let _width, _height, _settings;
        _width = ("portrait" === printSetting.orientation ? printSetting.width : printSetting.height);
        _height = ("portrait" === printSetting.orientation ? printSetting.height : printSetting.width);

        if (printSetting.aspectRatio == 0) {
            _settings = {
                dpi: printSetting.dpi,
                documentSize: printSetting.tamanio,
                orientation: printSetting.orientacion,
                objectSize: { width: _width, height: _height}
            }
        } else {
            _settings = {
                dpi: printSetting.dpi,
                documentSize: printSetting.tamanio,
                orientation: printSetting.orientacion,
                aspectRatio: parseInt(printSetting.aspectRatio),
                objectSize: { width: _width, height: _height}
            }
        }

        let isContainer = vis.model.genericType == 'container' ? true : false;
        if (isContainer) {
            vis.model.getProperties().then(function () {
                let activeObjectFromContainer = vis.model.items.activeId;
                _app.visualization.get(activeObjectFromContainer).then((visualContainer) => {
                    if (visualContainer) {
                        visualContainer.exportPdf(_settings).then(function (res) {
                            setState(states.COMPLETED);
                            setPrintUrl(res);
                            visualContainer.close();
                        }).catch(function (error) {
                            console.log(error);
                            setState(states.FAILED);
                        });
                    } else {
                        console.log(error);
                        setState(states.FAILED);
                    }
                })
            })
        } else {
            // console.log(_settings);
            vis.exportPdf(_settings).then(function (res) {
                setState(states.COMPLETED);
                setPrintUrl(res);
            }).catch(function (error) {
                console.log(error);
                setState(states.FAILED);
            });
        }




    }
    





    const handleClose = () => {
        props.onCloseModal();
    };
    return (
        <React.Fragment>
            <div className='mz-dialog__body'>
                {/* Tamaño Papel */}
                <div className="section">
                    <div className="section-title">{t("Print.PaperSize")}</div>
                    <div className="component-wrapper">
                        <select
                            className='lui-select'
                            id="print-paper-size"
                            value={selectedSize}
                            onChange={(e) => handleSizeChange(e.target.value)}
                            disabled={state === states.PENDING}
                        >
                            {Object.values(paperSizes).map(size => (
                                <option key={size.tamanio} value={size.tamanio}>
                                    {size.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Resolución (DPI) */}
                <div className="section" disabled={state === states.PENDING}>
                    <div className="section-title">{t("Print.Image.Dpi")}</div>
                    <div className="print-image" data-quiMin="0" data-quiMax="300">
                        <span className="qui-input-number lui-input-group" qui-min="0" qui-max="300">
                            <button disabled={state === states.PENDING} className="lui-input-group__item lui-input-group__button lui-button" onClick={() => handleChangeDpi(-1)}>
                                <span className="lui-button__icon">-</span>
                            </button>
                            <input
                                disabled={state === states.PENDING}
                                type="number"
                                className="lui-input-group__item  lui-input-group__input  lui-input"
                                id="captureSizeDpi"
                                value={printSetting.dpi}
                                onChange={handleChangeInputDpi} // Cambiado de handleChangeImputDpi a handleChangeInputDpi
                                onBlur={handleBlurInputDpi} // Nuevo evento onBlur
                                min={72}
                                max={300}
                            />
                            <button disabled={state === states.PENDING} className="lui-input-group__item lui-input-group__button lui-button" onClick={() => handleChangeDpi(1)}>
                                <span className="lui-button__icon">+</span>
                            </button>
                        </span>
                    </div>
                </div>

                {/* Orientación */}
                <div className="section">
                    <div className="section-title">{t("Print.Layout")}</div>
                    <div className="lui-buttongroup">
                        <button
                            className={`lui-button ${selectedLayout.orientation === 'portrait' ? 'lui-active' : ''}`}
                            id="print-orientation-portrait"
                            onClick={() => handleLayoutChange( 0, 'portrait')}
                            disabled={state === states.PENDING}
                        >
                            {t("Print.Portrait")}
                        </button>
                        <button
                            className={`lui-button ${selectedLayout.orientation === 'landscape' ? 'lui-active' : ''}`}
                            id="print-orientation-landscape"
                            onClick={() => handleLayoutChange( 1, 'landscape')}
                            disabled={state === states.PENDING}
                        >
                            {t("Print.Landscape")}
                        </button>
                    </div>
                </div>

                {/* Aspect Ratio */}
                <div className="section">
                    <div className="section-title" q-translation="Print.Layout.Aspect"></div>
                    <label className="lui-radiobutton">
                        <input
                            className="lui-radiobutton__input"
                            type="radio"
                            name="print-aspect"
                            value={0}
                            checked={printSetting.aspectRatio === 0}
                            onChange={() => handleChangeAspect(0)}
                            disabled={state === states.PENDING}
                        />
                        <div className="lui-radiobutton__radio-wrap">
                            <span className="lui-radiobutton__radio"></span>
                            <span className="lui-radiobutton__radio-text">{t("Print.Layout.CurrentSize")}</span>
                        </div>
                    </label>

                    <label className="lui-radiobutton">
                        <input
                            className="lui-radiobutton__input"
                            type="radio"
                            name="print-aspect"
                            value={2}
                            checked={printSetting.aspectRatio === 2}
                            onChange={() => handleChangeAspect(2)}
                            disabled={state === states.PENDING}
                        />
                        <div className="lui-radiobutton__radio-wrap">
                            <span className="lui-radiobutton__radio"></span>
                            <span className="lui-radiobutton__radio-text">{t("Print.Layout.BestFitNoPreserveAspectRatio")}</span>
                        </div>
                    </label>
                </div>
                <React.Fragment>
                    {state === states.PENDING && (
                        <div className="loading-screen clearfix">
                            <div className="spinner"><div className="qv-loader"></div></div>
                        </div>
                    )}
                    {state === states.COMPLETED && (
                        <div className="section clearfix">
                            <a href={printUrl} target="_blank">{t("Print.Pdf.CompletedLink")}</a>
                        </div>
                    )}
                    {state === states.TIMEOUT && (
                        <div className="section clearfix">
                            <p className="dm-p">{t("Print.Failed.TimeoutMessage")}</p>
                        </div>
                    )}
                    {state === states.FAILED && (
                        <div className="section clearfix">
                            <p className="dm-p">{t("Print.Failed.GenericMessage")}</p>
                        </div>
                    )}
                </React.Fragment>
            </div>
            <div className='mz-dialog__footer'>
                <button onClick={(e) => { e.preventDefault(); handleClose(); }} name="cancel" className="lui-button lui-dialog__button">{t("common.Common.Cancel")}</button>
                <button disabled={state === states.PENDING} onClick={(e) => { e.preventDefault(); handleDownloadPDF(); }} name="confirm" autoFocus="autofocus" className="lui-button lui-dialog__button">{t("Print.Download")}</button>                
            </div>
        </React.Fragment>
    );
}

export default ExportPdf;
