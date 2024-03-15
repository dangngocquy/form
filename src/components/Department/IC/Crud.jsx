import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CiSearch } from "react-icons/ci";
import { AiOutlineDelete } from 'react-icons/ai';
import { FiEdit3 } from 'react-icons/fi';
import Notification from '../../Notification';
import { API_URL } from '../../../api';
import useStateArray from '../../function/useStateArray';
import Modal from '../../function/Modal';
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

const Crud = ({ phanquyen }) => {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({
        restaurant: '',
        code: '',
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const { successMessage, setSuccessMessage,
        currentPage, setCurrentPage, setShowNotification } = useStateArray();
    const [searchQuery, setSearchQuery] = useState('');
    const {
        openModalid,
        closeModalid,
        showModalid
    } = Modal();

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/chinhanh/all`);
            setData(response.data);
        } catch (error) {
            setSuccessMessage(<Notification type="error" content={`Lỗi: ${error}`} onClose={() => setShowNotification(null)}/>);
        }
    }, [setSuccessMessage, setShowNotification]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditId(null);
        setFormData({
            restaurant: '',
            code: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!formData.restaurant || !formData.code) {
                setSuccessMessage(<Notification type="warning" content="Vui lòng nhập đầy đủ thông tin cửa hàng" onClose={() => setShowNotification(null)}/>);
                return;
            }
            const isDuplicate = data.some(
                item =>
                    (item.restaurant.toLowerCase() === formData.restaurant.toLowerCase() ||
                        item.code.toLowerCase() === formData.code.toLowerCase()) &&
                    item.id !== editId
            );
            if (isDuplicate) {
                setSuccessMessage(<Notification type="warning" content="Tên chi nhánh hoặc mã bị trùng vui lòng kiểm tra lại !" onClose={() => setShowNotification(null)}/>);
                return;
            }
            const isFormChanged = data.some(
                item => item.id === editId &&
                    (item.restaurant !== formData.restaurant || item.code !== formData.code)
            );
            if (!isFormChanged && editMode) {
                setSuccessMessage(<Notification type="warning" content="Không có thay đổi nào để cập nhật" onClose={() => setShowNotification(null)}/>);
                return;
            }
            if (editMode) {
                await axios.put(`${API_URL}/edit/update/${editId}`, formData);
            } else {
                await axios.post(`${API_URL}/chinhanh/add`, formData);
            }

            fetchData();
            setFormData({
                restaurant: '',
                code: '',
            });
            setEditMode(false);
            setEditId(null);
        } catch (error) {
            setSuccessMessage(<Notification type="error" content={`Lỗi: ${error}`} onClose={() => setShowNotification(null)}/>);
        }
    };

    const handleEdit = (id) => {
        setEditMode(true);
        setEditId(id);

        const selectedRecord = data.find(item => item.id === id);
        if (selectedRecord) {
            setFormData({
                restaurant: selectedRecord.restaurant,
                code: selectedRecord.code,
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/delete/${id}`);
            fetchData();
        } catch (error) {
            setSuccessMessage(<Notification type="error" content={`Lỗi: ${error}`} onClose={() => setShowNotification(null)}/>);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredData = data.filter(item =>
        item.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const itemsPerPage = 5;

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
    const reversedData = filteredData.slice().reverse();
    const displayedData = reversedData.slice(startIndex, endIndex);


    return (
        <div className="backgoround-niso-from bg-white dark:bg-slate-900" style={{ maxWidth: '1800px', margin: '15px auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }} className='mobile-column-niso'>
                <h3 className='dark:text-white font-bold'>Quản lý chi nhánh cửa hàng</h3>
                <label className="search-box-niso">
                    <CiSearch size={28} />
                    <input
                        type="text"
                        placeholder="Nhập tên chi nhánh hoặc mã chi nhánh để tìm kiếm..."
                        className="box-search-niso-input text-sm"
                        onChange={handleSearch}
                    />
                </label>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table id="customers" style={{ marginTop: '15px' }} className='text-sm dark:text-white'>
                    <thead>
                        <tr>
                            <th>TT</th>
                            <th>Chi nhánh</th>
                            <th>Mã chi nhánh / Code</th>
                            {phanquyen === true && (<th>Tùy chọn</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {displayedData.length === 0 ? (
                            <tr>
                                <td colSpan="4" className='text-center'>Không tìm thấy chi nhánh nào !</td>
                            </tr>
                        ) : (
                            displayedData.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.restaurant}</td>
                                    <td className='uppercase'>{item.code}</td>
                                    {phanquyen === true && (
                                    <td className='flex gap-3.5'>
                                        <FiEdit3 onClick={() => handleEdit(item.id)} className='iconmenu' size={40} />
                                        <AiOutlineDelete onClick={() => openModalid(item.id)} className='iconmenu' size={40} />
                                    </td>)}
                                    {showModalid && showModalid === item.id && (
                                        <div className="modal">
                                            <div className="modal-content">
                                                <h1 style={{ color: 'red', textAlign: 'center' }} className='font-black text-2xl'>Warning !</h1>
                                                <h3 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }} className='text-sm'>Bạn chắc chắn muốn xóa chi nhánh này?</h3>
                                                <span className='button-box-modal'>
                                                    <button className='text-sm' onClick={() => handleDelete(item.id)}>Xóa</button>
                                                    <button onClick={closeModalid} className='text-sm'>Hủy</button>
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex gap-3.5 items-center" style={{ marginTop: '15px' }}>
                <GrFormPrevious onClick={handlePreviousPage} disabled={currentPage === 1} className='iconmenu' size={40} />
                <span className='text-sm dark:text-white'>{`Page ${currentPage} of ${totalPages}`}</span>
                <GrFormNext onClick={handleNextPage} disabled={currentPage === totalPages} className='iconmenu' size={40} />
            </div>
            {phanquyen === true && (
            <form onSubmit={handleSubmit}>
                <label className='grid-account-admin-niso dark:text-white'>
                    Nhập tên chi nhánh:
                    <input
                        type="text"
                        name="restaurant"
                        placeholder='Nhập tên chi nhánh...'
                        value={formData.restaurant}
                        onChange={handleInputChange}
                        className='question-container-niso-question text-sm text-slate-900'
                    />
                </label>
                <label className='grid-account-admin-niso dark:text-white'>
                    Mã chi nhánh:
                    <input
                        placeholder='Nhập mã chi nhánh...'
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        className='question-container-niso-question text-sm uppercase text-slate-900'
                    />
                    <button type="submit" style={{ marginTop: '10px' }}>{editMode ? 'Cập nhật' : 'Thêm'}</button>
                    {editMode && <button type="button" onClick={handleCancelEdit}>Hủy</button>}
                </label>
            </form>
            )}
            {successMessage}
        </div>
    );
};

export default Crud;
