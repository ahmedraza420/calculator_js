const input = document.querySelector('#input');
const numericBtn = document.querySelectorAll('.button.numeric');
const operatorBtn = document.querySelectorAll('.button.operator');
const equalsBtn = document.querySelector('#equalbtn');
const historyDiv = document.querySelector('#history');
const historyWrapper = document.querySelector("#historywrapper");
const allClearBtn = document.querySelector('#clearbtn');
const bkspBtn = document.querySelector('#bckbtn');
const NUMERICS = '0123456789.';
const OPERATORS = '+-*/%';
let backspacePressed = false;
let num1 = null, num2 = null, operator = null, result = null, secondOp = null, opSymbol = null, isNum1Negative = false;

historyWrapper.scrollTop = historyWrapper.scrollHeight;

input.addEventListener('keydown', e=> {
    if (NUMERICS.includes(e.key)) numericBtn.forEach(i => i.value == e.key ? i.click() : null);
    if (OPERATORS.includes(e.key)) operatorBtn.forEach(i => i.value == e.key ? i.click() : null);
    e.key == 'Backspace' ? backspacePressed = true : backspacePressed = false;
    e.key == '=' ? equalsBtn.click() : null;
    e.key == 'Escape' ? allClearBtn.click() : null;
    e.key == 'Enter' ? equalsBtn.click() : null;
})
input.addEventListener('input', ()=> {backspacePressed ? null : input.value = input.value.slice(0, -1)
});
numericBtn.forEach(i => i.addEventListener('click', (e) => {
    input.value += e.target.value;
}));
operatorBtn.forEach(i => i.addEventListener('click', (e) => {
    input.value += e.target.value;
}));
equalsBtn.addEventListener('click', ()=>{
    parseInput();
    if (!isNaN(num1) && num1 !== null && !isNaN(num2) && num2 !== null){
    result = calculate();
    updateAll(result);
}});
allClearBtn.addEventListener('click', allClear);
bkspBtn.addEventListener('click', e => input.value = input.value.slice(0, -1));

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
    }
}
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
            }
        }
    console.log(num1, operator, num2);
}
function allClear() {
    input.value = '';
    historyDiv.innerHTML = '';
    num1 = null;
    num2 = null;
    operator = null;
}
function updateAll(result) {
    addHistory()
    input.value = result;
    num1 = result;
    // console.log(num1);
    if (secondOp){
        operator = secondOp;
        secondOp = null;
    }
}
function addHistory(){
    const historyItem = document.createElement('div');
    historyItem.setAttribute('class', 'historyItem');
    historyItem.innerText = `${num1} ${opSymbol} ${num2}`;
    // console.log(`${num1} ${operator} ${num2}`)
    // historyItem.innerText = input.value;
    historyDiv.appendChild(historyItem);
    historyWrapper.scrollTop = historyWrapper.scrollHeight;
}