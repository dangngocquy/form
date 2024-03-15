import React, { useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../api';
import { CiSearch } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { GrView } from 'react-icons/gr';
// import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { AiOutlineDelete } from 'react-icons/ai';
import Notification from '../components/Notification';
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { CiFilter } from "react-icons/ci";
import FilterDate from '../create/FilterDate';
import useStateArray from './function/useStateArray';
import Modal from './function/Modal';
import Report from './Report';
// import * as XLSX from 'xlsx';

const ListDocs = ({ phanquyen, bophan }) => {
    const { searchTerm, setSearchTerm, startDate, currentPage, setCurrentPage, show, setShow, successMessage, setSuccessMessage, contentData, setContentData, setShowNotification,
        setStartDate, endDate, setEndDate, activeBophan, setActiveBophan, activeTitle, activeName, setActiveTitle, setActiveName, activeChinhanh, setActiveChinhanh } = useStateArray();
    const {
        openModalid,
        closeModalid,
        showModalid,
    } = Modal();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/content/all`);
                setContentData(response.data.data);
            } catch (error) {
                console.error('Có lỗi xảy ra khi lấy dữ liệu:', error);
            }
        };
        fetchData();
    }, [setContentData]);

    const uniqueKeys = new Set();

    const handleDelete = async (keys) => {
        try {
            await axios.delete(`${API_URL}/content/delete/${keys}`);
            closeModalid();
            const updatedContentData = contentData.filter(doc => doc.keys !== keys);
            setContentData(updatedContentData);
            setSuccessMessage(<Notification type="success" content="Xóa phản hồi thành công !" onClose={() => setShowNotification(null)}/>);
            closeModalid();
        } catch (error) {
            console.error('Error deleting document:', error);
            setSuccessMessage(<Notification type="error" content="Không thể xóa !" onClose={() => setShowNotification(null)}/>);
            closeModalid();
        }
    };

    const filteredDocs = contentData.filter((doc) => {
        const docDates = FilterDate(doc.ngay_tao_phieu);
        const docDate = FilterDate(doc.ngay_phan_hoi);

        const isAfterStartDate = !startDate || new Date(docDates) >= new Date(startDate);
        const isBeforeEndDate = !endDate || new Date(docDate) < new Date(`${endDate}T23:59:59`);

        const isTitleMatch = doc.ten_phieu.toLowerCase().includes(searchTerm.toLowerCase());
        const isBophanMatch = !activeBophan || doc.bo_phan === activeBophan;
        const isTitleMatchbox = !activeTitle || doc.ten_phieu === activeTitle;
        const isNameMatch = !activeName || doc.nguoi_tra_loi === activeName;
        const isNameShop = !activeChinhanh || doc.chi_nhanh === activeChinhanh;

        const shouldInclude = isTitleMatch && isAfterStartDate && isBeforeEndDate && isBophanMatch && isNameMatch && isNameShop && isTitleMatchbox;

        const isKeyUnique = !uniqueKeys.has(doc.keys);

        if (isKeyUnique) {
            uniqueKeys.add(doc.keys);
        }

        return shouldInclude && isKeyUnique;
    });


    const itemsPerPage = 5;

    const filteredDocsBasedOnAuthorization = phanquyen
        ? filteredDocs
        : filteredDocs.filter((doc) => doc.bo_phan === bophan);

    const totalPages = filteredDocsBasedOnAuthorization ? Math.ceil(filteredDocsBasedOnAuthorization.length / itemsPerPage) : 0;

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
    const reversedData = filteredDocsBasedOnAuthorization.slice().reverse();
    const displayedData = reversedData.slice(startIndex, endIndex);

    const handleShowHide = () => {
        setShow(!show);
    };

    // const handleDownloadExcel = (doc) => {
    //     if (doc) {
    //         const workbook = XLSX.utils.book_new();

    //         const worksheetData = [
    //             [
    //                 doc.ngay_tao_phieu || '',
    //                 doc.ngay_phan_hoi || '',
    //                 doc.bo_phan || '',
    //                 doc.chi_nhanh || 'NULL',
    //                 doc.ten_phieu || '',
    //                 doc.noi_dung_phieu || '',
    //                 doc.cau_hoi || '',
    //                 doc.cau_tra_loi || '',
    //                 doc.tieudephu || '',
    //                 doc.noidungphu || '',
    //             ]
    //         ];

    //         const truncatedSheetName = doc.ten_phieu.substring(0, 31);

    //         const headerStyle = { font: { bold: true } };
    //         const headerRow = [
    //             'Ngày tạo phiếu',
    //             'Ngày phản hồi',
    //             'Bộ phận',
    //             'Chi nhánh cửa hàng',
    //             'Tên phiếu',
    //             'Nội dung phiếu',
    //             'Câu hỏi',
    //             'Câu trả lời',
    //             'Tiêu đề phụ của câu hỏi',
    //             'Nội dung phụ của câu hỏi',
    //         ];
    //         const headerRowWithStyle = headerRow.map((cell) => ({ v: cell, s: headerStyle }));

    //         const worksheet = XLSX.utils.aoa_to_sheet([headerRowWithStyle, ...worksheetData]);
    //         XLSX.utils.book_append_sheet(workbook, worksheet, truncatedSheetName);
    //         XLSX.writeFile(workbook, `${truncatedSheetName}.xlsx`);
    //     }
    // };
    return (
        <div className='line-header-niso' style={{ minHeight: '100vh' }}>
            <div className='bg-white backgoround-niso-from dark:bg-slate-900' style={{ maxWidth: '1800px', margin: '0 auto' }}>
                <title>Niso - Danh sách phản hồi</title>
                <div style={{ display: 'flex', justifyContent: 'space-between' }} className='mobile-column-niso'>
                    <h3 className='dark:text-white font-bold'>Danh sách Form từ người dùng</h3>
                    <span style={{ display: 'flex', gap: '15px' }}>
                        <CiFilter className='iconmenu' size={40} onClick={handleShowHide} />
                        <label className="search-box-niso">
                            <CiSearch size={28} />
                            <input
                                type="text"
                                placeholder="Nhập tên Form..."
                                className="box-search-niso-input text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </label>
                    </span>
                </div>
                {show && (
                    <div className='box-niso-loc filter-niso' style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
                        <span style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className='font-bold'>Theo Ngày</span>
                            <label className='flex mb-flex-date mt-4'>
                                <label className='xs-bold-name-niso'>
                                    <span className='font-bold text-xs'>Từ ngày</span>
                                    <input type="date" min="2000-01-01" style={{ padding: '10px' }} className='box-search-niso-input date-input-niso text-sm' placeholder='Ngày/tháng/năm' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                </label>
                                <label className='xs-bold-name-niso'>
                                    <span className='font-bold text-xs'>Đến</span>
                                    <input type="date" min="2000-01-01" style={{ padding: '10px' }} className='box-search-niso-input date-input-niso text-sm' placeholder='Ngày/tháng/năm' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                </label>
                            </label>
                        </span>
                        {phanquyen === true && (
                            <>
                                <span className='font-bold'>Theo tên Form</span>
                                <span style={{ display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
                                    <span className='box-niso-search-container' style={{ position: 'relative' }}>
                                        {Array.from(new Set(contentData.map(doc => doc.ten_phieu))).map((ten_phieu, index) => (
                                            <span
                                                className={`box-search-niso text-xs whitespace-nowrap niso-text-rutgon ${activeTitle === ten_phieu ? 'buttonReed font-bold' : 'buttontrans'}`}
                                                onClick={() => setActiveTitle(activeTitle === ten_phieu ? '' : ten_phieu)}
                                                key={index}
                                                style={{ marginTop: '0' }}
                                            >
                                                {ten_phieu}
                                            </span>
                                        ))}
                                    </span>
                                </span>
                            </>
                        )}
                        {phanquyen === true && (
                            <>
                                <span className='font-bold'>Theo bộ phận</span>
                                <span style={{ display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
                                    <span className='box-niso-search-container'>
                                        {Array.from(new Set(contentData.map(doc => doc.bo_phan))).map((bo_phan, index) => (
                                            <span
                                                className={`box-search-niso text-xs whitespace-nowrap ${activeBophan === bo_phan ? 'buttonReed font-bold' : 'buttontrans'}`}
                                                onClick={() => setActiveBophan(activeBophan === bo_phan ? '' : bo_phan)}
                                                key={index}
                                                style={{ marginTop: '0' }}
                                            >
                                                {bo_phan}
                                            </span>
                                        ))}
                                    </span>
                                </span>
                            </>
                        )}
                        {phanquyen === true && (
                            <>
                                <span className='font-bold'>Theo chi nhánh cửa hàng</span>
                                <span style={{ display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
                                    <span className='box-niso-search-container'>
                                        {Array.from(new Set(contentData.map(doc => doc.chi_nhanh)))
                                            .filter(chi_nhanh => chi_nhanh !== '') 
                                            .map((chi_nhanh, index) => (
                                                <span
                                                    className={`box-search-niso text-xs whitespace-nowrap ${activeChinhanh === chi_nhanh ? 'buttonReed font-bold' : 'buttontrans'}`}
                                                    onClick={() => setActiveChinhanh(activeChinhanh === chi_nhanh ? '' : chi_nhanh)}
                                                    key={index}
                                                    style={{ marginTop: '0' }}
                                                >
                                                    {chi_nhanh}
                                                </span>
                                            ))}
                                    </span>
                                </span>
                            </>
                        )}
                        {phanquyen === true && (
                            <>
                                <span className='font-bold'>Theo Người phản hồi</span>
                                <span style={{ display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
                                    <span className='box-niso-search-container'>
                                        {Array.from(new Set(contentData.map(doc => doc.nguoi_tra_loi))).map((nguoi_tra_loi, index) => (
                                            <span
                                                onClick={() => setActiveName(activeName === nguoi_tra_loi ? '' : nguoi_tra_loi)}
                                                key={index}
                                                style={{ marginTop: '0' }}
                                                className={`box-search-niso text-xs whitespace-nowrap ${activeName === nguoi_tra_loi ? 'buttonReed font-bold' : 'buttontrans'}`}>
                                                {nguoi_tra_loi}
                                            </span>
                                        ))}
                                    </span>
                                </span>
                            </>
                        )}
                    </div>
                )}

                {displayedData.length === 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table id="customers" style={{ marginTop: '15px' }} className='text-sm dark:text-white'>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Người Đăng</th>
                                    <th>Người phản hồi</th>
                                    <th>Bộ phận</th>
                                    <th>Cửa hàng</th>
                                    <th>Tên Form</th>
                                    <th>Ngày tạo Form</th>
                                    <th>Ngày phản hồi</th>
                                    <th>Tùy chọn</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="9" className="text-center">Không có phản hồi nào từ người dùng</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table id="customers" style={{ marginTop: '15px' }} className='text-sm dark:text-white'>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    {phanquyen === true && (<th>Người Đăng</th>)}
                                    {phanquyen === true && (<th>Người phản hồi</th>)}
                                    {phanquyen === true && (<th>Bộ phận</th>)}
                                    {phanquyen === true && (<th>Cửa hàng</th>)}
                                    <th>Tên Form</th>
                                    <th>Ngày tạo Form</th>
                                    <th>Ngày phản hồi</th>
                                    <th>Tùy chọn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...displayedData].map((doc, index) => (
                                    <tr key={doc.keys}>
                                        <td>{index + 1}</td>
                                        {phanquyen === true && (<td>{doc.nguoidang}</td>)}
                                        {phanquyen === true && (<td>{doc.nguoi_tra_loi}</td>)}
                                        {phanquyen === true && (<td className='uppercase'>{doc.bo_phan}</td>)}
                                        {phanquyen === true && (
                                            <td>{doc.chi_nhanh ? doc.chi_nhanh : <p className='text-red-700 font-bold'>Phòng ban chưa cấp quyền chọn cửa hàng</p>}</td>
                                        )}
                                        <td>{doc.ten_phieu}</td>
                                        <td>{doc.ngay_tao_phieu}</td>
                                        <td>{doc.ngay_phan_hoi}</td>
                                        <td className='grid-niso-phieus'>
                                            {/* <Link to={`/auth/docs/views/statistical/${doc.keys}/${docs.find((items) => items.id === doc.keysJSON)?.id}`}>
                                                <GrView className='iconmenu' size={40} />
                                            </Link> */}
                                            <Link to={`/auth/docs/views/statistical/${doc.keys}`}>
                                                <GrView className='iconmenu' size={40} />
                                            </Link>
                                            {/* <PiMicrosoftExcelLogoFill className='iconmenu' size={40} onClick={() => handleDownloadExcel(doc)} /> */}
                                            {phanquyen === true && (<AiOutlineDelete className='iconmenu' size={40} onClick={() => openModalid(doc.keys)} />)}
                                        </td>
                                        {showModalid && showModalid === doc.keys && (
                                            <div className="modal">
                                                <div className="modal-content">
                                                    <h1 style={{ color: 'red', textAlign: 'center' }} className='font-black text-2xl'>Warning !</h1>
                                                    <h3 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }} className='text-sm'>Bạn chắc chắn muốn xóa phản hồi cho phiếu này?</h3>
                                                    <span className='button-box-modal'>
                                                        {phanquyen === true && (<button className='text-sm' onClick={() => handleDelete(doc.keys)}>Xóa</button>)}
                                                        <button onClick={closeModalid} className='text-sm'>Hủy</button>
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="flex gap-3.5 items-center" style={{ marginTop: '15px' }}>
                    <GrFormPrevious onClick={handlePreviousPage} disabled={currentPage === 1} className='iconmenu' size={40} />
                    <span className='text-sm dark:text-white'>{`Page ${currentPage} of ${totalPages}`}</span>
                    <GrFormNext onClick={handleNextPage} disabled={currentPage === totalPages} className='iconmenu' size={40} />
                </div>
                {successMessage}
            </div>
            <Report phanquyens={phanquyen} bophans={bophan} />
        </div>
    );
};

export default ListDocs;