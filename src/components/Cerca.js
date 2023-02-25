import React, { Component } from 'react'

export class Cerca extends Component {
    constructor(props){
        super(props)
        this.state={
            cerca:''
        }
    }
    onInputChange = (e) =>{
        this.setState({cerca: e.target.value})
        // console.log(this.state.cerca)
    }
    onSubmit = (e) => {
        e.preventDefault()
        this.props.onInputSearch(this.state.cerca)
        this.setState({ cerca: '' })
      }
    onFocus =(e)=>{
        e.target.blur()
    }
    render() {
        return (
            <div className='row'>
                <form className="form-inline" onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="cerca"
                            className="form-control"
                            value={this.state.cerca}
                            onChange={this.onInputChange}
                            placeholder="Cerca..."
                        />
                    </div>
                    <button type='submit' onFocus={this.onFocus} className='btn btn-warning cercaButton'><i className="fas fa-search"></i></button>
                </form>
            </div>
        )
    }
}

export default Cerca