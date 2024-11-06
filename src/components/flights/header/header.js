import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English');

  const handleCurrencyChange = (event) => setCurrency(event.target.value);
  const handleLanguageChange = (event) => setLanguage(event.target.value);

  return (
    <header className="header">
      <div className="header_logo">
        <h1>FlyAtlasPlus.com</h1>
      </div>

      <div className="navbar">

      <nav className="header_nav">
        <ul>
          <li ><a href="#stays"> Stays</a></li>
          <li><a href="#flights">Flights</a></li>
          <li><a href="#cars">Cars</a></li>
          <li><a href="#deals">Deals</a></li>
          <li><a href="#support">Support</a></li>
        </ul>
      </nav>
      </div>

      <div className="header_user">
        <span className="user-icon">👤</span>
        <div className="header_currency-language">
          <select onChange={handleLanguageChange} value={language} className="language-selector">
            <option value="English">English</option>
            <option value="Spanish">Español</option>
            <option value="French">Français</option>
          </select>
          <select onChange={handleCurrencyChange} value={currency} className="currency-selector">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;