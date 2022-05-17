import {createBrowserHistory} from 'history';
import {put, takeLatest} from 'redux-saga/effects'
import {push} from "connected-react-router";


export const history = createBrowserHistory({basename: "country-app"})

const ROUTE_TYPE = "portal-router#route";

type RouteAction = {
    type: "portal-router#route",
    path: string
}

export function* gotoSaga({path}: RouteAction) {
    yield put(push(path))
}

function* gotoRouteSaga() {
    yield takeLatest(ROUTE_TYPE, gotoSaga)
}

export const routeSagas = [gotoRouteSaga]