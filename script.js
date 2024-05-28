const input = document.querySelector('#input');
const historyWrapper = document.querySelector("#historywrapper");
const historyContainer = document.querySelector("#history");
const numericBtns = document.querySelectorAll(".button.numeric");
const operatorBtns = document.querySelectorAll(".button.operation");
const clearBtn = document.querySelector("#clearbtn");
const bkspBtn = document.querySelector("#bckbtn");
const MAXLENGTH = 20;
const validChars = '0123456789.+-*/%';
let holdTime = undefined;

historyWrapper.scrollTop = historyWrapper.scrollHeight;

input.addEventListener('input', (e) => {
    if (input.value.length <= MAXLENGTH){
        input.value = filterInput(input.value);    
    }
    else {
        input.value = input.value.slice(0, MAXLENGTH);
    }
});
input.addEventListener('keydown', (e) => {
    switch(e.key)
    {
        case 'Escape':
            clearInput();
            break; 
    }
});
numericBtns.forEach(i => i.addEventListener('click', (e) => input.value += e.target.innerText));
operatorBtns.forEach(i => i.addEventListener('click', (e) => input.value += e.target.innerText));
clearBtn.addEventListener('click',() => allClear());
bkspBtn.addEventListener('click', () => input.value = input.value.slice(0, input.value.length -1));
bkspBtn.addEventListener('mousedown', () => holdTime = setTimeout(clearInput, 1000));
bkspBtn.addEventListener('mouseup', () => clearTimeout(holdTime));
bkspBtn.addEventListener('mouseleave', () => {if (holdTime) clearTimeout(holdTime)});

function filterInput (value) {
    let filteredValue = '';
    for (let char of value)
        {
            validChars.includes(char) ? filteredValue += char : null;
        }
    return filteredValue;
}
function allClear() {
    historyContainer.innerHTML = '';
    clearInput();
}
function clearInput() {
    input.value = '';
}
function Backspace() {
    input.value = input.value.slice(0, input.value.length);
}
