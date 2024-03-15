import React, { useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../../api';
import Notification from '../Notification';
import useStateArray from '../function/useStateArray';
import Modal from '../function/Modal';
import { CiSearch } from 'react-icons/ci';
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import avt from '../../assets/avartar.webp'

const Account = () => {
    const {
        openModal,
        closeModal,
        showModal,
    } = Modal();

    const {
        admins, searchQuery, setSearchQuery,
        setAdmins, filteredUsers, setFilteredUsers,
        selectedAdminId, currentPage, setCurrentPage,
        setSelectedAdminId, setShowNotification,
        formStatus,
        setFormStatus,
        errorMessage,
        setErrorMessage,
        successMessage,
        setSuccessMessage,
        initialFormData,
        setInitialFormData,
        setUsers,
        departments,
        setDepartments,
        formData,
        setFormData
    } = useStateArray();


    const fetchAdmins = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/users/all`);
            const { docs } = response.data;
            setAdmins(docs);
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    }, [setAdmins]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/users/all`);
                const { docs, docsUser } = response.data;
                setUsers(docs);
                setDepartments(docsUser);

                const filtered = docs.filter(
                    (user) =>
                        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.username.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setFilteredUsers(filtered);

                fetchAdmins();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [setUsers, setDepartments, fetchAdmins, searchQuery, setFilteredUsers]);

    const handleAdminSelection = (adminId) => {
        setSelectedAdminId(adminId);
        fetchAdminDetails(adminId);
    };

    const fetchAdminDetails = async (adminId) => {
        try {
            const response = await axios.get(`${API_URL}/users/get/${adminId}`);
            const adminData = response.data;
            setFormData({
                name: adminData.name,
                phanquyen: adminData.phanquyen,
                bophan: adminData.bophan,
                username: adminData.username,
                password: adminData.password,
            });
            setInitialFormData({
                name: adminData.name,
                bophan: adminData.bophan,
                phanquyen: adminData.phanquyen,
                username: adminData.username,
                password: adminData.password,
            });
            setFormStatus('edit');
        } catch (error) {
            console.error('Error fetching admin details:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, checked } = e.target;
        const inputValue = e.target.type === 'checkbox' ? checked : e.target.value;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: inputValue }));
    };

    const handleAddAdmin = async () => {
        if (!formData.name || !formData.bophan || !formData.username || !formData.password) {
            setErrorMessage(<Notification type="warning" content='Bạn chưa nhập đầy đủ thông tin !' onClose={() => setShowNotification(null)}/>);
            return;
        }

        const existingAdmin = admins.find(admin => admin.username === formData.username);
        if (existingAdmin) {
            setErrorMessage(<Notification type="error" content='Tên người dùng hoặc tài khoản đã tồn tại trên hệ thống !' onClose={() => setShowNotification(null)}/>);
            return;
        }

        try {
            const requestData = {
                name: formData.name,
                bophan: formData.bophan,
                username: formData.username,
                password: formData.password,
                phanquyen: formData.phanquyen ? 1 : 0,
            };

            await axios.post(`${API_URL}/users/add`, requestData);
            setFormData({ name: '', bophan: '', phanquyen: '', username: '', password: '' });
            setErrorMessage('');
            setSuccessMessage(<Notification type="success" content='Thêm tài khoản thành công !' onClose={() => setShowNotification(null)}/>);
            fetchAdmins();
            window.location.reload();
        } catch (error) {
            console.error('Error adding admin:', error);
        }
    };

    const handleUpdateAdmin = async () => {
        if (
            formData.name === initialFormData.name &&
            formData.bophan === initialFormData.bophan &&
            formData.phanquyen === initialFormData.phanquyen &&
            formData.username === initialFormData.username &&
            formData.password === initialFormData.password
        ) {
            setErrorMessage(<Notification type="warning" content='Thông tin tài khoản không thay đổi, không thể cập nhật !' onClose={() => setShowNotification(null)}/>);
            return;
        }

        if (!formData.name || !formData.bophan || !formData.username || !formData.password) {
            setErrorMessage(<Notification type="warning" content='Bạn chưa nhập đầy đủ thông tin !' onClose={() => setShowNotification(null)}/>);
            return;
        }

        const existingAdmin = admins.find(
            (admin) => admin.username === formData.username && admin.keys !== selectedAdminId
        );
        if (existingAdmin) {
            setErrorMessage(
                <Notification type="error" content='Tên người dùng hoặc tài khoản đã tồn tại trên hệ thống !' onClose={() => setShowNotification(null)}/>
            );
            return;
        }

        try {
            await axios.put(`${API_URL}/users/update/${selectedAdminId}`, {
                ...formData,
                phanquyen: formData.phanquyen ? 1 : 0,
            });

            setSelectedAdminId(null);
            setFormData({ name: '', bophan: '', phanquyen: false, username: '', password: '' });
            setFormStatus('add');
            setErrorMessage('');
            setSuccessMessage(<Notification type="success" content='Cập nhật thành công !' onClose={() => setShowNotification(null)}/>);
            fetchAdmins();
            window.location.reload();
        } catch (error) {
            console.error('Error updating admin:', error);
        }
    };


    const handleDeleteAdmin = async () => {
        try {
            await axios.delete(`${API_URL}/users/delete/${selectedAdminId}`);
            setSelectedAdminId(null);
            setFormData({ name: '', bophan: '', phanquyen: '', username: '', password: '' });
            setFormStatus('add');
            setErrorMessage('');
            setSuccessMessage(<Notification type="success" content='Xóa tài khoản thành công !' onClose={() => setShowNotification(null)}/>);
            closeModal();
            fetchAdmins();
            window.location.reload();
        } catch (error) {
            console.error('Error deleting admin:', error);
        }
    };

    const handleCancel = () => {
        setFormData({ name: '', bophan: '', phanquyen: '', username: '', password: '' });
        setSelectedAdminId(null);
        setFormStatus('add');
        setErrorMessage('');
        setSuccessMessage('');
    };

    const generateRandomPassword = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%zxcvbnmasdfghjklqwertyuiop';
        let newPassword = '';
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            newPassword += characters.charAt(randomIndex);
        }
        setFormData({ ...formData, password: newPassword });
    };

    const itemsPerPage = 5;

    const totalPages = filteredUsers ? Math.ceil(filteredUsers.length / itemsPerPage) : 0;

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const reversedData = filteredUsers.slice().reverse();
    const displayedData = reversedData.slice(startIndex, endIndex);

    return (
        <div className='backgoround-niso-from bg-white dark:bg-slate-900' style={{ maxWidth: '1800px', margin: '15px auto' }}>
            <title>Niso - Quản lý nội bộ</title>
            {errorMessage}
            {successMessage}

            <div className='grid1-niso'>
                <span>
                    <span style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }} className='flexmobile-niso'>
                        <h3 className="dark:text-white font-bold">
                            Cài đặt tài khoản
                        </h3>
                        <label className="search-box-niso">
                            <CiSearch size={28} />
                            <input
                                type="text"
                                placeholder="Nhập họ tên hoặc tài khoản..."
                                className="box-search-niso-input text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </label>
                    </span>
                    <div style={{ overflowX: 'auto' }}>
                        <table id="customers" className='flex-table-niso-1'>
                            <thead>
                                <tr className='dark:text-white'>
                                    <th>STT</th>
                                    <th>Avatar</th>
                                    <th>Họ tên</th>
                                    <th>Bộ phận</th>
                                    <th>Loại tài khoản</th>
                                    <th>Tài khoản</th>
                                    <th>Mật khẩu</th>
                                </tr>
                            </thead>
                            {displayedData.length === 0 ? (
                                <tbody className='dark:text-white'>
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            Không có người dùng nào được tìm thấy !
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody className='dark:text-white'>
                                    {displayedData.map((admin, index) => (
                                        <tr key={admin.keys} onClick={() => handleAdminSelection(admin.keys)} className='dark:text-white'>
                                            <td>{index + 1}</td>
                                            <td>
                                                {admin.imgAvatar ? (
                                                    <img src={admin.imgAvatar.replace('..\\public', '').replace(/\\/g, '/') || 'avt'} alt={admin.name} className='avatar-admin-niso'/>
                                                ) : (
                                                    <img src={avt} alt={admin.name} className='avatar-admin-niso'/>
                                                )}
                                            </td>
                                            <td>{admin.name}</td>
                                            <td className='uppercase'>{admin.bophan}</td>
                                            <td>
                                                {admin.phanquyen ? (
                                                    <p className="text-center rounded-md font-bold" style={{ color: '#d9534f', border: '1px solid #d9534f', padding: '5px' }}>Admin</p>
                                                ) : (
                                                    <p className="text-center rounded-md font-bold" style={{ color: '#32a846', border: '1px solid #32a846', padding: '5px' }}>User</p>
                                                )}
                                            </td>
                                            <td>{admin.username}</td>
                                            <td>{admin.password}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            )}
                        </table>
                    </div>
                    <div className="flex gap-3.5 items-center" style={{ marginTop: '15px' }}>
                        <GrFormPrevious onClick={handlePreviousPage} disabled={currentPage === 1} className='iconmenu' size={40} />
                        <span className='text-sm dark:text-white'>{`Page ${currentPage} of ${totalPages}`}</span>
                        <GrFormNext onClick={handleNextPage} disabled={currentPage === totalPages} className='iconmenu' size={40} />
                    </div>
                </span>

                <div className='flex-table-niso-2'>
                    <form className='box-niso-row'>
                        <h3 className='dark:text-white font-bold b'>Thông tin tài khoản</h3>
                        <span className='grid-account-admin-nisow'>
                            <label className='dark:text-white'>Họ tên</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className='question-container-niso-question' placeholder='Nhập họ tên' />
                        </span>
                        <span className='grid-account-admin-niso'>
                            <label className='dark:text-white'>Bộ phận:</label>
                            <select value={formData.bophan} onChange={handleInputChange} name="bophan" className="text-sm select-option-niso uppercase">
                                <option>Vui lòng chọn bộ phận</option>
                                {departments.slice().reverse().map(department => (
                                    <option value={department.bophan} key={department.keys}>{department.bophan}</option>
                                ))}
                            </select>
                        </span>

                        <span className='grid-account-admin-niso'>
                            <label className='dark:text-white'>Tài khoản</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className='question-container-niso-question'
                                placeholder='Nhập tài khoản'
                            />
                        </span>

                        <span className='grid-account-admin-niso'>
                            <label className='dark:text-white'>Mật khẩu</label>
                            <span className='create-niso-pass'>
                                <input
                                    type="text"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className='question-container-niso-question'
                                    placeholder='Nhập mật khẩu'
                                />
                                <button type="button" onClick={generateRandomPassword} style={{ marginTop: '10px' }}>
                                    Tạo mật khẩu ngẫu nhiên
                                </button>
                            </span>
                        </span>
                    </form>
                    <span style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }} className='dark:text-white'><label>Phân quyền <i style={{ fontSize: '8pt' }}>(on = Admin, off = User)</i></label></span>
                    <span className='grid-account-admin-niso'>
                        <label className="switch-niso">
                            <input
                                type="checkbox"
                                className='niso-input'
                                name="phanquyen"
                                checked={formData.phanquyen}
                                onChange={handleInputChange}
                            />
                            <span className="slider-niso round-niso"></span>
                        </label>
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }} className='nullflex-moble'>
                        <span className='grid-account-admin-niso1 text-sm'>
                            {formStatus === 'add' ? (
                                <button type="button" onClick={handleAddAdmin}>
                                    Thêm
                                </button>
                            ) : (
                                <>
                                    <button type="button" onClick={handleUpdateAdmin}>
                                        Cập nhật
                                    </button>
                                    <button type="button" onClick={openModal}>
                                        Xóa
                                    </button>
                                </>
                            )}

                            {formStatus === 'edit' && (
                                <button type="button" onClick={handleCancel}>
                                    Hủy
                                </button>
                            )}
                        </span>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h1 style={{ color: 'red', textAlign: 'center' }} className='font-black text-2xl'>Warning !</h1>
                        <h3 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }} className='text-sm'>Bạn chắc chắn muốn xóa tài khoản này?</h3>
                        <span className='button-box-modal'>
                            <button onClick={handleDeleteAdmin} className="text-sm">Xóa</button>
                            <button onClick={closeModal} className="text-sm">Hủy</button>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Account;