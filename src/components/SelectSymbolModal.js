import '../assets/css/App.css'
import React from 'react';
import Modal from 'react-modal'
import SearchInput, {createFilter} from 'react-search-input'
import PropTypes from 'prop-types';

class SelectSymbolModal extends React.Component {
  constructor(props) {
    super(props);
    Modal.setAppElement('#root');
    this.state = {
      searchTerm: "",
      symbols: []
    };
  }

  propTypes = {
    open: PropTypes.bool,
    onSelect: PropTypes.func,
    onClose: PropTypes.func
  };

  async componentDidMount() {
    const response = await fetch("https://api.iextrading.com/1.0/ref-data/symbols");
    const symbols = await response.json();
    this.setState({symbols: symbols.filter(symbol => symbol.isEnabled)});
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.props.open}>
          <SearchInput onChange={search => this.setState({searchTerm: search})}/>
          <button style={{'position': 'fixed', 'top': 10, 'right': 10}} onClick={() => this.props.onClose()}>X</button>
          {this.state.symbols.filter(createFilter(this.state.searchTerm, ["symbol", "name"])).map(symbol =>
            <div className='selectable'
                 key={symbol.symbol}
                 onClick={() => this.props.onSelect(symbol)}
            >{symbol.name} - <b>{symbol.symbol}</b></div>
          )}
        </Modal>
      </div>
    )
  }
}

export default SelectSymbolModal
