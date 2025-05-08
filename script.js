class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.resetScreen = false;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }

    appendNumber(number) {
        if (this.currentOperand === '0' || this.resetScreen) {
            this.currentOperand = '';
            this.resetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand += number;
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.resetScreen = true;
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    toggleSign() {
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
    }

    percentage() {
        this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-action]:not([data-action="calculate"])');
const equalsButton = document.querySelector('[data-action="calculate"]');
const clearButton = document.querySelector('[data-action="clear"]');
const signButton = document.querySelector('[data-action="sign"]');
const percentageButton = document.querySelector('[data-action="percentage"]');
const previousOperandElement = document.querySelector('.previous-operand');
const currentOperandElement = document.querySelector('.current-operand');

const calculator = new Calculator(previousOperandElement, currentOperandElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        let operation;
        switch(button.innerText) {
            case '÷': operation = '÷'; break;
            case '×': operation = '×'; break;
            case '+': operation = '+'; break;
            case '-': operation = '-'; break;
        }
        calculator.chooseOperation(operation);
        calculator.updateDisplay();
        highlightOperationButton(button);
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
    removeHighlight();
});

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
    removeHighlight();
});

signButton.addEventListener('click', () => {
    calculator.toggleSign();
    calculator.updateDisplay();
});

percentageButton.addEventListener('click', () => {
    calculator.percentage();
    calculator.updateDisplay();
});

function highlightOperationButton(button) {
    removeHighlight();
    button.classList.add('btn-active');
}

function removeHighlight() {
    operationButtons.forEach(button => {
        button.classList.remove('btn-active');
    });
}

// Keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key >= 0 && e.key <= 9) {
        const button = document.querySelector(`[data-number="${e.key}"]`);
        if (button) button.click();
    } else if (e.key === '.') {
        const button = document.querySelector('[data-number="."]');
        if (button) button.click();
    } else if (e.key === '=' || e.key === 'Enter') {
        equalsButton.click();
    } else if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    } else if (e.key === 'Escape') {
        clearButton.click();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        let action;
        switch(e.key) {
            case '+': action = 'add'; break;
            case '-': action = 'subtract'; break;
            case '*': action = 'multiply'; break;
            case '/': action = 'divide'; break;
        }
        const button = document.querySelector(`[data-action="${action}"]`);
        if (button) button.click();
    }
});