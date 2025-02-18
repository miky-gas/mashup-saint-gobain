import { createSlice, configureStore } from '@reduxjs/toolkit'
const initialState = {
    root: null
};
// Slice para bookmarkActivo
const bookmarkActivoSlice = createSlice({
    name: 'bookmarkActivo',
    initialState: {
        activo: false,
        bookmarkName: ''
    },
    reducers: {
        activarBookmark: (state, action) => {
            state.activo = true;
            state.bookmarkName = action.payload;
        },
        desactivarBookmark: state => {
            state.activo = false;
            state.bookmarkName = '';
        }
    }
})
export const { activarBookmark, desactivarBookmark } = bookmarkActivoSlice.actions;

//Slice para Sidebar Collapse
const SidebarSlice = createSlice({
    name: 'Sidebar',
    initialState: {
        activo: false
    },
    reducers: {
        collapseSidebar: (state, action) => {
            state.activo = true;
        },
        expandSidebar: state => {
            state.activo = false;
        },
        toggleSidebar: state => {
            state.activo = !state.activo;
        }
    }
})
export const { collapseSidebar, expandSidebar, toggleSidebar } = SidebarSlice.actions;


const rootSlice = createSlice({
    name: 'root',
    initialState,
    reducers: {
        setRoot: (state, action) => {
            state.root = action.payload;
        },
        clearRoot: (state) => {
            state.root = null;
        }
    }
});
export const { setRoot, clearRoot } = rootSlice.actions;

const patchesSlice = createSlice({
    name: 'patches',
    initialState: {
        patchesById: {},
    },
    reducers: {
        setPatches: (state, action) => {
            const { objectId, patches } = action.payload;
            state.patchesById[objectId] = patches;
        },
        removePatches: (state, action) => {
            const { objectId } = action.payload;
            delete state.patchesById[objectId];
        },
    },
});
export const { setPatches, removePatches } = patchesSlice.actions;
export const selectPatches = (state, objectId) => state.patches.patchesById[objectId] || [];

const objectLoadedSlice = createSlice({
    name: 'objectLoadedSlice',
    initialState:{
        partials:0,
        total:0
    },
    reducers: {
        incrementPartials: (state) => {
            state.partials += 1;
        },
        setTotal: (state, action) => {
            state.total = action.payload;
        },
        reset: (state) => {
            state.partials = 0;
            state.total = 0;
        }
    }
});
export const { incrementPartials, setTotal, reset } = objectLoadedSlice.actions;

//Slice para panel de opciones
const optionsPanelSlice = createSlice({
    name: 'optionsPanel',
    initialState: {
        isVisible: false,
    },
    reducers: {
        showOptionsPanel: (state) => {
            state.isVisible = true;
        },
        hideOptionsPanel: (state) => {
            state.isVisible = false;
        },
        toggleOptionsPanel: (state) => {
            state.isVisible = !state.isVisible;
        },
    },
});
export const { showOptionsPanel, hideOptionsPanel, toggleOptionsPanel } = optionsPanelSlice.actions;

//Slice para filtros seleccionados
const filtersOptionsSlice = createSlice({
    name: 'filtersOptions',
    initialState: {
        totalFiltersSelected: 0, 
        filters: []
    },
    reducers: {
        setTotalFiltersSelected: (state, action) => {
            state.totalFiltersSelected = action.payload;
        },
        setListFilters: (state, action) => {
            state.filters = action.payload;
        },
    },
});
export const {setTotalFiltersSelected, setListFilters} = filtersOptionsSlice.actions;

// Slice para manejar opciones y su visibilidad
const optionsSlice = createSlice({
    name: 'options',
    initialState:{
        mzOptions: [
            {
              id: 1,
              descripcion: "alertas",
              application_id: 1,
              user_id: 1,
              opcion_id: 1,
              visible: true
            },
            {
              id: 2,
              descripcion: "marcadores",
              application_id: 1,
              user_id: 1,
              opcion_id: 2,
              visible: true
            },
            {
              id: 3,
              descripcion: "filtros",
              application_id: 1,
              user_id: 1,
              opcion_id: 3,
              visible: true
            },
            {
              id: 4,
              descripcion: "glosario",
              application_id: 1,
              user_id: 1,
              opcion_id: 4,
              visible: true
            },
            {
              id: 5,
              descripcion: "ayuda",
              application_id: 1,
              user_id: 1,
              opcion_id: 5,
              visible: true
            },
            {
              id: 6,
              descripcion: "modos",
              application_id: 1,
              user_id: 1,
              opcion_id: 6,
              visible: true
            }
          ]
    },
    reducers: {
        setOptions: (state, action) => {
            // action.payload debe contener los dos arrays: opciones y visibilidad
            const { opciones, visibilidad } = action.payload;

            // Unir las opciones con la visibilidad
            const opcionesActualizadas = opciones.map(opcion => {
                const visibilidadOpcion = visibilidad.find(v => v.opcion_id === opcion.id);
                
                return {
                    ...opcion,
                    ...visibilidadOpcion,
                    visible: visibilidadOpcion ? visibilidadOpcion.visible : false
                };
            });
            state.mzOptions = opcionesActualizadas;
        },
        updateOptionVisibility: (state, action) => {
            const { opcionId, visible } = action.payload;
            const index = state.mzOptions.findIndex(opcion => opcion.id === opcionId);
            if (index !== -1) {
                state.mzOptions[index].visible = visible;
            }
        },
        setOptionsFallback: (state, action) => {
            state.mzOptions = action.payload.opcionesFallback;
        }
    }
});
export const getOptions = state => state.options.mzOptions;

export const getOptionById = (state, opcionId) => {
    return state.options.mzOptions.find(opcion => opcion.id === opcionId);
};
export const { setOptions, setOptionsFallback, updateOptionVisibility } = optionsSlice.actions;

// Slice para Videos
const videosHelpSlice = createSlice({
    name: 'videosHelp',
    initialState:{
        videosHelp:[]
    },
    reducers: {
        setVideos: (state, action) => {
            state.videosHelp = action.payload;
        }
    }
});
export const { setVideos } = videosHelpSlice.actions;

const rootReducer = {
    bookmarkActivo: bookmarkActivoSlice.reducer,
    Sidebar: SidebarSlice.reducer,
    patches: patchesSlice.reducer,
    root: rootSlice.reducer,   
    objectLoadedSlice:objectLoadedSlice.reducer,
    optionsPanel: optionsPanelSlice.reducer,
    filtersOptions:filtersOptionsSlice.reducer,
    options: optionsSlice.reducer,
    videosHelp: videosHelpSlice.reducer
}
const store = configureStore({
    reducer: rootReducer
})




export default store;
// store.subscribe(() => console.log(store.getState()));
// Can still subscribe to the store
//store.subscribe(() => console.log(store.getState()));
// // Still pass action objects to `dispatch`, but they're created for us
// store.dispatch(incremented())
// // {value: 1}
// store.dispatch(incremented())
// // {value: 2}
// store.dispatch(decremented())
// // {value: 1}