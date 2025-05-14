// script_v2.js
document.addEventListener('DOMContentLoaded', () => {
    const questionPromptElement = document.getElementById('question-prompt');
    const imageDisplayArea = document.getElementById('image-display-area');
    const optionsArea = document.getElementById('options-area');
    const feedbackTextElement = document.getElementById('feedback-text');
    const scoreElement = document.getElementById('score');
    const mistakesElement = document.getElementById('mistakes');
    const nextQuestionButton = document.getElementById('next-question-button');

    let score = 0;
    let mistakes = 0;
    let correctAnswerTotalKurus = 0;

    const currencies = [
        { name: "200 TL", value: 20000, image: "images/200_tl_new.png", type: "banknote" },
        { name: "100 TL", value: 10000, image: "images/100_tl_new.png", type: "banknote" },
        { name: "50 TL", value: 5000, image: "images/50_tl_new.png", type: "banknote" },
        { name: "20 TL", value: 2000, image: "images/20_tl_new.png", type: "banknote" },
        { name: "10 TL", value: 1000, image: "images/10_tl_new.png", type: "banknote" },
        { name: "5 TL", value: 500, image: "images/5_tl_new.png", type: "banknote" },
        { name: "1 TL", value: 100, image: "images/1_tl_coin_new.png", type: "coin" },
        { name: "50 Kuruş", value: 50, image: "images/50_kurus_coin_new.png", type: "coin" },
        { name: "25 Kuruş", value: 25, image: "images/25_kurus_coin_new.png", type: "coin" },
        { name: "10 Kuruş", value: 10, image: "images/10_kurus_coin_new.png", type: "coin" },
        { name: "5 Kuruş", value: 5, image: "images/5_kurus_coin_new.png", type: "coin" }
    ];

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function formatKurusToString(totalKurus) {
        const lira = Math.floor(totalKurus / 100);
        const kurus = totalKurus % 100;
        if (lira > 0 && kurus > 0) {
            return `${lira} TL ${kurus} Kr`;
        }
        if (lira > 0) {
            return `${lira} TL`;
        }
        return `${kurus} Kr`;
    }

    function generateQuestion() {
        feedbackTextElement.textContent = '';
        feedbackTextElement.className = '';
        optionsArea.innerHTML = '';
        imageDisplayArea.innerHTML = '';
        nextQuestionButton.disabled = true;

        const operationType = getRandomInt(0, 1); // 0 for addition, 1 for subtraction
        const numItems = operationType === 0 ? getRandomInt(2, 3) : 2;
        
        let selectedCurrencies = [];
        let availableCurrencies = [...currencies];
        for (let i = 0; i < numItems; i++) {
            const randomIndex = getRandomInt(0, availableCurrencies.length - 1);
            selectedCurrencies.push(availableCurrencies[randomIndex]);
            // To avoid picking the same item multiple times for small numItems, 
            // we could remove it, but for simplicity, we'll allow replacement for now,
            // or better, pick from a shuffled list or ensure distinct values if needed.
            // For now, let's just pick with replacement, it's simpler for small number of items.
        }

        if (operationType === 1) { // Subtraction
            // Ensure the first item is greater than or equal to the second for simplicity
            selectedCurrencies.sort((a, b) => b.value - a.value);
            if (selectedCurrencies[0].value < selectedCurrencies[1].value) {
                 // This case should not happen if sorted correctly, but as a fallback:
                 [selectedCurrencies[0], selectedCurrencies[1]] = [selectedCurrencies[1], selectedCurrencies[0]];
            }
             // If they are equal, the result is 0. This is fine.
            correctAnswerTotalKurus = selectedCurrencies[0].value - selectedCurrencies[1].value;
            questionPromptElement.textContent = "Bu iki para arasındaki fark kaçtır?";

            const img1 = document.createElement('img');
            img1.src = selectedCurrencies[0].image;
            img1.alt = selectedCurrencies[0].name;
            img1.className = selectedCurrencies[0].type;
            imageDisplayArea.appendChild(img1);

            const operatorSpan = document.createElement('span');
            operatorSpan.className = 'operator';
            operatorSpan.textContent = '−'; // Minus sign
            imageDisplayArea.appendChild(operatorSpan);

            const img2 = document.createElement('img');
            img2.src = selectedCurrencies[1].image;
            img2.alt = selectedCurrencies[1].name;
            img2.className = selectedCurrencies[1].type;
            imageDisplayArea.appendChild(img2);

        } else { // Addition
            correctAnswerTotalKurus = selectedCurrencies.reduce((sum, curr) => sum + curr.value, 0);
            questionPromptElement.textContent = "Bu paraların toplamı ne kadar?";
            
            selectedCurrencies.forEach((currency, index) => {
                const img = document.createElement('img');
                img.src = currency.image;
                img.alt = currency.name;
                img.className = currency.type;
                imageDisplayArea.appendChild(img);
                if (index < selectedCurrencies.length - 1) {
                    const operatorSpan = document.createElement('span');
                    operatorSpan.className = 'operator';
                    operatorSpan.textContent = '+';
                    imageDisplayArea.appendChild(operatorSpan);
                }
            });
        }

        generateOptions(correctAnswerTotalKurus);
    }

    function generateOptions(correctAnswer) {
        let options = [correctAnswer];
        // Generate 3 distractor options
        while (options.length < 4) {
            let distractor;
            const variationType = getRandomInt(1, 3);
            let offset = 0;
            
            // Generate distractors that are somewhat close
            const typicalOffsets = [5, 10, 25, 50, 100, 500, 1000]; // in Kurus
            offset = typicalOffsets[getRandomInt(0, typicalOffsets.length - 1)];
            if (getRandomInt(0,1) === 0) offset *= -1; // Make it positive or negative

            distractor = correctAnswer + offset;
            
            if (distractor < 0) distractor = correctAnswer + Math.abs(offset); // Ensure positive distractors
            if (distractor === correctAnswer) distractor += 5; // Ensure it's different

            if (!options.includes(distractor) && distractor >=0) {
                options.push(distractor);
            }
        }

        shuffleArray(options);

        options.forEach(optionValue => {
            const button = document.createElement('button');
            button.textContent = formatKurusToString(optionValue);
            button.addEventListener('click', () => checkAnswer(optionValue, button));
            optionsArea.appendChild(button);
        });
    }

    function checkAnswer(selectedValue, buttonElement) {
        // Disable all option buttons
        const optionButtons = optionsArea.querySelectorAll('button');
        optionButtons.forEach(btn => {
            btn.classList.add('disabled'); 
            // Mark correct answer for visual feedback
            if (parseInt(formatKurusToString(selectedValue).replace(/[^0-9]/g, ''),10) === parseInt(formatKurusToString(correctAnswerTotalKurus).replace(/[^0-9]/g, ''),10) && btn === buttonElement) {
                 // This logic is flawed for comparing. Let's re-evaluate how to find the correct button.
            }
        });
        // Find the correct button to highlight it later
         let correctButton;
         optionButtons.forEach(btn => {
            // This comparison is tricky because of formatting. We need to compare the value the button represents.
            // A better way would be to store the value on the button itself.
            // For now, let's assume the text content is unique enough for this simple case or find it by re-evaluating.
            // Let's re-create the text for the correct answer and find the button.
            if (btn.textContent === formatKurusToString(correctAnswerTotalKurus)) {
                correctButton = btn;
            }
         });


        if (selectedValue === correctAnswerTotalKurus) {
            feedbackTextElement.textContent = 'Harika! Doğru cevap!';
            feedbackTextElement.className = 'correct';
            buttonElement.classList.add('correct');
            score++;
            scoreElement.textContent = score;
        } else {
            feedbackTextElement.textContent = `Maalesef yanlış. Doğru cevap: ${formatKurusToString(correctAnswerTotalKurus)}`;
            feedbackTextElement.className = 'incorrect';
            buttonElement.classList.add('incorrect');
            if(correctButton) correctButton.classList.add('correct'); // Highlight the actual correct answer
            mistakes++;
            mistakesElement.textContent = mistakes;
        }
        nextQuestionButton.disabled = false;
    }

    nextQuestionButton.addEventListener('click', generateQuestion);

    // Initial question
    generateQuestion();
});


