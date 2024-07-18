import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import './Header.css';
import onlineIcon from './online.png';
import offlineIcon from './offline.png';

const Header = ({ onlineCount, offlineCount }) => {
  return (
    <div className="header">
      <div className="spacer"></div>
      <div className="button-with-text">
        <img src={onlineIcon} alt="Online" className="button-icon" />
        <span className="button-text">Online: {onlineCount}</span>
      </div>
      
      <div className="button-with-text">
        <img src={offlineIcon} alt="Offline" className="button-icon" />
        <span className="button-text">Offline: {offlineCount}</span>
      </div>
      <div className="spacer"></div>
      <div className="button-with-text">
        <div className="dot red"></div>
        <span className="button-text">Chromebook</span>
      </div>
      <div className="button-with-text">
        <div className="dot yellow"></div>
        <span className="button-text">Ios</span>
      </div>
      <div className="button-with-text">
        <div className="dot green"></div>
        <span className="button-text">Android</span>
      </div>
      <div className="button-with-text">
        <div className="dot blue"></div>
        <span className="button-text">Windows</span>
      </div>
    </div>
  );
}

// Add prop type validation
Header.propTypes = {
  onlineCount: PropTypes.number.isRequired,
  offlineCount: PropTypes.number.isRequired,
};

export default Header;
