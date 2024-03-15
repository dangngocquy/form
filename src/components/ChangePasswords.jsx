import React from 'react';
import { BiShow, BiHide } from "react-icons/bi";

const ChangePassword = ({ setShowConfirmPassword, handleLogout, handleChangePassword, setNewPassword,
    setConfirmPassword, showOldPassword, setShowOldPassword, closeModalbt, confirmPassword, newPassword,
        showNewPassword, setShowNewPassword, showConfirmPassword, showModalbt, setOldPassword, oldPassword,
 }) => {
    
    const handleLogoutAfterSuccess = () => {
        closeModalbt();
        handleLogout();
    };

    return (
        <div>
            <div>
                <form onSubmit={handleChangePassword}>
                    <div className='backgoround-niso-from bg-white dark:bg-slate-900'>
                        <h3 className='font-bold dark:text-white'>Thay đổi mật khẩu</h3>

                        <label className='change-pass-niso'>
                            <span className='dark:text-white'>Mật khẩu cũ:</span>
                            <div className='password-input-container'>
                                <input
                                    type={showOldPassword ? 'text' : 'password'}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder='Nhập mật khẩu hiện tại'
                                    className='question-container-niso-question v text-sm'
                                    autoComplete="on"
                                    name="oldPassword"
                                />
                                <div onClick={() => setShowOldPassword(!showOldPassword)}>
                                    {showOldPassword ? <BiHide size={26} className='size-niso-z'/> : <BiShow size={26} className='size-niso-z'/>}
                                </div>
                            </div>
                        </label>


                        <label className='change-pass-niso'>
                            <span className='dark:text-white'>Mật khẩu mới:</span>
                            <div className='password-input-container'>
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder='Nhập mật khẩu mới'
                                    className='question-container-niso-question v text-sm'
                                    autoComplete="on"
                                    name="newPassword"
                                />
                                <div onClick={() => setShowNewPassword(!showNewPassword)}>
                                    {showNewPassword ? <BiHide size={26} className='size-niso-z'/> : <BiShow size={26} className='size-niso-z'/>}
                                </div>
                            </div>
                        </label>


                        <label className='change-pass-niso'>
                            <span className='dark:text-white'>Xác nhận mật khẩu mới:</span>
                            <div className='password-input-container'>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder='Nhập mật khẩu mới'
                                    className='question-container-niso-question v text-sm'
                                    autoComplete="on"
                                    name="confirmPassword"
                                />
                                <div onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <BiHide size={26} className='size-niso-z'/> : <BiShow size={26} className='size-niso-z'/>}
                                </div>
                            </div>
                        </label>
                        <div style={{ marginTop: '15px', display: 'flex' }}>
                            <button type="submit" style={{ width: '100%' }} className='text-sm'>Thay đổi mật khẩu</button>
                        </div>
                        {showModalbt && (
                            <div className="modal">
                                <div className="modal-content">
                                    <h1 style={{ color: 'red', textAlign: 'center' }} className='font-black text-2xl'>Warning !</h1>
                                    <h3 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }} className='text-sm'>Thay đổi mật khẩu thành công bạn có muốn tiếp tục đăng nhập</h3>
                                    <span className='button-box-modal'>
                                        <button onClick={closeModalbt} className='text-sm'>Giữ trạng thái đăng nhập</button>
                                        <button onClick={handleLogoutAfterSuccess} className='text-sm'>Đăng xuất</button>
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;