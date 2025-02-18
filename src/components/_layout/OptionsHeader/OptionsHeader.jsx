import React, { useState, useEffect, useContext } from 'react';
import HeaderContext from '@context/HeaderContext';
import GSenseApp from '@config/configGlobal';
const MzLogout = React.lazy(() => import('@components/_features/MzLogout/MzLogout'));

function OptionsHeader(props) {
    const { openBookmark, setOpenBookmark } = useContext(HeaderContext);
    const { openFilter, setOpenFilter } = useContext(HeaderContext);
    const { openGlossary, setOpenGlossary } = useContext(HeaderContext);
    const { openAlerts, setOpenAlerts } = useContext(HeaderContext);
    const { numFilter, setNumFilter } = useContext(HeaderContext);
    const { openFilterSelected, setOpenFilterSelected } = useContext(HeaderContext);
    const { totalFiltros, setTotalFiltros } = useContext(HeaderContext);
    const [isVisibleLinkBookmark, setIsVisibleLinkBookmark] = useState(true);
    const [isVisibleLinkGlosary, setIsVisibleLinkGlosary] = useState(true);
    const [isVisibleLinkFilters, setIsVisibleLinkFilters] = useState(true);



    const handleOnToggleFilters = () => {
        setOpenFilter(prevOpenFilter => !prevOpenFilter);
    };
    const handleOnToggleBookmark = () => {
        setOpenFilter(false);
        setOpenBookmark(prevOpenBookmark => !prevOpenBookmark);
    };

    const handleOnToggleGlossary = () => {
        setOpenFilter(false);
        setOpenGlossary(prevOpenGlossary => !prevOpenGlossary);
    }

    return (
        <React.Fragment> 
                <React.Fragment>
                    {isVisibleLinkBookmark && (
                        <div className="mz-list-options mz-item-options">
                            <div className="item-option" onClick={handleOnToggleBookmark}>
                                <div className="item-header-options">
                                    <span className="title-option title-option-bookmark">
                                        <span className="txt-xs"><span className="lui-icon lui-icon--bookmark qs-no-margin" aria-hidden="true"></span></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}


                    {isVisibleLinkFilters && (
                        <div className="mz-list-options mz-item-options">
                            <div className="item-option" onClick={handleOnToggleFilters}>
                                <div className="item-header-options" >
                                    <span className="title-option title-option-filter">
                                        <span className="badge badge-default selectionsnotification badgeFilter">{totalFiltros}</span>
                                        <span className="txt-xs"><span className="lui-icon lui-icon--filterpane qs-no-margin" aria-hidden="true"></span></span>

                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {isVisibleLinkGlosary && (
                        <div className="mz-list-options mz-item-options">
                            <div className="item-option" onClick={handleOnToggleGlossary}>
                                <div className="item-header-options">
                                    <span className="title-option title-option-Glossary">
                                        <span className="txt-xs"><span className="lui-icon lui-icon--library qs-no-margin" aria-hidden="true"></span></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {GSenseApp.init.viewLogout && (
                        <div className="mz-list-options mz-item-options">
                            <MzLogout />
                        </div>
                    )}

                </React.Fragment>   
        </React.Fragment>
    );
}

export default OptionsHeader;
