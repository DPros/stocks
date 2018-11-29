import '../assets/css/App.css'
import React from 'react';
import SelectSymbolModal from "./SelectSymbolModal";
import CompanyTable from "./CompanyTable";
import CompanyInfoModal from "./CompanyInfoModal";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      companies: [],
      searchPopupOpen: false,
      symbolsList: [],
      searchTerm: "",
      calculateForCompany: null
    };
  }

  async componentDidMount() {
    const response = await fetch("https://api.iextrading.com/1.0/ref-data/symbols");
    const symbols = await response.json();
    this.setState({symbolsList: symbols.filter(symbol => symbol.isEnabled)});
  }

  calculateForCompany(company) {
    this.setState({calculateForCompany: company});
  }

  render() {
    return (
      <div>
        {this.state.companies.map(company =>
          <CompanyTable key={company.symbol} company={company} onCalculate={() => this.calculateForCompany(company)}/>
        )}
        <button onClick={() => this.setState({searchPopupOpen: true})}>Add</button>
        <SelectSymbolModal open={this.state.searchPopupOpen}
                           onSelect={symbol => {
                             Promise.all([
                               fetch(`https://api.iextrading.com/1.0/stock/${symbol.symbol}/financials?period=annual`).then(response => response.json()),
                               fetch(`https://api.iextrading.com/1.0/stock/${symbol.symbol}/stats`).then(response => response.json()),
                               fetch(`https://api.iextrading.com/1.0/stock/${symbol.symbol}/chart/5y`).then(response => response.json())
                             ]).then(([financials, stats, chart]) => {
                               chart.forEach(day => day.timestamp = new Date(day.date).getTime());
                               financials.financials.forEach(period => {
                                 const timestamp = new Date(period.reportDate).getTime();
                                 period.price = chart.find(day => day.timestamp >= timestamp).close;
                               });
                               this.setState({
                                 companies: this.state.companies.concat(Object.assign({
                                   financials: financials.financials.reverse(),
                                   stats: stats,
                                   chart: chart
                                 }, symbol))
                               })
                             })
                           }}
                           onClose={() => this.setState({searchPopupOpen: false})}
        />
        <CompanyInfoModal company={this.state.calculateForCompany}
                          onClose={() => this.setState({calculateForCompany: null})}/>
      </div>
    )
  }
}

export default App
