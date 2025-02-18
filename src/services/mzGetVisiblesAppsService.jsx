import GSenseApp from '@config/configGlobal.jsx';
import { arrAppsControl } from "@routes/_routes.jsx";
import _ from 'lodash';

const MzGetVisiblesAppsService = {
    getGlobal: async () => {
        return new Promise((resolve, reject) => {
            var global = GSenseApp.Qlikproperties.QS.getGlobal(GSenseApp.Qlikproperties.QSCON);
            resolve(global)
        });
    },
    getIcon: async (visualization) => {
        switch (visualization) {
            case 'linechart':
                return 'lui-icon lui-icon--line-chart lui-list__aside';
            case 'barchart':
            case 'bulletchart':
                return 'lui-icon lui-icon--bar-chart lui-list__aside';
            case 'scatterplot':
                return 'lui-icon lui-icon--scatter-chart lui-list__aside';
            case 'piechart':
                return 'lui-icon lui-icon--pie-chart lui-list__aside';
            case 'boxplot':
                return 'lui-icon lui-icon--boxplot lui-list__aside';
            case 'distributionplot':
                return 'lui-icon lui-icon--distributionplot lui-list__aside';
            case 'combochart':
                return 'lui-icon lui-icon--combo-chart lui-list__aside';
            case 'map':
                return 'lui-icon lui-icon--map lui-list__aside';
            case 'treemap':
                return 'lui-icon lui-icon--treemap lui-list__aside';
            case 'histogram':
                return 'lui-icon lui-icon--histogram lui-list__aside';
            case 'table':
                return 'lui-icon lui-icon--table lui-list__aside';
            case 'pivot-table':
                return 'lui-icon lui-icon--pivot-table lui-list__aside';
            case 'MzGenaro':
                return 'lui-icon lui-icon--print lui-list__aside';
            default:
                return 'lui-icon lui-icon--field lui-list__aside';
        }
    },
    getUserMode: async () => {
        return new Promise(async (resolve, reject) => {
            var global = await MzGetVisiblesAppsService.getGlobal();
            global.isPersonalMode((reply) => {
                resolve(reply.qReturn);
            });
        });
    },
    getUserAppList: async () => {
        return new Promise(async (resolve, reject) => {
            var global = await MzGetVisiblesAppsService.getGlobal();
            global.session.rpc({
                method: "GetDocList", handle: -1, params: []

            }).then(function (res) {
                var conPermisoLectura;
                conPermisoLectura = res.result.qDocList;

                let listApps = [];
                if (conPermisoLectura && conPermisoLectura.length > 0) {
                    conPermisoLectura.forEach(function (item, index) {
                        var option = {};
                        option.idApp = item.qDocId;
                        option.nameApp = item.qDocName.trim();
                        listApps.push(option);
                    })
                }
                resolve(listApps);

            }).catch(function (e) {
                reject(e);
            })
        });
    },

    getInitConfigApps: async (appsServer) => {
        return new Promise(async (resolve, reject) => {
            try {
                var visibles = [];
                const IsPersonalMode = await MzGetVisiblesAppsService.getUserMode();
    
                await Promise.all(GSenseApp.arrApps.map(async (initApp) => {
                    const serverApp = appsServer.find((serverApp) => {
                        if (IsPersonalMode === true) {
                            return initApp.idapp.trim().replace(".qvf", "") === serverApp.nameApp.trim().replace(".qvf", "");
                        } else {
                            return initApp.idapp.trim() === serverApp.idApp.trim();
                        }
                    });
    
                    if (serverApp) {
                        visibles.push(initApp);
                    }
                }));
    
                resolve(visibles);
            } catch (error) {
                reject(error);
            }
        });
    },
    //Obtenemos las aplicaciones visibles para obtener los objetos
    getVisibleApps :  () => {
        return new Promise(async function (resolveGeneral, rejectGeneral) {
            const IsPersonalMode = await MzGetVisiblesAppsService.getUserMode();
           
            if (IsPersonalMode) {
                const appUniq = _.uniqBy(GSenseApp.arrApps, (obj) => obj.idapp);
                resolveGeneral(appUniq);

            } else {
                (async function () {
                    try {
                        var appsServer = await MzGetVisiblesAppsService.getUserAppList();
                        var appsVisibles = await MzGetVisiblesAppsService.getInitConfigApps(appsServer);
                        resolveGeneral(appsVisibles);

                    } catch (e) {
                        console.error(e);
                        resolveGeneral(GSenseApp.arrApps);
                    }
                })();
            }
        });

    },
    getAppOpen :async (_appId, i) => {
        return new Promise(resolve => {
            if (GSenseApp.arrApps[i].APPSENSE) {
                resolve(GSenseApp.arrApps[i].APPSENSE);
            } else {
                var app = GSenseApp.Qlikproperties.QS.openApp(_appId, GSenseApp.Qlikproperties.QSCON);
                app.model.waitForOpen.promise.then(() => {
                    if (!GSenseApp.arrApps[i].APPSENSE) {
                        GSenseApp.arrApps[i].APPSENSE = app;
                    }    
                    resolve(app);
                }).catch(function(){
                    resolve(false);
                })
            }
        }) 
    },
    getUser: async (value)=>{
        var str = value.qMeta.hasOwnProperty('owner').owner ? value.qMeta.owner.name : value.qMeta.user;
        var isServer = str.includes(';');

        if (isServer == true) {
            str.split(";");
            var usuario = str.split('=');
            return usuario[2];
        } else {
            return str;
        }
    },
    getListadoBookmark: async (aplicacion, i) => {
        return new Promise(async resolve => {
            const IsPersonalMode = await MzGetVisiblesAppsService.getUserMode();
            var APP = aplicacion;
            APP.getList("BookmarkList", function (reply) {
                var listBookmark = [];
                reply.qBookmarkList.qItems.forEach(async function (value) {
                    if (value.qMeta.hasOwnProperty('extensionId')) {
                        var itemBookmark = {};
                        itemBookmark.APP = aplicacion;
                        itemBookmark.APPNAME = arrAppsControl.find((app) => app.idapp == aplicacion.id).name;
                        itemBookmark.indexApp = i;
                        itemBookmark.Object = value.qMeta.object;
                        itemBookmark.title = value.qData.title;
                        itemBookmark.id = value.qInfo.qId;
                        itemBookmark.selectionFields = value.qData.selectionFields;
                        itemBookmark.creationDate = value.qData.creationDate;
                        itemBookmark.modificationDate = value.qMeta.modifiedDate;
                        itemBookmark.type = await MzGetVisiblesAppsService.getIcon(value.qMeta.object.visualization);
                        itemBookmark.typeObject = value.qMeta.object.visualization;
                        itemBookmark.qStateData = value.qData.qBookmark.qStateData;
                        itemBookmark.user = await MzGetVisiblesAppsService.getUser(value);// value.qMeta.hasOwnProperty('owner').owner ? value.qMeta.owner.name : value.qMeta.user;

                        if (IsPersonalMode == false) {
                            itemBookmark.published = value.qMeta.published == true;
                            itemBookmark.canDelete = value.qMeta.privileges ? value.qMeta.privileges.includes("delete") : false;
                            itemBookmark.canPublish = value.qMeta.privileges ? value.qMeta.privileges.includes("publish") : false;
                        } else {
                            itemBookmark.published = false;
                            itemBookmark.canDelete = true;
                            itemBookmark.canPublish = false;
                        }
                        listBookmark.push(itemBookmark);
                    }
                });
                APP.destroySessionObject(reply.qInfo.qId)
                resolve(listBookmark);
            });
        })
    },
    asyncCallGetListadoBookmark:async (_appId) => {
        try {
            let index = arrAppsControl.findIndex((app) => app.idapp === _appId);
            const app = await MzGetVisiblesAppsService.getAppOpen(_appId, index);
            if (app !== false) {
                const result = await MzGetVisiblesAppsService.getListadoBookmark(app, index);
                return [result];
            }
        } catch (error) {
            console.error(error);
        }
    
        return null;
    }
};

export default MzGetVisiblesAppsService;
