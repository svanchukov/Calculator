const numberButtons = document.querySelectorAll('.calculator__button--number');
const operatorButtons = document.querySelectorAll('.calculator__button--operator');
const clearButton = document.getElementById('clear');
const equalButton = document.getElementById('equals');
const display = document.getElementById('display');
const result = document.getElementById('result');
const history = document.getElementById('history-list');
const squareButton = document.getElementById('square');
const percentButton = document.getElementById('per-Cent');

document.addEventListener('DOMContentLoaded', function() {
    result.addEventListener('mouseenter', () => {
        result.setAttribute('title', 'Здесь только ответ');
    });

    result.addEventListener('mouseleave', () => {
        result.removeAttribute('title');
    });
});

function addHistory(expression, result) {
    const listItem = document.createElement('li');
    listItem.textContent = `${expression} = ${result}`;
    listItem.style.padding = '8px 0';
    listItem.style.borderBottom = '2px solid #000000';
    history.prepend(listItem);
}

numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
        display.value += button.textContent;
    });
});

operatorButtons.forEach((button) => {
    button.addEventListener('click', () => {
        display.value += button.textContent;
    });
});

clearButton.addEventListener('click', () => {
    display.value = '';
    result.value = '';
});

function calculate(expression) {
    expression = expression.replace(/\s+/g, ''); 

    expression = expression.replace(/(\d+)%/g, (_, p1) => {
        return (parseFloat(p1) / 100).toString();
    });

    expression = expression.replace(/([-+*/(])\s*(-)/g, '$1$2');
    expression = expression.replace(/^-(?=\d)/, '0-');

    const numbers = [];
    const operators = [];
    let currentNumber = '';

    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];

        if (!isNaN(char) || char === '.') {
            currentNumber += char;
        } else if ('+-*/'.includes(char)) {
            if (currentNumber) {
                numbers.push(parseFloat(currentNumber));
                currentNumber = '';
            } else if (char === '-' && (i === 0 || '+-*/('.includes(expression[i - 1]))) {
                currentNumber = '-';
                continue;
            }
            while (
                operators.length &&
                getPrecedent(operators[operators.length - 1]) >= getPrecedent(char)
            ) {
                applyOperator(numbers, operators);
            }

            operators.push(char);
        } else if (char === '(') {
            operators.push(char);
        } else if (char === ')') {
            if (currentNumber) {
                numbers.push(parseFloat(currentNumber));
                currentNumber = '';
            }

            while (operators[operators.length - 1] !== '(') {
                applyOperator(numbers, operators);
            }
            operators.pop();
        }
    }

    if (currentNumber) {
        numbers.push(parseFloat(currentNumber));
    }

    while (operators.length) {
        if (numbers.length < 2) break;
        applyOperator(numbers, operators);
    }

    return numbers[0] !== undefined ? numbers[0] : 'Error';
}

function applyOperator(numbers, operators) {
    const operator = operators.pop();
    const b = numbers.pop();
    const a = numbers.pop();

    if (a === undefined || b === undefined) return;

    if (operator === '+') numbers.push(a + b);
    if (operator === '-') numbers.push(a - b);
    if (operator === '*') numbers.push(a * b);
    if (operator === '/') {
        if (b === 0) return 'Невозможно делить на ноль';
        numbers.push(a / b);
    }
}

function getPrecedent(op) {
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/') return 2;
    if (op === '(') return 0;
    return 0;
}

equalButton.addEventListener('click', () => {
    try {
        const expression = display.value;
        if (!expression) {
            result.value = '0';
            return;
        }
        const answer = calculate(expression);
        result.value = isNaN(answer) || answer === 'Error' ? 'Error' : answer;

        if (result.value !== 'Error') {
            addHistory(expression, result.value);
        }
    } catch (error) {
        result.value = 'Error';
    }
});

squareButton.addEventListener('click', () => {
    try {
        const expression = display.value;

        if (!expression) {
            result.value = 'Ошибка: пустое выражение';
            return;
        }

        const baseValue = calculate(expression);

        if (isNaN(baseValue)) {
            result.value = 'Ошибка: неверное выражение';
            return;
        }

        const squared = baseValue ** 2;
        result.value = squared;

        addHistory(`(${expression})²`, squared);
    } catch (error) {
        result.value = 'Ошибка: ' + error.message;
    }
});
