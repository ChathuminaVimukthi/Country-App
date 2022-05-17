import React, {useEffect, useState} from "react"
import {CircularProgress, TextField} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {CurrencyConverterData, fetchExchangeRatesAction} from "./index";
import {PortalState} from "../../rootReducer/store";

interface CurrencyConverterProps {
    currencyOfSelectedCountry: string
}

export function CurrencyConverter(props: CurrencyConverterProps) {
    const dispatch = useDispatch();
    const {currencyOfSelectedCountry} = props
    const {exchange, fetchExchangeRatesIsLoading, fetchExchangeRatesError} = useSelector<PortalState, CurrencyConverterData>(
        state => state.currencyConverterData
    )
    const [amount, setAmount] = useState<number>(0)

    useEffect(() => {
        amount > 0 &&
        dispatch(fetchExchangeRatesAction(currencyOfSelectedCountry, "SEK", amount))
    }, [currencyOfSelectedCountry])

    const handleInput = (event: any) => {
        let amountEntered = event.target.value ? event.target.value : 0
        setAmount(amountEntered)
        amountEntered > 0 &&
        dispatch(fetchExchangeRatesAction(currencyOfSelectedCountry, "SEK", amountEntered))
    }

    return <div>
        <div className="text-align-center header">{`Currency Converter - SEK to ${currencyOfSelectedCountry}`}</div>
        <div className="row mt-2">
            <div className="col-md-6">
                <TextField id="outlined-basic" onChange={handleInput} defaultValue={0} fullWidth label="SEK"
                           InputProps={{inputProps: {min: 1}}}
                           variant="outlined" type="number"/>
            </div>
            <div className="col-md-6 align-content-center">
                {
                    fetchExchangeRatesIsLoading ?
                        <CircularProgress className="" color="success"/> :
                        <TextField disabled id="outlined-basic" fullWidth
                                   value={fetchExchangeRatesError.hasError ? 0 : amount == 0 ? 0 : exchange.result}
                                   label={`${currencyOfSelectedCountry}`} variant="outlined"/>
                }
            </div>
        </div>

    </div>
}