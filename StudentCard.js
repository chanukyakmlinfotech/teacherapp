import React from 'react';
import PropTypes from 'prop-types';
import './StudentView.css';
import onlineIcon from './online.png';
import offlineIcon from './offline.png';
import img1 from './images/lock.png';
import img3 from './images/search.png';
import img4 from './images/share.png';
import img5 from './images/avatar.png';
import img7 from './images/check.png';
import img8 from './images/closebutton1.png';

const StudentCard = ({ username, deviceType, isOnline, isLocked, handleLock, handleUnlock, handleOpenMagnifier, handleStartScreenSharing, screenshot }) => {

  const getTopBarColor = () => {
    switch (deviceType) {
      case 'Windows':
        return '#4285f4';
      case 'Android':
        return '#34a853';
      case 'Ios':
        return '#fbbc05';
      case 'Chromebook':
        return '#ea4335';
      default:
        return '#4285f4';
    }
  };

  const topBarColor = getTopBarColor();

  const toggleLock = () => {
    if (isLocked) {
      handleUnlock(username);
    } else {
      handleLock(username);
    }
  };

  return (
    <div className="student-card" style={{ width: '180px', height: '160px' }}>
      {isOnline ? (
        <img src={onlineIcon} alt="Online" className="online-icon" />
      ) : (
        <img src={offlineIcon} alt="Offline" className="offline-icon" />
      )}
      <div className="top-bar" style={{ backgroundColor: topBarColor }}></div>
      <div className="avatar">
        <img src={img5} alt="Avatar" style={{ width: '25px', height: '25px' }} />
        <img src={img7} alt="Check" className="check-icon" style={{ width: '16px', height: '16px' }} />
        <img src={img8} alt="Close" className="close-button1" style={{ width: '15px', height: '15px' }} />
      </div>
      <div className="username">{username}</div>
      <div className={`inner-container ${isLocked ? 'locked' : ''}`} style={{ pointerEvents: isLocked ? 'none' : 'auto', opacity: isLocked ? 0.5 : 1 }}>
        {screenshot && <img src={screenshot} alt="Student Screenshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div className="action-icons">
        <img src={img1} style={{ margin: '5px 9px -10px' }} alt={isLocked ? 'Unlock' : 'Lock'} onClick={toggleLock} />
        <img src={img3} style={{ margin: '5px 9px -10px -40px' }} alt="Search" onClick={handleOpenMagnifier} />
        <img src={img4} style={{ margin: '5px 9px -10px -40px' }} alt="Share" onClick={() => handleStartScreenSharing('https://example.com')} />
      </div>
    </div>
  );
};

StudentCard.propTypes = {
  username: PropTypes.string.isRequired,
  deviceType: PropTypes.oneOf(['Windows', 'Android', 'Ios', 'Chromebook']).isRequired,
  isOnline: PropTypes.bool.isRequired,
  isLocked: PropTypes.bool.isRequired,
  handleLock: PropTypes.func.isRequired,
  handleUnlock: PropTypes.func.isRequired,
  handleOpenMagnifier: PropTypes.func.isRequired,
  handleStartScreenSharing: PropTypes.func.isRequired,
  screenshot: PropTypes.string, // Add screenshot prop
};

export default StudentCard;
