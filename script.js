const input = document.querySelector('#input');
const numericBtn = document.querySelectorAll('.button.numeric');
const operatorBtn = document.querySelectorAll('.button.operator');
const decimalBtn = document.querySelector('.decimal');
const equalsBtn = document.querySelector('#equalbtn');
const historyDiv = document.querySelector('#history');
const historyWrapper = document.querySelector("#historywrapper");
const allClearBtn = document.querySelector('#clearbtn');
const bkspBtn = document.querySelector('#bckbtn');
const NUMERICS = '0123456789.';
const OPERATORS = '+-*/%';
let backspacePressed = false, hasOperator = false, isError = false;
let num1 = null, num2 = null, operator = null, result = null, secondOp = null, opSymbol = null, backspaceHoldTime = undefined;

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
    input.value += e.target.value;
    input.value.slice(input.value.length - 2) == ' 0' ? input.value = removeLastNChars(input.value, 1) : null;
}));
operatorBtn.forEach(i => i.addEventListener('click', (e) => {
    if (isError){
        allClear();
        isError = false;
    }
    if (input.value !== '' && input.value[input.value.length - 1] !== ' ' && input.value[input.value.length - 1] !== '.') 
        {
            if (!hasOperator) {
                input.value += ` ${e.target.value} `;
                hasOperator = true;
            }
            else {
                secondOp = e.target.value;
                equalsBtn.click();
            }
        }
    else if (input.value[input.value.length - 1] === ' ') {
        input.value = removeLastNChars(input.value, 3);
        input.value += ` ${e.target.value} `;
    }
}));
decimalBtn.addEventListener('click', e => {
    if (input.value == '' || input.value.slice(-1) == ' ') input.value += '0.';
    else tryInsertDecimal(input.value);
});
equalsBtn.addEventListener('click', ()=>{
    parseInput();
    if (!isNaN(num1) && num1 !== null && !isNaN(num2) && num2 !== null){
    result = Math.round(calculate() * 1e10) / 1e10;
    if (result == 'Infinity' || result == '-Infinity' || isNaN(result)) isError = true;
    updateAll(result);
}});
allClearBtn.addEventListener('click', allClear);
bkspBtn.addEventListener('click', e => {if (input.value[input.value.length - 1] == ' '){
    input.value = input.value.slice(0, -3);
    hasOperator = false;
} 
    else input.value = removeLastNChars(input.value, 1)}); // if space encountered, remove 3 chars (space operator space)
bkspBtn.addEventListener('mousedown', () => backspaceHoldTime = setTimeout(() => input.value = '', 750));
bkspBtn.addEventListener('mouseup', () => clearTimeout(backspaceHoldTime));
bkspBtn.addEventListener('mouseleave', () => {if (backspaceHoldTime) clearTimeout(backspaceHoldTime)});
function calculate() {
    switch(operator){
        case '+':
            opSymbol = '+';
            return num1 + num2;
            break;
        case '-':
            opSymbol = '−';
            return num1 - num2;
            break;
        case '*':
            opSymbol = '×';
            return num1 * num2;
            break;
        case '/':
            opSymbol = '÷';
            return num1 / num2;
            break;
        case '%':
            opSymbol = '%';
            return num1 % num2;
            break;
    }}
function parseInput() {
    if (num1 == input.value) return;
    num1 = null;
    num2 = null;
    for (let i = 0; i < input.value.length; i++)
        {
            if (OPERATORS.includes(input.value[i])){
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
    historyItem.innerText = `${num1} ${opSymbol} ${num2}`;
    historyDiv.appendChild(historyItem);
    historyWrapper.scrollTop = historyWrapper.scrollHeight;
}
function removeLastNChars(str, n) {
    return str.slice(0, str.length - n);
}
function tryInsertDecimal (str){
    let op, index, n1, n2;
    for (let i = 1; i < str.length; i++){
            if (OPERATORS.includes(str[i])){
                op = str[i];
                index = i;
                break;
    }}
    if (operator) {
        str.split(op)[1].split('').find(char => char == '.') ? null : input.value += '.';
    }
    else {
        str.split('').find(char => char == '.') ? null : input.value += '.';
}}