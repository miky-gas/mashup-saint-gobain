import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { Tooltip } from 'devextreme-react/tooltip';
import store from '@store/store'; // Importa tu store Redux

function BookmarkActive(props) {
    const { t } = useTranslation();
    const [bookmarkactive, setBookmarkactive] = useState(false);
    const [bookmarkname, setBookmarkname] = useState('');

    const tooltipAttributes = useMemo(() => {
        return {
            class: 'mz-tooltip mz-tooltip-right'
        };
    }, []);

    useEffect(() => {
        // Suscribirse al store
        const unsubscribe = store.subscribe(() => {
            const estadoBookmark = store.getState().bookmarkActivo;
            setBookmarkactive(estadoBookmark.activo);
            setBookmarkname(estadoBookmark.bookmarkName);
        });

        // Función de limpieza
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <React.Fragment>
            <div id="bookmarkActiveInfo">
                <label>
                    <span className="lui-icon lui-icon--bookmark qs-no-margin" aria-hidden="true"></span> 
                    {t('Bookmarks.BookmarkActive')}
                </label>
                {!bookmarkactive ? (
                    <label id="hideBookmark">{t('Bookmarks.NoBookmarkActive')}</label>
                ) : (
                    <div className="cover_bk_active">
                        <label title={bookmarkname}>{bookmarkname}</label>
                    </div>
                )}
                <div className={`bookmark-collapse ${bookmarkactive ? 'hasBookmarkActive' : ''}`} id="BookmarkActive-tooltip">
                    <svg className="svg-icon" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2ZM18 4H6V19.4324L12 15.6707L18 19.4324V4Z" />
                    </svg>
                </div>
                <Tooltip
                    wrapperAttr={tooltipAttributes}
                    target="#BookmarkActive-tooltip"
                    showEvent="mouseenter"
                    hideEvent="mouseleave"
                    position="right"
                    hideOnOutsideClick={false}
                >
                    {bookmarkactive ? (
                        <React.Fragment>
                            <p>
                                <label>
                                    <span className="lui-icon lui-icon--bookmark qs-no-margin" aria-hidden="true"></span> 
                                    {t('Bookmarks.BookmarkActive')}
                                </label>
                            </p>
                            <p>
                                <label className="label-bookmark" title={bookmarkname}>{bookmarkname}</label>
                            </p>
                        </React.Fragment>
                    ) : (
                        <label>{t('Bookmarks.NoBookmarkActive')}</label>
                    )}
                </Tooltip>
            </div>
        </React.Fragment>
    );
}

export default BookmarkActive;
