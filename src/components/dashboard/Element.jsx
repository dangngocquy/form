import { AiOutlineDelete } from "react-icons/ai";
import { FaRegStar, FaRegHeart } from "react-icons/fa";
import { FaRegCircleCheck, FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

function Element({
    handleAnswerTypeChange, handleAddOption, selectedIcon, setTuychonnhieukhac, tuychonkhac, setTuychonkhac,
    showFirstElement, handleElemRemove, tuychon, handleRatingChange, tuychonnhieukhac, noidung, setNoidung,
    addcontent, handleDeleteOption, handleTuychon, cauhoibatbuoc, setCauhoibatbuoc,
    handleQuestionContentChange, handleTuychonall, handleMoveDown, handleMoveUp, setIsAdditionalSectionVisible, isAdditionalSectionVisible,
    questions, handleRemoveOption, ratingLevels, tieudephieuthem, setTieudephieuthem, noidungphieuthem, setNoidungphieuthem,
    selectedOption, tuychonall, options, handleIconChange }) {
    return (
        <>
            {addcontent && addcontent.map((elemName, index) => (
                <div key={index}>
                    {showFirstElement && (
                        <>
                            {isAdditionalSectionVisible[index] && (
                                <div className='backgoround-niso-from bg-white dark:bg-slate-900 border-left-niso'>
                                    <input
                                        placeholder='Thêm tiêu đề phụ cho câu hỏi (Không bắt buộc)'
                                        className='input-title-nisos'
                                        style={{ marginBottom: '15px' }}
                                        value={tieudephieuthem[index]}
                                        onChange={(e) => {
                                            const newTieudephieuthem = [...tieudephieuthem];
                                            newTieudephieuthem[index] = e.target.value;
                                            setTieudephieuthem(newTieudephieuthem);
                                        }}
                                    />
                                    <CKEditor
                                        editor={ClassicEditor}
                                        config={{
                                            placeholder: 'Nhập nội dung phụ cho câu hỏi (Không bắt buộc)',
                                        }}
                                        className="flex-1-niso"
                                        data={noidungphieuthem[index]}
                                        onChange={(event, editor) => {
                                            const newNoidungphieuthem = [...noidungphieuthem];
                                            newNoidungphieuthem[index] = editor.getData();
                                            setNoidungphieuthem(newNoidungphieuthem);
                                        }}
                                    />
                                    <div className="delete-element-niso"></div>
                                    <MdDelete className="iconmenu" size={40} onClick={() => setIsAdditionalSectionVisible(prevState => prevState.map((value, i) => (i === index ? false : value)))} />
                                </div>
                            )}

                            <div className='backgoround-niso-from bg-white dark:bg-slate-900'>
                                <div className='flex-container-niso gap-2.5'>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        onChange={(e, editor) => {
                                            const value = editor.getData();
                                            handleQuestionContentChange(index, value);
                                        }}
                                        config={{
                                            placeholder: 'Nhập câu hỏi...',
                                        }}
                                        data={questions[index] || ''}
                                        className="flex-1-niso"
                                    />
                                    <select
                                        className="select-option-niso flex-2-niso w-32-niso"
                                        onChange={(e) => handleAnswerTypeChange(e, index)}
                                    >
                                        <option value="">Lựa chọn hình thức trả lời</option>
                                        <option value="option0">Nội dung</option>
                                        <option value="option1">Văn bản</option>
                                        <option value="option2">Tùy chọn</option>
                                        <option value="option3">Chọn nhiều</option>
                                        <option value="option4">Xếp loại</option>
                                    </select>
                                </div>
                                <div className='option-quetion-niso-box'>
                                    {selectedOption[index] === "option0" && (
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={noidung[index]}
                                            onChange={(event, editor) => {
                                                const updatedNoidung = [...noidung];
                                                updatedNoidung[index] = editor.getData();
                                                setNoidung(updatedNoidung);
                                            }}
                                            config={{
                                                placeholder: 'Nhập nội dung...',
                                            }}
                                        />
                                    )}
                                    {selectedOption[index] === "option1" && (
                                        <textarea
                                            placeholder='Nhập văn bản...'
                                            className='text-answer-container-niso'
                                            disabled
                                        />
                                    )}
                                    {selectedOption[index] === "option2" && (
                                        <div>
                                            {options[index] && options[index].options && options[index].options.map((option, idx) => (
                                                <div className='option-niso' key={idx}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', justifyContent: 'space-between' }}>
                                                        <label className="containerCicle">
                                                            <input
                                                                type="text"
                                                                placeholder={`Tùy chọn ${idx + 1}`}
                                                                onChange={(e) => handleTuychon(index, idx, e.target.value)}
                                                                value={tuychon[index]?.[idx]?.name || ''}
                                                                className='question-container-niso-question'
                                                                style={{ width: '100%' }}
                                                            />
                                                            <input
                                                                type="radio"
                                                                defaultChecked={idx === null}
                                                                placeholder={option.name}
                                                                disabled
                                                                className='Cricle-input'
                                                            />
                                                            <span className="checkmarkCricle"></span>
                                                        </label>
                                                        <AiOutlineDelete className='iconmenu' size={40} onClick={() => handleDeleteOption(index, idx)} />
                                                    </div>
                                                </div>
                                            ))}
                                            <label className="containerCicle">
                                                <input
                                                    type="text"
                                                    placeholder="Nhấp vào đây để thêm tùy chọn"
                                                    className='question-container-niso-question'
                                                    onClick={() => handleAddOption(index)}
                                                    style={{ width: '100%' }}
                                                    readOnly
                                                />
                                                <input
                                                    type="radio"
                                                    className='Cricle-input'
                                                />
                                                <span className="checkmarkCricle"></span>
                                            </label>
                                            <span className="flex gap-4 mt-4 items-center">
                                                <p className="dark:text-white uy">Câu trả lời khác</p>
                                                <label className='switch-niso'>
                                                    <input
                                                        type='checkbox'
                                                        className='niso-input'
                                                        checked={tuychonkhac[index]}
                                                        onChange={() => {
                                                            const updatedTuychonkhac = [...tuychonkhac];
                                                            updatedTuychonkhac[index] = !updatedTuychonkhac[index];
                                                            setTuychonkhac(updatedTuychonkhac);
                                                        }}
                                                    />
                                                    <span className='slider-niso round-niso'></span>
                                                </label>
                                            </span>
                                        </div>
                                    )}
                                    {selectedOption[index] === "option3" && (
                                        <>
                                            {options[index] && options[index].options && options[index].options.map((option, idx) => (
                                                <div className='option-niso' key={idx}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', justifyContent: 'space-between' }}>
                                                        <label className="container-checkbox-niso">
                                                            <input
                                                                type="text"
                                                                placeholder={`Tùy chọn ${idx + 1}`}
                                                                onChange={(e) => handleTuychonall(index, idx, e.target.value)}
                                                                value={tuychonall[index]?.[idx]?.name || ''}
                                                                className='question-container-niso-question'
                                                                style={{ width: '100%' }}
                                                            />
                                                            <input
                                                                type="checkbox"
                                                                defaultChecked={idx === null}
                                                                placeholder={option.name}
                                                                disabled
                                                                className='input-checkbox'
                                                            />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                        <AiOutlineDelete className='iconmenu' size={40} onClick={() => handleRemoveOption(index, idx)} />
                                                    </div>
                                                </div>
                                            ))}
                                            <label className="container-checkbox-niso">
                                                <input
                                                    type="text"
                                                    placeholder="Nhấp vào đây để thêm tùy chọn"
                                                    className='question-container-niso-question'
                                                    readOnly
                                                    onClick={() => handleAddOption(index)}
                                                    style={{ width: '100%' }}
                                                />
                                                <input
                                                    type="checkbox"
                                                    className='input-checkbox'
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                            <span className="flex gap-4 mt-4 items-center">
                                                <p className="dark:text-white uy">Câu trả lời khác</p>
                                                <label className='switch-niso'>
                                                    <input
                                                        type='checkbox'
                                                        className='niso-input'
                                                        checked={tuychonnhieukhac[index]}
                                                        onChange={() => {
                                                            const updatedTuychonnhieukhac = [...tuychonnhieukhac];
                                                            updatedTuychonnhieukhac[index] = !updatedTuychonnhieukhac[index];
                                                            setTuychonnhieukhac(updatedTuychonnhieukhac);
                                                        }}
                                                    />
                                                    <span className='slider-niso round-niso'></span>
                                                </label>
                                            </span>
                                        </>
                                    )}
                                    {selectedOption[index] === "option4" && (
                                        <div>
                                            <div className='grid-niso-option'>
                                                {[...Array(ratingLevels[index] || 1).keys()].map((value) => (
                                                    <span key={value} className='dark:text-white'>
                                                        {selectedIcon[index] === 'ngoisao' ? <FaRegStar size={28} /> :
                                                            selectedIcon[index] === 'traitim' ? <FaRegHeart size={28} /> :
                                                                selectedIcon[index] === 'daukiem' ? <FaRegCircleCheck size={32} /> :
                                                                    <div className='number-niso-option dark:text-slate-900'>{value + 1}</div>}
                                                    </span>
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                                                <span>
                                                    <span className='dark:text-white'>Thang điểm: </span>
                                                    <select onChange={(e) => handleRatingChange(e, index)} className='select-option-niso'>
                                                        {[...Array(10).keys()].map((value) => (
                                                            <option key={value} value={value + 1} className="dark:text-white">{value + 1}</option>
                                                        ))}
                                                    </select>
                                                </span>
                                                <span>
                                                    <span className='dark:text-white'>Biểu tượng: </span>
                                                    <select onChange={(e) => handleIconChange(e, index)} className='select-option-niso'>
                                                        <option>Chọn một biểu tượng</option>
                                                        <option value="ngoisao">Ngôi sao</option>
                                                        <option value="traitim">Trái tim</option>
                                                        <option value="daukiem">Dấu kiểm</option>
                                                        <option value="so">Số</option>
                                                    </select>
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                </div>
                                <div className='delete-element-niso'>
                                    <div className="dlex-g">
                                        <AiOutlineDelete onClick={() => handleElemRemove(elemName)} className='iconmenu' size={40} />
                                        <CiCirclePlus
                                            className='iconmenu'
                                            size={40}
                                            onClick={() => setIsAdditionalSectionVisible(prevState => {
                                                const newState = [...prevState];
                                                newState[index] = !newState[index];
                                                return [...newState];
                                            })}
                                        />
                                        <span className="flex items-center gap-4">
                                            <b className="text-red-600 text-xs">Câu hỏi bắt buộc</b>
                                            <label className='switch-niso'>
                                                <input
                                                    type='checkbox'
                                                    className='niso-input'
                                                    checked={cauhoibatbuoc[index]}
                                                    onChange={() => {
                                                        const updatedCauhoibatbuoc = [...cauhoibatbuoc];
                                                        updatedCauhoibatbuoc[index] = !updatedCauhoibatbuoc[index];
                                                        setCauhoibatbuoc(updatedCauhoibatbuoc);
                                                    }}
                                                />
                                                <span className='slider-niso round-niso'></span>
                                            </label>
                                        </span>
                                    </div>
                                    <span style={{ display: 'flex', gap: '10px' }}>
                                        {(index > 0) && (
                                            <FaArrowUp className='iconmenu' size={40} onClick={() => handleMoveUp(index)} />
                                        )}

                                        {(index < addcontent.length - 1) && (
                                            <FaArrowDown className='iconmenu' size={40} onClick={() => handleMoveDown(index)} />
                                        )}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </>
    )
}
export default Element;