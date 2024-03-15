import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../api';
import ChangePassword from '../components/ChangePasswords';
import Notification from '../components/Notification';
import useStateArray from '../components/function/useStateArray';
import Modal from '../components/function/Modal';

const Profile = ({ keys, name, bophan, phanquyen, imgAvatar }) => {
    const userId = keys;
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const { successMessage, setSuccessMessage, setShowNotification,
        oldPassword, setOldPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword, showOldPassword, setShowOldPassword,
        showNewPassword, setShowNewPassword, showConfirmPassword, setShowConfirmPassword, shows, setShows,
    } = useStateArray();
    const {
        openModal, showModal,
        closeModal, openModalbt, showModalbt, closeModalbt,
    } = Modal();

    const handleFileInputChange = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const allowedExtensions = ["png", "jpg", "jpeg", "webp", "gif"];
            const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

            if (allowedExtensions.includes(fileExtension)) {
                setSelectedFile(selectedFile);
                openModal();

                const imageUrl = URL.createObjectURL(selectedFile);
                setUploadedImageUrl(imageUrl);
            } else {
                setSuccessMessage(<Notification type="warning" content="Vui lòng chọn đúng tệp hình ảnh !" onClose={() => setShowNotification(null)} />);
            }
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            if (!oldPassword) {
                setSuccessMessage(<Notification type="warning" content="Vui lòng nhập mật khẩu cũ!" onClose={() => setShowNotification(null)} />);
                return;
            }
            const checkOldPassword = await axios.get(`${API_URL}/users/get/${keys}`);
            if (checkOldPassword.data.password !== oldPassword) {
                setSuccessMessage(<Notification type="warning" content="Mật khẩu cũ không đúng, vui lòng kiểm tra lại!" onClose={() => setShowNotification(null)} />);
                return;
            }
            if (!newPassword) {
                setSuccessMessage(<Notification type="warning" content="Vui lòng nhập mật khẩu mới!" onClose={() => setShowNotification(null)} />);
                return;
            }
            if (!confirmPassword) {
                setSuccessMessage(<Notification type="warning" content="Vui lòng nhập xác nhận mật khẩu mới!" onClose={() => setShowNotification(null)} />);
                return;
            }
            if (newPassword !== confirmPassword) {
                setSuccessMessage(<Notification type="error" content="Mật khẩu bạn vừa nhập không trùng khớp với mật khẩu mới!" onClose={() => setShowNotification(null)} />);
                return;
            }
            if (newPassword.length < 8) {
                setSuccessMessage(
                    <Notification type="error" content="Mật khẩu phải có ít nhất 8 kí tự !" onClose={() => setShowNotification(null)} />
                );
                return;
            }
            const response = await axios.put(`${API_URL}/users/changepassword/${keys}`, {
                password: newPassword,
            });

            console.error(response.data);
            setShows(<Notification type="success" content="Thay đổi mật khẩu thành công!" onClose={() => setShowNotification(null)} />);
            openModalbt();
        } catch (error) {
            console.error(error);
        }
    };

    const uploadAvatar = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('avatar', selectedFile);

            axios.put(`${API_URL}/users/upload/${userId}`, formData)
                .then((response) => {
                    console.info(response.data);
                    setUploadedImageUrl(null);
                    setSuccessMessage(<Notification type="success" content="Cập nhật ảnh đại diện thành công, đăng nhập lại để áp dụng thay đổi !" onClose={() => setShowNotification(null)} />);
                    closeModal();
                })
                .catch((error) => {
                    console.error('Error uploading avatar:', error);
                });
        }
    };

    useEffect(() => {
        axios
            .get(`${API_URL}/users/get/${userId}`)
            .then((response) => {
                console.clear(response.data);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }, [userId]);

    return (
        <div>
            <div className='line-header-niso' style={{ minHeight: '100vh' }}>
                <div className='bg-white backgoround-niso-from dark:bg-slate-900' style={{ maxWidth: '1800px', margin: '0 auto' }}>
                    <title>Niso | Thông tin tài khoản {name}</title>
                    <div className='grid-avatr-niso'>
                        <div className='flex flex-col gap-3 items-center iopp'>
                            {uploadedImageUrl ? (
                                <img src={uploadedImageUrl} alt={name} className='avatar' />
                            ) : (
                                <img src={imgAvatar} alt={name} height={50} width={50} className='avatar' />
                            )}
                            <b className='dark:text-white'>Họ tên: {name}</b>
                            <b className='dark:text-white'>Phòng ban: {bophan}{phanquyen === true && (<span className='bg-red-600 dp'>Quản trị viên cấp cao</span>)}</b>
                            <button onClick={handleFileInputChange}>Cập nhật ảnh đại diện</button>
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            {showModal && (
                                <div className="modal" >
                                    <div className="modal-content">
                                        <h1 style={{ color: 'red', textAlign: 'center' }} className='font-black text-2xl'>Warning !</h1>
                                        <h3 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }} className='text-sm'>Xác nhận thay đổi ảnh đại diện</h3>
                                        <span className='button-box-modal'>
                                            <button onClick={uploadAvatar} className='text-sm'>Xác nhận</button>
                                            <button onClick={closeModal} className='text-sm'>Hủy</button>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <ChangePassword keys={keys}
                            handleChangePassword={handleChangePassword}
                            setShowConfirmPassword={setShowConfirmPassword}
                            setNewPassword={setNewPassword}
                            setConfirmPassword={setConfirmPassword}
                            showOldPassword={showOldPassword} 
                            etShowOldPassword={setShowOldPassword}
                            showNewPassword={showNewPassword}
                            setShowNewPassword={setShowNewPassword}
                            showConfirmPassword={showConfirmPassword}
                            shows={shows}
                            showModalbt={showModalbt}
                            confirmPassword={confirmPassword}
                            closeModalbt={closeModalbt}
                            newPassword={newPassword}
                            setOldPassword={setOldPassword}
                            oldPassword={oldPassword}
                        />
                    </div>
                </div>
            </div>
            {successMessage}
            {shows}
        </div>
    );
};

export default Profile;
