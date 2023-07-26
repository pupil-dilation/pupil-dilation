import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../features/user/api/firebase_auth';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { changePasswordUser } from '../../features/user/slices/userSlice';
import './HostMyPage.css';

function HostMyPage() {
    const [hostInfo, setHostInfo] = useState({
        currentPassword: '',
        newPassword: '',
        checkPassword: '',
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.user);

    const onChangeAccount = (e) => {
        setHostInfo({
            ...hostInfo,
            [e.target.name]: e.target.value,
        });
    };

    const id = userData.id;
    const realPassword = userData.password;
    const email = userData.email;

    const onButtonClick = async () => {
        await changePassword(
            id,
            hostInfo.currentPassword,
            realPassword,
            hostInfo.newPassword,
            hostInfo.checkPassword,
        ).then((e) => {
            if (e == true) {
                dispatch(changePasswordUser(hostInfo.newPassword));
                navigate('/host');
            }
        });
    };

    return (
        <div className="host-mypage-container">
            <div className="host-mypage-text">마이페이지</div>
            <div className="host-mypage-data">
                <div className="host-mypage-account-data">계정 정보</div>
                <div className="host-mypage-data-box">
                    <div className="host-mypage-box-name">CRA</div>
                    <div className="host-mypage-id">
                        <div className="host-mypage-id-text">아이디</div>
                        <div className="host-mypage-id-data">{id}</div>
                    </div>
                    <div className="host-mypage-pw">
                        <div className="host-mypage-pw-text">비밀번호</div>
                        <div className="host-mypage-pw-inputs">
                            <input
                                type="password"
                                className="host-mypage-pw-input"
                                name="currentPassword"
                                placeholder="&nbsp;현재 비밀번호"
                                onChange={onChangeAccount}
                            ></input>
                            <input
                                type="password"
                                className="host-mypage-pw-input"
                                name="newPassword"
                                placeholder="&nbsp;새 비밀번호"
                                onChange={onChangeAccount}
                            ></input>
                            <input
                                type="password"
                                className="host-mypage-pw-input"
                                name="checkPassword"
                                placeholder="&nbsp;비밀번호 확인"
                                onChange={onChangeAccount}
                            ></input>
                            <button
                                type="button"
                                className="host-mypage-change-pw-button"
                                onClick={onButtonClick}
                            >
                                비밀번호 변경
                            </button>
                        </div>
                    </div>
                    <div className="host-email">
                        <div className="host-email-text">담당자 이메일</div>
                        <div className="host-email-data">{email}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HostMyPage;