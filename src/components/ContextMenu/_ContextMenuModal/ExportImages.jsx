import React, { useState, useEffect } from 'react';
import { arrAppsControl } from "@routes/_routes.jsx";
import { useTranslation } from "react-i18next";

function ExportImages(props) {
    const { t } = useTranslation();
    const _app = props.aplication;
    const ID = props.qlikObjectID;
    const vis = props.visual;
    const [imageCustomSize, setImageCustomSize] = useState(false);
    const [printUrl, setPrintUrl] = useState('');
    const states = {
        NODATA: -4,
        CANCELED: -3,
        TIMEOUT: -2,
        FAILED: -1,
        IDLE: 0,
        PENDING: 1,
        COMPLETED: 2
    };
    const [state, setState] = useState(states.IDLE);

    const [imageSetting, setImageSetting] = useState({
        imageType: 'png',
        captureSize: {
            dpi: 96,
            height: props.visual._elements[0].clientHeight, 
            width: props.visual._elements[0].clientWidth 
        }
    });

    const [format, setFormat] = useState('Png');
    const availableFormats = ["Jpeg", "Png"];


    useEffect(() => {
        props.onDatosListos();
    }, []);
    
     

    function getNumerical(t, n, r) {
        t = sanitizeNumber(t);
        n = Number(n);
        r = Number(r);
        if (t < n)
            return n;
        if (0 !== r && t > r)
            return r;
        return t;
    }
    
    function sanitizeNumber(e) {
        return Number(String(e).replace(/[^-\d]/g, ""));
    }


    const handleImageCustomSize = (val) => {
        setImageCustomSize(val)
    };

    const handleChangeHeight = (increment) => {
        // Modificar el estado de imageSetting para actualizar la altura de captura
        setImageSetting(prevImageSetting => ({
            ...prevImageSetting,
            captureSize: {
                ...prevImageSetting.captureSize,
                height: prevImageSetting.captureSize.height + increment
            }
        }));
    };

    const handleChangeImputHeight = (event) => {
        // Modificar el estado de imageSetting para actualizar la altura de captura desde el input
        const newHeight = parseInt(event.target.value, 10);
        setImageSetting(prevImageSetting => ({
            ...prevImageSetting,
            captureSize: {
                ...prevImageSetting.captureSize,
                height: newHeight
            }
        }));
    };

    const handleChangeWidth = (increment) => {
        // Modificar el estado de imageSetting para actualizar el ancho de captura
        setImageSetting(prevImageSetting => ({
            ...prevImageSetting,
            captureSize: {
                ...prevImageSetting.captureSize,
                width: prevImageSetting.captureSize.width + increment
            }
        }));
    };

    const handleChangeImputWidth = (event) => {
        // Modificar el estado de imageSetting para actualizar el ancho de captura desde el input
        const newWidth = parseInt(event.target.value, 10);
        setImageSetting(prevImageSetting => ({
            ...prevImageSetting,
            captureSize: {
                ...prevImageSetting.captureSize,
                width: newWidth
            }
        }));
    };
    const handleChangeDpi = (increment) => {
        setImageSetting(prevImageSetting => ({
            ...prevImageSetting,
            captureSize: {
                ...prevImageSetting.captureSize,
                dpi: prevImageSetting.captureSize.dpi + increment
            }
        }));
    };

    const handleChangeImputDpi = (event) => {
        const newDpi = parseInt(event.target.value, 10);
        setImageSetting(prevImageSetting => ({
            ...prevImageSetting,
            captureSize: {
                ...prevImageSetting.captureSize,
                dpi: newDpi
            }
        }));
    };

    const handleFormatChange = (event) => {
        setFormat(event.target.value);
    };

    const handleDownloadImage = () => {
        setState(states.PENDING);
        const settings = { 
            format: format.toLowerCase().toString(), 
            height: imageSetting.captureSize.height, 
            width: imageSetting.captureSize.width 
        };

        let isContainer = vis.model.genericType == 'container' ? true : false;
        if (isContainer) {
            let activeObjectFromContainer = vis.model.items.activeId;
            _app.visualization.get(activeObjectFromContainer).then(function (viz) {
                viz.exportImg(settings).then(function (res) {
                    setState(states.COMPLETED);
                    setPrintUrl(res);

                }).catch(function (error) {
                    setState(states.FAILED);
                    console.log(error);
                });
            })
        } else {
            vis.exportImg(settings).then(function (res) {
                setState(states.COMPLETED);
                setPrintUrl(res);
            }).catch(function (error) {
                setState(states.FAILED);
                console.log(error);
            });
        }
    };

    const handleClose = () => {
        props.onCloseModal();
    };
    return (
        <React.Fragment>
            <div className='mz-dialog__body'>
                <div className="section" disabled={state === states.PENDING}>
                    <div className="lui-buttongroup">
                        <button disabled={state === states.PENDING} className={`lui-button ${!imageCustomSize ? 'lui-active' : ''}`} onClick={() => handleImageCustomSize(false)}>{t("Print.Image.CurrentSize")}</button>
                        <button disabled={state === states.PENDING} className={`lui-button ${imageCustomSize ? 'lui-active' : ''}`} onClick={() => handleImageCustomSize(true)}>{t("Print.Image.Custom")}</button>
                    </div>
                </div>
                {!imageCustomSize ? (
                    <div className="section" disabled={state === states.PENDING}>
                        {imageSetting.captureSize.width} x {imageSetting.captureSize.height} px @ 96 dpi
                    </div>
                ) : null}

                {imageCustomSize ? (
                    <React.Fragment>
                        <div className="section" disabled={state === states.PENDING}>
                            <div className="section-title">{t("Print.Image.Width")}</div>
                            <div className="print-image" data-quiMin="0" data-quiMax="2000">
                                <span className="qui-input-number lui-input-group">
                                    <button disabled={state === states.PENDING} className="lui-input-group__item lui-input-group__button lui-button" onClick={() => handleChangeWidth(-1)}>
                                        <span className="lui-button__icon">-</span>
                                    </button>
                                    <input disabled={state === states.PENDING}
                                        type="tel"
                                        className="lui-input-group__item lui-input-group__input lui-input"
                                        id="captureSizeWidth"
                                        value={imageSetting.captureSize.width}
                                        onChange={handleChangeImputWidth}
                                    />
                                    <button disabled={state === states.PENDING} className="lui-input-group__item lui-input-group__button lui-button" onClick={() => handleChangeWidth(1)}>
                                        <span className="lui-button__icon">+</span>
                                    </button>
                                </span>
                            </div>
                        </div>
                        <div className="section" disabled={state === states.PENDING}>
                            <div className="section-title">{t("Print.Image.Height")}</div>
                            <div className="print-image" data-quiMin="0" data-quiMax="2000">
                                <span className="qui-input-number lui-input-group">
                                    <button disabled={state === states.PENDING} className="lui-input-group__item lui-input-group__button lui-button" onClick={() => handleChangeHeight(-1)}>
                                        <span className="lui-button__icon">-</span>
                                    </button>
                                    <input disabled={state === states.PENDING}
                                        type="tel"
                                        className="lui-input-group__item lui-input-group__input lui-input"
                                        id="captureSizeHeight"
                                        value={imageSetting.captureSize.height}
                                        onChange={handleChangeImputHeight}
                                    />
                                    <button disabled={state === states.PENDING} className="lui-input-group__item lui-input-group__button lui-button" onClick={() => handleChangeHeight(1)}>
                                        <span className="lui-button__icon">+</span>
                                    </button>
                                </span>
                            </div>
                        </div>
                        <div className="section" disabled={state === states.PENDING}>
                            <div className="section-title">{t("Print.Image.Dpi")}</div>
                            <div className="print-image" data-quiMin="0" data-quiMax="300">
                                <span className="qui-input-number lui-input-group" qui-min="0" qui-max="300">
                                    <button disabled={state === states.PENDING} className="lui-input-group__item lui-input-group__button lui-button" onClick={() => handleChangeDpi(-1)}>
                                        <span className="lui-button__icon">-</span>
                                    </button>
                                    <input disabled={state === states.PENDING}
                                        type="tel"
                                        className="lui-input-group__item  lui-input-group__input  lui-input"
                                        id="captureSizeDpi"
                                        value={imageSetting.captureSize.dpi}
                                        onChange={handleChangeImputDpi}
                                    />
                                    <button disabled={state === states.PENDING} className="lui-input-group__item lui-input-group__button lui-button" onClick={() => handleChangeDpi(1)}>
                                        <span className="lui-button__icon">+</span>
                                    </button>
                                </span>
                            </div>
                        </div>
                    </React.Fragment>
                ) : null}

                <div className="section" disabled={state === states.PENDING}>
                    <div className="section-title">{t("Print.Image.Format")}</div>
                    <div className="print-image">
                        <div className="component-wrapper">
                            <select disabled={state === states.PENDING}
                                className="lui-select"
                                value={format}
                                onChange={handleFormatChange}
                                aria-invalid="false"
                            >
                                {availableFormats.map((formatOption, index) => (
                                    <option key={index} value={formatOption}>{formatOption}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <React.Fragment>
                    {state === states.PENDING && (
                        <div className="loading-screen clearfix">
                            <div className="spinner"><div className="qv-loader"></div></div>
                        </div>
                    )}
                    {state === states.COMPLETED && (
                        <div className="section clearfix">
                            <a href={printUrl} target="_blank">{t("Print.Image.CompletedLink")}</a>
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
                <button disabled={state === states.PENDING} onClick={(e) => { e.preventDefault(); handleDownloadImage(); }} name="confirm" autoFocus="autofocus" className="lui-button lui-dialog__button">{t("Print.Download")}</button>                
            </div>
        </React.Fragment>
    );
}

export default ExportImages;
