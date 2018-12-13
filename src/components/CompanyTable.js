import '../assets/css/App.css'
import React from 'react';
import PropTypes from 'prop-types';

class CompanyTable extends React.Component {

  propTypes = {
    company: PropTypes.object,
    onCalculate: PropTypes.func,
    onDelete: PropTypes.func
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
        {this.props.onCalculate && <button onClick={() => this.props.onCalculate()}>Calculations</button>}
        <button style={{'float': 'right'}}
                onClick={() => this.props.onDelete()}
        >
          Remove
        </button>
        <table width="100%">
          <thead>
          <tr>
            <td>Investment Return</td>
            <td>Date</td>
            <td>Shares Outstanding</td>
            <td>Price</td>
            <td>Revenue</td>
            <td>EBITDA</td>
            <td>Net Profit</td>
            <td>Book Value</td>
            <td>Market Value</td>
            <td>Debt</td>
            <td>EV/S</td>
            <td>EV/EBITDA</td>
            <td>P/E</td>
            <td>P/BV</td>
          </tr>
          </thead>
          <tbody>
          {this.props.company.financials.map(period => {
              period.marketValue = this.props.company.stats.sharesOutstanding * period.price;
              period.evs = (period.marketValue + period.totalDebt) / period.totalRevenue;
              period.pe = period.marketValue / period.netIncome;
              return <tr key={period.reportDate}>
                <td>{(period.netIncome / period.totalRevenue * 100).toFixed(2)}%</td>
                <td>{period.reportDate}</td>
                <td>{this.props.company.stats.sharesOutstanding}</td>
                <td>{period.price}</td>
                <td>{period.totalRevenue}</td>
                <td></td>
                <td>{period.netIncome}</td>
                <td></td>
                <td>{period.marketValue}</td>
                <td>{period.totalDebt}</td>
                <td>{period.evs.toFixed(2)}</td>
                <td></td>
                <td>{period.pe.toFixed(2)}</td>
                <td></td>
              </tr>
            }
          )}
          </tbody>
        </table>
      </div>
    )
  }
}

export default CompanyTable
