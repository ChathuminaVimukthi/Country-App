import {getCurrencyConversion} from "../../api/apiCalls";
import {ExchangeResponse} from "../../api/responseInterfaces";
import produce from "immer"
import {call, put, takeEvery} from "redux-saga/effects";

export enum currencyConverterActionTypes {
    FETCH_EXCHANGE_RATES = "fetch_exchange_rates",
    FETCH_EXCHANGE_RATES_SUCCESS = "fetch_exchange_rates_success",
    FETCH_EXCHANGE_RATES_FAILURE = "fetch_exchange_rates_failure",
}

interface FetchExchangeRatesAction {
    type: currencyConverterActionTypes.FETCH_EXCHANGE_RATES;
    to: string;
    from: string;
    amount: number;
}

interface FetchExchangeRatesSuccessAction {
    type: currencyConverterActionTypes.FETCH_EXCHANGE_RATES_SUCCESS;
    exchange: ExchangeResponse;
}

interface FetchExchangeRatesFailureAction {
    type: currencyConverterActionTypes.FETCH_EXCHANGE_RATES_FAILURE;
    err: string;
}

export type CurrencyConverterActions = FetchExchangeRatesAction
    | FetchExchangeRatesSuccessAction
    | FetchExchangeRatesFailureAction

function fetchExchangeRatesAction(to: string, from: string, amount: number): FetchExchangeRatesAction {
    return {
        type: currencyConverterActionTypes.FETCH_EXCHANGE_RATES,
        to: to,
        from: from,
        amount:amount
    }
}

function fetchExchangeRatesSuccessAction(exchange: ExchangeResponse): FetchExchangeRatesSuccessAction {
    return {
        type: currencyConverterActionTypes.FETCH_EXCHANGE_RATES_SUCCESS,
        exchange: exchange,
    }
}

function fetchExchangeRatesFailureAction(err: string): FetchExchangeRatesFailureAction {
    return {
        type: currencyConverterActionTypes.FETCH_EXCHANGE_RATES_FAILURE,
        err: err
    }
}

export interface CurrencyConverterData {
    exchange: ExchangeResponse,
    fetchExchangeRatesIsLoading: boolean,
    fetchExchangeRatesError: { hasError: boolean; description: string },
}

const initialState = {
    exchange: {
        result: 0,
        success: false
    },
    fetchExchangeRatesIsLoading: false,
    fetchExchangeRatesError: {hasError: false, description: ""},
}

export function currencyConverterReducer(state: CurrencyConverterData = initialState, action: CurrencyConverterActions) {
    return produce(state, draft => {
        switch (action.type) {
            case currencyConverterActionTypes.FETCH_EXCHANGE_RATES: {
                draft.fetchExchangeRatesIsLoading = true;
                break;
            }
            case currencyConverterActionTypes.FETCH_EXCHANGE_RATES_SUCCESS: {
                draft.exchange = action.exchange;
                draft.fetchExchangeRatesIsLoading = false;
                draft.fetchExchangeRatesError = {hasError: false, description: ""};
                break;
            }
            case currencyConverterActionTypes.FETCH_EXCHANGE_RATES_FAILURE: {
                draft.fetchExchangeRatesIsLoading = false;
                draft.fetchExchangeRatesError = {hasError: true, description: action.err};
                break;
            }
        }
    })
}


function* callFetchExchangeRates(action: FetchExchangeRatesAction) {
    try {
        const result: ExchangeResponse = yield call(getCurrencyConversion, action.to, action.from, action.amount)
        yield put(fetchExchangeRatesSuccessAction(result))
    } catch (e: any) {
        yield put(fetchExchangeRatesFailureAction(e.toString()))
    }
}

//--------------------------------------------------------------------------

function* getCurrencyConverterSagas() {
    yield takeEvery(currencyConverterActionTypes.FETCH_EXCHANGE_RATES, callFetchExchangeRates)
}

const currencyConverterSagas = [getCurrencyConverterSagas]
export {currencyConverterSagas,
    fetchExchangeRatesAction,
}
