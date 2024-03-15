import React, { useEffect } from 'react';
import axios from 'axios';
import { AiOutlineDelete } from 'react-icons/ai';
import { FiEdit3 } from 'react-icons/fi';
import { IoSaveOutline } from 'react-icons/io5';
import { MdOutlineCancel } from 'react-icons/md';
import { API_URL } from '../../api';
import Notification from '../../components/Notification';
import { CiSearch } from 'react-icons/ci';
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import Modal from '../function/Modal';
import useStateArray from '../function/useStateArray';

function Department() {
    const {
      tableAData, setShowNotification,
      setTableAData,
      isButtonDisabled,
      setIsButtonDisabled,
      bophan,
      setBophan,
      errorMessage,
      setErrorMessage,
      editId,
      setEditId,
      editedBophan,
      setEditedBophan,
      searchQuery,
      setSearchQuery,
      currentPage,
      setCurrentPage,
    } = useStateArray();
  
    const { openModalid, closeModalid, showModalid } = Modal();
  
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
  
    const handleSearch = (e) => {
      setSearchQuery(e.target.value);
    };
  
    const handleDelete = async (keys) => {
      try {
        const response = await axios.delete(`${API_URL}/tablea/delete/${keys}`);
  
        if (response.data && response.data.success) {
          setErrorMessage(
            <Notification type="success" content="Xóa bộ phận thành công !" onClose={() => setShowNotification(null)}/>
          );
          closeModalid();
          window.location.reload();
        } else {
          console.error(
            'Error deleting data from TableA:',
            response.data && response.data.error
          );
        }
      } catch (error) {
        console.error('Error deleting data from TableA:', error.message);
      }
    };
  
    const handleEdit = (keys, currentBophan) => {
      setEditId(keys);
      setEditedBophan(currentBophan);
    };
  
    const handleSubmitEdit = async () => {
      try {
        const response = await axios.put(
          `${API_URL}/tablea/update/${editId}`,
          {
            bophan: editedBophan,
          }
        );
  
        if (response.data.success) {
          if (
            editedBophan.toLowerCase() ===
            tableAData.find((item) => item.keys === editId).bophan.toLowerCase()
          ) {
            setErrorMessage(
              <Notification
                type="warning"
                content="Nội dung không thay đổi, không thể cập nhật !"
                onClose={() => setShowNotification(null)}
              />
            );
            return;
          }
  
          setTableAData(
            tableAData.map((item) =>
              item.keys === editId ? { ...item, bophan: editedBophan } : item
            )
          );
          setEditId(null);
          setEditedBophan('');
          setErrorMessage(
            <Notification
              type="success"
              content="Cập nhật bộ phận thành công !"
              onClose={() => setShowNotification(null)}
            />
          );
          window.location.reload();
        } else {
          console.error('Error editing data in TableA:', response.data.error);
        }
      } catch (error) {
        console.error('Error editing data in TableA:', error.message);
      }
    };
  
    const addDepartmentToTable = (keys, bophan) => {
      setTableAData([...tableAData, { keys, bophan }]);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!bophan) {
        setErrorMessage(
          <Notification
            type="warning"
            content="Vui lòng nhập tên bộ phận !"
            onClose={() => setShowNotification(null)}
          />
        );
        return;
      }
  
      const departmentExists = tableAData.some(
        (item) => item.bophan.toLowerCase() === bophan.toLowerCase()
      );
  
      if (departmentExists) {
        setErrorMessage(
          <Notification
            type="warning"
            content="Tên bộ phận đã tồn tại không thể thêm !"
            onClose={() => setShowNotification(null)}
          />
        );
        return;
      }
  
      try {
        const response = await axios.post(`${API_URL}/tablea/add`, {
          bophan,
        });
  
        if (response.data.success) {
          addDepartmentToTable(response.data.keys, bophan);
          setErrorMessage(
            <Notification type="success" content="Thêm bộ phận thành công !" onClose={() => setShowNotification(null)}/>
          );
          setBophan('');
          window.location.reload();
        } else {
          if (response.data.error.toLowerCase() === 'departmentexists') {
            setErrorMessage(
              <Notification
                type="warning"
                content="Tên bộ phận đã tồn tại không thể thêm !"
                onClose={() => setShowNotification(null)}
              />
            );
            setIsButtonDisabled(true);
          } else {
            setErrorMessage(
              <Notification
                type="error"
                content="Lỗi ! Thêm bộ phận thất bại"
                onClose={() => setShowNotification(null)}
              />
            );
          }
        }
      } catch (error) {
        console.error('Error:', error.message);
        setErrorMessage(
          <Notification
            type="error"
            content="Xảy ra lỗi! Vui lòng thử lại sau"
            onClose={() => setShowNotification(null)}
          />
        );
      }
    };
  
    const filteredTableAData = tableAData.filter((item) =>
      item.bophan.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const itemsPerPage = 5;
  
    const totalPages = Math.ceil(filteredTableAData.length / itemsPerPage);
  
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
    const reversedData = filteredTableAData.slice().reverse();
    const displayedData = reversedData.slice(startIndex, endIndex);
  
    return (
      <div className='line-header-niso' style={{minHeight: '100vh'}}>
        <title>Quản lý nội bộ</title>
        <div className="backgoround-niso-from bg-white dark:bg-slate-900" style={{maxWidth:'1800px', margin: '0 auto'}}>
            <span style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }} className='flexmobile-niso'>
                <h3 className="dark:text-white font-bold">
                    Thêm một bộ phận vào phòng ban
                </h3>
                <label className="search-box-niso">
                    <CiSearch size={28} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bộ phận..."
                        className="box-search-niso-input text-sm"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </label>
            </span>
            <div style={{overflowX: 'auto'}}>
            <table id="customers">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Bộ phận</th>
                        <th>Tùy chọn</th>
                    </tr>
                </thead>
                <tbody className='dark:text-white'>
                    {displayedData.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="text-center text-sm dark:text-white">
                                {searchQuery
                                    ? 'Không tìm thấy bộ phận nào phù hợp!'
                                    : 'Bạn chưa thêm bộ phận nào!'}
                            </td>
                        </tr>
                    ) : (
                        [...displayedData].map((item, index) => (
                            <tr key={item.keys || index} className=''>
                                <td>{startIndex + index + 1}</td>
                                <td className='uppercase text-sm dark:text-white'>
                                    {editId === item.keys ? (
                                        <input
                                            key={`edit-${item.keys}`}
                                            type="text"
                                            placeholder="nhập nội dung chỉnh sửa"
                                            value={editedBophan}
                                            onChange={(e) => setEditedBophan(e.target.value)}
                                            className='text-sm question-container-niso w-32-niso uppercase dark:text-slate-900'
                                        />
                                    ) : (
                                        <p className='hover:text-slate-900 dark:text-white'>{item.bophan}</p>
                                    )}
                                </td>
                                <td>
                                    {editId === item.keys ? (
                                        <div className="flex gap-3.5" key={`edit-${item.keys}`}>
                                            <IoSaveOutline onClick={handleSubmitEdit} className='iconmenu' size={40} />
                                            <MdOutlineCancel onClick={() => setEditId(null)} className='iconmenu' size={40} />
                                        </div>
                                    ) : (
                                        <div className="flex gap-3.5">
                                            <FiEdit3 onClick={() => handleEdit(item.keys, item.bophan)} className='iconmenu' size={40} />
                                            <AiOutlineDelete onClick={() => openModalid(item.keys)} className='iconmenu' size={40} />
                                            {showModalid && showModalid === item.keys && (
                                                <div className="modal">
                                                    <div className="modal-content">
                                                        <h1 style={{ color: 'red', textAlign: 'center' }} className="font-black text-2xl">
                                                            Warning !
                                                        </h1>
                                                        <h3 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }} className='text-sm'>
                                                            Bạn chắc chắn muốn xóa bộ phận này
                                                        </h3>
                                                        <span className="button-box-modal">
                                                            <button onClick={() => handleDelete(item.keys)} className="text-sm">
                                                                Xóa
                                                            </button>
                                                            <button onClick={closeModalid} className="text-sm">
                                                                Hủy
                                                            </button>
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </td>
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
            <form onSubmit={handleSubmit}>
                <span className="flex flex-col gap-4" style={{ marginTop: '15px' }}>
                    <input
                        type="text"
                        placeholder="Nhập tên bộ phận muốn thêm"
                        onChange={(e) => {
                            setBophan(e.target.value);
                            setIsButtonDisabled(false);
                        }}
                        className="text-sm question-container-niso"
                    />
                    <button type="submit" className="text-sm" disabled={isButtonDisabled}>
                        Thêm
                    </button>
                </span>
            </form>
            {errorMessage}
        </div>
        </div>
    );
}

export default Department;
