import '../assets/css/App.css'
import React from 'react';
import Modal from 'react-modal'
import SearchInput, {createFilter} from 'react-search-input'
import PropTypes from 'prop-types';

class CompanyTable extends React.Component {

  propTypes = {
    company: PropTypes.object,
    onCalculate: PropTypes.func
  };

  async componentDidMount() {
    const response = await fetch("https://api.iextrading.com/1.0/ref-data/symbols");
    const symbols = await response.json();
    this.setState({symbols: symbols.filter(symbol => symbol.isEnabled)});
  }

  render() {
    return (
      <div key={this.props.company.symbol} className={'company-block'}>
        <b>{this.props.company.name}</b>
        <button onClick={() => this.props.onCalculate()}>Calculations</button>
        <button style={{'float': 'right'}}
                onClick={() => this.setState({companies: this.state.companies.filter(c => c !== company)})}
        >
          Remove
        </button>
        <table width="100%">
          <thead>
          <tr>
            <td>Date</td>
            <td>Shares Outstanding</td>
            <td>Price</td>
            <td>Revenue</td>
            <td>EBITDA</td>
            <td>Net Profit</td>
            <td>Book Value</td>
            <td>Market Value</td>
            <td>Debt</td>
          </tr>
          </thead>
          <tbody>
          {this.props.company.financials.map(period =>
            <tr key={period.reportDate}>
              <td>{period.reportDate}</td>
              <td>{this.props.company.stats.sharesOutstanding}</td>
              <td>{period.price}</td>
              <td>{period.totalRevenue}</td>
              <td></td>
              <td>{period.netProfit}</td>
              <td></td>
              <td>{this.props.company.stats.sharesOutstanding * period.price}</td>
              <td>{period.totalDebt}</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    )
  }
}

export default CompanyTable
