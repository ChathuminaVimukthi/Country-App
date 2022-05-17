import {Country, ExchangeResponse} from "./responseInterfaces";

const GET_COUNTRIES_HEADER = {
    'Content-Type': 'application/json'
};

const GET_CURRENCY_HEADER = {
    'Content-Type': 'application/json',
    'apiKey' : 'f5nrL4JpU6PI0u08AoXqmV966cBel9Ui'
}

export async function getCountries(): Promise<Array<Country>> {
    const resp = await fetch(`https://restcountries.com/v3.1/all`, {
        method: 'GET',
        headers: GET_COUNTRIES_HEADER,
    })
    const json = await resp.json();
    return json as Array<Country>
}

export async function getCurrencyConversion(to: string, from: string, amount: number): Promise<ExchangeResponse> {
    const resp = await fetch(`https://api.apilayer.com/fixer/convert?to=${to}&from=${from}&amount=${amount}`, {
        method: 'GET',
        redirect: 'follow',
        headers: GET_CURRENCY_HEADER
    })
    const json = await resp.json();
    return json as ExchangeResponse
}