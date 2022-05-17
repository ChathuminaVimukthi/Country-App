export interface Country {
    name: {
        common: string,
        official: string
    },
    capital: Array<string>,
    population: number,
    currencies: {},
    latlng: Array<number>
}

export interface ExchangeResponse {
    result: number,
    success: boolean
}