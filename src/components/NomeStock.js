import React, { Component } from 'react'

export class NomeStock extends Component {
    addPreferiti=()=>{
        //chiama metodo nel padre
        this.props.onAddPreferiti(this.props.ids);
    }
  render() {
    return (
      <div className='nomestock' onClick={this.addPreferiti}>
       <i className='fas fa-plus-circle'></i> {this.props.dati.symbol} - 
        {this.props.dati.name}
      </div>
    )
  }
}

export default NomeStock