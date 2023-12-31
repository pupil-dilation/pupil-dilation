import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import './DetailFooterDesktop.css';
import { getDateScheduleFormat } from '../../../functions/dateFeature';
import useShowById from '../../../hooks/useShowById';
import Popup from '../../Popup/Popup';

function DetailFooterDesktop({ id }) {
    const show = useShowById(id);
    const navigate = useNavigate();
    const isLogged = useSelector((state) => state.user.isLogged);
    const [selectedSchedule, setSelectedSchedule] = useState(1);
    const [popup, setPopup] = useState({
        open: false,
        message: '',
        callback: false,
    });

    const schedule = show.schedule.map((value, i) => (
        <option value={i + 1} className="detail-z-index">
            {i + 1}공 {getDateScheduleFormat(value)}
        </option>
    ));

    const onChangeSchedule = (e) => {
        setSelectedSchedule(e.target.value);
    };

    return (
        <div>
            <div className="detail-footer">
                <Popup
                    open={popup.open}
                    setPopup={setPopup}
                    message={popup.message}
                    title={popup.title}
                    callback={popup.callback}
                />
                <select
                    name="schedule"
                    className="detail-select-schedule"
                    onChange={onChangeSchedule}
                >
                    {schedule}
                </select>
                <button
                    type="button"
                    onClick={() => {
                        if (isLogged)
                            navigate(
                                '/seats/' +
                                    id +
                                    '?' +
                                    'showNum=' +
                                    selectedSchedule,
                            );
                        else {
                            setPopup({
                                open: true,
                                message: '로그인 부탁드립니다.',
                                callback: () => navigate('/login'),
                            });
                        }
                    }}
                    className="detail-ticketing-button"
                >
                    예매하기
                </button>
            </div>
        </div>
    );
}
DetailFooterDesktop.propTypes = {
    id: PropTypes.node.isRequired,
};

export default DetailFooterDesktop;
