import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './HostHeaderDesktop.css';
import { restoreUser } from '../../../../features/user/slices/userSlice';

function HostHeaderDesktop() {
    const isLogged = useSelector((state) => state.user.isLogged);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onClickLogout = () => {
        dispatch(restoreUser());
        navigate('/login');
    };

    return (
        <div className="host-header">
            <div className="host-header-red">
                {isLogged ? (
                    <button
                        type="button"
                        onClick={onClickLogout}
                        className="host-header__auth-logout"
                    >
                        로그아웃
                    </button>
                ) : (
                    <div>
                        <Link to="/login" className="host-header-auth">
                            로그인
                        </Link>
                        <Link to="/login/signup" className="host-header-auth">
                            회원가입
                        </Link>
                    </div>
                )}
            </div>
            <div className="host-header-line">
                <Link to="/host">
                    <img
                        className="host-header-pupil-dilation"
                        alt="my-header"
                        src="/img/header_img.png"
                    />
                </Link>
                <div className="host-header-line-right">
                    <Link className="test" to="/host/mypage">
                        <img
                            className="host-header-user-button"
                            alt="search-button"
                            src="/images/host-header-mypage.svg"
                        />{' '}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HostHeaderDesktop;
