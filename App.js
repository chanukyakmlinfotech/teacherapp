import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './Header';
import StudentCard from './StudentCard';
import StudentMagnifierView from './StudentMagnifierView';
import ScreenShareView from './ScreenShareView';
import socketIOClient from 'socket.io-client';

function App() {
  const [students, setStudents] = useState([]);
  const [isOpenStudentMagnifierPopup, setIsOpenStudentMagnifierPopup] = useState(false);
  const [magniferStudent, setMagniferStudent] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [blockList, setBlockList] = useState([]);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenShareUrl, setScreenShareUrl] = useState('');
  const [isGroupBroadcastStarted, setIsGroupBroadcastStarted] = useState(true); // Assuming the default value is true
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = socketIOClient("https://socket.gto.to");

      socketRef.current.on('connect', () => {
        console.log("Connected to server");
        handlePinLogin();
      });

      socketRef.current.on('disconnect', () => {
        console.log("Disconnected from server");
      });

      socketRef.current.on('addStudent', (newStudent) => {
        try {
          console.log("New student added:", newStudent);

          if (!newStudent.deviceType) {
            console.warn('New student is missing deviceType:', newStudent);
          }
          setStudents(prevStudents => [
            ...prevStudents,
            { ...newStudent, isOnline: false, isLocked: false, screenshot: '',activeTab: '' }
          ]);

          let list = [];
          students.forEach(student => {
            list.push(student.userId);
          });

          list.push(newStudent.userId);

          console.dir(list);

          socketRef.current.emit('subscribeToStudents', { clients: list });

          list.forEach(id => {
            socketRef.current.emit('sendCommand', {
              id: id,
              teacher: "t21@dev.gafeslam.com",
              command: "iamwatching"
            });
          });

        } catch (e) {
          console.error("Error adding new student:", e);
        }
      });

      socketRef.current.on('studentOnline', (data) => {
        console.log("Student online:", data.id);
        
        setStudents(prevStudents =>
          prevStudents.map(student =>
            student.userId === data.id ? { ...student, isOnline: true } : student
          )
        );
      });

      socketRef.current.on('studentScreenshot', (data) => {
        console.log("Student studentScreenshot:", data.id);
        console.dir(data);
        setStudents(prevStudents =>
          prevStudents.map(student =>
            student.userId === data.id ? { ...student, screenshot: data.image, isOnline: true } : student
          )
        );
      });

      socketRef.current.on('studentActiveTab', (obj) => {
        console.log("studentActiveTab " + JSON.stringify(obj));
        setStudents(prevStudents =>
          prevStudents.map(student =>
            student.userId  === obj.id ? { ...student, activeTab: obj.activeTab } : student
          )
        );
      });

      // Listen for other events...
    }
  }, [students]);

  const handlePinLogin = () => {
    socketRef.current.emit('teacherOnline', {
      clients: [],
      class: "Demo",
      name: "t21@dev.gafeslam.com",
      id: "t21@dev.gafeslam.com",
      device_type: "Windows",
      version: "9.10.33",
      pin: "219657"
    });
    console.log("Emitting pin login event");
  };

  const handleLock = (username) => {
    console.log(`Locking ${username}`);
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.profile.name.fullName === username ? { ...student, isLocked: true } : student
      )
    );

    const student = students.find(student => student.profile.name.fullName === username);
    if (student) {
      socketRef.current.emit('sendCommand', {
        id: student.userId,
        teacher: "t21@dev.gafeslam.com",
        command: "lock"
      });
    }
  };

  const handleUnlock = (username) => {
    console.log(`Unlocking ${username}`);
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.profile.name.fullName === username ? { ...student, isLocked: false } : student
      )
    );

    const student = students.find(student => student.profile.name.fullName === username);
    if (student) {
      socketRef.current.emit('sendCommand', {
        id: student.userId,
        teacher: "t21@dev.gafeslam.com",
        command: "unlock"
      });
    }
  };

  const onlineCount = students.filter(student => student.isOnline).length;
  const offlineCount = students.filter(student => !student.isOnline).length;

  const handleOpenMagnifier = (student) => {
    setMagniferStudent(student);
    setIsOpenStudentMagnifierPopup(true);
  };

  const handleStartScreenSharing = (url) => {
    setScreenShareUrl(url);
    setIsScreenSharing(true);
  };

  const handleStopScreenSharing = () => {
    setIsScreenSharing(false);
    setIsGroupBroadcastStarted(false);
  };

  const handleStopBroadcast = () => {
    setIsGroupBroadcastStarted(false);
  };

  

  return (
    <div className="App">
      {isScreenSharing ? (
        <ScreenShareView
          students={students}
          screenShareStarted={true}
          setScreenShareStarted={setIsScreenSharing}
          isGroupBroadcastStarted={isGroupBroadcastStarted} // Pass the actual value here
          url={screenShareUrl}
        />
      ) : (
        <>
          <Header onlineCount={onlineCount} offlineCount={offlineCount} />
          <div className="student-cards-container">
            {students.map((student, index) => (
              <StudentCard
                key={index}
                username={student.profile.name.fullName}
                deviceType={student.deviceType}
                isOnline={student.isOnline}
                isLocked={student.isLocked}
                handleLock={handleLock}
                handleUnlock={handleUnlock}
                handleOpenMagnifier={() => handleOpenMagnifier(student)}
                handleStartScreenSharing={() => handleStartScreenSharing(student.userId)} // Replace with actual URL
                screenshot={student.screenshot} // Pass screenshot URL to StudentCard
              />
            ))}
          </div>
          {isOpenStudentMagnifierPopup && (
            <StudentMagnifierView
              isOpenStudentMagnifierPopup={isOpenStudentMagnifierPopup}
              setIsOpenStudentMagnifierPopup={setIsOpenStudentMagnifierPopup}
              magniferStudent={magniferStudent}
              refresh={refresh}
              setRefresh={setRefresh}
              blockList={blockList}
              setBlockList={setBlockList}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
