import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiEdit3 } from 'react-icons/fi';
import { GrView } from 'react-icons/gr';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoMdCopy } from 'react-icons/io';
import Modal from './function/Modal';
import { API_URL, URLS } from '../api';
import Notification from '../components/Notification';
import { CiSearch } from 'react-icons/ci';
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import Crud from './Department/IC/Crud';
import useStateArray from './function/useStateArray';

const ListEdits = ({ bophan, phanquyen, tableAData }) => {
    const { currentPage, setCurrentPage, docs, searchInput, copySuccess, setSearchInput, setCopySuccess,
        setDocs, deletingDocId, setDeletingDocId, contentData, setContentData, setShowNotification } = useStateArray();

    const {
        openModal,
        closeModal,
        showModal,
    } = Modal();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/content/all`);
                setContentData(response.data.data);
            } catch (error) {
                setCopySuccess(<Notification type="error" content={`Lỗi: ${error}`} onClose={() => setShowNotification(null)}/>);
            }
        };
        fetchData();
    }, [setContentData, setCopySuccess, setShowNotification]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/docs/all`);
                setDocs(response.data);
            } catch (error) {
                setCopySuccess(<Notification type="error" content={`Lỗi: ${error}`} onClose={() => setShowNotification(null)}/>);
            }
        };

        fetchData();
    }, [setDocs, setCopySuccess, setShowNotification]);

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${API_URL}/docs/delete/${deletingDocId}`);
            setDocs(docs.filter(doc => doc.id !== deletingDocId));
            setCopySuccess(<Notification type="success" content="Xóa Form thành công !" onClose={() => setShowNotification(null)}/>)
            closeModal();
        } catch (error) {
            setCopySuccess(<Notification type="error" content={`Lỗi: ${error}`} onClose={() => setShowNotification(null)}/>);
            closeModal();
        }
    };

    const handleDeleteClick = (docId) => {
        setDeletingDocId(docId);
        openModal();
    };

    const handleCopyClick = (text) => {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);

            textArea.select();
            document.execCommand('copy');

            document.body.removeChild(textArea);

            setCopySuccess(
                <Notification type="success" content="Sao chép liên kết thành công !" onClose={() => setShowNotification(null)} />
            );
        } catch (error) {
            setCopySuccess(<Notification type="error" content={`Lỗi: ${error}`} />);
            setCopySuccess(
                <Notification type="error" content="Sao chép liên kết thất bại !" onClose={() => setShowNotification(null)}/>
            );
        }
    };

    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    let visibleIndex = 0;

    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const reversedData = docs.slice().reverse();

    let displayedData;
    if (phanquyen === true) {
        displayedData = reversedData;
    } else if (bophan) {
        displayedData = reversedData.filter((item) => item.bophanAD === bophan);
    } else {
        displayedData = [];
    }

    const filteredData = displayedData.slice(startIndex, endIndex).filter((doc) =>
        doc.title.toLowerCase().includes(searchInput.toLowerCase())
    );

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        const maxPageIndex = Math.ceil(displayedData.length / itemsPerPage);
        if (currentPage < maxPageIndex) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };
    const countUniqueMatchingKeys = (array, title) => {
        const uniqueKeys = new Set();
        array.forEach((item) => {
            if (item.ten_phieu === title) {
                uniqueKeys.add(item.keys);
            }
        });
        return uniqueKeys.size;
    };
    return (
        <div className='line-header-niso' style={{ minHeight: '100vh' }} >
            <title>Niso - Quản lý Form</title>
            <div className="backgoround-niso-from bg-white dark:bg-slate-900" style={{ maxWidth: '1800px', margin: '0 auto' }}>
                <span className='mb-flex-niso-px'>
                    <h3 className='dark:text-white font-bold'>Quản lý Form</h3>
                    <label className="search-box-niso">
                        <CiSearch size={28} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm Form..."
                            className="box-search-niso-input text-sm"
                            value={searchInput}
                            onChange={handleSearchInputChange}
                        />
                    </label>
                </span>
                {filteredData.length === 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table id="customers" style={{ marginTop: '15px', textAlign: 'center' }} className='text-sm dark:text-white'>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    {phanquyen === true && (<th>Người tạo Form</th>)}
                                    {phanquyen === true && (<th>Bộ phận</th>)}
                                    {phanquyen === true && (<th>Người chỉnh sửa</th>)}
                                    {phanquyen === true && (<th>Thời gian chỉnh sửa</th>)}
                                    <th>Tên Form</th>
                                    <th>Ngày tạo Form</th>
                                    <th>Tổng lượt phản hồi</th>
                                    <th>Tùy chọn</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="10" className="text-center">
                                        Không có Form nào được tìm thấy !
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table id="customers" style={{ marginTop: '15px' }} className='text-sm dark:text-white'>
                                <thead className='whitespace-nowrap'>
                                    <tr>
                                        <th>STT</th>
                                        {phanquyen === true && (<th>Người tạo Form</th>)}
                                        {phanquyen === true && (<th>Bộ phận</th>)}
                                        {phanquyen === true && (<th>Người chỉnh sửa</th>)}
                                    {phanquyen === true && (<th>Thời gian chỉnh sửa</th>)}
                                        <th>Tên Form</th>
                                        <th>Ngày tạo Form</th>
                                        <th>Tổng lượt phản hồi</th>
                                        <th>Tùy chọn</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((doc) => (
                                        <tr key={doc.id}>
                                            <td>{++visibleIndex}</td>
                                            {phanquyen === true && (<td>{doc.nguoitaophieu}</td>)}
                                            {phanquyen === true && (<td className='uppercase'>{doc.bophanAD}</td>)}
                                            {phanquyen === true && (
                                                <td className='uppercase'>
                                                    {doc.nguoichinhsua || <p className='text-red-700 font-bold'>Chưa chỉnh sửa</p>}
                                                </td>
                                            )}
                                            {phanquyen === true && (
                                                <td className='uppercase'>
                                                    {doc.ngaychinhsua || <p className='text-red-700 font-bold'>Chưa chỉnh sửa</p>}
                                                </td>
                                            )}
                                            <td className='line-niso-over'>{doc.title}</td>
                                            <td>{doc.date}</td>
                                            <td>{countUniqueMatchingKeys(contentData, doc.title)}</td>
                                            <td className='grid-niso-phieu'>
                                                {(phanquyen === true || (bophan && tableAData.some(item => item.bophan === bophan && item.tinhtrangPass === true))) && (
                                                    <Link to={`/auth/docs/edit/${doc.id}`}>
                                                        <FiEdit3 className='iconmenu' size={40} />
                                                    </Link>
                                                )}
                                                <Link to={`/auth/docs/views/${doc.id}`}>
                                                    <GrView className='iconmenu' size={40} />
                                                </Link>
                                                {(phanquyen === true || (bophan && tableAData.some(item => item.bophan === bophan && item.tinhtrangPass === true))) && (
                                                    <AiOutlineDelete className='iconmenu' size={40} onClick={() => handleDeleteClick(doc.id)} />
                                                )}
                                                <IoMdCopy className='iconmenu' size={40} onClick={() => handleCopyClick(`${URLS}/auth/docs/views/${doc.id}`)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex gap-3.5 items-center" style={{ marginTop: '15px' }}>
                            <GrFormPrevious onClick={handlePreviousPage} disabled={currentPage === 1} className='iconmenu' size={40} />
                            <span className='text-sm dark:text-white'>{`Page ${currentPage} of ${Math.ceil(displayedData.length / itemsPerPage)}`}</span>
                            <GrFormNext onClick={handleNextPage} disabled={endIndex >= filteredData.length} className='iconmenu' size={40} />
                        </div>
                    </>
                )}
            </div>
            {showModal && (
                <div className="modal" >
                    <div className="modal-content">
                        <h1 style={{ color: 'red', textAlign: 'center' }} className='font-black text-2xl'>Warning !</h1>
                        <h3 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }} className='text-sm'>Bạn chắc chắn muốn xóa Form này?</h3>
                        <span className='button-box-modal'>
                            <button onClick={handleConfirmDelete} className='text-sm'>Xóa</button>
                            <button onClick={closeModal} className='text-sm'>Hủy</button>
                        </span>
                    </div>
                </div>
            )}
            {copySuccess}
            {(phanquyen === true || (bophan && tableAData.some(item => item.bophan === bophan && item.chinhanh === true))) && (<Crud phanquyen={phanquyen} />)}
        </div>
    );
}

export default ListEdits;
