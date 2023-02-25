import React, { Component } from 'react'
import logo from './logo.png';
import './css/App.css';
import Stock from './components/stock/Stock';
import Cerca from './components/Cerca';
import NomeStock from './components/NomeStock';
import axios from 'axios';




export class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      listaElementi: [],
      listaPreferiti: [],
      inCaricamento: false,
      showError: false,
      msg: null,
      msgNoElements: false

    }
  }

  cercaElementi = (str) => {
    alert('stai cercando ' + str)
    this.getElementi(str);
  }
  getElementi = (searchTerm) => {
    const url = `http://api.marketstack.com/v1/tickers?access_key=4d2038789836d530c7bc9fd685c6fc7c&limit=5&search=${searchTerm}`;
    this.setState({ inCaricamento: true })
    this.setState({ showError: false })
    this.setState({ noElements: this.state.listaElementi.length })

    const fetchOptions = {
      method: 'GET',
      cache: 'no-store', // disabilita la cache
      redirect: 'follow', // permette al client di seguire il redirect automaticamente
      https: false // forza la chiamata in HTTP
      // headers: {
      //   'X-Forwarded-Proto': 'http' // forza l'utilizzo di HTTP
      // },
    };
    fetch(url, fetchOptions)
      .then(res => res.json())
      .then(res => {
        const { data } = res;
        this.setState({ listaElementi: data })
        this.setState({ inCaricamento: false })
        if (data.length === 0) {
          this.setState({ msgNoElements: true });
        }
      })
      .catch((error) => {
        this.setState({ inCaricamento: false })
        this.setState({ showError: true, msg: error.message })
        console.log('fetch failed ' + error);
      });
  }
  addPreferiti = (ids) => {
    this.setState({ listaPreferiti: [...this.state.listaPreferiti, this.state.listaElementi[ids]] })
  }
  eliminoStock = (symbol) => {
    const preferiti = this.state.listaPreferiti.filter(el => {
      if (el.symbol !== symbol) {
        return true
      } else {
        return false
      }
    })
    this.setState({ listaPreferiti: preferiti })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p style={{ color: 'gold' }}>
            Applicazione Stock Exchange
          </p>
          <Cerca onInputSearch={this.getElementi}></Cerca>
          <div className='container'>
            <section className='listanomi'>
              <div className='row'>
                <div className='col'>
                  {this.state.inCaricamento && <p className='text-center'>Loading...</p>}
                  {this.state.showError && <p className='text-center'>{this.state.msg}</p>}
                  {this.state.msgNoElements && !this.state.inCaricamento && <p className='text-center'>Elemento non esistente</p>}
                  {this.state.listaElementi.map((el, index) =>
                    <NomeStock
                      key={el.symbol}
                      dati={el}
                      ids={index}
                      onAddPreferiti={this.addPreferiti} />)}
                </div>
              </div>
            </section>
            <section className='listapreferiti row'>
              {this.state.listaPreferiti.map(el => <Stock key={el.symbol} dati={el} eliminoStock={this.eliminoStock} symbol={el.symbol} />)}
            </section>
          </div>
        </header>
      </div>

    )
  }
}

export default App