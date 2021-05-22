import React, { createContext } from 'react'
import _ from "lodash"

const cc = require('cryptocompare')
cc.setApiKey('0e404eb44cbd44bcc5c164b5acaa69d124fc39a708aa15d06c2f94a7c9634c04')

export const AppContext = createContext();

const MAX_FAVORITES = 10
export class AppProvider extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 'dashboard',
            favorites: ["BTC", "ETH", "DOGE"],
            ...this.savedSettings(),
            setPage: this.setPage,
            confirmFavorites: this.confirmFavorites,
            coinList: {},
            addCoin: this.addCoin,
            removeCoin: this.removeCoin,
            isInFavorites: this.isInFavorites,
            setFilteredCoins: this.setFilteredCoins,
            setCurrentFavorite: this.setCurrentFavorite
        }
    }


    componentDidMount() {
        this.fetchCoins()
        this.fetchPrices()
    }

    addCoin = key => {
        let favorites = [...this.state.favorites];
        if (favorites.length < MAX_FAVORITES) {
            favorites.push(key)
            this.setState({ favorites })
        }
    }

    removeCoin = key => {
        let favorites = [...this.state.favorites]
        this.setState({ favorites: _.pull(favorites, key) })
    }

    isInFavorites = key => _.includes(this.state.favorites, key)

    fetchCoins = async () => {
        let resp = await cc.coinList()
        const coinList = resp.Data
        console.log(coinList)
        this.setState({
            coinList
        })
    }

    fetchPrices = async () => {
        if (this.state.firstVisit) return
        let prices = await this.prices()
        console.log(prices)
        this.setState({ prices })
    }

    prices = async () => {
        let returnData = []
        for (let i = 0; i < this.state.favorites.length; i++) {
            try {
                let priceData = await cc.priceFull(this.state.favorites[i], "USD")
                console.log(priceData)
                returnData.push(priceData)
            }
            catch (e) {
                console.warn('fetch price error: ', e)
            }
        }
        return returnData
    }


    confirmFavorites = () => {
        let currentFavorite = this.state.favorites[0]
        this.setState({
            firstVisit: false,
            page: 'dashboard',
            currentFavorite
        }, () => {
            console.log('confirm')
            this.fetchPrices()
        })
        localStorage.setItem("crytoDash", JSON.stringify({ favorites: this.state.favorites, currentFavorite }))
    }

    savedSettings() {
        let cryptoDashData = JSON.parse(localStorage.getItem('crytoDash'))
        if (!cryptoDashData) {
            return { page: 'settings', firstVisit: true }
        }
        let { favorites, currentFavorite } = cryptoDashData
        return { favorites, currentFavorite }
    }

    setCurrentFavorite = (sym) => {
        this.setState({
            currentFavorite: sym
        })
        localStorage.setItem('cryptoDash', JSON.stringify({
            ...JSON.parse(localStorage.getItem("cryptoDash")),
            currentFavorite: sym
        }))
    }

    setPage = page => this.setState({ page })

    setFilteredCoins = (filteredCoins) => this.setState({ filteredCoins })
    render() {
        return (
            <AppContext.Provider value={this.state}>
                {this.props.children}
            </AppContext.Provider>
        )
    }
}