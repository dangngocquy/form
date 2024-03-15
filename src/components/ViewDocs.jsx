import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../api';
import axios from 'axios';
import DeleteHTML from './function/DeleteHTML';
import * as XLSX from 'xlsx';
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import useStateArray from './function/useStateArray';
import Notification from './Notification';
import { LuAsterisk } from "react-icons/lu";
import parse from 'html-react-parser';
import BacktoTop from './function/BacktoTop';

const ViewDocs = () => {
  const { keys } = useParams();
  const [content, setContent] = useState([]);
  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();
  const { setShowNotification, successMessage, setSuccessMessage } = useStateArray();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/content/${keys}`);
        const data = response.data;
        setContent(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [keys]);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await axios.get(`${API_URL}/docs/all`);
        const data = response.data;
        setDocs(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocs();
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDownloadExcel = () => {
    const worksheetData = content.map((item) => [
      item.ngay_tao_phieu || '',
      item.ngay_phan_hoi || '',
      item.bo_phan || '',
      item.chi_nhanh || '',
      item.ten_phieu || '',
      item.noi_dung_phieu || '',
      item.cau_hoi || '',
      item.cau_tra_loi || '',
      item.tieudephu || '',
      item.noidungphu || '',
    ]);

    const headerRow = [
      'Ngày tạo phiếu',
      'Ngày phản hồi',
      'Bộ phận',
      'Chi nhánh cửa hàng',
      'Tên phiếu',
      'Nội dung phiếu',
      'Câu hỏi',
      'Câu trả lời',
      'Tiêu đề phụ của câu hỏi',
      'Nội dung phụ của câu hỏi',
    ];

    const ws = XLSX.utils.aoa_to_sheet([headerRow, ...worksheetData]);
    const wb = XLSX.utils.book_new();

    const fileName = `Checklist_${content[0]?.ten_phieu || 'default'}.xlsx`;

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);

    setSuccessMessage(
      <Notification
        type="success"
        content="Tải xuống file Excel thành công!"
        onClose={() => setShowNotification(null)}
      />
    );
  };


  //Xử lý logic mảng :)) để views histoty
  const relatedDocs = docs.filter(doc => content.some(item => item.keysJSON === doc.id));// má phải check keysJSON với keys :))) l0z má 1 tuần ms tìm đc cách
  const relatedContent = content.filter((item, index, self) => {
    return (
      index === self.findIndex((t) => (
        t.keysJSON === item.keysJSON
      ))
    );
  });
  return (
    <div className='line-header-niso' style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className='backgoround-niso-from flex items-center justify-between bg-white'>
          <button className='text-sm' onClick={handleGoBack}>Quay lại</button>
          <button className='text-sm flex gap-3 items-center' onClick={handleDownloadExcel}><PiMicrosoftExcelLogoFill size={21} />Tải xuống Excel</button>
        </div>
        <div className='backgoround-niso-from bg-white'>
          {relatedContent.map((item, docIndex) => (
            <div key={docIndex}>
              <div className='box-niso-time-users' key={docIndex}>
                <span style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <h3>Người phản hồi</h3>
                  <p>{item.nguoi_tra_loi}</p>
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <h3>Ngày phản hồi</h3>
                  <p>{item.ngay_phan_hoi}</p>
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <h3>Tổng số câu</h3>
                  <p>Null</p>
                </span>
              </div>
              {relatedDocs.map((doc, docIndex) => (
                <div key={docIndex}>
                  <title>Niso - Phản hồi checklist {doc.title}</title>
                  <div className='backgoround-niso-from bg-white niso-box-titles'>
                    <h2 className='size-kl' style={{ marginBottom: '15px' }}>{doc.title}</h2>
                    <div style={{ fontSize: '11pt', lineHeight: '15pt' }}>{parse(doc.contentTitle)}</div>
                  </div>
                </div>
              ))}
              <div className='box-niso-time-users' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '15px' }}>
                <h2 className='font-bold'>Chi nhánh</h2>
                <select disabled className='select-option-niso' style={{ width: '100%' }}>
                  <option>{item.chi_nhanh}</option>
                </select>
              </div>
              {relatedDocs.map((doc, index) => {
                return (
                  <div key={index + 1}>
                    {doc.questions.map((question, qIndex) => {
                      const cauhoi = content[qIndex].cau_tra_loi
                      return (
                        <div key={qIndex}>
                          {question.tieudephieuthem &&
                            <div className='backgoround-niso-from bg-white border-left-niso'>
                              <span className='font-bold'>{question.tieudephieuthem}</span>
                              {question.noidungphieuthem && (
                                <div style={{ fontSize: '11pt', lineHeight: '15pt' }} className='mt-3'>
                                  {question.noidungphieuthem}
                                </div>
                              )}
                            </div>
                          }
                          <div className='backgoround-niso-from bg-white flex flex-col'>
                            <span style={{ fontSize: '11pt', marginBottom: '15px' }} className='flex gap-1'>
                              <span>{parse(question[`Cauhoi${qIndex + 1}`])}</span>
                              <span>{question.cauhoibatbuoc && <LuAsterisk className='text-red-600 font-bold text-sm' />}</span>
                            </span>
                            {Object.keys(question.luachon).map((optionKey, optionIndex) => (
                              <div key={optionIndex}>
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
                                          value={cauhoi}
                                          disabled
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
                                                  value={option.tuychon}
                                                  disabled
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
                                              disabled
                                            />
                                            <div className='flex gap-4'>
                                              <p>Mục khác:</p>
                                              <input
                                                type='text'
                                                placeholder='Câu trả lời khác'
                                                className='khac-niso'
                                                disabled
                                              />
                                            </div>
                                            <span className="checkmarkCricles"></span>
                                          </label>
                                        )}
                                        <div className='dapan-niso'>
                                          <b>Câu trả lời</b>
                                          <label className="containerCicles">
                                            <input
                                              type="radio"
                                              className='Cricle-inputs'
                                              defaultChecked
                                            />
                                            <p>{cauhoi}</p>
                                            <span className="checkmarkCricles"></span>
                                          </label>
                                        </div>
                                      </span>
                                    )}
                                    {optionKey === 'option3' && (
                                      <span>
                                        option3
                                      </span>
                                    )}
                                    {optionKey === 'option4' && (
                                      <span>
                                        option4
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {successMessage}
      <BacktoTop />
    </div>
  );
};

export default ViewDocs;
