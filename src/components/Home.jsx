import React, { useEffect } from 'react';
import axios from 'axios';
import { API_URL } from "../api";
import { CiSearch, CiFilter } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { IoCreateOutline } from "react-icons/io5";
import useStateArray from './function/useStateArray';
import file from '../assets/file.png';
import Notification from './Notification';
import { useNavigate } from 'react-router-dom';

const Home = ({ bophan, tableAData, phanquyen }) => {
  const {
    searchTitle, successMessage, setSuccessMessage,
    setSearchTitle, searchMyDocs, setSearchMyDocs,
    searchBophan, visibleItems, setVisibleItems,
    setSearchBophan, loadingMore, setLoadingMore,
    visibleCount, setTableADatas, tableADatas,
    setVisibleCount, setShowNotification,
    show,
    setShow,
    setData,
    data
  } = useStateArray();

  useEffect(() => {
    let isComponentMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/docs/all`);
        if (isComponentMounted) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      isComponentMounted = false;
    };
  }, [setData]);

  const filteredData = data
    .slice()
    .reverse()
    .filter((doc) => {
      const titleMatch = doc.title && doc.title.toLowerCase().includes(searchTitle.toLowerCase());
      const bophanMatch = (typeof doc.bophanAD === 'string' && doc.bophanAD.toLowerCase() === searchBophan.toLowerCase()) || searchBophan === '';
      return titleMatch && bophanMatch;
    });

  const handleSearchBophan = (selectedBophan) => {
    setSearchBophan(selectedBophan === searchBophan ? '' : selectedBophan);
  };

  const handleShowHide = () => {
    setShow(!show);
  };

  const navigate = useNavigate();

  const navigateCreate = () => {
    const hasPermission = phanquyen === true || (bophan && tableAData.some(item => item.bophan === bophan && item.tinhtrangAD === true));
    if (hasPermission) {
      navigate(`/auth/docs/new/create`);
    } else {
      setSuccessMessage(<Notification type="warning" content="Bạn không có quyền tạo Form !" onClose={() => setShowNotification(null)}/>)
    }
  };

  const filterData = data
    .slice()
    .reverse()
    .filter((item) => {
      const filterCondition =
        bophan === item.bophanAD &&
        (searchMyDocs === '' || item.title.toLowerCase().includes(searchMyDocs.toLowerCase()));

      return filterCondition;
    });

  const loadMoreItems = () => {
    setLoadingMore(true);
    setVisibleItems((prevVisibleMoreItems) => prevVisibleMoreItems + 2);
    setLoadingMore(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/tablea/all`);
        setTableADatas(response.data.data);
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    fetchData();
  }, [setTableADatas]);

  return (
    <div style={{ background: '#f0f0f0', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1800px', margin: '0 auto' }} className='mt'>
        <title>Niso Form</title>
        <div className='pb-8 line-header-niso'>
          <button className='btn-fl-niso' onClick={navigateCreate} style={{ fontSize: '11px', padding: '10px' }}><IoCreateOutline size={18} />Tạo Form mới</button>
        </div>
        {phanquyen === true && (
          <>
            <label className="search-box-niso">
              <CiSearch className='size-icon-niso' />
              <input
                type="text"
                placeholder="Tìm kiếm Form..."
                className="box-search-niso-input text-sm"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
              />
            </label>

            <span className='flex justify-between items-end'>
              <p className='font-bold pt-8'>Tất cả Form</p>
              <CiFilter size={40} className='iconmenu' onClick={handleShowHide} />
            </span>

            {show && (
              <div className='box-niso-loc'>
                {tableADatas.map((item, index) => (
                  <div
                    key={index}
                    className={item.bophan === searchBophan ? 'buttonReed text-xs uppercase text-mobile' : 'text-xs buttontrans uppercase text-mobile'}
                    onClick={() => handleSearchBophan(item.bophan)}
                  >
                    {item.bophan}
                  </div>
                ))}
              </div>
            )}
            {filteredData.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '1.5rem' }}>
                {filteredData.slice(0, visibleCount).map((doc) => (
                  <Link to={`/auth/docs/views/${doc.id}`} key={doc.id} className='box-link-docs-niso'>
                    <span className='flex gap-4'>
                      <img src={file} alt='File' className='imgFile' />
                      <span className='flex flex-col'>
                        <h3 className='font-bold text-xl mb-2 width-m text-ellipsis overflow-hidden whitespace-nowrap'>{doc.title}</h3>
                        <p style={{ fontSize: '11px' }}>{doc.nguoitaophieu}</p>
                      </span>
                    </span>
                    <span className='uppercase text-slate-900 text-xs m'>
                      Bộ phận {doc.bophanAD}
                    </span>
                    <span className='text-slate-900 text-xs m'>
                      Đã đăng {doc.date}
                    </span>
                  </Link>
                ))}
                {visibleCount < filteredData.length && (
                  <p className="text-sm cursor-pointer text-center text-niso-hover" onClick={() => setVisibleCount(prevCount => prevCount + 2)}>Xem thêm</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-900 text-center">Không tìm thấy Form nào !</p>
            )}
          </>
        )}
        {phanquyen === false && (
          <label className="search-box-niso">
            <CiSearch className='size-icon-niso' />
            <input
              type="text"
              placeholder="Tìm kiếm Form..."
              className="box-search-niso-input text-sm"
              value={searchMyDocs}
              onChange={(e) => setSearchMyDocs(e.target.value)}
            />
          </label>
        )}
        <span className='flex justify-between items-end k'>
          <p className='font-bold pt-8'>Các Form đã tạo</p>
          {phanquyen === true && (
            <label className="search-box-niso">
              <CiSearch size={28} />
              <input
                type="text"
                placeholder="Tìm kiếm Form..."
                className="box-search-niso-input text-sm"
                value={searchMyDocs}
                onChange={(e) => setSearchMyDocs(e.target.value)}
              />
            </label>
          )}
        </span>
        <div style={{ marginTop: '1.5rem' }}>
          {filterData.length > 0 ? (
            filterData.slice(0, visibleItems).map((item) => (
              <div key={item.id}>
                {bophan === item.bophanAD && (
                  <Link
                    to={`/auth/docs/views/${item.id}`}
                    key={item.id}
                    className='box-link-docs-niso'
                    style={{ marginBottom: '15px' }}
                  >
                    <span className='flex gap-4'>
                      <img src={file} alt='File' className='imgFile' />
                      <span className='flex flex-col'>
                        <h3 className='font-bold text-xl mb-2 width-m text-ellipsis overflow-hidden whitespace-nowrap'>
                          {item.title}
                        </h3>
                        <p style={{ fontSize: '11px' }}>{item.nguoitaophieu}</p>
                      </span>
                    </span>
                    <span className='uppercase text-slate-900 text-xs m'>
                      Bộ phận {item.bophanAD}
                    </span>
                    <span className='text-slate-900 text-xs m'>
                      Đã đăng {item.date}
                    </span>
                  </Link>
                )}
              </div>
            ))
          ) : (
            <p className='text-sm  text-center dark:text-slate-900'>Không tìm thấy Form nào !</p>
          )}
          {loadingMore ? (
            <p className="text-sm text-center text-niso-hover text-slate-900">Đang tải...</p>
          ) : (
            filterData.length > visibleItems && (
              <p onClick={loadMoreItems} className="text-sm cursor-pointer text-center text-niso-hover">
                Xem thêm
              </p>
            )
          )}
        </div>
      </div>
      {successMessage}
    </div>
  );
};

export default Home;
