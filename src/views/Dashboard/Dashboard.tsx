import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux";
import {fetchCountriesAction, DashboardData} from "./index";
import {PortalState} from "../../rootReducer/store";
import {Autocomplete, CircularProgress, TextField} from "@mui/material";
import {CurrencyConverter} from "../CurrencyConverter/CurrencyConverter";
import {Country} from "../../api/responseInterfaces";

export function Dashboard() {
    const dispatch = useDispatch();
    const {countries, fetchCountriesIsLoading} = useSelector<PortalState, DashboardData>(
        state => state.dashboardData
    )
    const [value, setValue] = useState<string>("");
    const [searchedCountry, setSearchedCountry] = useState<Country>(JSON.parse("{\"name\":{\"common\":\"\",\"official\":\"\"},\"currencies\":{},\"capital\":[],\"latlng\":[],\"population\":0}"))

    useEffect(() => {
        document.title = 'Dashboard | Country App'
        dispatch(fetchCountriesAction())
    }, []);

    useEffect(() => {
        setValue(countries[0]?.name.common)
        setSearchedCountry(countries[0])
    }, [fetchCountriesIsLoading])

    const handleSearchCountry = (name: string) => {
        setValue(name)
        setSearchedCountry(countries.find((e) => e.name.common === name) || countries[0])
    }

    const getCurrency = (currency: any) => {
        const currencyCode = Object.keys(currency)[0]
        return currency[currencyCode].name + ' (' + currencyCode + ')'
    }

    return <div>
        <div className="row m-0">
            <div className="col-md-8 p-4">
                <div className="card p-4">
                    {fetchCountriesIsLoading ?
                        <CircularProgress className="m-auto" color="success"/> :
                        <div>
                            <div className="row col-md-12 m-0">
                                <div className="col-md-6 align-content-bottom">
                                    <div className="header">
                                        {searchedCountry?.name.official.toUpperCase()}
                                    </div>
                                </div>
                                <div className="col-md-6 align-content-end">
                                    <Autocomplete
                                        value={value || countries[0]?.name.common}
                                        onChange={(event: any, newValue: string | null) => {
                                            newValue &&
                                            handleSearchCountry(newValue);
                                        }}
                                        id="country-auto-complete"
                                        options={countries?.map(e => e.name.common)}
                                        sx={{width: 300}}
                                        renderInput={(params) => <TextField {...params} label="Search Countries"/>}
                                    />
                                </div>
                            </div>
                            <hr/>
                            <div className="">
                                <div className="row col-md-12 m-0">
                                    <div className="col-md-4 p-2">
                                        <div className="card bg-primary">
                                            <p className="header text-align-center">Capital</p>
                                            {
                                                searchedCountry?.capital ?
                                                    <p className="text-align-center">{searchedCountry?.capital}</p> :
                                                    <p className="text-align-center">N/A</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-md-4 p-2">
                                        <div className="card bg-primary">
                                            <p className="header text-align-center">Population</p>
                                            <p className="text-align-center">{searchedCountry?.population.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 p-2">
                                        <div className="card bg-primary">
                                            <p className="header text-align-center">Currency</p>
                                            {
                                                searchedCountry?.currencies ?
                                                    <p className="text-align-center">{getCurrency(searchedCountry?.currencies)}</p> :
                                                    <p className="text-align-center">N/A</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className="col-md-4 p-4">
                <div className="card p-4">
                    {
                        searchedCountry?.currencies == null ?
                            <div className="text-align-center header">
                                Currency conversion not available
                            </div> :
                            <CurrencyConverter currencyOfSelectedCountry={Object.keys(searchedCountry?.currencies)[0]}/>
                    }
                </div>

            </div>

        </div>
    </div>
}