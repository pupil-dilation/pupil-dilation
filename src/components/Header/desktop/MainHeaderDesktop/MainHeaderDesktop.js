import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './MainHeaderDesktop.css';
import { restoreUser } from '../../../../features/user/slices/userSlice';

function MainHeaderDesktop() {
    const isLogged = useSelector((state) => state.user.isLogged);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchInfo, setSearchInfo] = useState({ search: '' });

    const onClickLogout = () => {
        dispatch(restoreUser());
        navigate('/login');
    };

    const onChangeSearch = (e) => {
        setSearchInfo({
            ...searchInfo,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="header">
            <div className="header-red">
                {isLogged ? (
                    <button
                        type="button"
                        onClick={onClickLogout}
                        className="header__auth-logout"
                    >
                        로그아웃
                    </button>
                ) : (
                    <div>
                        <Link to="/login" className="auth">
                            로그인
                        </Link>
                        <Link to="/login/signup" className="auth">
                            회원가입
                        </Link>
                    </div>
                )}
            </div>
            <div className="line">
                <Link to="/">
                    <img
                        className="pupil-dilation"
                        alt="my-header"
                        src="/img/header_img.png"
                    />
                </Link>

                <div className="line-right">
                    <div className="search-input">
                        <input
                            type="text"
                            id="search"
                            name="search"
                            placeholder="&nbsp;공연/동아리 검색"
                            onchange={onChangeSearch}
                        />
                        <img
                            className="search-button"
                            alt="search-button"
                            src="/images/search.png"
                        />
                    </div>
                    <img
                        className="user-button"
                        alt="search-button"
                        src="/images/user.svg"
                    />
                </div>
            </div>
        </div>
    );
}

export default MainHeaderDesktop;
