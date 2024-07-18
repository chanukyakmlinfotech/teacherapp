import React, { useState, useEffect } from 'react';
import img5 from './images/avatar.png';

// Utility functions to replicate SwiftUI logic
const getDeviceColor = (student) => {
    switch (student.deviceType) {
        case 'chromebook':
            return 'red';
        case 'android':
            return 'green';
        case 'windows':
            return 'blue';
        default:
            return 'yellow';
    }
};

const isOnline = (student) => student.isOnline;

const isScreenShotAvailable = (student) => {
    const now = Math.floor(Date.now() / 1000);
    if (student.lastUpdatedScreenshot !== 0) {
        if (now - student.lastUpdatedScreenshot < 20) {
            return true;
        }
    } else if (now - student.startTime < 10) {
        return true;
    }
    return false;
};

const getGroupColor = (student) => {
    const groupingColorList = [
        '#fd954f',
        '#f1d62f',
        '#8941ff',
        '#70c6d0',
        '#9672fa',
    ];
    if (student.group === -1) {
        return groupingColorList[0];
    }
    return groupingColorList[student.group - 1];
};

const getGroupName = (student) => `Group ${student.group}`;

const StatusView = ({ image, color }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
            style={{
                width: '10px',
                height: '10px',
                backgroundColor: color,
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {image && (
                <img
                    src={image}
                    alt=""
                    style={{ width: '10px', height: '10px', borderRadius: '5px' }}
                />
            )}
        </div>
        <div style={{ flex: 1 }} />
    </div>
);

const StudentView = ({
    students,
    setStudents,
    refresh,
    setRefresh,
    isMonitoringOn,
    isOpenStudentMagnifierPopup,
    setIsOpenStudentMagnifierPopup,
    magniferStudent,
    setMagniferStudent,
    updateRating,
}) => {
    const handleRemoveStudent = (student) => {
        setStudents(students.filter((s) => s.userID !== student.userID));
        setRefresh(refresh + 1);
    };

    const handleSelectStudent = (student) => {
        student.isSelected = !student.isSelected;
        setRefresh(refresh + 1);
    };

    const handleRatingChange = (student, increment) => {
        student.dialy_rating += increment;
        if (student.dialy_rating < 0) student.dialy_rating = 0;
        setRefresh(refresh + 1);
        updateRating();
    };

    const handleToggleLock = (student) => {
        student.isLock = !student.isLock;
        setRefresh(refresh + 1);
    };

    return (
        <div style={{ overflowY: 'auto', padding: '10px' }}>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '20px',
                }}
            >
                {students.map((student) => (
                    <div
                        key={student.userID}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            padding: '10px',
                            height: '250px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div style={{ position: 'relative', height: '40px' }}>
                            <div
                                style={{
                                    backgroundColor: getDeviceColor(student),
                                    height: '15px',
                                    width: '100%',
                                }}
                            ></div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingTop: '8px',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: '#f5f6fa',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <img
                                        src= {img5}
                                        alt="avatar"
                                        style={{ width: '28px', height: '28px' }}
                                    />
                                </div>
                                <div style={{ flex: 1, paddingLeft: '10px' }}>
                                    <span
                                        style={{
                                            fontSize: '14px',
                                            color: '#939cb2',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {student.profile.name.fullName}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                    }}
                                >
                                    <img
                                        src="images/close.png"
                                        alt="close"
                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                        onClick={() => handleRemoveStudent(student)}
                                    />
                                    {student.isSelected ? (
                                        <img
                                            src="images/check.png"
                                            alt="check"
                                            style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                                            onClick={() => handleSelectStudent(student)}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                border: '2px solid #c7c7c7',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => handleSelectStudent(student)}
                                        ></div>
                                    )}
                                </div>
                                <StatusView color={isOnline(student) ? 'green' : 'red'} />
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            {student.is_no_license ? (
                                <div
                                    style={{
                                        color: 'red',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                    }}
                                >
                                    No License
                                </div>
                            ) : student.isOnline &&
                              !isScreenShotAvailable(student) &&
                              student.lastUpdatedScreenshot !== 0 &&
                              isMonitoringOn ? (
                                <div
                                    style={{
                                        color: 'red',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                    }}
                                >
                                    Student not shared screen
                                </div>
                            ) : student.screenShot && isMonitoringOn ? (
                                <img
                                    src={student.screenShot}
                                    alt="screenshot"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => console.log('On Click Image')}
                                />
                            ) : null}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <img
                                    src="share.png"
                                    alt="share"
                                    style={{ width: '33px', height: '33px', cursor: 'pointer' }}
                                    onClick={() => {
                                        console.log('on share');
                                    }}
                                />
                                <img
                                    src="images/search.png"
                                    alt="search"
                                    style={{ width: '33px', height: '33px', cursor: 'pointer' }}
                                    onClick={() => {
                                        console.log('on Click here');
                                        setMagniferStudent(student);
                                        setIsOpenStudentMagnifierPopup(true);
                                    }}
                                />
                                <img
                                    src="images/lock.png"
                                    alt="lock"
                                    style={{ width: '33px', height: '33px', cursor: 'pointer' }}
                                    onClick={() => handleToggleLock(student)}
                                />
                            </div>
                            {student.group !== 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <span
                                        style={{
                                            fontSize: '14px',
                                            color: '#575757',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {getGroupName(student)}
                                    </span>
                                    <div
                                        style={{
                                            width: '15px',
                                            height: '15px',
                                            backgroundColor: getGroupColor(student),
                                            borderRadius: '10px',
                                        }}
                                    ></div>
                                </div>
                            )}
                        </div>
                        {refresh > 0 && <div style={{ height: '1px' }}></div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

StudentView.defaultProps = {
    students: [],
};

export default StudentView;
