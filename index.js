const numberButtons = document.querySelectorAll('.number-button');
const operatorButtons = document.querySelectorAll('.operator-button');
const clearButton = document.getElementById('clear');
const equalButton = document.getElementById('equals');
const display = document.getElementById('display');
const result = document.querySelector('.output');

numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
        display.value += button.textContent; // Добавляем на экран число
    });
});

operatorButtons.forEach((button) => {
    button.addEventListener('click', () => {
        display.value += button.textContent; // Добавляем на экран оператор
    });
});

clearButton.addEventListener('click', () => {
    display.value = ''; // Очищаем экран
    result.value = ''; // Очищаем результат
});

function calculate(expression) {
    expression = expression.replace(/\s+/g, ''); // Убираем пробелы из выражения

    const numbers = [];
    const operators = [];

    let currentNumber = '';

    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];

        if (!isNaN(char) || char === '.') {
            currentNumber += char; // Собираем число
        } else if ('+-*/'.includes(char)) {
            // Если встречен оператор
            if (currentNumber) {
                numbers.push(parseFloat(currentNumber)); // Добавляем число в массив
                currentNumber = '';
            }

            // Применяем операторы с более высоким приоритетом
            while (
                operators.length &&
                getPrecedent(operators[operators.length - 1]) >= getPrecedent(char)
            ) {
                applyOperator(numbers, operators); // Применяем оператор
            }

            operators.push(char); // Добавляем оператор в стек
        } else if (char === '(') {
            operators.push(char); // Добавляем скобку в стек
        } else if (char === ')') {
            // Если закрывающая скобка, применяем операторы до открытия скобки
            if (currentNumber) {
                numbers.push(parseFloat(currentNumber));
                currentNumber = '';
            }

            while (operators[operators.length - 1] !== '(') {
                applyOperator(numbers, operators); // Применяем операторы до открывающей скобки
            }
            operators.pop(); // Убираем открывающую скобку из стека
        }
    }

    if (currentNumber) {
        numbers.push(parseFloat(currentNumber)); // Добавляем последнее число
    }

    while (operators.length) {
        applyOperator(numbers, operators); // Применяем оставшиеся операторы
    }

    return numbers[0]; // Результат вычисления

    // Применяем операторы
    function applyOperator(numbers, operators) {
        const operator = operators.pop();
        const b = numbers.pop();
        const a = numbers.pop();

        if (operator === '+') numbers.push(a + b);
        if (operator === '-') numbers.push(a - b);
        if (operator === '*') numbers.push(a * b);
        if (operator === '/') numbers.push(a / b);
    }

    // Возвращаем приоритет оператора
    function getPrecedent(op) {
        if (op === '+' || op === '-') return 1;
        if (op === '*' || op === '/') return 2;
        return 0;
    }
}

// Обработка нажатия на кнопку "="
equalButton.addEventListener('click', () => {
    try {
        const expression = display.value; // Получаем выражение
        const answer = calculate(expression); // Получаем результат
        result.value = answer; // Выводим результат в поле вывода
    } catch (error) {
        result.value = 'Error'; // Если ошибка, выводим "Error"
    }
});
