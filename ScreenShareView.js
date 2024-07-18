import React from 'react';
import PropTypes from 'prop-types';
import './ScreenShareView.css'; // Import your CSS file
import img9 from './images/Qmascot-01.png'; // Assuming this is the path to your image

const ScreenShareView = ({
  screenShareStarted,
  setScreenShareStarted,
  url
}) => {

  const handleClose = () => {
    setScreenShareStarted(false);
  };

  return (
    <div className="screen-share-view">
      <div className="screen-share-container">
        <button className="close-button" onClick={handleClose}>
          <img src={img9} alt="Close" className="return-access" style={{ width: '42px', height: '42px' }} />
        </button>
        <div className="group-share-header">
          <div className="group-share-header-title">Screen Share</div>
          <div className="group-share-header-subtitle">Shared URL: {url}</div>
        </div>
        <div className="screen-share-content">
          <iframe
            src={url}
            title="Screen Share"
            width="100%"
            height="100%"
            className="screen-share-iframe"
          />
        </div>
      </div>
    </div>
  );
}

ScreenShareView.propTypes = {
  screenShareStarted: PropTypes.bool.isRequired,
  setScreenShareStarted: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

export default ScreenShareView;
