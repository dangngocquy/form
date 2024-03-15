import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../api";
import Modal from "./function/Modal";
import Notification from "./Notification";
import useStateArray from "./function/useStateArray";
import { TbReport } from "react-icons/tb";
import { GrView } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from 'react-router-dom';
import { FaComputer } from "react-icons/fa6";
import { ImMobile } from "react-icons/im";

function Report({ phanquyens, bophans }) {
    const {
        openModal, showModal,
        closeModal, openModalid,
        closeModalid, openModal2, showModal2,
        closeModal2,
        showModalid,
    } = Modal();

    const { successMessage, setSuccessMessage, setShowNotification } = useStateArray();
    const [tableAData, setTableAData] = useState([]);
    const [reports, setReports] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [reportLink, setReportLink] = useState("");
    const [reportLinkmobile, setReportLinkmobile] = useState("");
    const [loading, setLoading] = useState(false);
    const [invalidLink, setInvalidLink] = useState(false);
    const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState("");

    const handleAddReport = async () => {
        try {
            if (!selectedDepartment || !reportLink) {
                setSuccessMessage(<Notification type="warning" content="Vui lòng điền đầy đủ thông tin !" onClose={() => setShowNotification(null)}/>);
                return;
            }

            if (!isValidUrl(reportLink)) {
                setInvalidLink(true);
                return;
            }

            setLoading(true);

            const response = await axios.post(`${API_URL}/report/add`, {
                link: reportLink,
                bo_phan_rp: selectedDepartment,
                link_mobile: reportLinkmobile,
            });

            if (response.data.success) {
                setSuccessMessage(<Notification type="success" content="Thêm báo cáo thành công !" onClose={() => setShowNotification(null)}/>);
            }

            setLoading(false);
            closeModal();
        } catch (error) {
            console.error("Error adding report:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (keys) => {
        try {
            const response = await axios.delete(`${API_URL}/report/delete/${keys}`, { data: { keys } });

            if (response.data.success) {
                setSuccessMessage(<Notification type="success" content="Xóa báo cáo thành công !" />);
                const updatedReports = reports.filter(item => !keys.includes(item.keys));
                setReports(updatedReports);
            } else {
                setSuccessMessage(<Notification type="error" content="Xóa báo cáo không thành công !" onClose={() => setShowNotification(null)}/>);
            }

            closeModalid();
        } catch (error) {
            console.error("Error deleting report:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/tablea/all`);
                setTableAData(response.data.data);
            } catch (error) {
                console.error("Error retrieving data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/report/all`);
                setReports(response.data.data);
            } catch (error) {
                console.error('Error retrieving data:', error);
            }
        };

        fetchData();
    }, [setReports]);

    const isValidUrl = (url) => {
        try {
            const parsedUrl = new URL(url);

            if (!parsedUrl.hostname || parsedUrl.hostname === "") {
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    };
    const checkurl = (inputLink) => {
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        const isValidUrl = urlRegex.test(inputLink);

        if (isValidUrl || inputLink.indexOf('.') !== -1) {
            setReportLink(inputLink);
            setInvalidLink(false);
        } else {
            setReportLink(inputLink);
            setInvalidLink(true);
        }
    };

    const handleEdit = async (keys) => {
        try {
            if (!reportLink || !selectedDepartment) {
                setSuccessMessage(<Notification type="warning" content="Vui lòng điền đầy đủ thông tin !" onClose={() => setShowNotification(null)}/>);
                return;
            }

            const response = await axios.put(`${API_URL}/report/update/${keys}`, {
                link: reportLink,
                bo_phan_rp: selectedDepartment,
                link_mobile: reportLinkmobile,
            });

            if (response.data.success) {
                setSuccessMessage(<Notification type="success" content="Cập nhật báo cáo thành công !" onClose={() => setShowNotification(null)}/>);
            } else {
                setSuccessMessage(<Notification type="error" content="Cập nhật báo cáo không thành công !" onClose={() => setShowNotification(null)}/>);
            }
        } catch (error) {
            console.error("Error updating report:", error);
        } finally {
            setLoading(false);
            closeModal2();
        }
    };

    return (
        <div style={{ marginTop: "15px" }}>
            {successMessage}
            <div
                className="bg-white backgoround-niso-from dark:bg-slate-900"
                style={{ maxWidth: "1800px", margin: "0 auto" }}
            >
                <span className="cks">
                    <h3 className="dark:text-white font-bold">
                        Danh sách báo cáo theo phòng ban
                    </h3>
                    {phanquyens === true && (
                        <button onClick={openModal}>Thêm một báo cáo</button>
                    )}
                </span>
                {phanquyens === true && (
                    <select
                        className="text-sm select-option-niso uppercase"
                        style={{
                            width: "100%",
                            marginTop: "15px",
                            marginBottom: "15px",
                        }}
                        value={selectedDepartmentFilter}
                        onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
                    >
                        <option>Chọn một phòng ban</option>
                        {tableAData.map((item, index) => (
                            <option value={item.bophan} key={index}>
                                {item.bophan}
                            </option>
                        ))}
                    </select>
                )}

                <div className="box-grid-report-niso">
                    {reports.length > 0 ? (
                        reports
                            .filter((item) => !selectedDepartmentFilter || item.bo_phan_rp === selectedDepartmentFilter)
                            .map((item, index) => (
                                <div key={index}>
                                    {(phanquyens === true || (bophans === item.bo_phan_rp)) && (
                                        <>
                                            <div className="pc-mobile-report">
                                                {phanquyens === true && (
                                                    <div className="box-report-niso">
                                                        <div className='main-container'>
                                                            <iframe src={item.link} title="báo cáo" className="if-s" />
                                                            <div className="overlays">
                                                                <TbReport size={48} style={{ color: 'rgba(69, 175, 211, 0.6)' }} className="overlayMobil" />
                                                            </div>
                                                        </div>
                                                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                                            <b>BỘ PHẬN: <span className="uppercase">{item.bo_phan_rp}</span></b>
                                                        </div>
                                                        <span className="flex gap-4 justify-center" style={{ marginTop: '15px' }}>
                                                            <Link to={`/auth/docs/views/report/${item.keys}`}>
                                                                <GrView size={40} className="iconmenu" />
                                                            </Link>
                                                            <FaEdit size={40} className="iconmenu" onClick={() => openModal2(item.keys)} />
                                                            <MdDelete size={40} className="iconmenu" onClick={() => openModalid(item.keys)} />
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {item.link_mobile && (
                                                <div className="mobile-pc-report">
                                                    {phanquyens === true && (
                                                        <div className="box-report-niso">
                                                            <div className='main-container'>
                                                                <iframe src={item.link_mobile} title="báo cáo" className="if-s" />
                                                                <div className="overlays">
                                                                    <TbReport size={48} style={{ color: 'rgba(69, 175, 211, 0.6)' }} className="overlayMobil" />
                                                                </div>
                                                            </div>
                                                            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                                                <b>BỘ PHẬN: <span className="uppercase">{item.bo_phan_rp}</span></b>
                                                            </div>
                                                            <span className="flex gap-4 justify-center" style={{ marginTop: '15px' }}>
                                                                <Link to={`/auth/docs/views/report/${item.keys}`}>
                                                                    <GrView size={40} className="iconmenu" />
                                                                </Link>
                                                                <FaEdit size={40} className="iconmenu" onClick={() => openModal2(item.keys)} />
                                                                <MdDelete size={40} className="iconmenu" onClick={() => openModalid(item.keys)} />
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="pc-mobile-report">
                                                {phanquyens === false && (
                                                    <Link to={`/auth/docs/views/report/${item.keys}`}>
                                                        <div className="box-report-niso">
                                                            <div className='main-container'>
                                                                <iframe src={item.link} title="báo cáo" className="if-s" />
                                                                <div className="overlays">
                                                                    <TbReport size={48} style={{ color: 'rgba(69, 175, 211, 0.6)' }} className="overlayMobil" />
                                                                </div>
                                                            </div>
                                                            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                                                <b>BỘ PHẬN: <span className="uppercase">{item.bo_phan_rp}</span></b>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                )}
                                            </div>
                                            {item.link_mobile && (
                                                <div className="mobile-pc-report">
                                                    {phanquyens === false && (
                                                        <Link to={`/auth/docs/views/report/${item.keys}`}>
                                                            <div className="box-report-niso">
                                                                <div className='main-container'>
                                                                    <iframe src={item.link_mobile} title="báo cáo" className="if-s" />
                                                                    <div className="overlays">
                                                                        <TbReport size={48} style={{ color: 'rgba(69, 175, 211, 0.6)' }} className="overlayMobil" />
                                                                    </div>
                                                                </div>
                                                                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                                                    <b>BỘ PHẬN: <span className="uppercase">{item.bo_phan_rp}</span></b>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {showModal2 && showModal2 === item.keys && (
                                        <div className="modal">
                                            <div className="modal-content">
                                                <h3 className="font-bold ops">Chỉnh sửa báo cáo</h3>
                                                <div className="flex flex-col gap-4 mb-4 mt-4">
                                                    <select
                                                        value={selectedDepartment}
                                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                                        className="text-sm select-option-niso uppercase"
                                                        style={{
                                                            width: "auto",
                                                            margin: '0 15px'
                                                        }}
                                                    >
                                                        <option>Chọn một phòng ban</option>
                                                        {tableAData.map((item, index) => (
                                                            <option value={item.bophan} key={index}>
                                                                {item.bophan}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <label className="flex items-center gap-4" style={{
                                                        width: "auto",
                                                        margin: '0 15px'
                                                    }}>
                                                        <FaComputer size={32} className="dark:text-white text-slate-900" />
                                                        <input
                                                            placeholder="Nhập liên kết cho máy tính"
                                                            value={reportLink}
                                                            onInput={(e) => checkurl(e.target.value)}
                                                            style={{
                                                                width: "100%",
                                                            }}
                                                            className="text-sm question-container-niso"
                                                        />
                                                    </label>
                                                    <label className="flex items-center gap-4" style={{
                                                        width: "auto",
                                                        margin: '0 15px'
                                                    }}>
                                                        <ImMobile size={32} className="dark:text-white text-slate-900" />
                                                        <input
                                                            placeholder="Nhập liên kết cho thiết bị di động"
                                                            value={reportLinkmobile}
                                                            onChange={(e) => setReportLinkmobile(e.target.value)}
                                                            style={{
                                                                width: "100%",
                                                            }}
                                                            className="text-sm question-container-niso"
                                                        />
                                                    </label>

                                                </div>
                                                <span className="button-box-modal">
                                                    <button className="text-sm" onClick={() => handleEdit(item.keys)} disabled={loading}>
                                                        {loading ? "Đang cập nhật..." : "Cập nhật"}
                                                    </button>
                                                    <button onClick={closeModal2} className="text-sm">
                                                        Hủy
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {showModalid && showModalid === item.keys && (
                                        <div className="modal">
                                            <div className="modal-content">
                                                <h1 style={{ color: 'red', textAlign: 'center' }} className='font-black text-2xl'>Warning !</h1>
                                                <h3 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }} className='text-sm'>Bạn chắc chắn muốn xóa báo cáo này?</h3>
                                                <span className='button-box-modal'>
                                                    <button className='text-sm' onClick={() => handleDelete(item.keys)}>Xóa</button>
                                                    <button onClick={closeModalid} className='text-sm'>Hủy</button>
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                    ) : (
                        <div style={{ textAlign: 'center' }} className="dark:text-white">
                            <p className="dark:text-white">Không có báo cáo nào tồn tại</p>
                        </div>
                    )}
                </div>
            </div>
            {showModal && (
                <div className="modal" style={{ overflow: "hidden" }}>
                    <div className="widt-content-admin-niso bg-white dark:bg-slate-900">
                        <div style={{ padding: "0 20px 20px 20px" }}>
                            <h3 className="dark:text-white font-bold">Chọn phòng ban</h3>
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="text-sm select-option-niso uppercase"
                                style={{
                                    width: "100%",
                                    marginTop: "15px",
                                    marginBottom: "15px",
                                }}
                            >
                                <option>Chọn một phòng ban</option>
                                {tableAData.map((item, index) => (
                                    <option value={item.bophan} key={index}>
                                        {item.bophan}
                                    </option>
                                ))}
                            </select>
                            <h3 className="dark:text-white font-bold">
                                Nhập liên kết báo cáo
                            </h3>
                            <label className="flex items-center gap-4">
                                <FaComputer size={32} className="dark:text-white text-slate-900" />
                                <input
                                    placeholder="Nhập liên kết cho máy tính"
                                    value={reportLink}
                                    onInput={(e) => checkurl(e.target.value)}
                                    style={{
                                        width: "100%",
                                        marginTop: "15px",
                                        marginBottom: "15px",
                                    }}
                                    className="text-sm question-container-niso"
                                />
                            </label>
                            <label className="flex items-center gap-4">
                                <ImMobile size={32} className="dark:text-white text-slate-900" />
                                <input
                                    placeholder="Nhập liên kết cho thiết bị di động"
                                    value={reportLinkmobile}
                                    onChange={(e) => setReportLinkmobile(e.target.value)}
                                    style={{
                                        width: "100%",
                                        marginTop: "15px",
                                        marginBottom: "15px",
                                    }}
                                    className="text-sm question-container-niso"
                                />
                            </label>
                            <h3 className="dark:text-white font-bold">Xem trước</h3>
                            {reportLink && !invalidLink ? (
                                <iframe
                                    style={{ marginTop: "15px" }}
                                    src={reportLink}
                                    title="báo cáo"
                                    className="iframe-niso"
                                ></iframe>
                            ) : (
                                <div className="background-iframe">
                                    {invalidLink ? (
                                        "Vui lòng nhập một liên kết hợp lệ !"
                                    ) : (
                                        "Bạn chưa nhập liên kết báo cáo"
                                    )}
                                </div>
                            )}
                        </div>
                        <span className="button-box-modal sbn">
                            <button className="text-sm" onClick={handleAddReport} disabled={loading}>
                                {loading ? "Đang thêm..." : "Thêm"}
                            </button>
                            <button onClick={closeModal} className="text-sm">
                                Hủy
                            </button>
                        </span>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Report;
