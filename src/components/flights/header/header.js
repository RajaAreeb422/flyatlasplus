import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Box, Button, Popover, Typography, Link, Chip, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TranslateIcon from '@mui/icons-material/Translate';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { setLanguage, setCurrency} from '../../../Redux/settingsSlice';
import Select from 'react-select';
import logo from '../../../images/atlaslogo.png';

const languages = [
  { value: 'de', label: 'Deutsch', icon: '🇩🇪' },
  { value: 'en', label: 'English', icon: '🇬🇧' },
  { value: 'fr', label: 'Français', icon: '🇫🇷' },
  { value: 'it', label: 'Italiano', icon: '🇮🇹' },
  { value: 'es', label: 'Español', icon: '🇪🇸' },
];

const currencies = [
  { value: 'EUR', label: 'EUR' },
  { value: 'USD', label: 'USD' },
  { value: 'GBP', label: 'GBP' },
  { value: 'PKR', label: 'PKR' },
  { value: 'INR', label: 'INR' },
];

const Header = () => {
  const dispatch = useDispatch();
  const { language, currency } = useSelector((state) => state.settings);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages.find((l) => l.value === language)
  );
  const [selectedCurrency, setSelectedCurrency] = useState(
    currencies.find((c) => c.value === currency)
  );

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'popover' : undefined;

  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);
  };

  const handleCurrencyChange = (selectedOption) => {
    setSelectedCurrency(selectedOption);
  };

  const handleSavePreferences = () => {
    dispatch(setLanguage(selectedLanguage.value));
    dispatch(setCurrency(selectedCurrency.value));
    handlePopoverClose();
  };

  const suggestionChips = (options, handleSelect) => (
    <Box mt={1}>
      <Typography variant="caption">Suggestions:</Typography>
      <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
        {options.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            onClick={() => handleSelect(option)}
            clickable
            sx={{ backgroundColor: '#f3f3f3' }}
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <AppBar position="sticky"  elevation={0} sx={{boxShadow:'0px 0px 6px gray',backgroundColor:"white"}}>
      <Toolbar>
      <Box display="flex" flexGrow={1} >
      <Link href="/" style={{ textDecoration: 'none' }}>
            <img src={logo} alt="FlyAtlas Logo" style={{ height: '40px' }} />
          </Link>
        </Box>

        <Box display="flex" alignItems="center">
        <IconButton color="default">
            <HeadphonesIcon />
          </IconButton>
          <IconButton color="default">
            <FavoriteBorderIcon />
          </IconButton>
          <IconButton color="default">
            <NotificationsIcon />
          </IconButton>
          
          {/* <IconButton color="default" onClick={handlePopoverOpen}>
            <TranslateIcon />
          </IconButton> */}
          <IconButton color="default" onClick={handlePopoverOpen}>
          <TranslateIcon />
          <Box component="span" mx={1}>|</Box>
            <CurrencyExchangeIcon />
          </IconButton>
        </Box>

        {/* Popover for Language and Currency Selection */}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box padding={3} style={{ width: 500 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6" align="center">
                  Select your language
                </Typography>
                <Select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  options={languages}
                  getOptionLabel={(option) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>{option.icon}</span>
                      {option.label}
                    </div>
                  )}
                  isClearable={false}
                />
                {suggestionChips(languages, handleLanguageChange)}
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6" align="center">
                  Select your currency
                </Typography>
                <Select
                  value={selectedCurrency}
                  onChange={handleCurrencyChange}
                  options={currencies}
                  isClearable={false}
                />
                {suggestionChips(currencies, handleCurrencyChange)}
              </Grid>
            </Grid>

            <Button
              variant="contained"
              fullWidth
              style={{ marginTop: '16px', backgroundColor: '#f3b84d', color: 'white' }}
              onClick={handleSavePreferences}
            >
              Save Preferences
            </Button>
          </Box>
        </Popover>

        <Button variant="outlined" color="primary" style={{ marginLeft: '16px' }}>
          Sign in
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;


/*import React, { useState } from 'react';
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

*/