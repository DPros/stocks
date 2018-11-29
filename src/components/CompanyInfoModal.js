import '../assets/css/App.css'
import React from 'react';
import Modal from 'react-modal'
import SearchInput, {createFilter} from 'react-search-input'
import PropTypes from 'prop-types';

class CompanyInfoModal extends React.Component {

  propTypes = {
    company: PropTypes.object,
    onClose: PropTypes.func
  };

  render() {
    return (
      <Modal isOpen={!!this.props.company}>
        <button style={{'position': 'fixed', 'top': 10, 'right': 10}} onClick={() => this.props.onClose()}>X</button>
      </Modal>
    )
  }
}

export default CompanyInfoModal
