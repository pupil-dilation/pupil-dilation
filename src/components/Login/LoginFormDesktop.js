import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../features/user/api/firebase_auth';
import { stageUser } from '../../features/user/slices/userSlice';
import './LoginFormDesktop.css';
import Popup from '../Popup/Popup';

function LoginFormDesktop() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [account, setAccount] = useState({
        id: '',
        password: '',
    });

    const [popup, setPopup] = useState({
        open: false,
        message: '',
        callback: false,
    });

    const onChangeAccount = (e) => {
        setAccount({
            ...account,
            [e.target.name]: e.target.value,
        });
    };

    const onButtonClick = async () => {
        await loginUser(account.id, account.password).then((res) => {
            if (res) {
                dispatch(
                    stageUser({
                        user: res.user,
                        userCredential: res.userCredential,
                        isHost: res.isHost,
                    }),
                );
                console.log(res);
                if (res) {
                    switch (res) {
                        case 1:
                            setPopup({
                                open: true,
                                message: '존재하지 않는 id입니다.',
                            });
                            return;
                        case 2:
                            setPopup({
                                open: true,
                                message: '이메일이 존재하지 않습니다.',
                            });
                            return;
                        case 3:
                            setPopup({
                                open: true,
                                message: '비밀번호가 일치하지 않습니다.',
                            });
                            return;
                        case 4:
                            setPopup({
                                open: true,
                                message: '이미 사용 중인 이메일입니다.',
                            });
                            return;
                        case 5:
                            setPopup({
                                open: true,
                                message: '비밀번호는 6글자 이상이어야 합니다.',
                            });
                            return;
                        case 6:
                            setPopup({
                                open: true,
                                message: '네트워크 연결에 실패하였습니다.',
                            });
                            return;
                        case 7:
                            setPopup({
                                open: true,
                                message: '잘못된 이메일 형식입니다.',
                            });
                            return;
                        case 8:
                            setPopup({
                                open: true,
                                message: '잘못된 요청입니다.',
                            });
                            return;
                        case 9:
                            setPopup({
                                open: true,
                                message: '알 수 없는 오류로 실패했습니다.',
                            });
                            return;
                        default:
                            if (res.user.userType == 0) navigate('/');
                            else if (res.user.userType == 1) navigate('/host');
                    }
                }
            }
        });
    };

    return (
        <div className="right-page-desktop">
            <Popup
                open={popup.open}
                setPopup={setPopup}
                message={popup.message}
                title={popup.title}
                callback={popup.callback}
            />
            <div className="right-high-desktop">
                <div className="login-text1-desktop">로그인</div>
                <Link className="sign-up1-desktop" to="/login/signup">
                    <div className="sign-up-text1-desktop"> 회원가입</div>
                </Link>
            </div>
            <input
                type="text"
                className="id1-desktop"
                id="id"
                name="id"
                placeholder="아이디"
                onChange={onChangeAccount}
            />
            <input
                type="password"
                className="password1-desktop"
                id="password"
                name="password"
                placeholder="비밀번호"
                onChange={onChangeAccount}
            />
            <div className="checker-desktop">
                <input className="id-check-desktop" type="checkbox" />
                <div className="save-id-desktop">아이디 저장</div>
            </div>
            <button
                className="login1-desktop"
                type="button"
                onClick={onButtonClick}
            >
                <div className="login-text2-desktop">로그인</div>
            </button>
        </div>
    );
}

export default LoginFormDesktop;
