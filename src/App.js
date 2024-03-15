import React, { lazy, Suspense, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useStateArray from './components/function/useStateArray';
import axios from 'axios';
import { API_URL } from './api';
import Notification from './components/Notification';
import Header from './header/Header';
import Loading from './components/Loading';
import './App.css';
import avt from './assets/avartar.webp'

const Login = lazy(() => import('./components/Login'));
const Home = lazy(() => import('./components/Home'));
const Create = lazy(() => import('./components/dashboard/Create'));
const Phanquyen = lazy(() => import('./components/dashboard/Phanquyen'));
const Department = lazy(() => import('./components/dashboard/Department'));
const ListDocs = lazy(() => import('./components/ListDocs'));
const ListEdits = lazy(() => import('./components/ListEdits'));
const ViewDocs = lazy(() => import('./components/ViewDocs'));
const Docs = lazy(() => import('./components/Docs'));
const Notfound = lazy(() => import('./components/Notfound'));
const Edit = lazy(() => import('./components/dashboard/Edit'));
const Profile = lazy(() => import('./header/Profile'));
const ReportViewer = lazy(() => import('./components/dashboard/ReportViewer'));

const ProtectedRoute = ({ element, isLoggedIn, redirectTo }) => {
  const getRedirectPath = () => {
    if (isLoggedIn) {
      return '/auth/docs/home';
    } else {
      return redirectTo || '/login';
    }
  };

  return isLoggedIn ? element : (
    <>
      <Notification type='warning' content="Vui lòng đăng nhập để tiếp tục." />
      <Navigate to={getRedirectPath()} />
    </>
  );
};

const App = () => {
  const {
    bophan,
    setTableAData, setAvatar,
    tableAData, logoutTimer, setLogoutTimer,
    setBophan, setShowNotification,
    imgAvatar,
    username,
    setUsername,
    phanquyen,
    setPhanquyen,
    password,
    setPassword,
    name,
    setName,
    keys,
    setID,
    isLoggedIn,
    setLoggedIn,
    error,
    setError,
  } = useStateArray();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/tablea/all`);
        setTableAData(response.data.data);
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };
    fetchData();
  }, [setTableAData]);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('username', username);
      localStorage.setItem('name', name);
      localStorage.setItem('keys', keys);
      localStorage.setItem('bophan', bophan);
      localStorage.setItem('phanquyen', phanquyen);
      localStorage.setItem('imgAvatar', imgAvatar);
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('name');
      localStorage.removeItem('keys');
      localStorage.removeItem('bophan');
      localStorage.removeItem('phanquyen');
      localStorage.removeItem('imgAvatar');
    }
  }, [isLoggedIn, username, name, imgAvatar, keys, bophan, phanquyen]);

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedLoggedIn === 'true') {
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError(<Notification type='warning' content="Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu !" onClose={() => setShowNotification(null)} />);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      const user = response.data;
      setName(user.name);
      setID(user.keys);
      setBophan(user.bophan);
      setPhanquyen(user.phanquyen);
      setAvatar(user.imgAvatar);
      setLoggedIn(true);
      setError('');
      setError(<Notification type='success' content="Đăng xuất thành công!" onClose={() => setShowNotification(null)} />);
    } catch (error) {
      console.error(error);
      if (error.response) {
        if (error.response.status === 401) {
          setUsername('');
          setPassword('');
          setError(<Notification type='error' content="Tên đăng nhập hoặc mật khẩu không chính xác!" onClose={() => setShowNotification(null)} />);
        } else {
          setError(<Notification type='error' content="Đăng nhập thất bại. Vui lòng thử lại sau!" onClose={() => setShowNotification(null)} />);
        }
      } else {
        setError(<Notification type='error' content="Đã xảy ra lỗi. Vui lòng thử lại sau!" onClose={() => setShowNotification(null)} />);
      }

    }

    if (isLoggedIn) {
      localStorage.setItem('isLoggedIn', 'true');
    }
  };

  const handleLogout = useCallback(() => {
    setUsername('');
    setPassword('');
    setPhanquyen('');
    setName('');
    setID('');
    setAvatar('');
    setBophan('');
    setLoggedIn(false);
    window.location.href = '/login';
    localStorage.removeItem('isLoggedIn');
  }, [setUsername, setPassword, setPhanquyen, setName, setID, setBophan, setLoggedIn, setAvatar]);

  const AUTO_LOGOUT_TIME = 300 * 60 * 1000; // Trong 5 tiếng không thao tác sẽ logout
  const AUTO_LOGOUT_TIME_DAY = 24 * 60 * 60 * 1000; //Từ khi login sau 24h tự động logout

  useEffect(() => {
    let timerId;

    const resetLogoutTimer = () => {
      if (isLoggedIn && logoutTimer) {
        clearTimeout(logoutTimer);
      }
      if (isLoggedIn) {
        timerId = setTimeout(() => {
          handleLogout();
        }, AUTO_LOGOUT_TIME);
      }
    };
    resetLogoutTimer();

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [isLoggedIn, handleLogout, setLogoutTimer, AUTO_LOGOUT_TIME, logoutTimer]);

  useEffect(() => {
    let timerId;
    const resetLogoutTimer = () => {
      if (isLoggedIn && logoutTimer) {
        clearTimeout(logoutTimer);
      }
      if (isLoggedIn) {
        timerId = setTimeout(() => {
          handleLogout();
        }, AUTO_LOGOUT_TIME_DAY);
      }
    };
    const handleUserActivity = () => {
      resetLogoutTimer();
    };
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    resetLogoutTimer();
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [isLoggedIn, handleLogout, setLogoutTimer, AUTO_LOGOUT_TIME_DAY, logoutTimer]);


  useEffect(() => {
    localStorage.setItem('phanquyen', phanquyen);
  }, [phanquyen]);

  let imagePath;

  if (imgAvatar) {
    imagePath = imgAvatar.replace('..\\public', '').replace(/\\/g, '/');
  } else {
    imagePath = avt;
  }

  return (
    <Router className='font-serif'>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/login' element={isLoggedIn ? (<Navigate to='/auth/docs/home' />) : (
            <Login
              setUsername={setUsername}
              setPassword={setPassword}
              handleLogin={handleLogin}
              username={username}
              password={password}
              setError={setError}
              bophan={bophan}
              imgAvatar={imagePath}
              error={error} />
          )} />

          <Route
            path='/'
            element={
              <Header
                name={name}
                handleLogout={handleLogout}
                phanquyen={phanquyen}
                bophan={bophan}
                tableAData={tableAData}
                keys={keys}
                imgAvatar={imagePath}
              />
            }>

            <Route path={`/auth/docs/views/:id`} element={<ProtectedRoute
              element={<Docs phanquyen={phanquyen} bophan={bophan} name={name} tableAData={tableAData} />}
              isLoggedIn={isLoggedIn}
              redirectTo='/login'
            />} />

            <Route path={`/auth/docs/edit/:id`} element={<ProtectedRoute
              element={<Edit phanquyen={phanquyen} bophan={bophan} name={name} />}
              isLoggedIn={isLoggedIn}
              redirectTo='/login'
            />} />

            <Route path='/auth/docs/home' element={<ProtectedRoute
              element={<Home phanquyen={phanquyen} bophan={bophan} tableAData={tableAData} />}
              isLoggedIn={isLoggedIn}
              redirectTo='/login'
            />} />

            <Route path='/auth/docs/views/report/:keys' element={<ProtectedRoute
              element={<ReportViewer phanquyen={phanquyen} bophan={bophan} tableAData={tableAData} />}
              isLoggedIn={isLoggedIn}
              redirectTo='/login'
            />} />

            <Route path={`/auth/docs/profile/:keys`} element={<ProtectedRoute
              element={<Profile phanquyen={phanquyen} bophan={bophan} tableAData={tableAData} keys={keys} name={name} imgAvatar={imagePath} />}
              isLoggedIn={isLoggedIn}
              redirectTo='/login'
            />} />

            {(phanquyen === true || (bophan && tableAData.some(item => item.bophan === bophan && item.tinhtrangAD === true))) && (
              <Route
                path={`/auth/docs/new/create`}
                element={
                  <ProtectedRoute
                    element={<Create phanquyen={phanquyen} tableAData={tableAData} bophan={bophan} name={name} />}
                    isLoggedIn={isLoggedIn}
                    redirectTo='/login'
                  />
                }
              />
            )}

            <Route path={`/auth/docs/feedback-statistics`} element={<ProtectedRoute
              element={<ListDocs phanquyen={phanquyen} tableAData={tableAData} bophan={bophan} />}
              isLoggedIn={isLoggedIn}
              redirectTo='/login'
            />} />


            <Route path={`/auth/docs/views/statistical/:keys/`} element={<ProtectedRoute
              element={<ViewDocs />}
              isLoggedIn={isLoggedIn}
              redirectTo='/login'
            />} />

            <Route path={`/auth/docs/survey-management`} element={<ProtectedRoute
              element={<ListEdits bophan={bophan} tableAData={tableAData} phanquyen={phanquyen} />}
              isLoggedIn={isLoggedIn}
              redirectTo='/login'
            />} />

            <Route path={`/auth/docs/permission-settings`} element={<ProtectedRoute
              element={<Phanquyen bophan={bophan} phanquyen={phanquyen} />}
              isLoggedIn={isLoggedIn}
              redirectTo='/login'
            />} />

            {phanquyen === true && (
              <Route path={`/auth/docs/internal-management`} element={<ProtectedRoute
                element={<Department />}
                isLoggedIn={isLoggedIn}
                redirectTo='/login'
              />} />
            )}

            <Route path='/' element={<ProtectedRoute
              element={<Navigate to={isLoggedIn ? '/auth/docs/home' : '/login'} />}
              isLoggedIn={isLoggedIn}
              redirectTo='/login'
            />} />

            <Route path='*' element={<ProtectedRoute
              element={<Notfound />}
              isLoggedIn={isLoggedIn}
              redirectTo='/login'
            />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
