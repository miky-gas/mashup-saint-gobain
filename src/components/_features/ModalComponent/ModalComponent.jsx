import React, { useState, useEffect, useRef, Suspense } from 'react';
import { QlikProvider } from "@context/QlikContext.jsx";
import { Popup } from 'devextreme-react/popup';

const  ExportDatos = React.lazy(() => import('@components/ContextMenu/_ContextMenuModal/ExportDatos'));
const  ExportImages = React.lazy(() => import('@components/ContextMenu/_ContextMenuModal/ExportImages'));
const  ExportPdf = React.lazy(() => import('@components/ContextMenu/_ContextMenuModal/ExportPdf'));
const  DeleteBookmark = React.lazy(() => import('@components/_features/BookmarkComponent/_bookmarkModal/DeleteBookmark'));
const  NewBookmark = React.lazy(() => import('@components/_features/BookmarkComponent/_bookmarkModal/NewBookmark'));
const  EditBookmark = React.lazy(() => import('@components/_features/BookmarkComponent/_bookmarkModal/EditBookmark'));




function ModalComponent(props) {
    const [popupVisible, setPopupVisible] = useState(false);
    const popupRef = useRef(null);
    const [datosListos, setDatosListos] = useState(false);

    useEffect(() => {
        
        if (datosListos && !popupVisible) {
            setPopupVisible(true);
        }
        if (props.type === 'shareobject') {
            document.body.classList.add('shareobject-class')
        }
    }, [datosListos]);

    function destroyModal() {
        setPopupVisible(false);
        if (props.onCloseModal) {
            props.onCloseModal();
        }
        if (props.type === 'shareobject') {
            document.body.classList.remove('shareobject-class');
        }
       
    }

    // Mapeo de los tipos de componentes con sus respectivas configuraciones
    const componentesMap = {
        exportdatos: (
            <ExportDatos
                aplication={props.aplication}
                qlikObjectID={props.qlikObjectID}
                onCloseModal={() => destroyModal()}
                onDatosListos={() => setDatosListos(true)}
            />
        ),
        exportimage:(
            <ExportImages
                aplication={props.aplication}
                qlikObjectID={props.qlikObjectID}
                visual={props.visual}
                onDatosListos={() => setDatosListos(true)}
                onCloseModal={() => destroyModal()}
            />
        ),
        exportpdf:(
            <ExportPdf
                aplication={props.aplication}
                qlikObjectID={props.qlikObjectID}
                visual={props.visual}
                onDatosListos={() => setDatosListos(true)}
                onCloseModal={() => destroyModal()}
            />
        ),
        deletebookmark:(
            <DeleteBookmark 
                aplication={props.aplication} 
                bookmark={props.bookmark}  
                onDatosListos={() => setDatosListos(true)}            
                onCloseModal={() => destroyModal()}
            />
        ),
        newbookmark:(
            <NewBookmark 
                aplication={props.aplication} 
                sheetlocation={props.sheetlocation}
                onDatosListos={() => setDatosListos(true)}            
                onCloseModal={() => destroyModal()}
            />
        ),
        editbookmark:(
            <EditBookmark
                aplication={props.aplication} 
                bookmark={props.bookmark}
                currensheetlocation={props.currensheetlocation}
                onDatosListos={() => setDatosListos(true)}            
                onCloseModal={() => destroyModal()}
            />
        )
    };

    // Obtener el componente correspondiente al tipo proporcionado
    const componente = componentesMap[props.type] || null;
    const popupClassName = props.type === 'shareobject' ? 'shareobject-class' : '';

    return (
        <React.Fragment>
            <Popup
                ref={popupRef}
                visible={popupVisible}
                onHiding={destroyModal}
                width={props.width}
                height={props.height}
                title={props.title}
                dragEnabled={false}
                hideOnOutsideClick={false}
                position="center"
                className={popupClassName} // Agregar clase condicional
            >
                <Suspense fallback={<div className='momentum'></div>}>
                    {componente}
                </Suspense>

            </Popup>
        </React.Fragment>
    );
}

export default ModalComponent;
