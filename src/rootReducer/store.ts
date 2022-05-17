import {applyMiddleware, combineReducers, createStore} from "redux";
import createSagaMiddleware from "redux-saga";
import {all, fork} from "redux-saga/effects";
import {history, routeSagas} from "../router/router";
import {connectRouter, routerMiddleware, RouterState} from "connected-react-router";
import {DashboardData, dashboardReducer, dashboardSagas} from "../views/Dashboard";
import {CurrencyConverterData, currencyConverterReducer, currencyConverterSagas} from "../views/CurrencyConverter";

export interface PortalState {
    router: RouterState<unknown>,
    dashboardData: DashboardData,
    currencyConverterData: CurrencyConverterData
}

const rootReducer = (history: any) => combineReducers<PortalState>({
    router: connectRouter(history),
    dashboardData: dashboardReducer,
    currencyConverterData: currencyConverterReducer
});

function* rootSaga() {
    let sagas = [
        ...routeSagas,
        ...dashboardSagas,
        ...currencyConverterSagas
    ];

    yield all(sagas.map(s => fork(s)));
}


function configureStore() {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [routerMiddleware(history), sagaMiddleware];
    const store = createStore(rootReducer(history), {}, applyMiddleware(...middlewares));
    sagaMiddleware.run(rootSaga);
    return store;
}

export default configureStore;


