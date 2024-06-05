const input = document.querySelector('#input');
const numericBtn = document.querySelectorAll('.button.numeric');
const operatorBtn = document.querySelectorAll('.button.operator');
const decimalBtn = document.querySelector('.decimal');
const equalsBtn = document.querySelector('#equalbtn');
const historyDiv = document.querySelector('#history');
const historyWrapper = document.querySelector("#historywrapper");
const liveDisplay = document.querySelector('#livedisplay');
const allClearBtn = document.querySelector('#clearbtn');
const bkspBtn = document.querySelector('#bckbtn');
const themeButton = document.querySelector("#themeContainer");
const themes = document.querySelectorAll(".themeSelector");
const lightIcon = document.querySelector("#light");
const darkIcon = document.querySelector("#dark");
const body = document.querySelector('body');
const bgColorItems = document.querySelectorAll('.bglight');
const textColorItems = document.querySelectorAll('.textlight');
const hr = document.querySelector('hr');
const gitIcon = document.querySelector('.iconlight');
const NUMERICS = '0123456789.';
const OPERATORSYMBOLS = '+−×÷%';
const OPERATORS = '+-*/%';
const MAXLENGTH = 15;
let backspacePressed = false, hasOperator = false, isError = false;
let num1 = null, num2 = null, operator = null, result = null, secondOp = null, opSymbol = null, backspaceHoldTime = undefined;
let theme = themes[0].id;
historyWrapper.scrollTop = historyWrapper.scrollHeight;


input.addEventListener('keydown', e=> {
    if (NUMERICS.includes(e.key)) numericBtn.forEach(i => i.value == e.key ? i.click() : null);
    if (OPERATORS.includes(e.key)) operatorBtn.forEach(i => i.value == e.key ? i.click() : null);
    if (e.key == 'Backspace') {
        e.preventDefault();
        bkspBtn.click();
    }
    e.key == '.' ? decimalBtn.click() : null;
    e.key == '=' ? equalsBtn.click() : null;
    e.key == 'Escape' ? allClearBtn.click() : null;
    e.key == 'Enter' ? equalsBtn.click() : null;
})
input.addEventListener('input', ()=> {input.value = removeLastNChars(input.value, 1)
});
numericBtn.forEach(i => i.addEventListener('click', (e) => {
    if (isError){
        allClear();
        isError = false;
    }
    input.value == '0' ? input.value = '' : null;
    input.value.slice(input.value.length - 2) == ' 0' ? input.value = removeLastNChars(input.value, 1) + e.target.value : input.value += e.target.value;
    // input.value += e.target.value;
    input.value.slice(input.value.length - 3) == ' 00' ? input.value = removeLastNChars(input.value, 1) : null;
    showLiveCalculation();
}));
operatorBtn.forEach(i => i.addEventListener('click', (e) => {
    if (isError){
        allClear();
        isError = false;
    }
    if (input.value !== '' && input.value[input.value.length - 1] !== ' ') 
        {
            if (!hasOperator) {
                input.value += ` ${e.target.innerText} `;
                hasOperator = true;
            }
            else {
                secondOp = e.target.innerText;
                equalsBtn.click();
            }
        }
    else if (input.value[input.value.length - 1] === ' ') {
        input.value = removeLastNChars(input.value, 3);
        input.value += ` ${e.target.innerText} `;
    }
    if (input.value == ''){
        input.value += `0 ${e.target.value} `;
        hasOperator = true;
    }
    showLiveCalculation();  
}));
decimalBtn.addEventListener('click', e => {
    if (input.value == '' || input.value.slice(-1) == ' ') input.value += '0.';
    else tryInsertDecimal(input.value);
});
equalsBtn.addEventListener('click', ()=>{
    parseInput();
    if (!isNaN(num1) && num1 !== null && !isNaN(num2) && num2 !== null){
    result = Math.round(calculate() * 1e14) / 1e14;
    if (result == 'Infinity' || result == '-Infinity' || isNaN(result)) isError = true;
    updateAll(result);
    liveDisplay.innerText = '';
}});
allClearBtn.addEventListener('click', allClear);
bkspBtn.addEventListener('click', e => {if (input.value[input.value.length - 1] == ' '){
    input.value = input.value.slice(0, -3);
    hasOperator = false;
} 
    else input.value = removeLastNChars(input.value, 1)
    showLiveCalculation();
}); // if space encountered, remove 3 chars (space operator space)
bkspBtn.addEventListener('mousedown', () => backspaceHoldTime = setTimeout(() => input.value = '', 750));
bkspBtn.addEventListener('mouseup', () => clearTimeout(backspaceHoldTime));
bkspBtn.addEventListener('mouseleave', () => {if (backspaceHoldTime) clearTimeout(backspaceHoldTime)});
themeButton.addEventListener('click', toggleTheme);
function calculate() {
    switch(operator){
        case '+':
            return num1 + num2;
            break;
        case '−':
            return num1 - num2;
            break;
        case '×':
            return num1 * num2;
            break;
        case '÷':
            return num1 / num2;
            break;
        case '%':
            return num1 % num2;
            break;
    }}
function parseInput() {
    if (num1 == input.value) return;
    num1 = null;
    num2 = null;
    for (let i = 0; i < input.value.length; i++)
        {
            if (OPERATORSYMBOLS.includes(input.value[i])){
                if(i == 0) continue;
                operator = input.value[i];
                num1 = parseFloat(input.value.slice(0, i));
                num2 = parseFloat(input.value.slice(i + 1));
                break;
            }}}
function allClear() {
    input.value = '';
    historyDiv.innerHTML = '';
    num1 = null;
    num2 = null;
    operator = null;
    hasOperator = false;    
    liveDisplay.innerText = '';
}
function updateAll(result) {
    addHistory();
    result == '0' ? input.value = '' : input.value = result;
    num1 = result;
    if (secondOp){
        if (result == 0) input.value += '0';
        input.value += ` ${secondOp} `;
        secondOp = null;
    }
    else hasOperator = false;
}
function addHistory(){
    const historyItem = document.createElement('div');
    historyItem.setAttribute('class', 'historyItem');
    // historyItem.innerText = `${num1} ${opSymbol} ${num2}`;
    historyItem.innerText = input.value;
    historyDiv.appendChild(historyItem);
    historyWrapper.scrollTop = historyWrapper.scrollHeight;
}
function removeLastNChars(str, n) {
    return str.slice(0, str.length - n);
}
function tryInsertDecimal (str){
    let op, index, n1, n2;
    for (let i = 1; i < str.length; i++){
            if (OPERATORSYMBOLS.includes(str[i])){
                op = str[i];
                index = i;
                break;
    }}
    if (op) {
        str.split(op)[1].split('').find(char => char == '.') ? null : input.value += '.';
    }
    else {
        str.split('').find(char => char == '.') ? null : input.value += '.';
}}
function showLiveCalculation () {
    parseInput();
    if (!isNaN(num1) && num1 !== null && !isNaN(num2) && num2 !== null){
        const liveresult = Math.round(calculate() * 1e14) / 1e14;
        liveDisplay.innerText = liveresult;
    }
    if (num2 == null || !num2){
        liveDisplay.innerText = '';
    }
}
function toggleTheme(){
    if (theme == 'light'){
        darkIcon.style.opacity = 0;
        lightIcon.style.opacity = 1;
        theme = 'dark';
        classSwap(body, 'bodylight', 'bodydark');
        classSwap(hr, 'hrlight', 'hrdark');
        classSwap(gitIcon, 'iconlight', 'icondark');
        bgColorItems.forEach(i => classSwap(i, 'bglight', 'bgdark'));
        textColorItems.forEach(i => classSwap(i, 'textlight', 'textdark'));
    }
    else {
        lightIcon.style.opacity = 0;
        darkIcon.style.opacity = 1;
        theme = 'light'; 
        classSwap(body, 'bodydark', 'bodylight');
        classSwap(hr, 'hrdark', 'hrlight');
        classSwap(gitIcon, 'icondark', 'iconlight');
        bgColorItems.forEach(i => classSwap(i, 'bgdark', 'bglight'));
        textColorItems.forEach(i => classSwap(i, 'textdark', 'textlight'));
    }
}
function classSwap(item, classbefore, classafter){
    item.classList.remove(classbefore);
    item.classList.add(classafter);
}
// function limitMaxLength(MAXLENGTH) { was limiting the input value. If the first operands takes all/most of the space, the second operand will be left with no/less space.
//     if (input.value > MAXLENGTH) removeLastNChars(input.value, 1);
// }