const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const indicator = document.querySelector('[data-indicator]');

/* Initialize */
let password = '';
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// ste strength circle color to grey
setIndicator("#787878");


/* Handle Slider */
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}
handleSlider();

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});


/* Get Random Values */
const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min) + min);

const generateRandomNumber = () => getRandomInteger(0, 9);
const generateLowerCase = () => String.fromCharCode(getRandomInteger(97, 123));
const generateUpperCase = () => String.fromCharCode(getRandomInteger(65, 91));

const symbols = '!@#$%&*-/';

const getSybmols = () => {
    const randomNum = getRandomInteger(0, symbols.length - 1);
    return symbols.charAt(randomNum);
};


// Shuffle the password
function shufflePassword(array) {
    // Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = '';
    array.forEach((el) => (str += el));
    return str;
}


/* Calculate Strength */
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 8px 1px ${color}`;
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator('#0f0');
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator('#ff0');
    } else {
        setIndicator('#f00');
    }
}


/* Copy Content */
const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const copyDone = document.querySelector('.copy-done');
const copy = document.querySelector('.copy')

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copy.style.display = 'none';
        copyDone.classList.add('active');
    }
    catch (e) {
        alert('Failed');
    }

    setTimeout((() => {
        copyDone.classList.remove('active');
        copy.style.display = 'block';
    }), 2000);
}

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

/* Handle Checkbox */
const allCheckBox = document.querySelectorAll('input[type=checkbox]');

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

/* Generate Password */
const generateBtn = document.querySelector('[data-generateBtn]');

function generatePassword () {
    // None of the checkbox are selected
    if (checkCount <= 0) alert('Please include atleast one condition');

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    
    password = '';

    let funcArr = [];

    if(uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if(numbersCheck.checked) funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked) funcArr.push(getSybmols);

    // Compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randomIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randomIndex]();
    }

    // Shuffle The Password
    password = shufflePassword(Array.from(password));

    // Show in UI
    passwordDisplay.value = password;

    // Calculate Strength
    calcStrength();
}

generateBtn.addEventListener('click', generatePassword);