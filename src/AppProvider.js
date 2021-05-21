import React from 'react'
const cc = require('cryptocompare')
cc.setApiKey('0e404eb44cbd44bcc5c164b5acaa69d124fc39a708aa15d06c2f94a7c9634c04')

export const AppContext = React.createContext();

export class AppProvider extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 'dashboard',
            ...this.savedSettings(),
            setPage: this.setPage,
            confirmFavorites: this.confirmFavorites
        }
    }


    componentDidMount() {
        this.fetchCoins()
    }

    fetchCoins = async () => {
        let resp = await cc.coinList()
        const coinList = resp.Data
        this.setState({
            coinList
        })
    }


    confirmFavorites = () => {
        this.setState({
            firstVisit: false,
            page: 'dashboard'
        })
        localStorage.setItem("crytoDash", JSON.stringify({ test: 'hello' }))
    }

    savedSettings() {
        let cryptoDashData = JSON.parse(localStorage.getItem('crytoDash'))
        if (!cryptoDashData) {
            return { page: 'settings', firstVisit: true }
        }
        return {}
    }

    setPage = page => this.setState({ page })

    render() {
        return (
            <AppContext.Provider value={this.state}>
                {this.props.children}
            </AppContext.Provider>
        )
    }
}