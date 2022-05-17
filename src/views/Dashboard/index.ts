import {getCountries} from "../../api/apiCalls";
import produce from "immer"
import {call, put, takeEvery} from "redux-saga/effects";
import {Country} from "../../api/responseInterfaces";

export enum dashboardActionTypes {
    FETCH_COUNTRIES = "fetch_countries",
    FETCH_COUNTRIES_SUCCESS = "fetch_countries_success",
    FETCH_COUNTRIES_FAILURE = "fetch_countries_failure",
}

interface FetchCountriesAction {
    type: dashboardActionTypes.FETCH_COUNTRIES;
}

interface FetchCountriesSuccessAction {
    type: dashboardActionTypes.FETCH_COUNTRIES_SUCCESS;
    countries: Array<Country>;
}

interface FetchCountriesFailureAction {
    type: dashboardActionTypes.FETCH_COUNTRIES_FAILURE;
    err: string;
}

export type DashboardActions = FetchCountriesAction
    | FetchCountriesSuccessAction
    | FetchCountriesFailureAction

function fetchCountriesAction(): FetchCountriesAction {
    return {
        type: dashboardActionTypes.FETCH_COUNTRIES,
    }
}

function fetchCountriesSuccessAction(countries: Array<Country>): FetchCountriesSuccessAction {
    return {
        type: dashboardActionTypes.FETCH_COUNTRIES_SUCCESS,
        countries: countries,
    }
}

function fetchCountriesFailureAction(err: string): FetchCountriesFailureAction {
    return {
        type: dashboardActionTypes.FETCH_COUNTRIES_FAILURE,
        err: err
    }
}

export interface DashboardData {
    countries: Array<Country>,
    fetchCountriesIsLoading: boolean,
    fetchCountriesError: { hasError: boolean; description: string },
}

const initialState = {
    countries: [],
    fetchCountriesIsLoading: true,
    fetchCountriesError: {hasError: false, description: ""},
}

export function dashboardReducer(state: DashboardData = initialState, action: DashboardActions) {
    return produce(state, draft => {
        switch (action.type) {
            case dashboardActionTypes.FETCH_COUNTRIES: {
                draft.fetchCountriesIsLoading = true;
                break;
            }
            case dashboardActionTypes.FETCH_COUNTRIES_SUCCESS: {
                draft.countries = action.countries;
                draft.fetchCountriesIsLoading = false;
                draft.fetchCountriesError = {hasError: false, description: ""};
                break;
            }
            case dashboardActionTypes.FETCH_COUNTRIES_FAILURE: {
                draft.fetchCountriesIsLoading = false;
                draft.fetchCountriesError = {hasError: true, description: action.err};
                break;
            }
        }
    })
}


function* callFetchCountries() {
    try {
        const result: Array<Country> = yield call(getCountries)
        yield put(fetchCountriesSuccessAction(result))
    } catch (e: any) {
        yield put(fetchCountriesFailureAction(e.toString()))
    }
}

//--------------------------------------------------------------------------

function* getCountrySagas() {
    yield takeEvery(dashboardActionTypes.FETCH_COUNTRIES, callFetchCountries)
}

const dashboardSagas = [getCountrySagas]
export {dashboardSagas,
    fetchCountriesAction,
}
