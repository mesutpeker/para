// script_v3.js
document.addEventListener("DOMContentLoaded", () => {
    const questionPromptElement = document.getElementById("question-prompt");
    const imageDisplayArea = document.getElementById("image-display-area");
    const optionsArea = document.getElementById("options-area");
    const feedbackTextElement = document.getElementById("feedback-text");
    const scoreElement = document.getElementById("score");
    const mistakesElement = document.getElementById("mistakes");
    const nextQuestionButton = document.getElementById("next-question-button");

    // Ses elementleri
    const correctSound = document.getElementById("correct-sound");
    const incorrectSound = document.getElementById("incorrect-sound");
    const backgroundMusic = document.getElementById("background-music");
    
    // Arkaplan müziği ayarları
    backgroundMusic.volume = 0.3;
    
    // Basit müzik kontrol sistemi - yalnızca ilk tıklamada başlat
    let musicStarted = false;
    
    const startMusicOnce = () => {
        if (!musicStarted) {
            backgroundMusic.play()
                .then(() => {
                    musicStarted = true;
                    // İşlevini tamamladığında tüm dinleyicileri kaldır
                    document.removeEventListener('click', startMusicOnce);
                })
                .catch(e => console.log("Müzik başlatılamadı:", e));
        }
    };
    
    // Sadece bir global click event listener ekle
    document.addEventListener('click', startMusicOnce);

    let score = 0;
    let mistakes = 0;
    let correctAnswerTotalKurus = 0;

    // Simplified currency list for easier questions, focusing on whole liras or common kurus amounts
    const currencies = [
        { name: "200 TL", value: 20000, image: "images/200_tl_new.png", type: "banknote" },
        { name: "100 TL", value: 10000, image: "images/100_tl_new.png", type: "banknote" },
        { name: "50 TL", value: 5000, image: "images/50_tl_new.png", type: "banknote" },
        { name: "20 TL", value: 2000, image: "images/20_tl_new.png", type: "banknote" },
        { name: "10 TL", value: 1000, image: "images/10_tl_new.png", type: "banknote" },
        { name: "5 TL", value: 500, image: "images/5_tl_new.png", type: "banknote" },
        { name: "1 TL", value: 100, image: "images/1_tl_coin_new.png", type: "coin" },
        { name: "50 Kuruş", value: 50, image: "images/50_kurus_coin_new.png", type: "coin" },
        // { name: "25 Kuruş", value: 25, image: "images/25_kurus_coin_new.png", type: "coin" }, // Removed for simplicity
        // { name: "10 Kuruş", value: 10, image: "images/10_kurus_coin_new.png", type: "coin" }, // Removed for simplicity
        // { name: "5 Kuruş", value: 5, image: "images/5_kurus_coin_new.png", type: "coin" } // Removed for simplicity
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
        if (kurus === 0 && lira === 0) { // Handle 0 TL 0 Kr case
            return "0 TL";
        }
        return `${kurus} Kr`;
    }

    function generateQuestion() {
        feedbackTextElement.textContent = "";
        feedbackTextElement.className = "";
        optionsArea.innerHTML = "";
        imageDisplayArea.innerHTML = "";
        nextQuestionButton.disabled = true;

        const operationType = getRandomInt(0, 1); // 0 for addition, 1 for subtraction
        const numItems = operationType === 0 ? getRandomInt(2, 3) : 2; // 2-3 items for addition, 2 for subtraction
        
        let selectedCurrencies = [];
        // Create a temporary array to pick from, to avoid too many small values if possible
        let availableCurrencies = [...currencies];
        shuffleArray(availableCurrencies);

        // Try to pick larger values first for more meaningful sums, especially for fewer items
        for (let i = 0; i < numItems; i++) {
            if (availableCurrencies.length > 0) {
                 // Prioritize non-kuruş amounts for simpler questions initially
                let pickedCurrency;
                if (i < 2 && availableCurrencies.some(c => c.value % 100 === 0)) {
                    pickedCurrency = availableCurrencies.find(c => c.value % 100 === 0);
                    availableCurrencies = availableCurrencies.filter(c => c.value !== pickedCurrency.value); 
                } else {
                    pickedCurrency = availableCurrencies.shift(); // Take from the shuffled list
                }
                if (pickedCurrency) selectedCurrencies.push(pickedCurrency);
                else if (currencies.length > 0) selectedCurrencies.push(currencies[getRandomInt(0, currencies.length-1)]); // Fallback
            }
        }
        if (selectedCurrencies.length === 0) { // Fallback if selection fails
            selectedCurrencies.push(currencies[getRandomInt(0, currencies.length-1)]);
            selectedCurrencies.push(currencies[getRandomInt(0, currencies.length-1)]);
        }


        if (operationType === 1 && selectedCurrencies.length >= 2) { // Subtraction
            selectedCurrencies.sort((a, b) => b.value - a.value); // Ensure first is larger
            // Make sure the second item is strictly smaller if they are different items
            if (selectedCurrencies[0].value === selectedCurrencies[1].value && selectedCurrencies.length > 1) {
                // If they are the same, pick a different smaller one for the second item if possible
                let smallerCurrencyPool = currencies.filter(c => c.value < selectedCurrencies[0].value);
                if (smallerCurrencyPool.length > 0) {
                    selectedCurrencies[1] = smallerCurrencyPool[getRandomInt(0, smallerCurrencyPool.length -1)];
                } else { // if no smaller, make it an addition problem instead
                    correctAnswerTotalKurus = selectedCurrencies.reduce((sum, curr) => sum + curr.value, 0);
                    questionPromptElement.textContent = "Bu paraların toplamı ne kadar?";
                }
            }
            // Ensure values are not too complex after subtraction
            correctAnswerTotalKurus = selectedCurrencies[0].value - selectedCurrencies[1].value;
            if (correctAnswerTotalKurus < 0) correctAnswerTotalKurus = 0; // Avoid negative results
            
            // Simplify if result is too complex (e.g. 75 kurus)
            if (correctAnswerTotalKurus % 100 !== 0 && correctAnswerTotalKurus % 50 !== 0 && correctAnswerTotalKurus % 25 !== 0) {
                 correctAnswerTotalKurus = Math.round(correctAnswerTotalKurus / 50) * 50; // Round to nearest 50 kurus or whole Lira
            }
            if (correctAnswerTotalKurus < 0) correctAnswerTotalKurus = 0;

            questionPromptElement.textContent = "Bu iki para arasındaki fark kaçtır?";

            const img1 = document.createElement("img");
            img1.src = selectedCurrencies[0].image;
            img1.alt = selectedCurrencies[0].name;
            img1.className = selectedCurrencies[0].type;
            imageDisplayArea.appendChild(img1);

            const operatorSpan = document.createElement("span");
            operatorSpan.className = "operator";
            operatorSpan.textContent = "−";
            imageDisplayArea.appendChild(operatorSpan);

            const img2 = document.createElement("img");
            img2.src = selectedCurrencies[1].image;
            img2.alt = selectedCurrencies[1].name;
            img2.className = selectedCurrencies[1].type;
            imageDisplayArea.appendChild(img2);

        } else { // Addition (or fallback from subtraction)
            correctAnswerTotalKurus = selectedCurrencies.reduce((sum, curr) => sum + curr.value, 0);
            // Simplify sum if it has awkward kurus amounts
            if (correctAnswerTotalKurus % 100 !== 0 && correctAnswerTotalKurus % 50 !== 0 && correctAnswerTotalKurus % 25 !== 0) {
                 correctAnswerTotalKurus = Math.round(correctAnswerTotalKurus / 50) * 50; 
            }
            questionPromptElement.textContent = "Bu paraların toplamı ne kadar?";
            
            selectedCurrencies.forEach((currency, index) => {
                const img = document.createElement("img");
                img.src = currency.image;
                img.alt = currency.name;
                img.className = currency.type;
                imageDisplayArea.appendChild(img);
                if (index < selectedCurrencies.length - 1) {
                    const operatorSpan = document.createElement("span");
                    operatorSpan.className = "operator";
                    operatorSpan.textContent = "+";
                    imageDisplayArea.appendChild(operatorSpan);
                }
            });
        }

        generateOptions(correctAnswerTotalKurus);
    }

    function generateOptions(correctAnswer) {
        let options = [correctAnswer];
        // Generate 3 distractor options, make them simple
        const simpleOffsets = [50, 100, 500, 1000]; // 50Kr, 1TL, 5TL, 10TL

        while (options.length < 4) {
            let offset = simpleOffsets[getRandomInt(0, simpleOffsets.length - 1)];
            if (getRandomInt(0,1) === 0) offset *= -1;

            let distractor = correctAnswer + offset;
            
            if (distractor < 0) distractor = correctAnswer + Math.abs(offset); 
            if (distractor === correctAnswer) distractor += 50; // Ensure it's different, by at least 50 kurus
            if (distractor < 0) distractor = 0; // Ensure non-negative distractors

            // Ensure distractor is also a "simple" amount if possible
            if (distractor % 100 !== 0 && distractor % 50 !== 0) {
                 distractor = Math.round(distractor / 50) * 50; 
            }
            if (distractor < 0) distractor = 0;

            if (!options.includes(distractor)) {
                options.push(distractor);
            }
        }

        shuffleArray(options);

        options.forEach(optionValue => {
            const button = document.createElement("button");
            button.textContent = formatKurusToString(optionValue);
            button.dataset.value = optionValue; // Store the raw value for easier comparison
            button.addEventListener("click", () => checkAnswer(optionValue, button));
            optionsArea.appendChild(button);
        });
    }

    function checkAnswer(selectedValue, buttonElement) {
        const optionButtons = optionsArea.querySelectorAll("button");
        optionButtons.forEach(btn => {
            btn.classList.add("disabled"); 
            if (parseInt(btn.dataset.value) === correctAnswerTotalKurus) {
                // Highlight correct answer regardless of what was clicked, if not the clicked one
                if (btn !== buttonElement) btn.classList.add("correct"); 
            }
        });

        if (selectedValue === correctAnswerTotalKurus) {
            feedbackTextElement.textContent = "Harika! Doğru cevap!";
            feedbackTextElement.className = "correct";
            buttonElement.classList.add("correct");
            score++;
            scoreElement.textContent = score;
            // Doğru sesi çal
            correctSound.currentTime = 0;
            correctSound.play().catch(e => console.log("Doğru sesi çalınamadı:", e));
        } else {
            feedbackTextElement.textContent = `Maalesef yanlış. Doğru cevap: ${formatKurusToString(correctAnswerTotalKurus)}`;
            feedbackTextElement.className = "incorrect";
            buttonElement.classList.add("incorrect");
            // The correct button is already highlighted above
            mistakes++;
            mistakesElement.textContent = mistakes;
            // Yanlış sesi çal
            incorrectSound.currentTime = 0;
            incorrectSound.play().catch(e => console.log("Yanlış sesi çalınamadı:", e));
        }
        nextQuestionButton.disabled = false;
    }

    nextQuestionButton.addEventListener("click", generateQuestion);

    generateQuestion(); // Initial question
});

