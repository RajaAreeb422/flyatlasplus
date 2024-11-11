import logo from './logo.svg';
import './App.css';

import Header from './components/flights/header/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchBar from './components/flights/searchbar/Search';
import Results from './components/flights/search-results/FlightSearchResults';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FlightSearchResults from './components/flights/search-results/FlightSearchResults';
import { Provider } from 'react-redux';
import store from './Redux/store';
import Toolbar from './components/flights/header/Toolbar';
import StaySearch from './components/flights/searchbar/StaySearch';

const App = () => {
  return (
    <Router>
      <Provider store={store}>
      <Header />
      
      </Provider>
      <Toolbar />
      <StaySearch />
      <Routes>
         
        {/* <Route path="/" element={<SearchBar />} /> */}
      
        <Route path="/results" element={<FlightSearchResults />} />
      </Routes>
    </Router>
  );
};



/*
export default function App() {
  return (
    <>
    <Header />
    <SearchBar />
    <Results />
    </>
  );
}
*/

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

 export default App;
