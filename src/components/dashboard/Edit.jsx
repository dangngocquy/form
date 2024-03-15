import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useNavigate } from 'react-router-dom';
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaRegStar, FaRegHeart } from "react-icons/fa";
import Modal from '../function/Modal';
import Notification from '../Notification';
import useStateArray from '../function/useStateArray';
import BacktoTop from '../function/BacktoTop';
import LoadingEdit from '../function/LoadingEdit';
import { Thoigian } from '../function/date';

const Edit = ({ name, bophan }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedIcon, setSelectedIcon] = useState('');
  const [selectedScore, setSelectedScore] = useState('');
  const [cloneIndex, setCloneIndex] = useState(0);
  const [cloning, setCloning] = useState(false);
  const [docData, setDocData] = useState({
    title: '',
    contentTitle: '',
    bophanAD: '',
    date: '',
    questions: [],
    nguoitaophieu: '',
    nguoichinhsua: '',
    ngaychinhsua: '',
  });
  const { successMessage, setSuccessMessage, setShowNotification } = useStateArray();
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(10);
  
  const {
    openModal,
    closeModal,
    showModal,
    openModalbt, closeModalbt, showModalbt
  } = Modal();

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        const response = await axios.get(`${API_URL}/docs/get/${id}`);
        setDocData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching document data:', error);
      }
    };

    fetchDocumentData();
  }, [id]);

  const handleEdit = async () => {
    try {
      if (unsavedChanges) {
        const updatedDocData = {
          ...docData,
          nguoichinhsua: `${name} - ( ${bophan} )`,
          ngaychinhsua: Thoigian
        };

        const response = await axios.put(`${API_URL}/docs/update/${id}`, updatedDocData);
        console.clear(response.data);
        setSuccessMessage(<Notification type="success" content="Cập nhật phiếu thành công !" onClose={() => setShowNotification(null)}/>);
        closeModal();
      } else {
        setSuccessMessage(<Notification type="warning" content="Không có thay đổi để cập nhật !" onClose={() => setShowNotification(null)}/>);
      }
    } catch (error) {
      console.error('Error editing document:', error);
    }
  };

  const handleClone = async () => {
    try {
      setCloning(true);
      const clonedDocData = { ...docData };
      setCloneIndex(cloneIndex + 1);
      clonedDocData.title = `${clonedDocData.title} (Bản sao ${cloneIndex + 1})`;
      clonedDocData.id = null;

      clonedDocData.nguoitaophieu = [name];
      clonedDocData.bophanAD = [bophan]
      clonedDocData.date = [Thoigian]
  
      const response = await axios.post(`${API_URL}/docs/add`, clonedDocData);
      console.clear(response.data);
      setSuccessMessage(<Notification type="success" content={`Nhân bản phiếu thành công! (Bản sao ${cloneIndex + 1})`} onClose={() => setShowNotification(null)}/>);
      closeModalbt();
    } catch (error) {
      console.error('Error cloning document:', error);
    } finally {
      setCloning(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('Cauhoi')) {
      const questionIndex = parseInt(name.replace('Cauhoi', ''), 10) - 1;

      setDocData((prevData) => {
        const updatedQuestions = [...prevData.questions];
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          [name]: value,
        };

        return {
          ...prevData,
          questions: updatedQuestions,
        };
      });
    } else {
      setDocData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    setUnsavedChanges(true);
  };

  const handleCKEditorChange = (event, editor, questionIndex) => {
    const data = editor.getData();
    setDocData((prevData) => {
      if (questionIndex === -1) {
        return {
          ...prevData,
          contentTitle: data,
        };
      } else {
        const updatedQuestions = [...prevData.questions];
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          [`Cauhoi${questionIndex + 1}`]: data,
        };

        return {
          ...prevData,
          questions: updatedQuestions,
        };
      }
    });
    setUnsavedChanges(true);
  };

  const handleOptionChange = (e, questionIndex, optionIndex) => {
    const { value } = e.target;

    setDocData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      const updatedOptions = [...updatedQuestions[questionIndex].options];

      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        tuychon: value,
      };

      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: updatedOptions,
      };

      return {
        ...prevData,
        questions: updatedQuestions,
      };
    });
    setUnsavedChanges(true);
  };

  const handleMultiChoiceOptionChange = (e, questionIndex, optionIndex) => {
    const { value } = e.target;

    setDocData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      const updatedOptions = [...updatedQuestions[questionIndex].options];

      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        tuychonnhieu: value,
      };

      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: updatedOptions,
      };

      return {
        ...prevData,
        questions: updatedQuestions,
      };
    });
    setUnsavedChanges(true);
  };

  const handleIconChange = (e, questionIndex) => {
    const { value } = e.target;

    setDocData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      const updatedLuachonbieutuong = { ...updatedQuestions[questionIndex].luachonbieutuong };

      setSelectedIcon(value);

      updatedLuachonbieutuong.ngoisao = value === 'ngoisao';
      updatedLuachonbieutuong.traitim = value === 'traitim';
      updatedLuachonbieutuong.daukiem = value === 'daukiem';
      updatedLuachonbieutuong.so = value === 'so';

      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        luachonbieutuong: updatedLuachonbieutuong,
      };

      return {
        ...prevData,
        questions: updatedQuestions,
      };
    });
    setUnsavedChanges(true);
  };

  const handleScoreChange = (e, questionIndex) => {
    const { value } = e.target;

    setDocData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      const updatedLuachonbieutuong = { ...updatedQuestions[questionIndex].luachonbieutuong };

      setSelectedScore(value);

      updatedLuachonbieutuong.score = value;

      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        luachonbieutuong: updatedLuachonbieutuong,
        plusnumber: parseInt(value, 10),
      };

      return {
        ...prevData,
        questions: updatedQuestions,
      };
    });
    setUnsavedChanges(true);
  };

  const handleOption0Change = (event, editor, questionIndex) => {
    const data = editor.getData();
    setDocData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        noidung: data,
      };

      return {
        ...prevData,
        questions: updatedQuestions,
      };
    });
    setUnsavedChanges(true);
  };
  const handleAdditionalTitleChange = (e, questionIndex) => {
    const { value } = e.target;

    setDocData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        tieudephieuthem: value,
      };

      return {
        ...prevData,
        questions: updatedQuestions,
      };
    });
    setUnsavedChanges(true);
  };

  const handleAdditionalContentChange = (event, editor, questionIndex) => {
    const data = editor.getData();
    setDocData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        noidungphieuthem: data,
      };

      return {
        ...prevData,
        questions: updatedQuestions,
      };
    });
    setUnsavedChanges(true);
  };


  const handleClick = () => {
    navigate(`/auth/docs/views/${docData.id}`);
  };
  return (
    <div style={{ minHeight: '100vh' }} className='line-header-niso'>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <title>Niso | Chỉnh sửa phiếu {docData.title}</title>
        <div>
          <div className='backgoround-niso-from flex items-center justify-between bg-white'>
            <button className='text-sm' onClick={handleGoBack}>Quay lại</button>
            <div className='flex gap-4'>
              <button onClick={openModalbt} disabled={cloning}>{cloning ? 'Đang nhân bản...' : 'Nhân bản'}</button>
              <button onClick={handleClick}>Xem trước phiếu</button>
            </div>
          </div>
          {loading ? (
            <>
              {[...Array(10)].map((_, index) => (
                <LoadingEdit key={`loading_${index}`} />
              ))}
            </>
          ) : (
            <>
              <div className='backgoround-niso-from niso-box-titles bg-white'>
                <input
                  type='text'
                  name="title"
                  value={docData.title}
                  onChange={handleInputChange}
                  placeholder='Nhập tiêu đề khảo sát...'
                  className='input-title-niso'
                  style={{ width: '100%' }}
                />
                <CKEditor
                  editor={ClassicEditor}
                  onChange={(event, editor) => handleCKEditorChange(event, editor, -1)}
                  config={{
                    placeholder: 'Nhập nội dung phiếu...',
                  }}
                  data={docData.contentTitle}
                />
              </div>

              {docData.questions.map((question, index) => (
                <div key={`question_${index}`}>
                  {question.tieudephieuthem || question.noidungphieuthem ? (
                    <div className='backgoround-niso-from bg-white border-left-niso'>
                      <input
                        type='text'
                        value={question.tieudephieuthem}
                        placeholder='Nhập tiêu đề phụ cho câu hỏi(Không bắt buộc)'
                        className='input-title-nisos'
                        onChange={(e) => handleAdditionalTitleChange(e, index)}
                      />
                      <div style={{ marginTop: '15px' }}>
                        <CKEditor
                          editor={ClassicEditor}
                          onChange={(event, editor) => handleAdditionalContentChange(event, editor, index)}
                          config={{
                            placeholder: `Nhập nội dung phụ cho câu hỏi (Không bắt buộc)`,
                          }}
                          data={question.noidungphieuthem}
                        />
                      </div>
                    </div>
                  ) : null}
                  <div className='backgoround-niso-from bg-white'>
                    <div>
                      <CKEditor
                        editor={ClassicEditor}
                        onChange={(event, editor) => handleCKEditorChange(event, editor, index)}
                        config={{
                          placeholder: `Nhập nội dung câu hỏi ${index + 1}...`,
                        }}
                        data={question[`Cauhoi${index + 1}`] || ''}
                      />
                    </div>

                    {question.luachon && (
                      <div style={{ marginTop: '15px' }}>
                        {question.luachon.option1 &&
                          <span style={{ display: 'grid' }}>
                            <textarea
                              placeholder="Câu trả lời của bạn..."
                              className="textareareplly"
                              disabled
                            />
                          </span>
                        }
                        {question.luachon.option0 && (
                          <CKEditor
                            editor={ClassicEditor}
                            onChange={(event, editor) => handleOption0Change(event, editor, index)}
                            config={{
                              placeholder: `Nhập nội dung chỉnh sửa...`,
                            }}
                            data={question.noidung}
                          />
                        )}
                        {question.luachon.option2 && (
                          <div style={{ marginTop: '15px' }}>
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex}>
                                {option.tuychon && (
                                  <>
                                    <label className="containerCicles">
                                      <input
                                        type="radio"
                                        className='Cricle-inputs'
                                        name={`question_${index}`}
                                        disabled
                                      />
                                      <input
                                        type='text'
                                        placeholder='Nhập nội dung câu trả lời...'
                                        value={option.tuychon}
                                        onChange={(e) => handleOptionChange(e, index, optionIndex)}
                                        className='question-container-niso-question'
                                      />
                                      <span className="checkmarkCricles" style={{ top: '10px' }}></span>
                                    </label>
                                  </>
                                )}
                              </div>
                            ))}
                            {question.tuychonkhac && (
                              <label className="containerCicles">
                                <input
                                  type="radio"
                                  className='Cricle-inputs'
                                  name={`question_${index}`}
                                  disabled
                                />
                                <input type='text' placeholder='Câu trả lời khác' className='question-container-niso-question' disabled />
                                <span className="checkmarkCricles" style={{ top: '10px' }}></span>
                              </label>
                            )}
                          </div>
                        )}
                        {question.luachon.option3 && (
                          <div>
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} style={{ marginTop: '15px' }}>
                                {option.tuychonnhieu && (
                                  <label className="container-checkbox-nisos">
                                    <input
                                      type="checkbox"
                                      className='input-checkboxs'
                                      name={`question_${index}`}
                                      disabled
                                    />
                                    <input
                                      type='text'
                                      placeholder='Nhập nội dung câu trả lời...'
                                      value={option.tuychonnhieu}
                                      onChange={(e) => handleMultiChoiceOptionChange(e, index, optionIndex)}
                                      className='question-container-niso-question'
                                    />
                                    <span className="checkmarks" style={{ top: '10px' }}></span>
                                  </label>
                                )}
                              </div>
                            ))}
                            {question.tuychonnhieukhac && (
                              <label className="container-checkbox-nisos" >
                                <input
                                  type="checkbox"
                                  className='input-checkboxs'
                                  name={`question_${index}`}
                                  disabled
                                />
                                <input type='text' placeholder='Câu trả lời khác' className='question-container-niso-question' disabled />
                                <span className="checkmarks" style={{ top: '10px' }}></span>
                              </label>
                            )}
                          </div>
                        )}
                        {question.luachon.option4 &&
                          <div>
                            {question.luachonbieutuong.ngoisao && (
                              <div>
                                <div className='grid-con-niso-click'>
                                  {Array.from({ length: question.plusnumber }, (_, index) => (
                                    <span key={index}><FaRegStar size={32} /></span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {question.luachonbieutuong.traitim && (
                              <div>
                                <div className='grid-con-niso-click'>
                                  {Array.from({ length: question.plusnumber }, (_, index) => (
                                    <span key={index}><FaRegHeart size={32} /></span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {question.luachonbieutuong.daukiem && (
                              <div>
                                <div className='grid-con-niso-click'>
                                  {Array.from({ length: question.plusnumber }, (_, index) => (
                                    <span key={index}><FaRegCircleCheck size={32} /></span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {question.luachonbieutuong.so && (
                              <div>
                                <div className='grid-con-niso-click'>
                                  {Array.from({ length: question.plusnumber }, (_, index) => (
                                    <div style={{ padding: '10px 15px' }} className='number-niso-option' key={index}>{index + 1}</div>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div style={{ marginTop: '15px' }} className='flex justify-between'>
                              <span>
                                <span className='dark:text-white'>Biểu tượng: </span>
                                <select
                                  className='select-option-niso'
                                  value={selectedIcon}
                                  onChange={(e) => handleIconChange(e, index)}
                                >
                                  <option value="">Chọn một biểu tượng</option>
                                  <option value="ngoisao">Ngôi sao</option>
                                  <option value="traitim">Trái tim</option>
                                  <option value="daukiem">Dấu kiểm</option>
                                  <option value="so">Số</option>
                                </select>
                              </span>
                              <span>
                                <span className='dark:text-white'>Thang điểm: </span>
                                <select
                                  className='select-option-niso'
                                  value={selectedScore}
                                  onChange={(e) => handleScoreChange(e, index)}
                                >
                                  {[...Array(10).keys()].map((value) => (
                                    <option key={value} value={value + 1} className="dark:text-white">{value + 1}</option>
                                  ))}
                                </select>
                              </span>
                            </div>
                          </div>
                        }
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
          <div className='flex items-center justify-between backgoround-niso-from bg-white'>
            <button style={{ padding: '15px 50px' }} className='text-sm' onClick={openModal}>
              Cập nhật
            </button>
            <button>Xóa phiếu ?</button>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal" >
          <div className="modal-content">
            <h1 style={{ color: 'red', textAlign: 'center' }} className='font-black text-2xl'>Warning !</h1>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }} className='text-sm'>Bạn chắc chắn muốn cập nhật lại phiếu?</h3>
            <span className='button-box-modal'>
              <button onClick={handleEdit} className='text-sm'>Xác nhận</button>
              <button onClick={closeModal} className='text-sm'>Hủy</button>
            </span>
          </div>
        </div>
      )}
      {showModalbt && (
        <div className="modal" >
          <div className="modal-content">
            <h1 style={{ color: 'red', textAlign: 'center' }} className='font-black text-2xl'>Warning !</h1>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }} className='text-sm'>Xác nhận nhân bản phiếu "{docData.title}" ?</h3>
            <span className='button-box-modal'>
              <button onClick={handleClone} className='text-sm'>Xác nhận</button>
              <button onClick={closeModalbt} className='text-sm'>Hủy</button>
            </span>
          </div>
        </div>
      )}
      {successMessage}
      <BacktoTop />
    </div>
  );
};

export default Edit;