import React, { useEffect, useState } from 'react';
import Account from '../dashboard/Account';
import useStateArray from '../function/useStateArray';
import axios from 'axios';
import { API_URL } from '../../api';
import Notification from '../Notification';

function Phanquyen() {
  const { tableAData, setTableAData, error, setError, setShowNotification } = useStateArray();
  const [selectedDepartment, setSelectedDepartment] = useState(null);

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

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleCheckboxChange = (index, field) => {
    setTableAData((prevData) => {
      const newData = prevData.map((item) => {
        if (item.bophan === selectedDepartment) {
          return { ...item, [field]: !item[field] };
        }
        return item;
      });
      return newData;
    });
  };

  const handleApplyChanges = async () => {
    if (!selectedDepartment) {
      setError(
        <Notification
          type="warning"
          content="Vui lòng chọn phòng ban trước khi áp dụng thay đổi."
          onClose={() => setShowNotification(null)}
        />
      );
      return;
    }
    try {
      const response = await axios.put(
        `${API_URL}/edit/phanquyen/${selectedDepartment}`,
        {
          data: filteredData,
        }
      );

      if (response.data.success) {
        setError(
          <Notification
            type="success"
            content="Áp dụng thành công !"
            onClose={() => setShowNotification(null)}
          />
        );
      } else {
        console.error('Error applying changes:', response.data.error);
      }
    } catch (error) {
      console.error('Error applying changes:', error);
    }
  };

  const filteredData = tableAData.filter(
    (item) => item.bophan === selectedDepartment
  );

  return (
    <div className='line-header-niso' style={{ minHeight: '100vh' }}>
      <title>Niso | Cài đặt phân quyền tài khoản</title>
      <div
        className='bg-white backgoround-niso-from dark:bg-slate-900'
        style={{ maxWidth: '1800px', margin: '0 auto' }}
      >
        <span className='flex-phanqquyen-niso'>
          <h3 className='dark:text-white font-bold'>
            Phân quyền phòng ban
          </h3>
          <button onClick={handleApplyChanges} className='mb-btn-nisos'>
            Áp dụng thay đổi
          </button>
        </span>
        <select
          className='text-sm select-option-niso uppercase'
          style={{ width: '100%' }}
          onChange={handleDepartmentChange}
        >
          <option>Chọn một phòng ban</option>
          {tableAData.map((item, index) => (
            <option value={item.bophan} key={index}>
              {item.bophan}
            </option>
          ))}
        </select>
        {selectedDepartment && (
          <>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <div key={index}>
                  <div className='box-auth-niso'>
                    <p>
                      Cấp quyền chức năng tạo phiếu (bạn có thể tạo phiếu bất cứ
                      lúc nào)
                    </p>
                    <label className='switch-niso'>
                      <input
                        type='checkbox'
                        className='niso-input'
                        name='phanquyen'
                        checked={item.tinhtrangAD}
                        onChange={() => handleCheckboxChange(index, 'tinhtrangAD')}
                      />
                      <span className='slider-niso round-niso'></span>
                    </label>
                  </div>

                  <div className='box-auth-niso'>
                    <p>
                      Sửa và xóa phiếu (bất kì người dùng của bộ phận
                      nào đều có thể sửa và xóa phiếu của bộ phận đó khi bật tính năng này)
                    </p>
                    <label className='switch-niso'>
                      <input
                        type='checkbox'
                        className='niso-input'
                        name='phanquyen'
                        checked={item.tinhtrangPass}
                        onChange={() => handleCheckboxChange(index, 'tinhtrangPass')}
                      />
                      <span className='slider-niso round-niso'></span>
                    </label>
                  </div>

                  <div className='box-auth-niso'>
                    <p>
                      Bật chức năng chi nhánh (bất kì người dùng của bộ phận
                      nào khi bật chức năng này có thể tùy chọn chi nhánh cửa hàng)
                    </p>
                    <label className='switch-niso'>
                      <input
                        type='checkbox'
                        className='niso-input'
                        name='phanquyen'
                        checked={item.chinhanh}
                        onChange={() => handleCheckboxChange(index, 'chinhanh')}
                      />
                      <span className='slider-niso round-niso'></span>
                    </label>
                  </div>
                </div>
              ))
            ) : (
              <p className='dark:text-white'>Không có dữ liệu cho bộ phận đã chọn.</p>
            )}
          </>
        )}
      </div>
      <Account />
      {error}
    </div>
  );
}

export default Phanquyen;
