import React, { useState, useEffect } from 'react';
import { BiShow, BiHide } from "react-icons/bi";
import Background from '../assets/niso.png';

const Login = ({ setUsername, setPassword, handleLogin, username, password, error }) => {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [rememberPassword, setRememberPassword] = useState(false);
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');

        if (rememberPassword && storedUsername && storedPassword) {
            setUsername(storedUsername);
            setPassword(storedPassword);
        }
    }, [rememberPassword, setUsername, setPassword]);

    const handleCheckboxChange = () => {
        setRememberPassword(!rememberPassword);
    };

    const handleFormSubmit = (e) => {
        if (rememberPassword) {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
        } else {
            localStorage.removeItem('username');
            localStorage.removeItem('password');
        }
        handleLogin(e);
    };
    return (
        <div className='center-report-login-niso'>
            <div className='containers'>
                <div className='margin'>
                    <title>Đăng nhập - NISO FORM</title>
                    <form onSubmit={(e) => handleFormSubmit(e)} className='box-sign-in'>
                        <h1 className='color-text'>LOGIN - NISO FORM</h1>
                        <input
                            type="text"
                            placeholder="Tên đăng nhập hoặc địa chỉ email"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); }}
                            name='username'
                            autoComplete="on"
                            className='input1'
                        />
                        <div className='inputs'>
                            <input
                                type={showOldPassword ? 'text' : 'password'}
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); }}
                                name='password'
                                autoComplete="on"
                                className='input-input'
                            />
                            <div onClick={() => setShowOldPassword(!showOldPassword)} role="button" aria-label={showOldPassword ? 'Hide Password' : 'Show Password'}>
                                {showOldPassword ? <BiHide size={50} className='hide-show-niso'/> : <BiShow size={50} className='hide-show-niso'/>}
                            </div>
                        </div>
                        <span className='Niso-checkbox'>
                            <input
                                type='checkbox'
                                checked={rememberPassword}
                                onChange={handleCheckboxChange}
                            />
                            <p>Remember password</p>
                        </span>
                        <button type="submit">Sign in</button>
                    </form>
                    <img src={Background} alt="Ảnh bìa" className='background' />
                </div>
                {error}
            </div>
        </div>
    );
};

export default Login;