import useStateArray from "../function/useStateArray";
import axios from 'axios';
import { API_URL } from "../../api";
import React, { useEffect } from 'react';
import { Thoigian } from '../function/date';
import addElement from "../function/addElement";
import Element from "./Element";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Notification from '../Notification';
const Create = ({ phanquyen, bophan, name }) => {
    const {
        title, error,
        setError,
        setTitle,
        contentTitle,
        setContentTitle,
        bophanAD,
        setBophanAD,
        tableAData, setShowNotification,
        setTableAData,
    } = useStateArray();
    const {
        handleContent, handleAddOption, handleTuychonall, tuychonkhac, setTuychonkhac,
        questions, tuychonall, handleRemoveOption, tuychonnhieukhac, setTuychonnhieukhac,
        setTuychonall, handleElemRemove, handleRatingChange, setCauhoibatbuoc, cauhoibatbuoc,
        handleAnswerTypeChange, handleTuychon, tieudephieuthem, noidungphieuthem, setTieudephieuthem,
        showFirstElement, handleDeleteOption, setNoidungphieuthem, noidung, setNoidung,
        addcontent, tuychon, ratingLevels, isAdditionalSectionVisible, setIsAdditionalSectionVisible,
        handleQuestionContentChange, handleMoveDown, handleMoveUp,
        selectedOption, handleIconChange,
        options, selectedIcon,
        setOptions,
    } = addElement();

    const handleSaveData = async () => {
        let response;
        try {
            const existingTitlesResponse = await axios.get(`${API_URL}/docs/all`);
            const existingTitles = existingTitlesResponse.data;
    
            if (existingTitles.includes(title)) {
                setError(<Notification type="warning" content="Tiêu đề đã tồn tại. Vui lòng chọn tiêu đề khác." onClose={() => setShowNotification(null)}/>);
                return;
            }
            
            if (!bophanAD) {
                setError(<Notification type="warning" content="Vui lòng chọn phòng ban" onClose={() => setShowNotification(null)}/>);
                return;
            }
            if (!title) {
                setError(<Notification type="warning" content="Vui lòng nhập tiêu đề" onClose={() => setShowNotification(null)}/>);
                return;
            }
            const filteredQuestions = questions.filter(question => question.trim() !== '');

            const formattedQuestions = filteredQuestions.map((question, index) => {
                const formattedOptions = (options[index]?.options?.map((option, idx) => ({
                    tuychon: tuychon[index]?.[idx]?.name || '',
                    tuychonnhieu: tuychonall[index]?.[idx]?.name || '',
                })) || []);

                return {
                    [`Cauhoi${index + 1}`]: question,
                    options: formattedOptions,
                    luachon: {
                        option0: selectedOption[index] === 'option0',
                        option1: selectedOption[index] === 'option1',
                        option2: selectedOption[index] === 'option2',
                        option3: selectedOption[index] === 'option3',
                        option4: selectedOption[index] === 'option4',
                    },
                    luachonbieutuong: {
                        ngoisao: selectedIcon[index] === 'ngoisao',
                        traitim: selectedIcon[index] === 'traitim',
                        daukiem: selectedIcon[index] === 'daukiem',
                        so: selectedIcon[index] === 'so',
                    },
                    plusnumber: ratingLevels[index],
                    tuychonkhac: tuychonkhac[index] ? true : false,
                    tuychonnhieukhac: tuychonnhieukhac[index] ? true : false,
                    cauhoibatbuoc: cauhoibatbuoc[index] ? true : false,
                    tieudephieuthem: tieudephieuthem[index],
                    noidungphieuthem: noidungphieuthem[index],
                    noidung: noidung[index],
                };
            });

            if (formattedQuestions.length === 0) {
                setError(<Notification type="warning" content="Vui lòng nhập ít nhất một câu hỏi trước khi tạo phiếu" onClose={() => setShowNotification(null)}/>);
                return;
            }
            response = await axios.post(`${API_URL}/docs/add`, {
                date: Thoigian,
                title,
                bophanAD,
                contentTitle,
                nguoitaophieu: name,
                questions: formattedQuestions,
            });
            console.clear('Data saved successfully:', response.data);
            setError(<Notification type="success" content="tạo phiếu thành công !" onClose={() => setShowNotification(null)}/>);
            setContentTitle('');
            setTitle('');
            setBophanAD('');
            setOptions('');
        } catch (error) {
            console.error('Error saving data:', error);
            if (response) {
                console.error('Response status:', response.status);
            }
        }
    }

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

    return (
        <div className="background-niso-form-actions line-header-niso">
            <div className='backgoround-niso-from grid bg-white dark:bg-slate-900'>
                <title>Tạo phiếu khảo sát</title>
                <h3 className='font-bold dark:text-white'>Chọn phòng ban tạo phiếu</h3>
                <select
                    className='text-sm select-option-niso uppercase'
                    style={{ marginTop: '15px' }}
                    value={bophanAD}
                    onChange={(e) => setBophanAD(e.target.value)}
                >
                    <option value="">Vui lòng chọn một phòng ban</option>
                    {phanquyen === true && (
                        <>
                            {tableAData.map((bophanValue, index) => (
                                <option key={index} value={bophanValue.bophan}>
                                    {bophanValue.bophan}
                                </option>
                            ))}
                        </>
                    )}
                    {phanquyen === false && (
                        <option value={bophan}>{bophan}</option>
                    )}
                </select>
            </div>
            <div className='backgoround-niso-from niso-box-title bg-white dark:bg-slate-900'>
                <input
                    type='text'
                    name="title"
                    value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder='Nhập tiêu đề khảo sát...'
                    className='input-title-niso'
                />
                <CKEditor
                    editor={ClassicEditor}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setContentTitle(data);
                    }}
                    config={{
                        placeholder: 'Nhập nội dung phiếu...',
                    }}
                    data={contentTitle}
                />
            </div>
            <Element
                handleAnswerTypeChange={handleAnswerTypeChange}
                showFirstElement={showFirstElement}
                addcontent={addcontent}
                handleQuestionContentChange={handleQuestionContentChange}
                selectedOption={selectedOption}
                questions={questions}
                noidung={noidung} 
                setNoidung={setNoidung}
                handleAddOption={handleAddOption}
                handleRatingChange={handleRatingChange}
                tuychonall={tuychonall}
                tieudephieuthem={tieudephieuthem}
                noidungphieuthem={noidungphieuthem}
                setTieudephieuthem={setTieudephieuthem}
                setTuychonall={setTuychonall}
                handleDeleteOption={handleDeleteOption}
                tuychonnhieukhac={tuychonnhieukhac}
                options={options}
                cauhoibatbuoc={cauhoibatbuoc}
                setCauhoibatbuoc={setCauhoibatbuoc}
                tuychonkhac={tuychonkhac}
                setTuychonkhac={setTuychonkhac}
                setTuychonnhieukhac={setTuychonnhieukhac}
                setNoidungphieuthem={setNoidungphieuthem}
                handleMoveDown={handleMoveDown}
                handleMoveUp={handleMoveUp}
                tuychon={tuychon}
                handleTuychon={handleTuychon}
                handleTuychonall={handleTuychonall}
                setOptions={setOptions}
                handleIconChange={handleIconChange}
                selectedIcon={selectedIcon}
                isAdditionalSectionVisible={isAdditionalSectionVisible}
                setIsAdditionalSectionVisible={setIsAdditionalSectionVisible}
                ratingLevels={ratingLevels}
                handleElemRemove={handleElemRemove}
                handleRemoveOption={handleRemoveOption}
            />
            <div className='flex items-center justify-between backgoround-niso-from bg-white dark:bg-slate-900'>
                <button onClick={handleSaveData} className='text-sm'>Đăng khảo sát</button>
                <button onClick={() => handleContent("elements")} className='text-sm'>Tạo một câu hỏi</button>
            </div>
            {error}
        </div>
    );
};

export default Create;
