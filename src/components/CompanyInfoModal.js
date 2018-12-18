import '../assets/css/App.css'
import React from 'react';
import Modal from 'react-modal'
import PropTypes from 'prop-types';

class CompanyInfoModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  propTypes = {
    company: PropTypes.object,
    allCompanies: PropTypes.array,
    onClose: PropTypes.func
  };

  async componentDidMount() {
    const response = await fetch(`https://api.iextrading.com/1.0/stock/market/batch?symbols=${this.props.allCompanies.map(company => company.symbol).join(',')}&types=price`);
    const prices = await response.json();
    this.setState({prices: prices});
  }

  render() {
    return (
      <div>
        <Modal isOpen={true}>
          <h1>{this.props.company.stats.companyName}</h1>
          <button style={{'position': 'fixed', 'top': 10, 'right': 10}} onClick={() => this.props.onClose()}>X</button>
          {this.state.prices &&
          <table width="100%">
            <thead>
            <tr>
              <td> Date</td>
              <td>EV/S</td>
              <td>EV/EBITDA</td>
              <td>P/E</td>
              <td>P/BV</td>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Now</td>
              <td>
                {this.evsPrice()}
              </td>
              <td></td>
              <td>{this.pePrice()}</td>
              <td></td>
            </tr>
            </tbody>
          </table>
          }
        </Modal>
      </div>
    )
  }

  evsPrice() {
    const totalMarketRevenue = this.props.allCompanies.map(company => company.financials[3].totalRevenue).reduce((prev, curr) => prev + curr);
    const avgEvs = this.props.allCompanies.map(company => company.financials[3].evs * company.financials[3].totalRevenue / totalMarketRevenue).reduce((prev, curr) => prev + curr);
    const multPrice = (avgEvs * this.props.company.financials[3].totalRevenue - this.props.company.financials[3].totalDebt) / this.props.company.stats.sharesOutstanding;
    const stockPrice = this.state.prices[this.props.company.symbol].price;
    const change = multPrice === stockPrice ? 0 : ((multPrice - stockPrice) / stockPrice * 100).toFixed(2);
    return multPrice.toFixed(2) + (' (' + (change > 0 ? '+' : '') + change + '%)')
  }

  pePrice() {
    const totalMarketRevenue = this.props.allCompanies.map(company => company.financials[3].totalRevenue).reduce((prev, curr) => prev + curr);
    const avgPe = this.props.allCompanies.map(company => company.financials[3].pe * company.financials[3].totalRevenue / totalMarketRevenue).reduce((prev, curr) => prev + curr);
    const multPrice = (avgPe * this.props.company.financials[3].netIncome) / this.props.company.stats.sharesOutstanding;
    const stockPrice = this.state.prices[this.props.company.symbol].price;
    const change = multPrice === stockPrice ? 0 : ((multPrice - stockPrice) / stockPrice * 100).toFixed(2);
    return multPrice.toFixed(2) + (' (' + (change > 0 ? '+' : '') + change + '%)')
  }
}

export default CompanyInfoModal
