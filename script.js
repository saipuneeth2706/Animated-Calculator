document.addEventListener('DOMContentLoaded', () => {   
    const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
    };

    const updateDisplay = () => {
        const currentOperand = document.getElementById('current-operand');
        const previousOperand = document.getElementById('previous-operand');
        
        currentOperand.textContent = calculator.displayValue;
        
        if (calculator.firstOperand !== null) {
            previousOperand.textContent = `${calculator.firstOperand} ${calculator.operator || ''}`;
        } else {
            previousOperand.textContent = '';
        }
    };

    const inputDigit = (digit) => {
        const { displayValue, waitingForSecondOperand } = calculator;
        
        if (waitingForSecondOperand === true) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    };

    const inputDecimal = (dot) => {
        if (calculator.waitingForSecondOperand) {
            calculator.displayValue = '0.';
            calculator.waitingForSecondOperand = false;
            return;
        }
        
        if (!calculator.displayValue.includes(dot)) {
            calculator.displayValue += dot;
        }
    };

    const handleOperator = (nextOperator) => {
        const { firstOperand, displayValue, operator } = calculator;
        const inputValue = parseFloat(displayValue);
        
        if (operator && calculator.waitingForSecondOperand) {
            calculator.operator = nextOperator;
            return;
        }
        
        if (firstOperand === null) {
            calculator.firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation[operator](firstOperand, inputValue);
            calculator.displayValue = String(result);
            calculator.firstOperand = result;
        }
        
        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
    };

    const performCalculation = {
        '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
        '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
        '×': (firstOperand, secondOperand) => firstOperand * secondOperand,
        '÷': (firstOperand, secondOperand) => firstOperand / secondOperand,
        '=': (firstOperand, secondOperand) => secondOperand,
    };

    const resetCalculator = () => {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
    };

    const deleteLastDigit = () => {
        if (calculator.displayValue.length === 1) {
            calculator.displayValue = '0';
        } else {
            calculator.displayValue = calculator.displayValue.slice(0, -1);
        }
    };

    
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0;
    let posX = 0, posY = 0;
    let particleInterval;
    let lastParticleTime = 0;
    
    
    const moveCursor = () => {
        posX += (mouseX - posX) / 6;
        posY += (mouseY - posY) / 6;
        
        cursor.style.left = `${posX}px`;
        cursor.style.top = `${posY}px`;
        cursorFollower.style.left = `${posX}px`;
        cursorFollower.style.top = `${posY}px`;
        
        requestAnimationFrame(moveCursor);
    };
    
    moveCursor();
    
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        
        const now = Date.now();
        if (now - lastParticleTime > 30) { 
            createParticle(e.clientX, e.clientY);
            lastParticleTime = now;
        }
    });
    
    
    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        document.body.appendChild(particle);
        
      
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
    
   
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-active');
            cursorFollower.classList.add('cursor-follower-active');
            
            
            if (button.classList.contains('btn-equals')) {
                cursor.style.backgroundColor = 'rgba(59, 130, 246, 0.8)';
                cursorFollower.style.borderColor = 'rgba(59, 130, 246, 0.6)';
            } else if (button.classList.contains('btn-operator') || button.classList.contains('btn-clear')) {
                cursor.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
                cursorFollower.style.borderColor = 'rgba(30, 41, 59, 0.6)';
            } else {
                cursor.style.backgroundColor = 'rgba(59, 130, 246, 0.8)';
                cursorFollower.style.borderColor = 'rgba(59, 130, 246, 0.6)';
            }
        });
        
        button.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-active');
            cursorFollower.classList.remove('cursor-follower-active');
        });
        
        button.addEventListener('click', (e) => {
            const { action } = e.target.dataset;
            
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            e.target.appendChild(ripple);
            
          
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
         
            gsap.to(e.target, {
                duration: 0.1,
                scale: 0.96,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(e.target, {
                        duration: 0.3,
                        scale: 1,
                        ease: "elastic.out(1, 0.5)"
                    });
                }
            });

            if (!action) return;
            
            switch (action) {
                case '+':
                case '-':
                case '×':
                case '÷':
                case '=':
                    handleOperator(action);
                    break;
                case '.':
                    inputDecimal(action);
                    break;
                case 'clear':
                    resetCalculator();
                    break;
                case 'delete':
                    deleteLastDigit();
                    break;
                default:
                    if (Number.isInteger(parseFloat(action))) {
                        inputDigit(action);
                    }
            }
            
            updateDisplay();
        });
    });

    
    const calculatorContainer = document.getElementById('calculator-container');
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
     
        const tiltX = (y - 0.5) * 8; 
        const tiltY = (0.5 - x) * 8; 
        
        calculatorContainer.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        
        
        const shadowX = tiltY * 0.5;
        const shadowY = tiltX * 0.5;
        calculatorContainer.querySelector('.calculator').style.boxShadow = 
            `${shadowX}px ${shadowY}px 25px -5px rgba(0, 0, 0, 0.05), 
             ${shadowX/2}px ${shadowY/2}px 10px -5px rgba(0, 0, 0, 0.02)`;
    });

   
    calculatorContainer.addEventListener('mouseleave', () => {
        calculatorContainer.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        calculatorContainer.querySelector('.calculator').style.boxShadow = 
            '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)';
    });

    
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        let button;
        
        if (key >= '0' && key <= '9') {
            button = document.querySelector(`[data-action="${key}"]`);
        } else if (key === '.') {
            button = document.querySelector('[data-action="."]');
        } else if (key === '+') {
            button = document.querySelector('[data-action="+"]');
        } else if (key === '-') {
            button = document.querySelector('[data-action="-"]');
        } else if (key === '*') {
            button = document.querySelector('[data-action="×"]');
        } else if (key === '/') {
            button = document.querySelector('[data-action="÷"]');
        } else if (key === 'Enter' || key === '=') {
            button = document.querySelector('[data-action="="]');
        } else if (key === 'Backspace') {
            button = document.querySelector('[data-action="delete"]');
        } else if (key === 'Escape') {
            button = document.querySelector('[data-action="clear"]');
        }
        
        if (button) {
            button.click();
            
            gsap.to(button, {
                duration: 0.1,
                scale: 0.96,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(button, {
                        duration: 0.3,
                        scale: 1,
                        ease: "elastic.out(1, 0.5)"
                    });
                }
            });
        }
    });

   
    updateDisplay();
});
document.querySelectorAll('.letter').forEach(letter => {
    // Store the default color
    const defaultColor = 'white';
    
    letter.addEventListener('mouseenter', () => {
      letter.style.color = getRandomColor();  // Change to random color on hover
    });
    
    letter.addEventListener('mouseleave', () => {
      letter.style.color = defaultColor;  // Revert to default color when mouse leaves
    });
  });
  
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  