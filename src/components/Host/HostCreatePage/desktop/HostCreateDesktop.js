import { React, useState } from 'react';
import { useSelector } from 'react-redux';
import './HostCreateDesktop.css';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createShowsDocument } from '../../../../features/show/api/showsDocumentApi';
import { fStorage } from '../../../../Firebase';
import Popup from '../../../Popup/Popup';
import LoadingOverlay from '../../../LoadingOverlay';

function HostCreateDesktop() {
    const user = useSelector((state) => state.user.user);
    const [isLoaded, setIsLoaded] = useState(true);

    function makeDate(info) {
        const timeArray = (info.time || '').split(':');
        const hour = Number(timeArray[0]);
        const minute = Number(timeArray[1]);
        const resDate = new Date();

        resDate.setFullYear(info.year);
        resDate.setMonth(info.month - 1);
        resDate.setDate(info.day);
        resDate.setHours(hour);
        resDate.setMinutes(minute);

        return resDate;
    }

    const [popup, setPopup] = useState({
        open: false,
        message: '',
        callback: false,
    });

    const [imageUpload, setImageUpload] = useState(null);

    const days = [];
    const months = [];
    const dayOfWeeks = [];
    const places = [];
    const halls = ['그레이스', '학관', '올네'];
    const weeks = ['월', '화', '수', '목', '금', '토', '일'];
    const schedules = [];

    const [newShowInfo, setNewShowInfo] = useState({
        title: '',
        introduction: '',
        place: '',
        price: '',
        schedule: [],
        startDate: new Date(),
        endDate: new Date(),
        bankName: '',
        bankNumber: '',
    });
    const [scheduleCount, setScheduleCount] = useState(1);
    const [timeInfo, setTimeInfo] = useState({
        start: {
            year: 2023,
            month: 0,
            day: 0,
            time: '',
        },
        end: {
            year: 2023,
            month: 0,
            day: 0,
            time: '',
        },
        schedule: [
            {
                year: 2023,
                month: 0,
                day: 0,
                time: '',
            },
        ],
    });

    const upload = async () => {
        if (imageUpload === null) return;
        const imageRef = ref(fStorage, `show-image/${imageUpload.name}`);
        await uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref);
        });
    };

    const navigate = useNavigate();

    const onChangeAccount = (e) => {
        setNewShowInfo({
            ...newShowInfo,
            [e.target.name]: e.target.value,
        });
    };

    const onChangeStartDate = (e) => {
        const newTimeInfo = {
            ...timeInfo,
            start: {
                ...timeInfo.start,
                [e.target.name]: e.target.value,
            },
        };

        setTimeInfo(newTimeInfo);
    };

    const onChangeEndDate = (e) => {
        const newTimeInfo = {
            ...timeInfo,
            end: {
                ...timeInfo.end,
                [e.target.name]: e.target.value,
            },
        };
        setTimeInfo(newTimeInfo);
    };

    const onChangeSchedule = (e) => {
        const newSchedule = timeInfo.schedule;
        newSchedule[Number(e.target.id)] = {
            ...newSchedule[Number(e.target.id)],
            [e.target.name]: e.target.value,
        };

        setTimeInfo({
            ...timeInfo,
            schedule: newSchedule,
        });
    };

    const mappedSchedule = timeInfo.schedule.map((item) => makeDate(item));

    const onSubtractClick = () => {
        if (scheduleCount > 1) setScheduleCount(scheduleCount - 1);
        else
            setPopup({
                open: true,
                message: '더 이상 삭제할 수 없습니다!',
            });
    };

    const onButtonClick = async () => {
        setIsLoaded(false);
        const values = Object.values(newShowInfo);
        await upload();

        const info = {
            ...newShowInfo,
            image: `show-image/${imageUpload.name}`,
            schedule: mappedSchedule,
            startDate: makeDate(timeInfo.start),
            endDate: makeDate(timeInfo.end),
        };
        if (!values.includes('') && !values.includes(undefined)) {
            await createShowsDocument(info, user.id).then((res) => {
                if (res) {
                    setPopup({
                        open: true,
                        message: '추가 완료!',
                        callback: () => navigate('/host'),
                    });
                }
            });
        } else {
            setPopup({
                open: true,
                message: '추가 실패,,',
            });
        }
        setIsLoaded(true);
    };

    days.push(<option value={0}>선택&emsp;</option>);

    for (let i = 1; i <= 31; i += 1) {
        days.push(<option value={i}>{i}</option>);
    }

    months.push(<option value={0}>선택&emsp;</option>);

    for (let i = 1; i <= 12; i += 1) {
        months.push(<option value={i}>{i}</option>);
    }

    dayOfWeeks.push(<option value={0}>선택&emsp;</option>);

    for (let i = 1; i <= 7; i += 1) {
        dayOfWeeks.push(<option value={i}>{weeks[i - 1]}</option>);
    }

    places.push(
        <option value={0}>장소선택&emsp;&emsp;&emsp;&emsp;&emsp;</option>,
    );

    for (let i = 1; i <= 3; i += 1) {
        places.push(<option value={halls[i - 1]}>{halls[i - 1]}</option>);
    }

    for (let i = 0; i < scheduleCount; i += 1) {
        schedules.push(
            <div className="host-create-ticket-date-end" id={i}>
                <div className="host-create-ticket-start-text2">
                    {i + 1}공&nbsp;&nbsp;
                </div>
                <div className="host-create-date-end-month">
                    <select
                        name="month"
                        className="select-slection"
                        onChange={onChangeSchedule}
                        id={i}
                    >
                        {months}
                    </select>
                    <div className="host-create-ticket-start-text">월</div>
                </div>
                <div className="host-create-date-end-day">
                    <select
                        name="day"
                        className="select-slection"
                        onChange={onChangeSchedule}
                        id={i}
                    >
                        {days}
                    </select>
                    <div className="host-create-ticket-start-text">일</div>
                </div>
                <div className="host-create-date-end-dayOfWeek">
                    <select name="dayOfWeek-end" className="select-slection">
                        {dayOfWeeks}
                    </select>
                    <div className="host-create-ticket-start-text">요일</div>
                </div>
                <input
                    type="text"
                    className="host-create-date-start-time"
                    placeholder="시간 입력(24:00)"
                    name="time"
                    onChange={onChangeSchedule}
                    id={i}
                />
            </div>,
        );
    }

    return (
        <>
            {!isLoaded ? <LoadingOverlay /> : <></>}
            <div className="host-create-container">
                <Popup
                    open={popup.open}
                    setPopup={setPopup}
                    message={popup.message}
                    title={popup.title}
                    callback={popup.callback}
                />
                <div className="host-create-left">
                    <input
                        type="file"
                        className="img-get"
                        onChange={(event) => {
                            setImageUpload(event.target.files[0]);
                        }}
                        accept="image/*"
                        required
                        multiple
                    />
                    <img
                        src="/images/upload-image.png"
                        alt="업로드"
                        className="upload-image"
                    />
                </div>
                <div className="host-create-right">
                    <div className="host-create-right-1">
                        <input
                            className="host-create-title"
                            type="text"
                            name="title"
                            placeholder="공연 제목 입력"
                            onChange={onChangeAccount}
                        />
                    </div>
                    <div className="host-create-right-2">
                        <div className="host-create-right-2-left">
                            <div className="host-create-input-title">소개</div>
                            <textarea
                                className="host-create-introduction-content"
                                type="textarea"
                                placeholder="소개 입력"
                                name="introduction"
                                onChange={onChangeAccount}
                            />
                        </div>
                        <div className="host-create-right-2-right">
                            <div className="host-create-place">
                                <div className="host-create-input-title">
                                    장소
                                </div>
                                <select
                                    name="place"
                                    className="select-place"
                                    onChange={onChangeAccount}
                                >
                                    {places}
                                </select>
                            </div>
                            <div className="host-create-price">
                                <div className="host-create-input-title">
                                    가격
                                </div>
                                <input
                                    className="host-create-price-content"
                                    type="number"
                                    step="500"
                                    placeholder="가격 입력"
                                    name="price"
                                    onChange={onChangeAccount}
                                />
                            </div>
                            <div className="host-create-bank">
                                <div className="host-create-input-title">
                                    입금계좌
                                </div>
                                <div className="host-create-bank-set">
                                    <input
                                        className="host-create-bank-name"
                                        type="text"
                                        placeholder="은행명 입력"
                                        name="bankName"
                                        onChange={onChangeAccount}
                                    />
                                    <input
                                        className="host-create-price-content"
                                        type="text"
                                        placeholder='"-"포함 계좌번호 입력'
                                        name="bankNumber"
                                        onChange={onChangeAccount}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="host-create-right-3">
                        <div className="host-create-ticket-date">
                            <div className="host-create-input-title">
                                예매일정
                            </div>
                            <div className="host-create-ticket-date-end">
                                <div className="host-create-ticket-start-text2">
                                    시작
                                </div>
                                <div className="host-create-date-start-month">
                                    <select
                                        name="month"
                                        className="select-slection"
                                        onChange={onChangeStartDate}
                                    >
                                        {months}
                                    </select>
                                    <div className="host-create-ticket-start-text">
                                        월
                                    </div>
                                </div>
                                <div className="host-create-date-start-day">
                                    <select
                                        name="day"
                                        className="select-slection"
                                        onChange={onChangeStartDate}
                                    >
                                        {days}
                                    </select>
                                    <div className="host-create-ticket-start-text">
                                        일
                                    </div>
                                </div>
                                <div className="host-create-date-start-dayOfWeek">
                                    <select
                                        name="dayOfWeek-start"
                                        className="select-slection"
                                    >
                                        {dayOfWeeks}
                                    </select>
                                    <div className="host-create-ticket-start-text">
                                        요일
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    className="host-create-date-start-time"
                                    placeholder="시간 입력(24:00)"
                                    name="time"
                                    onChange={onChangeStartDate}
                                />
                            </div>
                            <div className="host-create-ticket-date-end">
                                <div className="host-create-ticket-start-text2">
                                    마감
                                </div>
                                <div className="host-create-date-end-month">
                                    <select
                                        name="month"
                                        className="select-slection"
                                        onChange={onChangeEndDate}
                                    >
                                        {months}
                                    </select>
                                    <div className="host-create-ticket-start-text">
                                        월
                                    </div>
                                </div>
                                <div className="host-create-date-end-day">
                                    <select
                                        name="day"
                                        className="select-slection"
                                        onChange={onChangeEndDate}
                                    >
                                        {days}
                                    </select>
                                    <div className="host-create-ticket-start-text">
                                        일
                                    </div>
                                </div>
                                <div className="host-create-date-end-dayOfWeek">
                                    <select
                                        name="dayOfWeek-end"
                                        className="select-slection"
                                    >
                                        {dayOfWeeks}
                                    </select>
                                    <div className="host-create-ticket-start-text">
                                        요일
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    className="host-create-date-start-time"
                                    placeholder="시간 입력(24:00)"
                                    name="time"
                                    onChange={onChangeEndDate}
                                />
                            </div>
                            <div className="host-create-input-title">
                                공연일정
                            </div>
                            <div className="event-function">
                                <div className="event-schedules">
                                    {schedules}
                                </div>
                            </div>
                        </div>
                        <div className="host-create-add-buttons">
                            <div className="event-add-button-div">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setScheduleCount(scheduleCount + 1);
                                        const newScheduleItem = {
                                            year: 2023,
                                            month: 0,
                                            day: 0,
                                            time: '',
                                        };
                                        const newSchedule = [
                                            ...timeInfo.schedule,
                                            newScheduleItem,
                                        ];
                                        const newTimeInfo = {
                                            ...timeInfo,
                                            schedule: newSchedule,
                                        };

                                        setTimeInfo(newTimeInfo);
                                    }}
                                    className="event-add-button"
                                >
                                    +&nbsp;&nbsp;&nbsp;&nbsp;열 추가하기
                                </button>
                            </div>
                            <div className="delete-button-space">
                                <button
                                    type="button"
                                    className="event-delete-button"
                                    onClick={onSubtractClick}
                                >
                                    <img
                                        src="/images/Trash.svg"
                                        alt="열 삭제하기"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="host-create-right-4">
                        <button
                            type="button"
                            className="host-create-button"
                            onClick={onButtonClick}
                        >
                            등록
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HostCreateDesktop;
