document.addEventListener('DOMContentLoaded', () => {
    const questionTextElement = document.getElementById('question-text');
    const questionImagesElement = document.getElementById('question-images');
    const answerLiraElement = document.getElementById('answer-lira');
    const answerKurusElement = document.getElementById('answer-kurus');
    const submitAnswerButton = document.getElementById('submit-answer');
    const feedbackTextElement = document.getElementById('feedback-text');
    const scoreElement = document.getElementById('score');
    const mistakesElement = document.getElementById('mistakes');
    const nextQuestionButton = document.getElementById('next-question');

    let currentCorrectAnswerLira = 0;
    let currentCorrectAnswerKurus = 0;
    let score = 0;
    let mistakes = 0;

    const currencyImages = {
        '200_tl': 'images/200_tl.png',
        '100_tl': 'images/100_tl.png',
        '50_tl': 'images/50_tl.png',
        '20_tl': 'images/20_tl.jpeg',
        '10_tl': 'images/10_tl.png',
        '5_tl': 'images/5_tl.jpeg',
        '1_tl': 'images/1_tl.png',
        '50_kurus': 'images/50_kurus.png',
        '25_kurus': 'images/25_kurus.png',
        '10_kurus': 'images/10_kurus.png',
        '5_kurus': 'images/5_kurus.png',
        '1_kurus': 'images/1_kurus.png'
    };

    const currencyValues = {
        '200_tl': { lira: 200, kurus: 0 },
        '100_tl': { lira: 100, kurus: 0 },
        '50_tl': { lira: 50, kurus: 0 },
        '20_tl': { lira: 20, kurus: 0 },
        '10_tl': { lira: 10, kurus: 0 },
        '5_tl': { lira: 5, kurus: 0 },
        '1_tl': { lira: 1, kurus: 0 },
        '50_kurus': { lira: 0, kurus: 50 },
        '25_kurus': { lira: 0, kurus: 25 },
        '10_kurus': { lira: 0, kurus: 10 },
        '5_kurus': { lira: 0, kurus: 5 },
        '1_kurus': { lira: 0, kurus: 1 }
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateQuestion() {
        answerLiraElement.value = '';
        answerKurusElement.value = '';
        feedbackTextElement.textContent = '';
        questionImagesElement.innerHTML = '';
        submitAnswerButton.disabled = false;
        answerLiraElement.disabled = false;
        answerKurusElement.disabled = false;

        const operationType = getRandomInt(0, 1); // 0 for addition, 1 for subtraction
        let num1Lira, num1Kurus, num2Lira, num2Kurus;

        // Generate amounts suitable for 2nd graders
        // Amounts will be relatively small, focusing on conceptual understanding

        if (operationType === 0) { // Addition
            num1Lira = getRandomInt(0, 20); 
            num1Kurus = getRandomInt(0, 99);
            num2Lira = getRandomInt(0, 20 - num1Lira); // Ensure sum is not too large
            num2Kurus = getRandomInt(0, 99);

            currentCorrectAnswerLira = num1Lira + num2Lira;
            currentCorrectAnswerKurus = num1Kurus + num2Kurus;

            if (currentCorrectAnswerKurus >= 100) {
                currentCorrectAnswerLira += Math.floor(currentCorrectAnswerKurus / 100);
                currentCorrectAnswerKurus %= 100;
            }
            questionTextElement.textContent = `${num1Lira} Lira ${num1Kurus} Kuruş + ${num2Lira} Lira ${num2Kurus} Kuruş = ?`;
            displayCurrency(num1Lira, num1Kurus);
            const plusSign = document.createElement('span');
            plusSign.textContent = ' + ';
            plusSign.style.fontSize = '2em';
            plusSign.style.margin = '0 10px';
            questionImagesElement.appendChild(plusSign);
            displayCurrency(num2Lira, num2Kurus);

        } else { // Subtraction
            num1Lira = getRandomInt(5, 30); // Ensure num1 is generally larger
            num1Kurus = getRandomInt(0, 99);
            num2Lira = getRandomInt(0, num1Lira -1); // Ensure num2Lira < num1Lira for positive result
            
            if (num1Lira === num2Lira) { // if liras are same, ensure num1Kurus > num2Kurus
                 num2Kurus = getRandomInt(0, num1Kurus > 0 ? num1Kurus -1 : 0);
            } else {
                 num2Kurus = getRandomInt(0, 99);
            }

            let total1Kurus = num1Lira * 100 + num1Kurus;
            let total2Kurus = num2Lira * 100 + num2Kurus;

            if (total1Kurus < total2Kurus) { // Swap if num1 < num2 to ensure positive result
                [num1Lira, num1Kurus, num2Lira, num2Kurus] = [num2Lira, num2Kurus, num1Lira, num1Kurus];
                [total1Kurus, total2Kurus] = [total2Kurus, total1Kurus];
            }

            const diffKurus = total1Kurus - total2Kurus;
            currentCorrectAnswerLira = Math.floor(diffKurus / 100);
            currentCorrectAnswerKurus = diffKurus % 100;

            questionTextElement.textContent = `${num1Lira} Lira ${num1Kurus} Kuruş - ${num2Lira} Lira ${num2Kurus} Kuruş = ?`;
            displayCurrency(num1Lira, num1Kurus);
            const minusSign = document.createElement('span');
            minusSign.textContent = ' - ';
            minusSign.style.fontSize = '2em';
            minusSign.style.margin = '0 10px';
            questionImagesElement.appendChild(minusSign);
            displayCurrency(num2Lira, num2Kurus);
        }
    }

    function displayCurrency(lira, kurus) {
        const amountInKurus = lira * 100 + kurus;
        let remainingKurus = amountInKurus;
        const denominations = [
            { value: 20000, key: '200_tl' }, { value: 10000, key: '100_tl' }, { value: 5000, key: '50_tl' },
            { value: 2000, key: '20_tl' }, { value: 1000, key: '10_tl' }, { value: 500, key: '5_tl' },
            { value: 100, key: '1_tl' }, { value: 50, key: '50_kurus' }, { value: 25, key: '25_kurus' },
            { value: 10, key: '10_kurus' }, { value: 5, key: '5_kurus' }, { value: 1, key: '1_kurus' }
        ];

        const group = document.createElement('div');
        group.style.display = 'inline-block'; // Keep images of one amount together

        if (remainingKurus === 0) { // Display a 0 TL image or text if amount is zero
            const zeroImage = document.createElement('span');
            zeroImage.textContent = "0 TL 0 Kr";
            zeroImage.style.margin = '5px';
            zeroImage.style.padding = '5px';
            zeroImage.style.border = '1px dashed #ccc';
            group.appendChild(zeroImage);
        } else {
            for (const den of denominations) {
                while (remainingKurus >= den.value) {
                    const img = document.createElement('img');
                    img.src = currencyImages[den.key];
                    img.alt = den.key.replace('_', ' ');
                    group.appendChild(img);
                    remainingKurus -= den.value;
                }
            }
        }
        questionImagesElement.appendChild(group);
    }

    submitAnswerButton.addEventListener('click', () => {
        const userAnswerLira = parseInt(answerLiraElement.value) || 0;
        const userAnswerKurus = parseInt(answerKurusElement.value) || 0;

        if (userAnswerLira === currentCorrectAnswerLira && userAnswerKurus === currentCorrectAnswerKurus) {
            feedbackTextElement.textContent = 'Harika! Doğru cevap!';
            feedbackTextElement.style.color = 'green';
            score++;
            scoreElement.textContent = score;
        } else {
            feedbackTextElement.textContent = `Maalesef yanlış. Doğru cevap: ${currentCorrectAnswerLira} Lira ${currentCorrectAnswerKurus} Kuruş`;
            feedbackTextElement.style.color = 'red';
            mistakes++;
            mistakesElement.textContent = mistakes;
        }
        submitAnswerButton.disabled = true;
        answerLiraElement.disabled = true;
        answerKurusElement.disabled = true;
    });

    nextQuestionButton.addEventListener('click', generateQuestion);

    // Initial question
    generateQuestion();
});

