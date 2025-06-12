import React, { Suspense, useEffect, useRef, useState } from 'react';
import { UISref, UISrefActive, useRouter } from '@uirouter/react';
import { useTranslation } from 'react-i18next';
const SimpleQlikObject = React.lazy(() => import('@components/_features/SimpleQlikObject/SimpleQlikObject'));
import { useMenuNavigation } from '@hooks/useMenuNavigation'; // Importar el hook

const WCMMenu = (props) => {
    const { t } = useTranslation();
    const {
        scrollMenu,
        handleMouseEnter,
        listaMenuContenidosRef,
        menuRef,
        objectTopRef,
        objectTop,
        arrObject,
        paramsRoute,
        scrollButtonsState,
    } = useMenuNavigation(props); // Usar el hook


    return (
        <React.Fragment>
            <div id="page-nav">
                <div className="sc_menu clearfix" ref={menuRef}>
                    <div id="box_ListaMenu">
                        {scrollButtonsState.left && (
                            <button
                                className="pager-menu-nav pager-menu-nav-prev"
                                onClick={() => scrollMenu('left')}
                                disabled={!scrollButtonsState.left}
                            >
                                <i className="ri-arrow-left-wide-line"></i>
                            </button>
                        )}
                        <ul id="listaMenuContenidos" ref={listaMenuContenidosRef}>
                            <UISrefActive className="active-item">
                                <li onMouseEnter={handleMouseEnter}>
                                    <UISref to="home.WCM.Dashboard">
                                        <a href="javascript:void(0)" className="menu-item">
                                            <span className="menu-item-text">WCM</span>
                                        </a>
                                    </UISref>
                                </li>
                            </UISrefActive>
                       {/*      <UISrefActive className="active-item">
                                <li onMouseEnter={handleMouseEnter} className="no-link">
                                    <a className="no-link" href="javascript:void(0)">
                                        <span className="texto-enlaces">Análisis</span>
                                        <i className="ri-arrow-down-s-line ico-moreMenu"></i>
                                    </a>
                                    <ul className="subMenuVistas">
                                        <UISrefActive className="active-item">
                                            <li>
                                                <UISref to="home.Ventas.Analisis.Distribucion">
                                                    <a href="javascript:void(0)" className="menu-item">
                                                        <span className="menu-item-text">1.- Distribución</span>
                                                    </a>
                                                </UISref>
                                            </li>
                                        </UISrefActive>
                                        <UISrefActive className="active-item">
                                            <li>
                                                <UISref to="home.Ventas.Analisis.EvolucionIndicadores">
                                                    <a href="javascript:void(0)" className="menu-item">
                                                        <span className="menu-item-text">2.- Evolución de Indicadores</span>
                                                    </a>
                                                </UISref>
                                            </li>
                                        </UISrefActive>
                                        <UISrefActive className="active-item">
                                            <li>
                                                <UISref to="home.Ventas.Analisis.Ranking">
                                                    <a href="javascript:void(0)" className="menu-item">
                                                        <span className="menu-item-text">3.- Ranking</span>
                                                    </a>
                                                </UISref>
                                            </li>
                                        </UISrefActive>
                                        <UISrefActive className="active-item">
                                            <li>
                                                <UISref to="home.Ventas.Analisis.Resumen">
                                                    <a href="javascript:void(0)" className="menu-item">
                                                        <span className="menu-item-text">4.- Resumen</span>
                                                    </a>
                                                </UISref>
                                            </li>
                                        </UISrefActive>
                                    </ul>
                                </li>
                            </UISrefActive> */}
                          
                           
                          {/*   <UISrefActive className="active-item">
                                <li onMouseEnter={handleMouseEnter}>
                                    <UISref to="home.GAPS.CustomSheets">
                                        <a href="javascript:void(0)" className="menu-item">
                                            <span className="menu-item-text">{t('sheets.menu.sheet')}</span>
                                        </a>
                                    </UISref>
                                </li>
                            </UISrefActive> */}
                        </ul>
                        {scrollButtonsState.right && (
                            <button
                                className="pager-menu-nav pager-menu-nav-next"
                                onClick={() => scrollMenu('right')}
                                disabled={!scrollButtonsState.right}
                            >
                                <i className="ri-arrow-right-wide-line"></i>
                            </button>
                        )}
                    </div>

                    {objectTop && (
                        <div className="objectstop" id="wrapperObjectsTop" ref={objectTopRef}>
                            {arrObject.length > 0 &&
                                arrObject.map((item) => (
                                        <div className="filtersInMenu isFilter">
                                            <div className="coverFilter isFilter" style={{ width: `${item.widthObjetx}px` }}>
                                                <SimpleQlikObject qlikObjectID={item.idObject} appId={paramsRoute.indexApp} />
                                            </div>
                                        </div>

                                ))}
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default WCMMenu;
