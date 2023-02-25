import React, { Component } from 'react';
import '../../css/stock/stock.css'
import Grafico from '../Grafico';

class Stock extends Component {

    constructor(props) {
        super(props);
        const { symbol, price, stock_exchange } = this.props.dati
        this.state = { symbol, price, stock_exchange, datatrade: 'xxxx-xx-xx 16:00:00', ckrealtime:'',datigrafico:[{datetime:'16:00:00',price:price}],showgrafico:false };
    }

    static getDerivedStateFromProps(np, ps) {
        if (np.dati.symbol !== ps.symbol) {
            return { nome: np.dati.symbol, price: np.dati.price }
        }
        return null;
    }

    // aggiornoStock = () => {
    //     const valore = this.state.valore + 10
    //     this.setState({ valore })
    // }
    eliminoStock = () => {
        this.props.eliminoStock(this.props.dati.symbol)
    }
    startCheckElemento = () => {
        this.timer = setInterval(() => this.getNewElementi(), 2000)
    }
    stopCheckElemento = () => {
        clearInterval(this.timer);
    }
    // componentWillMount =() => {
    //     clearInterval(this.timer);
    // }
    startRealtime =()=> {
        const ckrt = this.state.ckrealtime === 'checked' ? '' : 'checked';
        if(ckrt === 'checked'){
           this.startCheckElemento();
        }else {
            this.stopCheckElemento();
        }
        this.setState({ ckrealtime: ckrt }) 
    }
    getNewElementi = () => {
        const url = `http://api.marketstack.com/v1/intraday/latest?access_key=4d2038789836d530c7bc9fd685c6fc7c&interval=1min&symbols=${this.props.dati.symbol}`;
    
        fetch(url)
            .then(r => r.json())
            .then(r => {
                const { data } = r;
                const timeprice = Object.entries(data)[0];
                const datatrade = timeprice[1].date.slice(0, -5);
                const price = timeprice[1].open;
                const priceClose = timeprice[1].close;
                const datigrafico = [...this.state.datigrafico,{datetime:datatrade.substring(11),price:price}]
                this.setState({ price, priceClose, datatrade, datigrafico })
    
            })
            .catch((error) => {
                console.log('Fetch failed', error)
            })
    
    }
    
    
    showGrafico =()=> {
        this.setState({showgrafico:!this.state.showgrafico})
    }

    render() {
        const diff = (this.state.price - this.state.priceClose).toFixed(2);
        const percentuale = (diff / this.props.dati.price) * 100;
     
        return (
            <div className="stock col-md-6 p-3">
                <div className="bodystock">
                    <i className="fas fa-times-circle closebtn" onClick={this.eliminoStock}></i>
                    <div className="row">
                        <div className="col-sm">
                            <h2 className='giallo'>{this.props.dati.symbol}</h2>
                            <p>Nasdaq</p>
                        </div>
                        <div className="col-sm">
                            <h2>{this.state.stock_exchange.acronym}</h2>
                            <p>{this.state.stock_exchange.city}</p>
                        </div>
                        <div className="col-sm">
                            <h2>{diff}</h2>
                            <p style={{ color: 'green' }}>{this.state.datatrade.substring(11)}</p>
                        </div>
                        <div className="col-sm">
                            <p><i className="fas fa-chart-line fa-2x" onClick={this.showGrafico}></i></p>
                            <label className="bs-switch">
                                <input type="checkbox" checked={this.state.ckrealtime} onChange={this.startRealtime}/>
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="bodygrafico">
                    <div className="row">
                        <div className="col-sm">
                            {this.state.showgrafico &&<Grafico data={this.state.datigrafico} chiusura={this.props.dati.price}/>}
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default Stock