// Speed Reading App - Main Application Logic

class SpeedReader {
    constructor() {
        // DOM Elements
        this.inputView = document.getElementById('inputView');
        this.readingView = document.getElementById('readingView');
        this.textInput = document.getElementById('textInput');
        this.startBtn = document.getElementById('startBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.wordCountDisplay = document.getElementById('wordCount');
        
        // Reading display elements
        this.wordBefore = document.getElementById('wordBefore');
        this.wordFocal = document.getElementById('wordFocal');
        this.wordAfter = document.getElementById('wordAfter');
        this.wordDisplay = document.getElementById('wordDisplay');
        
        // Control elements
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        this.focalPointSelect = document.getElementById('focalPointSelect');
        this.themeSelect = document.getElementById('themeSelect');
        
        // Reading control elements
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.takeQuizBtn = document.getElementById('takeQuizBtn');
        this.exitBtn = document.getElementById('exitBtn');
        this.progressText = document.getElementById('progressText');
        this.playIcon = document.querySelector('.play-icon');
        this.pauseIcon = document.querySelector('.pause-icon');
        
        // Quiz views and elements
        this.quizSetupView = document.getElementById('quizSetupView');
        this.quizView = document.getElementById('quizView');
        this.quizResultsView = document.getElementById('quizResultsView');
        this.apiKeyInput = document.getElementById('apiKeyInput');
        this.numQuestionsSelect = document.getElementById('numQuestions');
        this.difficultySelect = document.getElementById('difficulty');
        this.feedbackTimingSelect = document.getElementById('feedbackTiming');
        this.generateQuizBtn = document.getElementById('generateQuizBtn');
        this.backToInputBtn = document.getElementById('backToInputBtn');
        this.quizGenerationStatus = document.getElementById('quizGenerationStatus');
        
        // Quiz taking elements
        this.quizProgressText = document.getElementById('quizProgressText');
        this.quizScoreDisplay = document.getElementById('quizScore');
        this.scoreValue = document.getElementById('scoreValue');
        this.totalQuestionsDisplay = document.getElementById('totalQuestions');
        this.questionText = document.getElementById('questionText');
        this.optionsContainer = document.getElementById('optionsContainer');
        this.feedbackContainer = document.getElementById('feedbackContainer');
        this.submitAnswerBtn = document.getElementById('submitAnswerBtn');
        this.nextQuestionBtn = document.getElementById('nextQuestionBtn');
        this.finishQuizBtn = document.getElementById('finishQuizBtn');
        this.exitQuizBtn = document.getElementById('exitQuizBtn');
        
        // Quiz results elements
        this.finalScore = document.getElementById('finalScore');
        this.finalTotal = document.getElementById('finalTotal');
        this.scorePercentage = document.getElementById('scorePercentage');
        this.resultsDetails = document.getElementById('resultsDetails');
        this.retakeQuizBtn = document.getElementById('retakeQuizBtn');
        this.backToReadingBtn = document.getElementById('backToReadingBtn');
        
        // State
        this.words = [];
        this.currentWordIndex = 0;
        this.isPlaying = false;
        this.intervalId = null;
        this.wpm = 300;
        this.focalPointRatio = 0.33;
        this.originalText = '';
        
        // Quiz state
        this.quizQuestions = [];
        this.currentQuestionIndex = 0;
        this.selectedAnswer = null;
        this.quizScore = 0;
        this.answeredQuestions = [];
        this.feedbackTiming = 'immediate';
        
        // Hidden element for text measurement
        this.measureElement = null;
        this.createMeasureElement();
        
        // Initialize
        this.initializeEventListeners();
        this.updateWordCount();
        this.applyTheme();
    }
    
    createMeasureElement() {
        // Create a hidden element for measuring text width
        this.measureElement = document.createElement('span');
        this.measureElement.style.position = 'absolute';
        this.measureElement.style.visibility = 'hidden';
        this.measureElement.style.whiteSpace = 'nowrap';
        this.measureElement.style.fontSize = '4rem';
        this.measureElement.style.fontWeight = '500';
        this.measureElement.style.letterSpacing = '0.05em';
        document.body.appendChild(this.measureElement);
    }
    
    initializeEventListeners() {
        // Input view listeners
        this.startBtn.addEventListener('click', () => this.startReading());
        this.clearBtn.addEventListener('click', () => this.clearText());
        this.textInput.addEventListener('input', () => this.updateWordCount());
        
        // Control listeners
        this.speedSlider.addEventListener('input', (e) => this.updateSpeed(e.target.value));
        this.focalPointSelect.addEventListener('change', (e) => this.updateFocalPoint(e.target.value));
        this.themeSelect.addEventListener('change', (e) => this.updateTheme(e.target.value));
        
        // Reading control listeners
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.resetBtn.addEventListener('click', () => this.resetReading());
        this.takeQuizBtn.addEventListener('click', () => this.showQuizSetup());
        this.exitBtn.addEventListener('click', () => this.exitReading());
        
        // Quiz setup listeners
        this.generateQuizBtn.addEventListener('click', () => this.generateQuiz());
        this.backToInputBtn.addEventListener('click', () => this.backToInput());
        
        // Quiz taking listeners
        this.submitAnswerBtn.addEventListener('click', () => this.submitAnswer());
        this.nextQuestionBtn.addEventListener('click', () => this.nextQuestion());
        this.finishQuizBtn.addEventListener('click', () => this.showResults());
        this.exitQuizBtn.addEventListener('click', () => this.exitQuiz());
        
        // Quiz results listeners
        this.retakeQuizBtn.addEventListener('click', () => this.retakeQuiz());
        this.backToReadingBtn.addEventListener('click', () => this.backToReading());
        
        // Load saved API key
        this.loadApiKey();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    // Text Parsing
    parseText(text) {
        // Split text into words, filtering out empty strings
        return text
            .trim()
            .split(/\s+/)
            .filter(word => word.length > 0);
    }
    
    updateWordCount() {
        const text = this.textInput.value.trim();
        const wordCount = text ? this.parseText(text).length : 0;
        this.wordCountDisplay.textContent = `${wordCount} word${wordCount !== 1 ? 's' : ''}`;
        this.startBtn.disabled = wordCount === 0;
    }
    
    clearText() {
        this.textInput.value = '';
        this.updateWordCount();
    }
    
    // Theme Management
    applyTheme() {
        const theme = this.themeSelect.value;
        document.body.className = `theme-${theme}`;
    }
    
    updateTheme(theme) {
        this.applyTheme();
    }
    
    // Speed Control
    updateSpeed(value) {
        this.wpm = parseInt(value);
        this.speedValue.textContent = this.wpm;
        
        // If currently playing, restart with new speed
        if (this.isPlaying) {
            this.stopPlayback();
            this.startPlayback();
        }
    }
    
    // Focal Point Control
    updateFocalPoint(value) {
        this.focalPointRatio = parseFloat(value);
        
        // Re-render current word if in reading view
        if (!this.inputView.classList.contains('hidden')) {
            return;
        }
        
        if (this.currentWordIndex < this.words.length) {
            this.displayWord(this.words[this.currentWordIndex]);
        }
    }
    
    // Calculate focal letter index for a word
    getFocalLetterIndex(word) {
        if (word.length === 0) return 0;
        if (this.focalPointRatio === 0) return 0;
        
        const index = Math.floor(word.length * this.focalPointRatio);
        return Math.min(index, word.length - 1);
    }
    
    // Measure text width
    measureText(text) {
        this.measureElement.textContent = text;
        return this.measureElement.offsetWidth;
    }
    
    // Word Display with Fixed Focal Point
    displayWord(word) {
        if (!word) return;
        
        const focalIndex = this.getFocalLetterIndex(word);
        
        // Split word into parts
        const before = word.substring(0, focalIndex);
        const focal = word[focalIndex];
        const after = word.substring(focalIndex + 1);
        
        // Update text content
        this.wordBefore.textContent = before;
        this.wordFocal.textContent = focal;
        this.wordAfter.textContent = after;
        
        // Measure the "before" text to calculate offset
        const beforeWidth = this.measureText(before);
        const focalWidth = this.measureText(focal);
        
        // Calculate offset to center the focal letter
        // We want the center of the focal letter to be at screen center
        const offset = beforeWidth + (focalWidth / 2);
        
        // Apply transform to position word correctly
        this.wordDisplay.style.transform = `translateX(calc(50vw - ${offset}px))`;
        
        // Update progress
        this.updateProgress();
    }
    
    updateProgress() {
        this.progressText.textContent = `${this.currentWordIndex + 1} / ${this.words.length}`;
    }
    
    // Playback Control
    startReading() {
        const text = this.textInput.value.trim();
        if (!text) return;
        
        // Save original text for quiz generation
        this.originalText = text;
        
        // Parse text into words
        this.words = this.parseText(text);
        this.currentWordIndex = 0;
        
        // Switch to reading view
        this.inputView.classList.add('hidden');
        this.readingView.classList.remove('hidden');
        
        // Display first word and start playback
        this.displayWord(this.words[this.currentWordIndex]);
        this.startPlayback();
    }
    
    startPlayback() {
        if (this.words.length === 0) return;
        
        this.isPlaying = true;
        this.updatePlayPauseButton();
        
        // Calculate interval from WPM
        const intervalMs = 60000 / this.wpm;
        
        this.intervalId = setInterval(() => {
            this.nextWord();
        }, intervalMs);
    }
    
    stopPlayback() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isPlaying = false;
        this.updatePlayPauseButton();
    }
    
    nextWord() {
        this.currentWordIndex++;
        
        if (this.currentWordIndex >= this.words.length) {
            // Reached end of text
            this.stopPlayback();
            this.currentWordIndex = this.words.length - 1;
            return;
        }
        
        this.displayWord(this.words[this.currentWordIndex]);
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.stopPlayback();
        } else {
            // If at the end, restart from beginning
            if (this.currentWordIndex >= this.words.length - 1) {
                this.currentWordIndex = 0;
                this.displayWord(this.words[this.currentWordIndex]);
            }
            this.startPlayback();
        }
    }
    
    resetReading() {
        this.stopPlayback();
        this.currentWordIndex = 0;
        if (this.words.length > 0) {
            this.displayWord(this.words[this.currentWordIndex]);
        }
    }
    
    exitReading() {
        this.stopPlayback();
        this.readingView.classList.add('hidden');
        this.inputView.classList.remove('hidden');
        this.words = [];
        this.currentWordIndex = 0;
    }
    
    updatePlayPauseButton() {
        if (this.isPlaying) {
            this.playIcon.classList.add('hidden');
            this.pauseIcon.classList.remove('hidden');
        } else {
            this.playIcon.classList.remove('hidden');
            this.pauseIcon.classList.add('hidden');
        }
    }
    
    // Keyboard Shortcuts
    handleKeyPress(e) {
        // Only handle shortcuts when in reading view
        if (this.readingView.classList.contains('hidden')) {
            return;
        }
        
        switch(e.key) {
            case ' ':
            case 'Spacebar':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'Escape':
                e.preventDefault();
                this.exitReading();
                break;
            case 'r':
            case 'R':
                e.preventDefault();
                this.resetReading();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.previousWord();
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (!this.isPlaying) {
                    this.nextWord();
                }
                break;
        }
    }
    
    previousWord() {
        if (this.currentWordIndex > 0) {
            this.stopPlayback();
            this.currentWordIndex--;
            this.displayWord(this.words[this.currentWordIndex]);
        }
    }
    
    // Quiz Methods
    
    loadApiKey() {
        const savedKey = localStorage.getItem('openai_api_key');
        if (savedKey) {
            this.apiKeyInput.value = savedKey;
        }
    }
    
    saveApiKey() {
        const apiKey = this.apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('openai_api_key', apiKey);
        }
    }
    
    showQuizSetup() {
        this.stopPlayback();
        this.readingView.classList.add('hidden');
        this.quizSetupView.classList.remove('hidden');
    }
    
    backToInput() {
        this.quizSetupView.classList.add('hidden');
        this.inputView.classList.remove('hidden');
    }
    
    async generateQuiz() {
        const apiKey = this.apiKeyInput.value.trim();
        
        if (!apiKey) {
            this.showStatus('Please enter your OpenAI API key', 'error');
            return;
        }
        
        if (!this.originalText) {
            this.showStatus('No text available. Please read something first.', 'error');
            return;
        }
        
        this.saveApiKey();
        
        const numQuestions = parseInt(this.numQuestionsSelect.value);
        const difficulty = this.difficultySelect.value;
        this.feedbackTiming = this.feedbackTimingSelect.value;
        
        this.showStatus('Generating quiz questions... This may take a moment.', 'loading');
        this.generateQuizBtn.disabled = true;
        
        try {
            const questions = await this.callOpenAI(apiKey, this.originalText, numQuestions, difficulty);
            this.quizQuestions = questions;
            this.currentQuestionIndex = 0;
            this.quizScore = 0;
            this.answeredQuestions = [];
            
            this.showStatus('Quiz generated successfully!', 'success');
            
            setTimeout(() => {
                this.startQuiz();
            }, 1000);
            
        } catch (error) {
            console.error('Error generating quiz:', error);
            this.showStatus(`Error: ${error.message}`, 'error');
            this.generateQuizBtn.disabled = false;
        }
    }
    
    async callOpenAI(apiKey, text, numQuestions, difficulty) {
        const difficultyInstructions = {
            easy: 'Focus on basic factual recall and simple comprehension questions.',
            medium: 'Focus on understanding, making connections, and moderate inference.',
            hard: 'Focus on deep analysis, critical thinking, complex inference, and synthesis.'
        };
        
        const prompt = `Based on the following text, create exactly ${numQuestions} multiple-choice quiz questions to test comprehension. ${difficultyInstructions[difficulty]}

Text:
${text}

Generate the questions in the following JSON format:
{
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct and others are wrong"
    }
  ]
}

Make sure each question has exactly 4 options, and the correctIndex is the index (0-3) of the correct answer. The explanation should be clear and educational.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that creates educational quiz questions. Always respond with valid JSON.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to generate quiz');
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Parse JSON response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid response format from API');
        }
        
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.questions;
    }
    
    showStatus(message, type) {
        this.quizGenerationStatus.textContent = message;
        this.quizGenerationStatus.className = `status-message ${type}`;
        this.quizGenerationStatus.classList.remove('hidden');
    }
    
    startQuiz() {
        this.quizSetupView.classList.add('hidden');
        this.quizView.classList.remove('hidden');
        
        this.totalQuestionsDisplay.textContent = this.quizQuestions.length;
        
        if (this.feedbackTiming === 'end') {
            this.quizScoreDisplay.classList.remove('hidden');
            this.scoreValue.textContent = '0';
        } else {
            this.quizScoreDisplay.classList.add('hidden');
        }
        
        this.displayQuestion();
    }
    
    displayQuestion() {
        const question = this.quizQuestions[this.currentQuestionIndex];
        this.selectedAnswer = null;
        
        // Update progress
        this.quizProgressText.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.quizQuestions.length}`;
        
        // Display question
        this.questionText.textContent = question.question;
        
        // Display options
        this.optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.innerHTML = `<span class="option-label">${String.fromCharCode(65 + index)}.</span>${option}`;
            optionDiv.dataset.index = index;
            
            optionDiv.addEventListener('click', () => this.selectOption(index));
            
            this.optionsContainer.appendChild(optionDiv);
        });
        
        // Reset feedback
        this.feedbackContainer.classList.add('hidden');
        this.feedbackContainer.innerHTML = '';
        
        // Reset buttons
        this.submitAnswerBtn.classList.remove('hidden');
        this.nextQuestionBtn.classList.add('hidden');
        this.finishQuizBtn.classList.add('hidden');
        this.submitAnswerBtn.disabled = true;
    }
    
    selectOption(index) {
        // Remove previous selection
        this.optionsContainer.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selection to clicked option
        const options = this.optionsContainer.querySelectorAll('.option');
        options[index].classList.add('selected');
        
        this.selectedAnswer = index;
        this.submitAnswerBtn.disabled = false;
    }
    
    submitAnswer() {
        if (this.selectedAnswer === null) return;
        
        const question = this.quizQuestions[this.currentQuestionIndex];
        const isCorrect = this.selectedAnswer === question.correctIndex;
        
        // Record answer
        this.answeredQuestions.push({
            question: question.question,
            options: question.options,
            selectedIndex: this.selectedAnswer,
            correctIndex: question.correctIndex,
            explanation: question.explanation,
            isCorrect: isCorrect
        });
        
        if (isCorrect) {
            this.quizScore++;
            if (this.feedbackTiming === 'end') {
                this.scoreValue.textContent = this.quizScore;
            }
        }
        
        // Disable options
        this.optionsContainer.querySelectorAll('.option').forEach(opt => {
            opt.classList.add('disabled');
            opt.style.pointerEvents = 'none';
        });
        
        // Highlight correct/incorrect
        const options = this.optionsContainer.querySelectorAll('.option');
        options[question.correctIndex].classList.add('correct');
        if (this.selectedAnswer !== question.correctIndex) {
            options[this.selectedAnswer].classList.add('incorrect');
        }
        
        // Show feedback if immediate
        if (this.feedbackTiming === 'immediate') {
            this.showFeedback(isCorrect, question.explanation);
        }
        
        // Update buttons
        this.submitAnswerBtn.classList.add('hidden');
        
        if (this.currentQuestionIndex < this.quizQuestions.length - 1) {
            this.nextQuestionBtn.classList.remove('hidden');
        } else {
            this.finishQuizBtn.classList.remove('hidden');
        }
    }
    
    showFeedback(isCorrect, explanation) {
        this.feedbackContainer.classList.remove('hidden');
        this.feedbackContainer.className = `feedback-container ${isCorrect ? 'correct' : 'incorrect'}`;
        
        this.feedbackContainer.innerHTML = `
            <div class="feedback-title ${isCorrect ? 'correct' : 'incorrect'}">
                ${isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </div>
            <div class="feedback-text">${explanation}</div>
        `;
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        this.displayQuestion();
    }
    
    showResults() {
        this.quizView.classList.add('hidden');
        this.quizResultsView.classList.remove('hidden');
        
        // Display score
        const totalQuestions = this.quizQuestions.length;
        const percentage = Math.round((this.quizScore / totalQuestions) * 100);
        
        this.finalScore.textContent = this.quizScore;
        this.finalTotal.textContent = totalQuestions;
        this.scorePercentage.textContent = `${percentage}%`;
        
        // Display detailed results
        this.resultsDetails.innerHTML = '<h3 style="margin-bottom: 1.5rem;">Question Review</h3>';
        
        this.answeredQuestions.forEach((answer, index) => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'result-item';
            
            const correctLabel = answer.isCorrect ? 
                '<span class="result-answer correct">✓ Correct</span>' : 
                '<span class="result-answer incorrect">✗ Incorrect</span>';
            
            resultDiv.innerHTML = `
                <div class="result-question">
                    ${index + 1}. ${answer.question}
                </div>
                <div style="padding-left: 1rem; margin-bottom: 0.5rem;">
                    <strong>Your answer:</strong> ${String.fromCharCode(65 + answer.selectedIndex)}. ${answer.options[answer.selectedIndex]}
                    ${correctLabel}
                </div>
                ${!answer.isCorrect ? `
                    <div style="padding-left: 1rem; margin-bottom: 0.5rem;">
                        <strong>Correct answer:</strong> ${String.fromCharCode(65 + answer.correctIndex)}. ${answer.options[answer.correctIndex]}
                    </div>
                ` : ''}
                <div class="result-explanation">
                    <strong>Explanation:</strong> ${answer.explanation}
                </div>
            `;
            
            this.resultsDetails.appendChild(resultDiv);
        });
    }
    
    retakeQuiz() {
        this.currentQuestionIndex = 0;
        this.quizScore = 0;
        this.answeredQuestions = [];
        this.startQuiz();
    }
    
    backToReading() {
        this.quizResultsView.classList.add('hidden');
        this.readingView.classList.remove('hidden');
    }
    
    exitQuiz() {
        this.quizView.classList.add('hidden');
        this.readingView.classList.remove('hidden');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SpeedReader();
});
