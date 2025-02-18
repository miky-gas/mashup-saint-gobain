import React, { Suspense, useEffect, useRef, useState } from 'react';
import GSenseApp from '@config/configGlobal';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';

import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

import { Popover } from 'devextreme-react/popover';

// const FiltersComponent = React.lazy(() => import('@components/_features/FiltersComponent/FiltersComponent'));
const SimpleQlikObject = React.lazy(() => import('@components/_features/SimpleQlikObject/SimpleQlikObject'));

const MatrizDashboard = (props) => {
    const [aplication, setAplication] = useState(props.aplication);
    const [controlOperaciones, setControlOperaciones] = useState(null);
    const [controlEquipo, setControlEquipo] = useState(false);
    const [controlSubPerfil, setControlSubPerfil] = useState(false);
    const [sizeEquipo, setSizeEquipo] = useState(0);
    const [sizeSubPerfil, setSizeSubPerfil] = useState(0);

    const [titleOperaciones, setTitleOperaciones] = useState('');
    const [titleEquipo, setTitleEquipo] = useState('');

    const [dataMatriz, setDataMatriz] = useState([]);

    const [objetivosMatriz, setObjetivosMatriz] = useState([]);
    const [titleObjetivos, setTitleObjetivos] = useState([]);

    const [conocimientosOperacionesMatriz, setConocimientosOperacionesMatriz] = useState([]);
    const [titleConocimientosOperaciones, setTitleConocimientosOperaciones] = useState();

    const [todosconocimientosOperacionesMatriz, setTodosconocimientosOperacionesMatriz] = useState([]);
    const [titleTodosConocimientosOperaciones, setTitleTodosConocimientosOperaciones] = useState();

    const qlik = GSenseApp.Qlikproperties.QS;
    let sesionParentFilter = useRef([]);


    useEffect(() => {
        const el = document.getElementById('load_app');
        if (el) {
            el.parentNode.removeChild(el);
        }
        fetchDatosTabla();
        fetchObjetivos();
        fetchConocimientosOperaciones();
        fetchTodosConocimientos();

        aplication.getList("SelectionObject", function (reply) {
            const sessionInfo = {
                idSession: reply.qInfo.qId,
                app: aplication,
                type: 'Filter Component Matriz'
            };
            sesionParentFilter.current.push(sessionInfo);




            let filterArr = reply.qSelectionObject.qSelections;

            const existeEquipo = filterArr.some((filtro) => filtro.qField === 'CentroEquipo.Nombre');
            const existeSubPerfil = filterArr.some((filtro) => filtro.qField === 'Subperfil.Nombre');
            setControlEquipo(existeEquipo);
            setControlSubPerfil(existeSubPerfil);

            if (existeEquipo) {
                setSizeEquipo(filterArr.filter((filtro) => filtro.qField === 'CentroEquipo.Nombre')[0].qStateCounts.qSelected);
                const titulo = filterArr.filter((filtro) => filtro.qField === 'CentroEquipo.Nombre');
                if (titulo.length === 1) {
                    console.log(titulo, 'titulo')
                    setTitleEquipo(titulo[0].qSelected)
                } else {
                    console.log(titulo, 'titulo')
                    setTitleEquipo()
                }
            } else {
                setSizeEquipo(0);
            }

            if (existeSubPerfil) {
                setSizeSubPerfil(filterArr.filter((filtro) => filtro.qField === 'Subperfil.Nombre')[0].qStateCounts.qSelected);
            } else {
                setSizeSubPerfil(0);
            }


        });
        // Función de limpieza
        return () => {
            removeSessionSelection();
        };
    }, []);

    const removeSessionSelection = async () => {
        let ArrSession = sesionParentFilter.current;
        if (ArrSession && ArrSession.length >= 1) {
            try {
                // Mapea cada sesión y devuelve una matriz de promesas de destrucción de objetos de sesión
                const destructionPromises = ArrSession.map(async value => {
                    const thisApp = value.app;
                    const id = value.idSession;
                    const res = await thisApp.destroySessionObject(id);
                    return res;
                });
                // Espera a que todas las promesas se resuelvan
                await Promise.all(destructionPromises);
                // Limpia el estado una vez que todas las promesas se han resuelto

            } catch (error) {
                console.error('Error al destruir los objetos de sesión:', error);
            }
        }
    };

    // TABLA 1
    const fetchHyperCubeData = async (model, table, qTop = 0, qLeft = 0, qWidth = 1000) => {
        const totalCols = table.colCount;
        const requests = [];

        const fetchData = async (currentWidth, currentLeft) => {
            if (currentLeft >= totalCols) return;

            const newWidth = Math.min(currentWidth, totalCols - currentLeft);
            const data = await model.getHyperCubePivotData("/qHyperCubeDef", [{
                qTop: qTop,
                qLeft: currentLeft,
                qWidth: newWidth,
                qHeight: table.rowCount
            }]);
            requests.push(...data); // Suponiendo que 'data' es un array

            await fetchData(currentWidth, currentLeft + newWidth);
        };

        await fetchData(qWidth, qLeft);
        return requests;
    };

    const fetchDatosTabla = async () => {
        const $this = document.getElementById('tableDatos');
        const app = aplication;

        app.visualization.get('bgHp').then(async (vis) => {
            vis.show($this, {
                onRendered: async () => {
                    const model = vis.model;
                    const table = qlik.table(model);

                    // Obtener datos utilizando la función recursiva
                    const data = await fetchHyperCubeData(model, table);
                    setDataMatriz(data)
                    let operacionesLength = data[0].qTop.length;
                    setControlOperaciones(operacionesLength);
                    setTitleOperaciones(data[0].qTop[0].qText);
                    console.log(data, 'result');
                }
            });
        });
    };


    //TABLA 2
    const fetchCubeData = async (model, table, qTop = 0, qLeft = 0, qWidth = 1000) => {
        const totalCols = table.colCount;
        const requests = [];

        const fetchData = async (currentWidth, currentLeft) => {
            if (currentLeft >= totalCols) return;

            const newWidth = Math.min(currentWidth, totalCols - currentLeft);
            const data = await model.getHyperCubeData("/qHyperCubeDef", [{
                qTop: qTop,
                qLeft: currentLeft,
                qWidth: newWidth,
                qHeight: table.rowCount
            }]);
            requests.push(...data); // Suponiendo que 'data' es un array

            await fetchData(currentWidth, currentLeft + newWidth);
        };

        await fetchData(qWidth, qLeft);
        return requests;
    };
    const fetchObjetivos = async () => {
        const $this = document.getElementById('tableObjetivos');
        const app = aplication;

        app.visualization.get('PfLcpPE').then(async (vis) => {
            vis.show($this, {
                onRendered: async () => {
                    const model = vis.model;
                    const table = qlik.table(model);

                    // Obtener datos utilizando la función recursiva
                    const data = await fetchCubeData(model, table);
                    console.log(data, 'Operaciones OBJETIVO conocidas por el trabajador')
                    setTitleObjetivos(model.layout.title);
                    setObjetivosMatriz(data);
                }
            });
        });
    }

    //TABLA 3
    const fetchConocimientosOperaciones = async () => {
        const $this = document.getElementById('tableConocimientos');
        const app = aplication;

        app.visualization.get('sZWrZJD').then(async (vis) => {
            vis.show($this, {
                onRendered: async () => {
                    const model = vis.model;
                    const table = qlik.table(model);

                    // Obtener datos utilizando la función recursiva
                    const data = await fetchCubeData(model, table);
                    console.log(data, 'Nº de personas que conocen la operación')
                    setTitleConocimientosOperaciones(model.layout.title);
                    setConocimientosOperacionesMatriz(data);
                }
            });
        });
    }

    //TABLA 4
    const fetchTodosConocimientos = async () => {
        const $this = document.getElementById('tableTodosConocimientos');
        const app = aplication;

        app.visualization.get('huvxUb').then(async (vis) => {
            vis.show($this, {
                onRendered: async () => {
                    const model = vis.model;
                    const table = qlik.table(model);

                    // Obtener datos utilizando la función recursiva
                    const data = await fetchCubeData(model, table);
                    console.log(data, 'Todos Conocimientos')
                    setTitleTodosConocimientosOperaciones(model.layout.title);
                    setTodosconocimientosOperacionesMatriz(data);
                }
            });
        });
    }


    function numberToColumn(number) {
        let column = "";
        while (number > 0) {
            let mod = (number - 1) % 26;
            column = String.fromCharCode(65 + mod) + column;
            number = Math.floor((number - 1) / 26);
        }
        return column;
    }

    // Función que convierte una columna de Excel (por ejemplo, "A", "Z", "AA") a su número correspondiente
    function columnToNumber(column) {
        let number = 0;
        const length = column.length;

        for (let i = 0; i < length; i++) {
            const charCode = column.charCodeAt(i) - 64; // "A" = 1, "B" = 2, ..., "Z" = 26
            number = number * 26 + charCode;  // Convertir la columna a un número
        }

        return number;
    }
    const generatePdf = async () => {
        const element = document.getElementById('matriz-formacion'); // Cambia 'content' al ID de tu div

        // Convierte el div a un canvas
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const pageWidth = 900; // A4 width in mm
        const pageHeight = 760; // A4 height in mm

        const docDefinition = {
            pageSize: "A4",
            pageOrientation: 'landscape',
            content: [
                {
                    image: imgData,
                    height: pageHeight,
                    with: pageWidth,
                    alignment: 'center', // Centrar la imagen
                    fit: [pageHeight, pageWidth]

                }
            ],
        };

        // Genera el PDF
        pdfMake.createPdf(docDefinition).download(`${titleEquipo}-${titleOperaciones}.pdf`);
    };

    const generateExcel = async () => {
        const fillBackground = (worksheet, startRow, endRow, startCol, endCol, color) => {
            for (let row = startRow; row <= endRow; row++) {
                for (let col = startCol; col <= endCol; col++) {
                    const cell = worksheet.getRow(row).getCell(col);
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: color } // Color en formato ARGB, como 'FFFF0000' para rojo.
                    };
                }
            }
        };


        // Crear un nuevo libro de trabajo
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Hoja1');
        fillBackground(worksheet, 1, 100, 1, 100, 'FFDDDDDD'); // Color gris claro en toda el área

        // Cargar las imágenes
        const imagePromises = [
            fetch('assets/img/imgEstados/Leyendas_0.png').then(res => res.arrayBuffer()),
            fetch('assets/img/imgEstados/Leyendas_1.png').then(res => res.arrayBuffer()),
            fetch('assets/img/imgEstados/Leyendas_2.png').then(res => res.arrayBuffer()),
            fetch('assets/img/imgEstados/Leyendas_3.png').then(res => res.arrayBuffer()),
            fetch('assets/img/imgEstados/Leyendas_4.png').then(res => res.arrayBuffer()),
            fetch('assets/img/imgEstados/Leyendas_5.png').then(res => res.arrayBuffer()),
        ];

        const imageBuffers = await Promise.all(imagePromises);

        // Asocia los valores de qText con los IDs de las imágenes
        const imageIds = {
            'value0': workbook.addImage({ buffer: imageBuffers[0], extension: 'png' }),
            'value1': workbook.addImage({ buffer: imageBuffers[1], extension: 'png' }),
            'value2': workbook.addImage({ buffer: imageBuffers[2], extension: 'png' }),
            'value3': workbook.addImage({ buffer: imageBuffers[3], extension: 'png' }),
            'value4': workbook.addImage({ buffer: imageBuffers[4], extension: 'png' }),
            'value5': workbook.addImage({ buffer: imageBuffers[5], extension: 'png' }),
        };

        // Arreglo para almacenar la definición de las columnas
        const columnDefinitions = [
            { key: 'A', width: 5 },
            { key: 'B', width: 35 },
            { key: 'C', width: 5 },
            { key: 'D', width: 5 }
        ];

        //TOP SIDE
        let dataArrayOperaciones = dataMatriz[0].qTop[0].qSubNodes;
        //TOP SIDE HEADER TITLE

        const startColHeaderTitle = 'E'; // Columna de inicio
        //const endColHeaderTitle = String.fromCharCode(startColHeaderTitle.charCodeAt(0) + dataArrayOperaciones.length - 1); // Columna final
        const endColHeaderTitle = numberToColumn(columnToNumber(startColHeaderTitle) + dataArrayOperaciones.length - 1); // Columna final
        worksheet.mergeCells(`${startColHeaderTitle}1:${endColHeaderTitle}1`);
        const mergedCellHeaderTitle = worksheet.getCell(`${startColHeaderTitle}1:${endColHeaderTitle}1`);
        mergedCellHeaderTitle.value = 'Operaciones'; // Asignar el valor
        mergedCellHeaderTitle.alignment = { vertical: 'middle', horizontal: 'center' };
        mergedCellHeaderTitle.font = { size: 12 };
        mergedCellHeaderTitle.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ffe4e015' } // Fondo amarillo
        };
        mergedCellHeaderTitle.border = {
            top: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde superior           
            bottom: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde inferior
            left: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde superior           
            right: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde inferior
        };
        worksheet.getRow(1).height = 35;



        //TOP SIDE HEADER

        const startColHeader = 'E'; // Columna de inicio
        //const endColHeader = String.fromCharCode(startColHeader.charCodeAt(0) + dataArrayOperaciones.length - 1); // Columna final
        const endColHeader = numberToColumn(columnToNumber(startColHeader) + dataArrayOperaciones.length - 1); // Columna final
        worksheet.mergeCells(`${startColHeader}2:${endColHeader}2`);
        const mergedCellHeader = worksheet.getCell(`${startColHeader}2:${endColHeader}2`);
        mergedCellHeader.value = titleOperaciones; // Asignar el valor
        mergedCellHeader.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        mergedCellHeader.font = { size: 12, color: { argb: 'ffffffff' } };
        mergedCellHeader.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ff3e3e3c' } // Fondo gris
        };
        mergedCellHeader.border = {
            top: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde superior           
            bottom: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde inferior
            left: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde superior           
            right: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde inferior
        };
        worksheet.getRow(2).height = 35;




        //TOP SIDE OPERACIONES
        dataArrayOperaciones.forEach((item, index) => {

            const startCol = 'E'; // Columna de inicio            
            const nextCol = numberToColumn(columnToNumber(startCol) + index); // Columna final

            worksheet.mergeCells(`${nextCol}11:${nextCol}3`);

            const mergedCell = worksheet.getCell(`${nextCol}11:${nextCol}3`);
            mergedCell.value = item.qText; // Asignar el valor
            mergedCell.alignment = { vertical: 'middle', horizontal: 'center', textRotation: 90 };
            mergedCell.font = { size: 8 };
            mergedCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ffe4e015' } // Fondo amarillo
            };
            mergedCell.border = {
                top: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde superior           
                bottom: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde inferior
                left: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde superior           
                right: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde inferior
            };
            // Agregar la definición de la columna al arreglo
            columnDefinitions.push({ key: nextCol, width: 8 });

        });


        //LEFT SIDE
        worksheet.mergeCells('A10:D10');
        worksheet.getCell('A10').value = titleEquipo;
        worksheet.getCell('A10').alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado en ambas direcciones
        worksheet.getCell('A10').font = { size: 12 };
        worksheet.getCell('A10:D10').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ffe4e015' } // Fondo amarillo
        };
        worksheet.getRow(10).height = 25;

        worksheet.mergeCells('A11:D11');
        worksheet.getCell('A11').value = 'Operarios';
        worksheet.getCell('A11').alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado en ambas direcciones
        worksheet.getCell('A11').font = { size: 12 };
        worksheet.getCell('A11:D11').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ffe4e015' } // Fondo amarillo
        };
        worksheet.getCell('A11:D11').border = {
            top: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde superior           
            bottom: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde inferior
        };
        worksheet.getRow(11).height = 25;


        // Iniciar en la celda B12 los Operarios
        let rowStart = 12;
        let dataArrayOperarios = dataMatriz[0].qLeft;
        dataArrayOperarios.forEach((item, index) => {
            // Escribir índice en la columna B
            worksheet.getCell(`A${rowStart + index}`).value = index + 1;
            worksheet.getCell(`A${rowStart + index}`).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ffe4e015' } // Fondo amarillo
            };
            worksheet.getCell(`A${rowStart + index}`).alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell(`A${rowStart + index}`).font = { size: 8 };
            // Escribir valor qText en la columna C
            worksheet.mergeCells(`B${rowStart + index}: D${rowStart + index}`);
            worksheet.getCell(`B${rowStart + index}`).value = item.qText;
            worksheet.getCell(`B${rowStart + index}`).font = { size: 8 };
            worksheet.getCell(`B${rowStart + index}`).alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
            worksheet.getCell(`B${rowStart + index}`).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ffffffff' } // Fondo blanco
            };

            worksheet.getRow(`${rowStart + index}`).height = 25;
        });

        //CENTER SIDE
        let rowStartValues = 12; // Suponiendo que comienzas a llenar a partir de la fila 12
        dataMatriz[0].qData.forEach((item, rowIndex) => {
            item.forEach((val, colIndex) => {

                const colLetter = numberToColumn(columnToNumber('E') + colIndex); // Calcula la letra de la columna
                const cellRef = `${colLetter}${rowStartValues + rowIndex}`; // Referencia de la celda
                worksheet.getCell(cellRef).alignment = { horizontal: 'center', vertical: 'middle' };
                worksheet.getCell(cellRef).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'ffffffff' } // Fondo blanco
                };
                worksheet.getCell(cellRef).border = {
                    top: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde superior           
                    bottom: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde inferior
                    left: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde superior           
                    right: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde inferior
                };
                // worksheet.getCell(cellRef).value = `${colLetter}${rowStartValues + rowIndex}`;
                if (imageIds['value' + val.qText]) {
                    // Agregar la imagen en la celda específica
                    worksheet.addImage(imageIds['value' + val.qText], {
                        tl: { col: colIndex + 4 + 0.25, row: rowStartValues + rowIndex - 1 + 0.25 }, // Ajuste para centrar (ajusta según tu celda)
                        ext: { width: 20, height: 20 } // Ajusta el tamaño de la imagen según necesites
                    });
                }
            });
        });

        //RIGHT SIDE
        let colStartObjetivosConocidos = numberToColumn(dataArrayOperaciones.length + 4 + 1); // Operaciones + 4 columnas +  para contar a partir de A
        let colEndtObjetivosConocidos = numberToColumn(dataArrayOperaciones.length + 3 + conocimientosOperacionesMatriz[0].qMatrix.length + 1); // Operaciones + 3 + longitud de matriz +  para contar a partir de A
        //Descripcion top right
        worksheet.mergeCells(`${colStartObjetivosConocidos}10:${colEndtObjetivosConocidos}10`);
        worksheet.getCell(`${colStartObjetivosConocidos}10`).value = titleObjetivos;
        worksheet.getCell(`${colStartObjetivosConocidos}10`).alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado en ambas direcciones
        worksheet.getCell(`${colStartObjetivosConocidos}10`).font = { size: 8 };
        worksheet.getCell(`${colStartObjetivosConocidos}10:${colEndtObjetivosConocidos}10`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ffe4e015' } // Fondo amarillo
        };
        //Index top Right
        conocimientosOperacionesMatriz[0].qMatrix.forEach((item, rowIndex) => {
            // const colLetter = String.fromCharCode(colStartObjetivosConocidos.charCodeAt(0) + rowIndex);
            const colLetter = numberToColumn(columnToNumber(colStartObjetivosConocidos) + rowIndex);

            const cell = worksheet.getCell(`${colLetter}11`);
            cell.value = rowIndex + 1;
            cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado en ambas direcciones
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ffe4e015' } // Fondo amarillo
            };
            cell.border = {
                top: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde superior           
                bottom: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde inferior
                left: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde superior           
                right: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde inferior
            };
        })

        //Cells Right Operaciones Objetivo Conocidas por el Trabajador
        const getBgCell = (i, item1, item2) => {
            const numItem1 = Number(item1);
            const numItem2 = Number(item2);

            if (isNaN(numItem1) || isNaN(numItem2)) {
                return 'FFFFFFFF'; // Color blanco por defecto en caso de error
            }

            if (i < numItem1) {
                return 'FF0C9239'; // Verde (AARRGGBB)
            } else if (i < numItem1 + numItem2) {
                return 'FF990D0D'; // Rojo (AARRGGBB)
            } else {
                return 'FFFFFFFF'; // Blanco (AARRGGBB)
            }
        };
        let rowStartObjetivosConocidos = 12;

        objetivosMatriz[0].qMatrix.forEach((item, rowIndex) => {
            const totalCeldas = parseInt(conocimientosOperacionesMatriz[0].qArea.qHeight); // Total de celdas por fila
            const celdasVerdes = parseInt(item[1].qText); // Cantidad de celdas verdes
            const celdasRojas = parseInt(item[2].qText); // Cantidad de celdas rojas
            const celdasBlancas = totalCeldas - (celdasVerdes + celdasRojas); // Celdas blancas restantes

            let currentIndex = 0; // Índice acumulado para columnas

            // Generar celdas verdes en horizontal
            for (let i = 0; i < celdasVerdes; i++, currentIndex++) {
                const colLetter = numberToColumn(columnToNumber(colStartObjetivosConocidos) + currentIndex); // Desplazamiento en columnas
                const cellRef = `${colLetter}${rowStartObjetivosConocidos + rowIndex}`; // Fila fija, columna variable
                const cell = worksheet.getCell(cellRef);

                cell.value = ''; // Sin valor
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF0C9239' }, // Verde
                };
                setCellBorder(cell);
                worksheet.getRow(rowStartObjetivosConocidos + rowIndex).height = 25; // Ajustar la altura de la fila
            }

            // Generar celdas rojas en horizontal
            for (let i = 0; i < celdasRojas; i++, currentIndex++) {
                const colLetter = numberToColumn(columnToNumber(colStartObjetivosConocidos) + currentIndex); // Desplazamiento en columnas
                const cellRef = `${colLetter}${rowStartObjetivosConocidos + rowIndex}`; // Fila fija, columna variable
                const cell = worksheet.getCell(cellRef);

                cell.value = ''; // Sin valor
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF0000' }, // Rojo
                };
                setCellBorder(cell);
                worksheet.getRow(rowStartObjetivosConocidos + rowIndex).height = 25; // Ajustar la altura de la fila
            }

            // Generar celdas blancas en horizontal
            for (let i = 0; i < celdasBlancas; i++, currentIndex++) {
                const colLetter = numberToColumn(columnToNumber(colStartObjetivosConocidos) + currentIndex); // Desplazamiento en columnas
                const cellRef = `${colLetter}${rowStartObjetivosConocidos + rowIndex}`; // Fila fija, columna variable
                const cell = worksheet.getCell(cellRef);

                cell.value = ''; // Sin valor
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFFFF' }, // Blanco
                };
                setCellBorder(cell);
                worksheet.getRow(rowStartObjetivosConocidos + rowIndex).height = 25; // Ajustar la altura de la fila
            }
        });



        //BOTTOM RIHGT

        let colStartPersonasOperaciones = numberToColumn(dataArrayOperaciones.length + 4 + 1);// Contamos las operaciones mas 2 columnas
        let colEndtPersonasOperaciones = numberToColumn(dataArrayOperaciones.length + 3 + objetivosMatriz[0].qMatrix.length + 1);
        let rowPersonasOperaciones = 12 + dataMatriz[0].qLeft.length;
        worksheet.mergeCells(`${colStartPersonasOperaciones}${rowPersonasOperaciones}:${colEndtPersonasOperaciones}${rowPersonasOperaciones}`);
        worksheet.getCell(`${colStartPersonasOperaciones}${rowPersonasOperaciones}`).value = titleConocimientosOperaciones;
        worksheet.getCell(`${colStartPersonasOperaciones}${rowPersonasOperaciones}`).alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado en ambas direcciones
        worksheet.getCell(`${colStartPersonasOperaciones}${rowPersonasOperaciones}`).font = { size: 8 };
        worksheet.getCell(`${colStartPersonasOperaciones}${rowPersonasOperaciones}:${colEndtPersonasOperaciones}${rowPersonasOperaciones}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ffe4e015' } // Fondo amarillo
        };
        worksheet.getRow(rowPersonasOperaciones).height = 25;

        //BOTTOM RIGHT INDEX Nº Personas que conocen todas las opercaciones

        let rowPersonasOperacionesIndex = rowPersonasOperaciones + 1;
        const celdasConocimientos = parseInt(todosconocimientosOperacionesMatriz[0].qMatrix[0][0].qNum);
        objetivosMatriz[0].qMatrix.forEach((item, rowIndex) => {

            const colLetter = numberToColumn(columnToNumber(colStartPersonasOperaciones) + rowIndex);
            const cell = worksheet.getCell(`${colLetter}${rowPersonasOperacionesIndex}`);
            cell.value = rowIndex + 1;
            cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado en ambas direcciones
            // Establecer el color de fondo dependiendo de la condición
            const fgColor = (celdasConocimientos === rowIndex + 1) ? 'FF0C9239' : 'FFFFFFFF'; // Verde si es igual, blanco si no
            const fontColor = (celdasConocimientos === rowIndex + 1) ? 'FFFFFFFF' : '00000000'; // Blanco si es verde, negro si es blanco
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: fgColor } // Fondo blanco
            };
            // Establecer el color del texto según la condición
            cell.font = {
                color: { argb: fontColor }, // Color de texto (blanco si verde, negro si blanco)
            };
            cell.border = {
                top: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde superior           
                bottom: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde inferior
                left: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde superior           
                right: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde inferior
            };
        })
        worksheet.getRow(rowPersonasOperacionesIndex).height = 25;


        //BOTTOM CONOCIMINETOS OPERACIONES

        //BOTTOM CONOCIMINETOS INDEX
        objetivosMatriz[0].qMatrix.forEach((item, rowIndex) => {
            const colLetter = 'D';
            worksheet.getCell(`${colLetter}${rowPersonasOperaciones + rowIndex}`).value = rowIndex + 1;
            worksheet.getCell(`${colLetter}${rowPersonasOperaciones + rowIndex}`).alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado en ambas direcciones
            worksheet.getCell(`${colLetter}${rowPersonasOperaciones + rowIndex}`).font = { size: 8 };
            worksheet.getCell(`${colLetter}${rowPersonasOperaciones + rowIndex}`).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ffe4e015' } // Fondo amarillo
            };
            worksheet.getCell(`${colLetter}${rowPersonasOperaciones + rowIndex}`).border = {
                top: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde superior           
                bottom: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde inferior
                left: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde superior           
                right: { style: 'thin', color: { argb: 'ffcccccc' } }, // Borde inferior
            };
        })


        conocimientosOperacionesMatriz[0].qMatrix.forEach((item, rowIndex) => {
            const totalCeldas = parseInt(dataMatriz[0].qArea.qHeight); // Total de celdas por fila
            const celdasVerdes = parseInt(item[1].qText); // Cantidad de celdas verdes
            const celdasRojas = parseInt(item[2].qText); // Cantidad de celdas rojas
            const celdasBlancas = totalCeldas - (celdasVerdes + celdasRojas); // Celdas blancas restantes

            let currentIndex = 0; // Índice acumulado para filas

            // Generar celdas verdes
            for (let i = 0; i < celdasVerdes; i++, currentIndex++) {

                const colLetter = numberToColumn(columnToNumber('E') + rowIndex);
                const cellRef = `${colLetter}${rowPersonasOperaciones + currentIndex}`;
                const cell = worksheet.getCell(cellRef);

                cell.value = ''; // Sin valor
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF0C9239' }, // Verde
                };
                setCellBorder(cell);
                worksheet.getRow(rowPersonasOperaciones + currentIndex).height = 25;
            }

            // Generar celdas rojas
            for (let i = 0; i < celdasRojas; i++, currentIndex++) {

                const colLetter = numberToColumn(columnToNumber('E') + rowIndex);
                const cellRef = `${colLetter}${rowPersonasOperaciones + currentIndex}`;
                const cell = worksheet.getCell(cellRef);

                cell.value = ''; // Sin valor
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF0000' }, // Rojo
                };
                setCellBorder(cell);
                worksheet.getRow(rowPersonasOperaciones + currentIndex).height = 25;
            }

            // Generar celdas blancas
            for (let i = 0; i < celdasBlancas; i++, currentIndex++) {

                const colLetter = numberToColumn(columnToNumber('E') + rowIndex);
                const cellRef = `${colLetter}${rowPersonasOperaciones + currentIndex}`;
                const cell = worksheet.getCell(cellRef);

                cell.value = ''; // Sin valor
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFFFF' }, // Blanco
                };
                setCellBorder(cell);
                worksheet.getRow(rowPersonasOperaciones + currentIndex).height = 25;
            }
        });

        // Función para establecer el borde de una celda
        function setCellBorder(cell) {
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            };
        }



        // Asignar las definiciones de columnas al worksheet
        worksheet.columns = columnDefinitions;
        worksheet.protect();


        // Generar el archivo Excel en un buffer
        const buffer = await workbook.xlsx.writeBuffer();
        // Guardar el archivo
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `${titleEquipo}-${titleOperaciones}.xlsx`);

    };


    return (
        <React.Fragment>
            <div className="flex-component m-0 p-0" id="scrollable-view">
                <div className='filters-page'>
                    <div className='item-filter-page'>
                        <SimpleQlikObject qlikObjectID="HJjKp" appId="0" />
                    </div>
                    <div className='item-filter-page'>
                        <SimpleQlikObject qlikObjectID="DgpWj" appId="0" />
                    </div>
                </div>

                {controlEquipo && controlSubPerfil && controlOperaciones === 1 && sizeEquipo === 1 && sizeSubPerfil === 1 ? (
                    <div className='cover-matriz'>
                        <Popover
                            target="#info"
                            showEvent="click"
                            position="top"
                            width={250}
                            shading={false}
                        >
                            <ul className='infoList'>
                                <li><img src="assets/img/imgEstados/Leyendas_0.png" /> No necesario</li>
                                <li><img src="assets/img/imgEstados/Leyendas_1.png" /> Formación necesaria</li>
                                <li><img src="assets/img/imgEstados/Leyendas_2.png" /> En formación</li>
                                <li><img src="assets/img/imgEstados/Leyendas_3.png" /> Completamente formado</li>
                                <li><img src="assets/img/imgEstados/Leyendas_4.png" /> Competente</li>
                                <li><img src="assets/img/imgEstados/Leyendas_5.png" /> Formador</li>
                            </ul>
                        </Popover>
                        <div className='btn-actions-matriz'>
                            <button className='btn' id="info">
                                <i class="ri-info-i"></i>
                            </button>
                            <button className='btn' onClick={generatePdf}>
                                <i class="ri-file-pdf-2-line"></i>
                            </button>
                            <button className='btn' onClick={generateExcel}>
                                <i class="ri-file-excel-line"></i>
                            </button>
                        </div>

                        <div id='matriz-formacion'>
                            {/* TOP MATRIZ */}
                            <div id='top-matriz'>
                                <div className='c-left w-f'>
                                    <div className='m-title'>{titleEquipo}</div>
                                    <div className='m-title'>Operarios</div>
                                </div>
                                <div className='c-center w-f'>
                                    <div className='m-title'>Operaciones</div>
                                    <div className='m-subtitle'>{titleOperaciones}</div>
                                    <div className='table-cell'>
                                        {dataMatriz[0].qTop[0].qSubNodes.map((item) => (
                                            <div className='item-cell' title={item.qText}>
                                                <svg
                                                    width="100%"
                                                    height="100%"
                                                    style={{ position: 'absolute', top: 0, left: 0 }}
                                                >
                                                    <rect width="100%" height="100%" fill="none" />
                                                    <text
                                                        x="50%"
                                                        y="50%"
                                                        dominantBaseline="middle"
                                                        textAnchor="middle"
                                                        style={{ fontSize: '.6rem', fill: 'black' }}
                                                    >
                                                        {item.qText}
                                                    </text>
                                                </svg>
                                            </div>

                                            // <div key={item.qText} className='item-cell' title={item.qText}><p>{item.qText}</p></div>
                                        ))}
                                    </div>
                                </div>
                                <div className='c-right w-f'>
                                    <div className='m-title'>{titleObjetivos}</div>
                                    <div className='m-title d-flex'>
                                        {conocimientosOperacionesMatriz.length > 0 && conocimientosOperacionesMatriz[0].qMatrix.map((item, key) => (
                                            <div className='objetivos-index'>{key + 1}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* CENTRO MATRIZ */}
                            <div id="center-matriz">
                                <div className='c-left w-f'>
                                    <div className='listOperarios'>
                                        {dataMatriz[0].qLeft.map((item, key) => (
                                            <div key={item.qText} className='item-operarios' title={item.qText}><span className='sp-index'>{key + 1}</span><p>{item.qText}</p></div>
                                        ))}
                                    </div>
                                </div>
                                <div className='c-center w-f'>
                                    <div className='list-center-values'>
                                        {dataMatriz[0].qData
                                            .map((item, idx) => (
                                                <div className='item-values' key={`item-${idx}`}>
                                                    {item.map((val, i) => (
                                                        <div className={`cell-value cell-${val.qText}`} key={`value-${i}`}>
                                                            {val.qText != "-" && (
                                                                <img
                                                                    src={`assets/img/imgEstados/Leyendas_${val.qText}.png`}
                                                                    alt="Leyenda"
                                                                />
                                                            )}
                                                            {/* <div className='cell-square'></div> */}
                                                        </div>
                                                    ))}
                                                </div>
                                            ))
                                        }

                                    </div>
                                </div>
                                <div className='c-right w-f'>
                                    <div className='listObjetivos'>
                                        {objetivosMatriz[0].qMatrix.map((item, key) => {
                                            const totalCeldas = parseInt(dataMatriz[0].qArea.qWidth); // Valor máximo de celdas
                                            const celdasVerdes = parseInt(item[1].qText); // Cantidad de celdas verdes
                                            const celdasRojas = parseInt(item[2].qText); // Cantidad de celdas rojas
                                            const celdasBlancas = totalCeldas - (celdasVerdes + celdasRojas); // Celdas restantes a rellenar

                                            return (
                                                <div key={key} className='item-objetivos'>
                                                    <React.Fragment>
                                                        {/* Renderizar celdas verdes */}
                                                        {Array.from({ length: celdasVerdes }, (_, i) => (
                                                            <div
                                                                key={`green-${i}`}
                                                                className="cell-objetivos obj-green"
                                                            ></div>
                                                        ))}

                                                        {/* Renderizar celdas rojas */}
                                                        {Array.from({ length: celdasRojas }, (_, i) => (
                                                            <div
                                                                key={`red-${i}`}
                                                                className="cell-objetivos obj-red"
                                                            ></div>
                                                        ))}

                                                        {/* Rellenar celdas blancas si faltan */}
                                                        {celdasBlancas > 0 &&
                                                            Array.from({ length: celdasBlancas }, (_, i) => (
                                                                <div
                                                                    key={`white-${i}`}
                                                                    className="cell-objetivos obj-white"
                                                                ></div>
                                                            ))
                                                        }
                                                    </React.Fragment>
                                                </div>
                                            );
                                        })}

                                    </div>
                                </div>
                            </div>

                            {/* BOTTOM MATRIZ */}
                            <div id="bottom-matriz">
                                <div className='c-left w-f'>
                                    <div className="m-title">
                                        <svg
                                            width="100%"
                                            height="100%"
                                            style={{ position: 'absolute', top: 0, left: 0 }}
                                        >
                                            <rect width="100%" height="100%" fill="none" />
                                            <text
                                                x="50%"
                                                y="50%"
                                                dominantBaseline="middle"
                                                textAnchor="middle"
                                                style={{ fontSize: '.6rem', fill: 'black' }}
                                            >
                                                {titleConocimientosOperaciones}
                                            </text>
                                        </svg>
                                    </div>
                                    <div className='indexConocimientos'>
                                        <div id='listIndexConocimientos'>
                                            {dataMatriz[0].qLeft.map((item, key) => (
                                                <React.Fragment>
                                                    <div key={key} className='sp-index'>{key + 1}</div>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className='c-center w-f'>
                                    <div className='listConocimientos'>
                                        {conocimientosOperacionesMatriz[0].qMatrix.map((item, key) => {
                                            const totalCeldas = parseInt(dataMatriz[0].qArea.qHeight); // Valor máximo de celdas
                                            const celdasVerdes = parseInt(item[1].qText); // Cantidad de celdas verdes
                                            const celdasRojas = parseInt(item[2].qText); // Cantidad de celdas rojas
                                            const celdasBlancas = totalCeldas - (celdasVerdes + celdasRojas); // Celdas restantes a rellenar
                                            return (

                                                <div className='item-conocimientos'>
                                                    <React.Fragment>
                                                        {Array.from({ length: celdasVerdes }, (_, i) => (
                                                            <React.Fragment>
                                                                <div
                                                                    key={i}
                                                                    className="cell-conocimientos obj-green"
                                                                >
                                                                </div>
                                                            </React.Fragment>
                                                        ))}
                                                        {Array.from({ length: celdasRojas }, (_, i) => (
                                                            <React.Fragment>
                                                                <div
                                                                    key={i}
                                                                    className="cell-conocimientos obj-red"
                                                                >
                                                                </div>
                                                            </React.Fragment>
                                                        ))}
                                                        {Array.from({ length: celdasBlancas }, (_, i) => (
                                                            <React.Fragment>
                                                                <div
                                                                    key={i}
                                                                    className="cell-conocimientos obj-white"
                                                                >
                                                                </div>
                                                            </React.Fragment>
                                                        ))}
                                                    </React.Fragment>
                                                </div>
                                            )


                                        })}
                                    </div>
                                </div>
                                <div className='c-right w-f'>
                                    <div className='m-title'>{titleTodosConocimientosOperaciones}</div>
                                    <div className='listTodosConocimientos'>
                                        {todosconocimientosOperacionesMatriz.length > 0 && (() => {
                                            const totalCeldas = parseInt(dataMatriz[0].qArea.qHeight); // Valor máximo de celdas
                                            const celdasConocimientos = parseInt(todosconocimientosOperacionesMatriz[0].qMatrix[0][0].qNum);
                                            const celdasBlancas = totalCeldas - celdasConocimientos;
                                            let INDEX = 0;
                                            return (
                                                <>
                                                    {/* Renderizar celdas de conocimientos */}
                                                    {Array.from({ length: celdasConocimientos }, (_, i) => {
                                                        INDEX = INDEX + 1;
                                                        const isLast = i === celdasConocimientos - 1; // Verifica si es la última iteración
                                                        return (
                                                            <div
                                                                className={`item-todos-conocimientos ${isLast ? 'item-final' : ''}`}
                                                                key={`conocimiento-${i}`}
                                                            >
                                                                <span>{INDEX}</span>
                                                            </div>
                                                        );
                                                    })}


                                                    {/* Renderizar celdas blancas */}
                                                    {Array.from({ length: celdasBlancas }, (_, i) => {
                                                        INDEX = INDEX + 1;
                                                        return (
                                                            <div className='item-todos-conocimientos' key={`blanca-${i}`}>
                                                                <span>{INDEX}</span>
                                                            </div>
                                                        )

                                                    })}
                                                </>
                                            );
                                        })()}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    controlEquipo || controlSubPerfil || controlOperaciones != 1 && controlOperaciones != null ? (
                        <div className='empty-datos'>
                            <h2>Seleccione un Equipo y un Subperfil</h2>
                        </div>
                    ) : (
                        <div className='empty-datos'>
                            <div className="loaderMZ"></div>
                        </div>
                    )

                )}
            </div>
            <div className="qlik-embed-invisible" id="tableDatos"></div>
            <div className="qlik-embed-invisible" id="tableObjetivos"></div>
            <div className="qlik-embed-invisible" id="tableConocimientos"></div>
            <div className="qlik-embed-invisible" id="tableTodosConocimientos"></div>



            {/* <FiltersComponent aplication={props.aplication} key={props.$stateParams.IDFILTRO} qlikObjectID={props.$stateParams.IDFILTRO}></FiltersComponent> */}
        </React.Fragment>
    );
};

export default MatrizDashboard;
