import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainPage from '../components/Main/MainPage';
import Detail from '../components/Detail/Detail';
import SeatsPage from '../components/Seats/SeatsPage';
import Loading from '../components/Loading';
// import AdminPage from '../components/Admin/AdminPage';
import PaymentPage from '../components/Seats/Pay/PaymentPage';
import ErrorPage from '../components/Error/ErrorPage';
import Terms from '../components/Terms/Terms';

function MainPageRoute() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="detail/:id" element={<Detail />} />
                <Route path="/seats/:id" element={<SeatsPage />} />
                <Route path="/loading" element={<Loading />} />
                {/* <Route path="/admin" element={<AdminPage />} /> */}
                <Route path="/payment/:id" element={<PaymentPage />} />
                <Route path="/termsofuse" element={<Terms />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </div>
    );
}

export default MainPageRoute;
