import React, { useState, useEffect, useContext, useCallback } from 'react';

import GSenseApp from '@config/configGlobal.jsx';
import QlikContext from "@context/QlikContext"; // Importa el contexto
import HeaderContext from '@context/HeaderContext';
import { useTranslation } from "react-i18next";


const GlossaryComponent = (props) => {
    const { t, i18n } = useTranslation();
    const isHideHeader = props.hideHeader;
    const aplications = props.aplication;
    const [initenviroment, setInitenviroment] = useState(false);
    const { openFilter, setOpenFilter } = useContext(HeaderContext);
    const { openGlossary, setOpenGlossary } = useContext(HeaderContext);

    const [listGlossary, setListGlossary] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [noGlosary] = useState(GSenseApp.init.noGlossary);


    const [sesionParentBookmark, setSesionParentBookmark] = useState([]);
    const [sesionParentSelection, setSesionParentSelection] = useState([]);
    const { qlik, connConfig } = useContext(QlikContext);
    let proDimensions, proMeasures;
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda


    useEffect(() => {
        setOpenFilter(false);
        if (initenviroment == false) {
            setInitenviroment(true);
            setOpenGlossary(false);
        }

        asyncCallGetGlosario();

        // Efecto para detectar cambios en el idioma

        i18n.on('languageChanged', handleLanguageChanged);

        return () => {
            // Limpiar cuando el componente se desmonta
            i18n.off('languageChanged', handleLanguageChanged);
        };
    }, [aplications]);

    const handleLanguageChanged = useCallback(async () => {
        await asyncCallGetGlosario(); // Recargar el glosario cuando cambie el idioma
    }, []);

    const asyncCallGetGlosario = async () => {
        const result = await getGlosario();
        setListGlossary(result);
        setAllTags([...new Set(result.flatMap(item => item.tags))]);
    }

    async function getGlosario() {
        try {
            const res = await fetchGlosario();
            const newArr = res;
            return newArr;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    function getListDimensions(arr) {
        proDimensions = new Promise(resolve => {
            var arrDimensions = [];
            $.each(arr, function (key, value) {
                var TAGS = value.qMeta.tags;
                if (!TAGS.some(r => noGlosary.includes(r))) {
                    var _item = {
                        type: t("glosario.dimensiones"),
                        descripcion: value?.qData?.descriptionExpression || value?.qData?.description,
                        name: value?.qData?.qLabelExpression || value?.qData?.title,
                        tags: TAGS
                    };
                    if (_item.name != '-' && _item.name != '') {
                        arrDimensions.push(_item);
                    }

                }
            })
            resolve(arrDimensions);
        })
    }

    function getListMeasures(arr) {
        proMeasures = new Promise(resolve => {
            var arrMeasures = [];
            $.each(arr, function (key, value) {
                var TAGS = value.qMeta.tags;
                if (!TAGS.some(r => noGlosary.includes(r))) {
                    var _item = {
                        type: t("glosario.medidas"),
                        descripcion: value?.qData?.descriptionExpression || value?.qData?.description,
                        name: value?.qData?.qLabelExpression || value?.qData?.title,
                        tags: TAGS
                    };
                    if (_item.name != '-' && _item.name != '') {
                        arrMeasures.push(_item);
                    }

                }
            })
            resolve(arrMeasures);
        })
    }

    async function fetchGlosario() {
        return new Promise(resolve => {
            aplications.model.waitForOpen.promise.then(() => {
                aplications.model.engineApp.createSessionObject(
                    {
                        qInfo: { qId: "LB01", qType: "MasterList" },
                        qDimensionListDef: {
                            qType: "dimension",
                            qData: {
                                qDimension: "/qDimension",
                                title: "/qMetaDef/title",
                                description: "/qMetaDef/description",
                                tags: "/qMetaDef/tags",
                                grouping: "/qDim/qGrouping",
                                info: "/qDimInfos",
                                descriptionExpression: "/qData/descriptionExpression",
                                qLabelExpression: "/qData/qLabelExpression",
                                qDim: "/qDim"
                            }
                        },
                        qMeasureListDef: {
                            qType: "measure",
                            qData: {
                                qMeasure: "/qMeasure",
                                title: "/qMetaDef/title",
                                description: "/qMetaDef/description",
                                tags: "/qMetaDef/tags",
                                grouping: "/qDim/qGrouping",
                                info: "/qDimInfos",
                                descriptionExpression: "/qData/descriptionExpression",
                                qLabelExpression: "/qData/qLabelExpression",
                                qDim: "/qDim"
                            }
                        },
                    }
                ).then(function (qBook) {
                    qBook.getLayout().then(function (res) {
                        let sessionInfoGlossary = {};
                        sessionInfoGlossary = {
                            idSession: 'LB01',
                            app: aplications,
                            type: 'Glosary Component getLayout'
                        };
                        GSenseApp.addSesionParent(sessionInfoGlossary);

                        getListDimensions(res.qDimensionList.qItems);
                        getListMeasures(res.qMeasureList.qItems);

                        Promise.all([proDimensions, proMeasures]).then(values => {
                            var arr0 = [].concat.apply([], values[0])
                            var arr1 = [].concat.apply([], values[1])
                            var newArr = arr0.concat(arr1);
                            resolve(newArr);
                        });

                    }).catch(function (error) {
                        console.log(error)
                    })
                })




            })
        });
    }
    const handleOnToggleGlossary = () => {
        setOpenGlossary(prevOpenGlossary => !prevOpenGlossary)
    }
    return (
        <React.Fragment>
            <div className={`list-glossary ${openGlossary ? 'active' : 'in-active'}`}>
                {!isHideHeader && (
                    <React.Fragment>
                        <header className='mz-header-glossary'>
                            <h2><i className="lui-icon lui-icon--library"></i>{t("glosario.glosario")}</h2>
                            <div className="nav-item liGlosarioClose" onClick={() => handleOnToggleGlossary()}>
                                <a href="javascript:void(0)" className="nav-link">
                                    <span className="selectionsButtom">
                                        <i className="lui-icon lui-icon--close"></i>
                                    </span>
                                </a>
                            </div>
                        </header>
                        <h3 className="glossary-title">
                            {t("glosario.DimensionesMedidas")}
                        </h3>
                    </React.Fragment>
                )}

                <div className="glossary-box">
                    <span id="glossary-search">
                        <input
                            className="form-control"
                            placeholder={t("common.Common.Buscar")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </span>
                    <div id="glossary-scroll">
                        {listGlossary
                            .filter(glossary => glossary.name.toLowerCase().includes(searchTerm.toLowerCase())) // Filtrar por término de búsqueda
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((glossary, index) => (
                                <div key={index} className="glossary-item">
                                    <div className="glossary-item-type">
                                        <span data-tipo={glossary.type}>{glossary.type}</span>
                                    </div>
                                    <div className="glossary-item-name">
                                        <span>{glossary.name}</span>
                                        {glossary.descripcion && <p>{glossary.descripcion}</p>}
                                    </div>
                                    {glossary.tags.length > 0 && (
                                        <div className="glossary-item-tags">
                                            {glossary.tags.map((tag, tagIndex) => (
                                                <div key={tagIndex} className="glossatyTag lui-tag">
                                                    <div className="qv-tagContent">{tag}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default GlossaryComponent;
