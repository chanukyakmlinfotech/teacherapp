import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './StudentMagnifierView.css';

// Ensure the modal is set up to bind to your app element
Modal.setAppElement('#root');

const StudentMagnifierView = ({
  isOpenStudentMagnifierPopup,
  setIsOpenStudentMagnifierPopup,
  magniferStudent,
  refresh,
  setRefresh,
  blockList,
  setBlockList
}) => {
  const [studentUrl, setStudentUrl] = useState('');
  const [studentScreenshotUrl, setStudentScreenshotUrl] = useState('');
  const [activeTabUrl, setActiveTabUrl] = useState('');

  const closeModal = () => {
    setIsOpenStudentMagnifierPopup(false);
  };

  const blockStudent = async () => {
    setBlockList([...blockList, magniferStudent.id]);
    await fetch(`/api/student/${magniferStudent.id}/block`, { method: 'POST' });
    setRefresh(!refresh);
  };

  const closeStudentUrl = async () => {
    await fetch(`/api/student/${magniferStudent.id}/close`, { method: 'POST' });
    setRefresh(!refresh);
  };

  useEffect(() => {
    if (magniferStudent) {
      console.log('Fetching URL and Screenshot for student:', magniferStudent); // Debugging
      // Fetching URL
      fetch(`/api/student/${magniferStudent.id}/url`)
        .then(response => response.json())
        .then(data => {
          console.log('Fetched URL:', data.url); // Debugging
          setStudentUrl(data.url);
        })
        .catch(error => {
          console.error('Error fetching URL:', error);
          setStudentUrl(''); // Handle error gracefully
        });

      // Fetching Active Tab URL
      fetch(`/api/student/${magniferStudent.id}/activetab`)
        .then(response => response.json())
        .then(data => {
          console.log('Fetched Active Tab URL:', data.activeTab); // Debugging
          setActiveTabUrl(data.activeTab);
        })
        .catch(error => {
          console.error('Error fetching Active Tab URL:', error);
          setActiveTabUrl(''); // Handle error gracefully
        });

      // Setting Screenshot
      setStudentScreenshotUrl(magniferStudent.screenshot);
    }
  }, [magniferStudent, refresh]);

  return (
    <Modal
      isOpen={isOpenStudentMagnifierPopup}
      onRequestClose={closeModal}
      contentLabel="Student Magnifier"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="magnifier-container">
        {magniferStudent && (
          <img
            className="avatar"
            src={require('./images/avatar1.png')}
            alt="Avatar"
          />
        )}
        <h2 className="name">{magniferStudent?.profile?.name?.fullName}</h2>

        <div className="innerContainer">
          {studentScreenshotUrl && (
            <a href={studentScreenshotUrl} target="_blank" rel="noopener noreferrer">
              <img src={studentScreenshotUrl} alt="Student Screenshot" className="screenshot" />
            </a>
          )}
        </div>

        {studentUrl && (
          <div className="url-container">
            <a href={studentUrl} target="_blank" rel="noopener noreferrer">{studentUrl}</a>
          </div>
        )}

        {activeTabUrl && (
          <div className="active-tab-container">
            <strong>Active Tab: </strong>
            <a href={activeTabUrl} target="_blank" rel="noopener noreferrer">
              {activeTabUrl}
            </a>
          </div>
        )}

        <button className="icon-button close-button-top-right" onClick={closeModal}>
          <img src={require('./images/closebutton.png')} alt="Close" />
        </button>
        
        <div className="button-container">
          <button className="icon-button block-button" onClick={blockStudent}>
            <img src={require('./images/block.png')} alt="Block" />
          </button>
          <button className="icon-button close-button" onClick={closeStudentUrl}>
            <img src={require('./images/close.png')} alt="Close URL" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StudentMagnifierView;
