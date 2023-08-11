import React, { useState } from 'react';
import {
    createShowSeatsToProgress,
    createShowTicketing,
    getShowSeatsByIdAndShowNumberNotExpired,
    getShowSeatsByIdAndShowNumber,
} from '../../features/show/api/showsDocumentApi';
import './SeatTicketingFrame.css';
import useShowById from '../../hooks/useShowById';
import {
    getDateSeatTickegingFrameDateFormat,
    getDateTimeFormat,
} from '../../functions/dateFeature';
import Popup from '../Popup/Popup';

function SeatTicketingFrame({ id, showNum, selected, completedSeats, user, setIsLoaded }) {
    const show = useShowById(id);
    const [popup, setPopup] = useState({
        open: false,
        message: '',
        callback: false,
    });
    const selectedName = selected.map((e) => (
        <div key={e.index}>
            {e.name}
            {', '}
        </div>
    ));
    return (
        <div className="seat-ticketing-frame">
            <Popup
                open={popup.open}
                setPopup={setPopup}
                message={popup.message}
                title={popup.title}
                callback={popup.callback}
            />
            <img
                className="seat-show-poster"
                src={show.imageDownloaded ? show.image : '/images/Dongari3.jpg'}
            />
            <div className="seat-show-title">{show.title}</div>
            <div className="seat-show-schedule">
                <div>
                    {getDateSeatTickegingFrameDateFormat(
                        show.schedule[showNum - 1],
                    )}
                </div>
                <div>{getDateTimeFormat(show.schedule[showNum - 1])}</div>
            </div>
            <div className="seat-num-people-title">관람인원 선택</div>
            <div className="seat-num-people">
                <div className="seat-plus-minus">-</div>
                <div className="seat-number">1</div>
                <div className="seat-plus-minus">+</div>
            </div>
            <div className="seat-final-check">
                <div className="seat-final-check-content">
                    <div className="seat-final-check-title-text">선택좌석</div>
                    <div className="seat-final-check-content-text seat-final-check-content-selected-name">
                        {selectedName}
                    </div>
                </div>
                <div className="seat-final-check-content">
                    <div className="seat-final-check-title-text">
                        최종결제금액
                    </div>
                    <div className="seat-final-check-content-text">
                        {show.price * selected.length}원
                    </div>
                </div>
            </div>
            <button
                type="button"
                className="seat-ticketing-submit"
                onClick={async () => {
                    setIsLoaded(false);
                    const res = await getShowSeatsByIdAndShowNumberNotExpired(
                        id,
                        showNum,
                    );
                    let flag = false;
                    selected.forEach((e) => {
                        if (
                            res.findIndex((resE) => {
                                return e.index === resE.data().index;
                            }) > -1
                        ) {
                            flag = true;
                        }
                    });
                    console.log(res);
                    if (!flag) {
                        await createShowTicketing(
                            id,
                            showNum,
                            selected,
                            user.id,
                            user.name,
                        ).then(async (ticketingId) => {
                            await createShowSeatsToProgress(
                                id,
                                showNum,
                                selected,
                                user.id,
                            )
                                .then(() =>
                                    setPopup({
                                        open: true,
                                        message: '성공',
                                    }),
                                )
                                .catch((e) => {
                                    setPopup({
                                        open: true,
                                        message: e,
                                    });
                                });
                        });
                    } else {
                        setPopup({
                            open: true,
                            message:
                                '이미 예매되었거나 예매 진행중인 좌석입니다.',
                        });
                    }
                    setIsLoaded(true);
                }}
            >
                결제하기
            </button>
        </div>
    );
}

export default SeatTicketingFrame;
