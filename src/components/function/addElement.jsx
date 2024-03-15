import { useState } from 'react';

function useAddElement() {
    const [showFirstElement, setShowFirstElement] = useState(false);
    const [addcontent, setAddcontent] = useState([]);
    const [questions, setQuestions] = useState(['']);
    const [addelement, setAddelement] = useState(-1);
    const [selectedOption, setSelectedOption] = useState([]);
    const [options, setOptions] = useState(Array(addcontent.length).fill({ options: [{ name: '', checked: false }] }));
    const [tuychon, setTuychon] = useState([{ name: '' }]);
    const [selectedIcon, setSelectedIcon] = useState('Ngôi sao');
    const [tuychonall, setTuychonall] = useState([{ name: '' }]);
    const [tuychonkhac, setTuychonkhac] = useState([]);
    const [tuychonnhieukhac, setTuychonnhieukhac] = useState([]);
    const [cauhoibatbuoc, setCauhoibatbuoc] = useState([]);
    const [tieudephieuthem, setTieudephieuthem] = useState([]);
    const [noidungphieuthem, setNoidungphieuthem] = useState([]);
    const [noidung, setNoidung] = useState([]);
    const [ratingLevels, setRatingLevels] = useState(Array(addcontent.length).fill(1));
    const [isAdditionalSectionVisible, setIsAdditionalSectionVisible] = useState(Array(addcontent.length).fill(false));

    const handleContent = (elemName) => {
        setShowFirstElement(true);
        const itemName = `Nội dung-${elemName}-${addelement}`;
        setQuestions([...questions, '']);
        setAddcontent([...addcontent, { itemName }]);
        setAddelement(addelement + 1);
    };

    const handleElemRemove = (elemName) => {
        const remainingItems = [...addcontent].filter(
            _elemName => (typeof _elemName === 'string' && !_elemName.includes("uploader")) || _elemName !== elemName
        );
        setAddcontent(remainingItems);
    };

    const handleQuestionContentChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index] = value;
        setQuestions(newQuestions);
    };

    const handleAnswerTypeChange = (e, index) => {
        const newSelectedOption = [...selectedOption];
        newSelectedOption[index] = e.target.value;
        setSelectedOption(newSelectedOption);
    };

    const handleAddOption = (index) => {
        const newOptions = [...options];
        if (!newOptions[index]) {
            newOptions[index] = { options: [] };
        }
        newOptions[index].options = [...newOptions[index].options, { name: '', checked: false }];

        setOptions(newOptions);
    };

    const handleTuychonall = (tuychonindex, optionindex, value) => {
        setTuychonall((prevTuychon) => {
            const newTuychon = [...prevTuychon];

            if (!newTuychon[tuychonindex]) {
                newTuychon[tuychonindex] = [{ name: value }];
            } else {
                newTuychon[tuychonindex][optionindex] = { name: value };
            }

            return newTuychon;
        });
    };


    const handleTuychon = (tuychonindex, optionindex, value) => {
        setTuychon((prevTuychon) => {
            const newTuychon = [...prevTuychon];

            if (!newTuychon[tuychonindex]) {
                newTuychon[tuychonindex] = [];
            }

            newTuychon[tuychonindex][optionindex] = { name: value };

            return newTuychon;
        });
    };


    const handleRemoveOption = (questionIndex, optionIndex) => {
        const updatedOptions = [...options];
        updatedOptions[questionIndex].options.splice(optionIndex, 1);

        setTuychonall((prevTuychon) => {
            const newTuychon = [...prevTuychon];

            if (newTuychon[questionIndex] && newTuychon[questionIndex][optionIndex]) {
                newTuychon[questionIndex][optionIndex] = { name: '' };
            }

            return newTuychon;
        });

        setOptions(updatedOptions);
    };

    const handleDeleteOption = (questionIndex, optionIndex) => {
        const updatedOptions = [...options];
        updatedOptions[questionIndex].options.splice(optionIndex, 1);

        setTuychon((prevTuychon) => {
            const newTuychon = [...prevTuychon];

            if (newTuychon[questionIndex] && newTuychon[questionIndex][optionIndex]) {
                newTuychon[questionIndex][optionIndex] = { name: '' };
            }

            return newTuychon;
        });

        setOptions(updatedOptions);
    };
    const handleIconChange = (event, index) => {
        const newSelectedIcons = [...selectedIcon];
        newSelectedIcons[index] = event.target.value;
        setSelectedIcon(newSelectedIcons);

        const newOptions = [...options];
        newOptions[index] = { name: '', checked: false };
        setOptions(newOptions);
    };


    const handleRatingChange = (event, index) => {
        const newRating = parseInt(event.target.value, 10);

        setRatingLevels((prevRatingLevels) => {
            const newLevels = [...prevRatingLevels];
            newLevels[index] = newRating;
            return newLevels;
        });

        const newOptions = [...options];
        newOptions[index] = { name: '', checked: false };
        setOptions(newOptions);
    };

    const handleMoveUp = (currentIndex) => {
        if (currentIndex > 0) {
            const newArray = [...addcontent];
            const temp = newArray[currentIndex];
            newArray[currentIndex] = newArray[currentIndex - 1];
            newArray[currentIndex - 1] = temp;

            setAddcontent(newArray);
            setQuestions((prevQuestions) => {
                const newQuestions = [...prevQuestions];
                const tempQuestion = newQuestions[currentIndex];
                newQuestions[currentIndex] = newQuestions[currentIndex - 1];
                newQuestions[currentIndex - 1] = tempQuestion;
                return newQuestions;
            });

            const newTypes = [...selectedOption];
            const tempType = newTypes[currentIndex];
            newTypes[currentIndex] = newTypes[currentIndex - 1];
            newTypes[currentIndex - 1] = tempType;
            setSelectedOption(newTypes);

            const newRatingLevels = [...ratingLevels];
            const tempRatingLevel = newRatingLevels[currentIndex];
            newRatingLevels[currentIndex] = newRatingLevels[currentIndex - 1];
            newRatingLevels[currentIndex - 1] = tempRatingLevel;
            setRatingLevels(newRatingLevels);


            const newTuychon = [...tuychon];
            const tempTuychon = newTuychon[currentIndex];
            newTuychon[currentIndex] = newTuychon[currentIndex - 1];
            newTuychon[currentIndex - 1] = tempTuychon;
            setTuychon(newTuychon);

            const newTuychonall = [...tuychonall];
            const tempTuychonall = newTuychonall[currentIndex];
            newTuychonall[currentIndex] = newTuychonall[currentIndex - 1];
            newTuychonall[currentIndex - 1] = tempTuychonall;
            setTuychonall(newTuychonall);

            const newOptions = [...options];
            const tempOptions = newOptions[currentIndex];
            newOptions[currentIndex] = newOptions[currentIndex - 1];
            newOptions[currentIndex - 1] = tempOptions;
            setOptions(newOptions);

            const newTuychonkhac = [...tuychonkhac];
            const tempTuychonkhac = newTuychonkhac[currentIndex];
            newTuychonkhac[currentIndex] = newTuychonkhac[currentIndex - 1];
            newTuychonkhac[currentIndex - 1] = tempTuychonkhac;
            setTuychonkhac(newTuychonkhac);

            const newTuychonnhieukhac = [...tuychonnhieukhac];
            const tempTuychonnhieukhac = newTuychonnhieukhac[currentIndex];
            newTuychonnhieukhac[currentIndex] = newTuychonnhieukhac[currentIndex - 1];
            newTuychonnhieukhac[currentIndex - 1] = tempTuychonnhieukhac;
            setTuychonnhieukhac(newTuychonnhieukhac);

            const newCauhoibatbuoc = [...cauhoibatbuoc];
            const tempCauhoibatbuoc = newCauhoibatbuoc[currentIndex];
            newCauhoibatbuoc[currentIndex] = newCauhoibatbuoc[currentIndex - 1];
            newCauhoibatbuoc[currentIndex - 1] = tempCauhoibatbuoc;
            setCauhoibatbuoc(newCauhoibatbuoc);
        }
    };

    const handleMoveDown = (currentIndex) => {
        if (currentIndex < addcontent.length - 1) {
            const newArray = [...addcontent];
            const temp = newArray[currentIndex];
            newArray[currentIndex] = newArray[currentIndex + 1];
            newArray[currentIndex + 1] = temp;

            setAddcontent(newArray);
            setQuestions((prevQuestions) => {
                const newQuestions = [...prevQuestions];
                const tempQuestion = newQuestions[currentIndex];
                newQuestions[currentIndex] = newQuestions[currentIndex + 1];
                newQuestions[currentIndex + 1] = tempQuestion;
                return newQuestions;
            });

            const newTypes = [...selectedOption];
            const tempType = newTypes[currentIndex];
            newTypes[currentIndex] = newTypes[currentIndex + 1];
            newTypes[currentIndex + 1] = tempType;
            setSelectedOption(newTypes);

            const newRatingLevels = [...ratingLevels];
            const tempRatingLevel = newRatingLevels[currentIndex];
            newRatingLevels[currentIndex] = newRatingLevels[currentIndex + 1];
            newRatingLevels[currentIndex + 1] = tempRatingLevel;
            setRatingLevels(newRatingLevels);

            const newOptions = [...options];
            const tempOptions = newOptions[currentIndex];
            newOptions[currentIndex] = newOptions[currentIndex + 1];
            newOptions[currentIndex + 1] = tempOptions;
            setOptions(newOptions);

            const newTuychon = [...tuychon];
            const tempTuychon = newTuychon[currentIndex];
            newTuychon[currentIndex] = newTuychon[currentIndex + 1];
            newTuychon[currentIndex + 1] = tempTuychon;
            setTuychon(newTuychon);

            const newTuychonall = [...tuychonall];
            const tempTuychonall = newTuychonall[currentIndex];
            newTuychonall[currentIndex] = newTuychonall[currentIndex + 1];
            newTuychonall[currentIndex + 1] = tempTuychonall;
            setTuychonall(newTuychonall);

            const newTuychonkhac = [...tuychonkhac];
            const tempTuychonkhac = newTuychonkhac[currentIndex];
            newTuychonkhac[currentIndex] = newTuychonkhac[currentIndex + 1];
            newTuychonkhac[currentIndex + 1] = tempTuychonkhac;
            setTuychonkhac(newTuychonkhac);

            const newTuychonnhieukhac = [...tuychonnhieukhac];
            const tempTuychonnhieukhac = newTuychonnhieukhac[currentIndex];
            newTuychonnhieukhac[currentIndex] = newTuychonnhieukhac[currentIndex + 1];
            newTuychonnhieukhac[currentIndex + 1] = tempTuychonnhieukhac;
            setTuychonnhieukhac(newTuychonnhieukhac);

            const newCauhoibatbuoc = [...cauhoibatbuoc];
            const tempCauhoibatbuoc = newCauhoibatbuoc[currentIndex];
            newCauhoibatbuoc[currentIndex] = newCauhoibatbuoc[currentIndex + 1];
            newCauhoibatbuoc[currentIndex + 1] = tempCauhoibatbuoc;
            setCauhoibatbuoc(newCauhoibatbuoc);
        }
    };


    return {
        handleContent, tuychonnhieukhac, setTuychonnhieukhac,
        showFirstElement, cauhoibatbuoc, setCauhoibatbuoc,
        addcontent, tieudephieuthem, setTieudephieuthem,
        options, noidungphieuthem, setNoidungphieuthem,
        setOptions, isAdditionalSectionVisible, setIsAdditionalSectionVisible,
        handleMoveUp, noidung, setNoidung, 
        handleMoveDown,
        handleQuestionContentChange,
        questions,
        handleRatingChange,
        handleTuychonall,
        handleAddOption,
        handleAnswerTypeChange,
        selectedOption,
        tuychonall,
        tuychon,
        handleTuychon,
        setTuychon,
        setTuychonall,
        handleRemoveOption,
        handleElemRemove,
        handleIconChange,
        selectedIcon,
        handleDeleteOption,
        ratingLevels,
        tuychonkhac, setTuychonkhac
    };
}

export default useAddElement;
