import React, { useEffect, useState } from 'react';
import { API_URL } from '../api';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaRegStar, FaRegHeart, FaStar, FaHeart } from "react-icons/fa";
import { FaRegCircleCheck, FaCircleCheck } from "react-icons/fa6";
import { Thoigian } from './function/date';
import { LuAsterisk } from "react-icons/lu";
import parse from 'html-react-parser';
import BacktoTop from './function/BacktoTop';
import Modal from './function/Modal';
import Notification from '../components/Notification';
import SendOk from './dashboard/SendOk';
import useStateArray from './function/useStateArray';
import DeleteHTML from './function/DeleteHTML';

const Docs = ({ bophan, name, tableAData, phanquyen }) => {
  const { id } = useParams();
  const [responseData, setResponseData] = useState({ success: false, data: {} });
  const [selectedNgoisaoIndex, setSelectedNgoisaoIndex] = useState(-1);
  const [selectedTraitimIndex, setSelectedTraitimIndex] = useState(-1);
  const [selectedDaukiemIndex, setSelectedDaukiemIndex] = useState(-1);
  const [selectedSoIndex, setSelectedSoIndex] = useState(-1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [branches, setBranches] = useState([]);

  const {
    errorMessage, setErrorMessage, setShowNotification,
  } = useStateArray();

  const [formData, setFormData] = useState({
    ten_phieu: '',
    noi_dung_phieu: '',
    chi_nhanh: '',
    nguoidang: '',
    nguoi_tra_loi: '',
    ngay_phan_hoi: '',
    noidungphu: '',
    tieudephu: '',
    bo_phan: '',
    ngay_tao_phieu: '',
    pairs: [{
      cau_hoi: '',
      cau_tra_loi: '',
      noidungphu: '',
      tieudephu: '',
    }],
    keysJSON: '',
  });

  const {
    openModal,
    closeModal,
    showModal,
  } = Modal();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handlePairChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const updatedPairs = [...(prevFormData.pairs || [])];
      while (updatedPairs.length <= index) {
        updatedPairs.push({});
      }
      updatedPairs[index] = { ...(updatedPairs[index] || {}), [name]: value };
      return { ...prevFormData, pairs: updatedPairs };
    });
  };
  const handleContentSelection = (index, selectedContent) => {
    setFormData((prevFormData) => {
      const updatedPairs = [...(prevFormData.pairs || [])];
      while (updatedPairs.length <= index) {
        updatedPairs.push({});
      }
      updatedPairs[index] = { ...(updatedPairs[index] || {}), cau_tra_loi: `${selectedContent}` };
      return { ...prevFormData, pairs: updatedPairs };
    });
  };

  const handleKhacInputChange = (index, e) => {
    const { value } = e.target;
    setFormData((prevFormData) => {
      const updatedPairs = [...(prevFormData.pairs || [])];
      while (updatedPairs.length <= index) {
        updatedPairs.push({});
      }
      updatedPairs[index] = { ...(updatedPairs[index] || {}), cau_tra_loi: `${value}` };
      return { ...prevFormData, pairs: updatedPairs };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasMatchingBophan = phanquyen === true || tableAData.some(item => item.chinhanh === true && item.bophan === bophanAD);
    if (hasMatchingBophan && !formData.chi_nhanh) {
      setErrorMessage(<Notification type="warning" content="Vui lòng chọn một chi nhánh cửa hàng !" onClose={() => setShowNotification(null)} />);
      closeModal();
      return;
    }

    const cauHoiBatBuoc = questions.filter(question => question.cauhoibatbuoc || (question.luachon && question.luachon.option1));
    const missingAnswers = cauHoiBatBuoc.filter((question, index) => {
      if (question.cauhoibatbuoc) {
        return !formData.pairs[index]?.cau_tra_loi;
      } else if (question.luachon && question.luachon.option1) {
        return !formData.pairs[index]?.cau_tra_loi && question.cauhoibatbuoc;
      }
      return false;
    });

    if (missingAnswers.length > 0) {
      setErrorMessage(<Notification type="warning" content="Vui lòng nhập đầy đủ thông tin cho các câu hỏi bắt buộc." onClose={() => setShowNotification(null)} />);
      closeModal();
      return;
    }
    const strippedContent = DeleteHTML(contentTitle);

    const cauHoiQuestions = questions.filter(question => Object.keys(question).some(key => key.startsWith('Cauhoi')));
    const mappedPairs = cauHoiQuestions.map((question, index) => {
      const translateHtml = DeleteHTML(question[`Cauhoi${index + 1}`])

      return {
        cau_hoi: translateHtml,
        noidungphu: question.noidungphieuthem,
        tieudephu: question.tieudephieuthem,
        cau_tra_loi: formData.pairs[index]?.cau_tra_loi || ''
      };
    });
    try {
      const response = await axios.post(`${API_URL}/content/add`, {
        ...formData,
        noi_dung_phieu: strippedContent,
        ten_phieu: title,
        nguoi_tra_loi: name,
        nguoidang: nguoitaophieu,
        ngay_phan_hoi: Thoigian,
        pairs: mappedPairs,
        bo_phan: bophanAD,
        ngay_tao_phieu: date,
        keysJSON: id,
      });

      if (response.data.success) {
        setShowSuccessMessage(true);
        closeModal();
      } else {
        console.error('Có lỗi xảy ra khi thêm dữ liệu.');
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi gửi yêu cầu:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchResponse = await axios.get(`${API_URL}/chinhanh/all`);
        setBranches(branchResponse.data);
      } catch (error) {
        console.error('Error fetching branches data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          console.error('ID is not defined');
          return;
        }

        const response = await axios.get(`${API_URL}/docs/get/${id}`);
        setResponseData({ success: true, data: response.data });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  if (!responseData.success) {
    return null;
  }

  const { title, contentTitle, bophanAD, questions, date, nguoitaophieu } = responseData.data;
  // let tieudephieuthemCount = 0;
  const handleClearAll = () => {
    setSelectedNgoisaoIndex(-1);
    setSelectedTraitimIndex(-1);
    setSelectedDaukiemIndex(-1);
    setSelectedSoIndex(-1);

    setFormData((prevFormData) => {
      const updatedPairs = (prevFormData.pairs || []).map((pair) => {
        return {
          ...pair,
          cau_tra_loi: '',
          tuychon: false,
          tuychonkhac: false,
        };
      });

      return { ...prevFormData, pairs: updatedPairs };
    });

    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio) => {
      radio.checked = false;
    });
    const checkboxButtons = document.querySelectorAll('input[type="checkbox"]');
    checkboxButtons.forEach((checkbox) => {
      checkbox.checked = false;
    });
  };

  const handleCheckboxChange = (index, optionValue, isChecked) => {
    setFormData((prevFormData) => {
      const updatedPairs = [...(prevFormData.pairs || [])];
      while (updatedPairs.length <= index) {
        updatedPairs.push({});
      }

      let existingCauTraLoi = updatedPairs[index]?.cau_tra_loi || '';

      if (isChecked) {
        existingCauTraLoi += existingCauTraLoi ? `,${optionValue}` : optionValue;
      } else {
        existingCauTraLoi = existingCauTraLoi
          .split(',')
          .filter((value) => value !== optionValue)
          .join(',');
      }

      updatedPairs[index] = { ...(updatedPairs[index] || {}), cau_tra_loi: existingCauTraLoi };
      return { ...prevFormData, pairs: updatedPairs };
    });
  };

  return (
    <>
      {(showSuccessMessage || phanquyen === true || bophan === bophanAD) && (
        <div className='line-header-niso'>
          <title>Niso - Checklist Form {title} </title>
          {showSuccessMessage ? (
            <SendOk />
          ) : (
            <div style={{ minHeight: '100vh', maxWidth: '800px', margin: '0 auto' }}>
              <div className='backgoround-niso-from niso-box-titles bg-white'>
                <h1 style={{ fontSize: '24pt', marginBottom: '15px' }}>
                  {title}
                </h1>
                <div style={{ fontSize: '11pt', lineHeight: '15pt' }}>
                  {parse(contentTitle)}
                </div>
              </div>
              {(phanquyen === true || (bophan && tableAData.some(item => item.bophan === bophan && item.chinhanh === true))) && (
                <div className='backgoround-niso-from bg-white'>
                  <select
                    className='text-sm select-option-niso uppercase'
                    style={{ width: '100%' }}
                    onChange={handleInputChange}
                    value={formData.chi_nhanh}
                    name="chi_nhanh"
                  >
                    <option>Chọn cửa hàng</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.restaurant}>
                        {branch.restaurant}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {questions &&
                questions.map((question, index) => (
                  <div key={index}>
                    {Object.keys(question).some(key => (key.startsWith('tieudephieuthem') || key.startsWith('noidungphieuthem')) && question[key]) && (
                      <div className='backgoround-niso-from bg-white border-left-niso flex flex-col'>
                        {Object.keys(question)
                          .filter(key => (key.startsWith('tieudephieuthem') || key.startsWith('noidungphieuthem')) && question[key])
                          .map((key, i, arr) => (
                            <span key={key} className={key.startsWith('tieudephieuthem') ? 'font-bold' : 'mt-4'}>
                              {/* {`${++tieudephieuthemCount}.`}  */}
                              {parse(question[key])}
                              {i < arr.length - 1 && <br />}
                            </span>
                          ))}
                      </div>
                    )}

                    <div className='backgoround-niso-from bg-white'>
                      <div style={{ fontSize: '1.0625rem', marginBottom: '15px' }}>
                        {Object.keys(question).map((key, i) => {
                          if (key.startsWith('Cauhoi')) {
                            const isCauhoiBatbuoc = question.cauhoibatbuoc && <LuAsterisk />;
                            return (
                              <span key={key} style={{ fontSize: '11pt', marginBottom: '15px' }} className='flex gap-1'>
                                {/* <span>{`${i + 1}.${i + 1}`}</span>  */}
                                <span>{parse(question[key])}</span>{' '}
                                <span className={`text-red-600 font-bold text-sm${isCauhoiBatbuoc ? 'visible' : 'hidden'}`}>{isCauhoiBatbuoc}</span>
                              </span>
                            );
                          }
                          return null;
                        })}
                        <ul>
                          {Object.keys(question.luachon).map((optionKey, optionIndex) => (
                            <li key={optionIndex}>
                              {question.luachon[optionKey] && (
                                <>
                                  {optionKey === 'option0' && (
                                    <span style={{ display: 'grid' }}>
                                      <div>{parse(question.noidung)}</div>
                                    </span>
                                  )}

                                  {optionKey === 'option1' && (
                                    <span style={{ display: 'grid' }}>
                                      <textarea
                                        placeholder="Câu trả lời của bạn..."
                                        className="textareareplly"
                                        id={`cau_tra_loi${index}`}
                                        name="cau_tra_loi"
                                        value={formData.pairs[index]?.cau_tra_loi || ''}
                                        onChange={(e) => handlePairChange(index, e)}
                                      />
                                    </span>
                                  )}
                                  {optionKey === 'option2' && (
                                    <span>
                                      {question.options.map((option, optionIndex) => (
                                        <div key={optionIndex}>
                                          {option.tuychon && (
                                            <label className="containerCicles">
                                              <input
                                                type="radio"
                                                className='Cricle-inputs'
                                                name={`question_${index}`}
                                                value={option.tuychon}
                                                onChange={() => handleContentSelection(index, option.tuychon)}
                                              />
                                              <p>{option.tuychon}</p>
                                              <span className="checkmarkCricles"></span>
                                            </label>
                                          )}
                                        </div>
                                      ))}
                                      {question.tuychonkhac && (
                                        <label className="containerCicles">
                                          <input
                                            type="radio"
                                            className='Cricle-inputs'
                                            name={`question_${index}`}
                                          />
                                          <div className='flex gap-4'>
                                            <p>Mục khác:</p>
                                            <input
                                              type='text'
                                              placeholder='Nhập câu trả lời khác'
                                              className='khac-niso'
                                              onChange={(e) => {
                                                handleKhacInputChange(index, e);
                                              }}
                                            />
                                          </div>
                                          <span className="checkmarkCricles"></span>
                                        </label>
                                      )}

                                    </span>
                                  )}

                                  {optionKey === 'option3' && (
                                    <span>
                                      {question.options.map((option, optionIndex) => (
                                        <label className="container-checkbox-nisos" key={optionIndex}>
                                          <input
                                            type="checkbox"
                                            className='input-checkboxs'
                                            value={option.tuychonnhieu}
                                            onChange={(e) => handleCheckboxChange(index, option.tuychonnhieu, e.target.checked)}
                                          />
                                          <span>{option.tuychonnhieu}</span>
                                          <span className="checkmarks"></span>
                                        </label>
                                      ))}
                                      {question.tuychonnhieukhac && (
                                        <label className="container-checkbox-nisos" key={optionIndex}>
                                          <input
                                            type="checkbox"
                                            className='input-checkboxs'
                                            onChange={(e) => {
                                              handleCheckboxChange(index, e.target.checked);
                                            }}
                                          />
                                          <div className='flex gap-4'>
                                            <p>Mục khác:</p>
                                            <input
                                              type='text'
                                              placeholder='Nhập câu trả lời khác'
                                              className='khac-niso'
                                              onChange={(e) => {
                                                handleKhacInputChange(index, e);
                                              }}
                                            />
                                          </div>
                                          <span className="checkmarks"></span>
                                        </label>
                                      )}
                                    </span>
                                  )}

                                  {optionKey === 'option4' && (
                                    <span>
                                      {question.luachonbieutuong.ngoisao && (
                                        <div className='grid-con-niso-click'>
                                          {Array.from({ length: question.plusnumber }).map((_, index) => (
                                            <div key={index}>
                                              {selectedNgoisaoIndex >= index + 1 ? (
                                                <FaStar size={32} className='icon-color-niso' />
                                              ) : (
                                                <FaRegStar size={32} style={{ cursor: 'pointer' }} />
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {question.luachonbieutuong.traitim && (
                                        <div className='grid-con-niso-click'>
                                          {Array.from({ length: question.plusnumber }).map((_, index) => (
                                            <div key={index}>
                                              {index < selectedTraitimIndex ? (
                                                <FaHeart
                                                  size={32}
                                                  className='icon-color-niso'
                                                  onClick={() => setSelectedTraitimIndex(index)}
                                                />
                                              ) : (
                                                <FaRegHeart
                                                  size={32}
                                                  style={{ cursor: 'pointer' }}
                                                  onClick={() => {
                                                    if (selectedTraitimIndex === index) {
                                                      setSelectedTraitimIndex(null);
                                                    } else {
                                                      setSelectedTraitimIndex(index);
                                                    }
                                                  }}
                                                />
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {question.luachonbieutuong.daukiem && (
                                        <div className='grid-con-niso-click'>
                                          {Array.from({ length: question.plusnumber }).map((_, index) => (
                                            <div key={index}>
                                              {selectedDaukiemIndex >= index + 1 ? (
                                                <FaCircleCheck size={32} className='icon-color-niso' />
                                              ) : (
                                                <FaRegCircleCheck size={32} style={{ cursor: 'pointer' }} />
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {question.luachonbieutuong.so && (
                                        <div className='grid-con-niso-click'>
                                          {Array.from({ length: question.plusnumber }).map((_, index) => (
                                            <div key={index}>
                                              {selectedSoIndex >= index + 1 ? (
                                                <div style={{ padding: '10px 15px' }} className='number-niso-option-active'>{index + 1}</div>
                                              ) : (
                                                <div style={{ padding: '10px 15px' }} className='number-niso-option'>{index + 1}</div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </span>
                                  )}
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              {showModal && (
                <div className="modal" >
                  <div className="modal-content">
                    <h1 style={{ color: 'red', textAlign: 'center' }} className='font-black text-2xl'>Warning !</h1>
                    <h3 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }} className='text-sm'>Bạn chắc chắn muốn gửi Form này?</h3>
                    <span className='button-box-modal'>
                      <button onClick={handleSubmit} className='text-sm'>Xác nhận</button>
                      <button onClick={closeModal} className='text-sm'>Hủy</button>
                    </span>
                  </div>
                </div>
              )}
              <div className='flex items-center justify-between backgoround-niso-from bg-white'>
                <button style={{ padding: '15px 50px' }} className='text-sm' onClick={openModal}>
                  Gửi
                </button>
                <span
                  className='text-sm cursor-pointer text-center text-niso-hover'
                  onClick={handleClearAll}
                >
                  Xóa hết câu trả lời
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      {errorMessage}
      <BacktoTop />
    </>
  );
};

export default Docs;