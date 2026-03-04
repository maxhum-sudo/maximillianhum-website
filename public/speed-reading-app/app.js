// Speed Reading App - Main Application Logic

class SpeedReader {
    constructor() {
        // DOM Elements
        this.inputView = document.getElementById('inputView');
        this.readingView = document.getElementById('readingView');
        this.textInput = document.getElementById('textInput');
        this.pdfInput = document.getElementById('pdfInput');
        this.pdfFileName = document.getElementById('pdfFileName');
        this.startBtn = document.getElementById('startBtn');
        this.viewBookmarksFromInputBtn = document.getElementById('viewBookmarksFromInputBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.wordCountDisplay = document.getElementById('wordCount');
        this.cursorPositionDisplay = document.getElementById('cursorPosition');
        this.startWordInput = document.getElementById('startWordInput');
        
        // Bookmarks view elements
        this.bookmarksView = document.getElementById('bookmarksView');
        this.bookmarksList = document.getElementById('bookmarksList');
        this.bookmarksCount = document.getElementById('bookmarksCount');
        this.backToReadingFromBookmarks = document.getElementById('backToReadingFromBookmarks');
        this.clearAllBookmarksBtn = document.getElementById('clearAllBookmarksBtn');
        this.viewBookmarksBtn = document.getElementById('viewBookmarksBtn');
        
        // Reading display elements
        this.wordBefore = document.getElementById('wordBefore');
        this.wordFocal = document.getElementById('wordFocal');
        this.wordAfter = document.getElementById('wordAfter');
        this.wordDisplay = document.getElementById('wordDisplay');
        
        // Control elements
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        this.focalPointButtons = document.querySelectorAll('[data-focal]');
        this.themeButtons = document.querySelectorAll('[data-theme]');
        
        // Reading control elements
        this.backFiveSecondsBtn = document.getElementById('backFiveSecondsBtn');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.bookmarkBtn = document.getElementById('bookmarkBtn');
        this.takeQuizBtn = document.getElementById('takeQuizBtn');
        this.exitBtn = document.getElementById('exitBtn');
        this.currentWordInput = document.getElementById('currentWordInput');
        this.totalWordsDisplay = document.getElementById('totalWordsDisplay');
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
        this.bookmarks = [];
        
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
        this.updateCursorPosition();
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
        this.viewBookmarksFromInputBtn.addEventListener('click', () => this.showBookmarksView());
        this.clearBtn.addEventListener('click', () => this.clearText());
        this.textInput.addEventListener('input', () => {
            this.updateWordCount();
            this.updateCursorPosition();
        });
        this.textInput.addEventListener('click', () => this.updateCursorPosition());
        this.textInput.addEventListener('keyup', () => this.updateCursorPosition());
        this.textInput.addEventListener('select', () => this.updateCursorPosition());
        this.pdfInput.addEventListener('change', (e) => this.handlePdfUpload(e));
        
        // Bookmarks view listeners
        this.viewBookmarksBtn.addEventListener('click', () => this.showBookmarksView());
        this.backToReadingFromBookmarks.addEventListener('click', () => this.backFromBookmarksView());
        this.clearAllBookmarksBtn.addEventListener('click', () => this.clearAllBookmarks());
        
        // Control listeners
        this.speedSlider.addEventListener('input', (e) => this.updateSpeed(e.target.value));
        
        // Focal point button listeners
        this.focalPointButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const value = e.target.dataset.focal;
                this.updateFocalPoint(value);
                this.setActiveButton(this.focalPointButtons, e.target);
            });
        });
        
        // Theme button listeners
        this.themeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                this.updateTheme(theme);
                this.setActiveButton(this.themeButtons, e.target);
            });
        });
        
        // Reading control listeners
        this.backFiveSecondsBtn.addEventListener('click', () => this.backFiveSeconds());
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.resetBtn.addEventListener('click', () => this.resetReading());
        this.bookmarkBtn.addEventListener('click', () => this.saveBookmark());
        this.takeQuizBtn.addEventListener('click', () => this.showQuizSetup());
        this.exitBtn.addEventListener('click', () => this.exitReading());
        
        // Allow Enter key to jump to word
        this.currentWordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.jumpToWord();
            }
        });
        
        // Update word index when user changes the input
        this.currentWordInput.addEventListener('blur', () => {
            this.jumpToWord();
        });
        
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
        
        // Load saved API key and bookmark
        this.loadApiKey();
        this.loadBookmark();
        
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
    
    updateCursorPosition() {
        const cursorPos = this.textInput.selectionStart;
        const textBeforeCursor = this.textInput.value.substring(0, cursorPos);
        
        // Count words before cursor
        const wordsBeforeCursor = textBeforeCursor.trim() ? this.parseText(textBeforeCursor).length : 0;
        const wordNumber = wordsBeforeCursor + 1;
        
        this.cursorPositionDisplay.textContent = `Cursor at word: ${wordNumber}`;
    }
    
    clearText() {
        this.textInput.value = '';
        this.pdfFileName.textContent = '';
        this.pdfInput.value = '';
        this.startWordInput.value = '';
        this.updateWordCount();
    }
    
    // PDF Handling
    async handlePdfUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file');
            return;
        }
        
        this.pdfFileName.textContent = `Loading: ${file.name}...`;
        
        try {
            const text = await this.extractTextFromPdf(file);
            this.textInput.value = text;
            this.updateWordCount();
            this.pdfFileName.textContent = `✓ ${file.name}`;
        } catch (error) {
            console.error('Error reading PDF:', error);
            alert('Failed to read PDF. Please try another file.');
            this.pdfFileName.textContent = '';
            this.pdfInput.value = '';
        }
    }
    
    async extractTextFromPdf(file) {
        // Set up PDF.js worker
        if (typeof pdfjsLib === 'undefined') {
            throw new Error('PDF.js library not loaded');
        }
        
        pdfjsLib.GlobalWorkerOptions.workerSrc = 
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        // Read file as array buffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Load PDF document
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        
        // Extract text from each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            // Combine text items from the page
            const pageText = textContent.items
                .map(item => item.str)
                .join(' ');
            
            fullText += pageText + '\n\n';
        }
        
        return fullText.trim();
    }
    
    // Button Group Management
    setActiveButton(buttons, activeButton) {
        buttons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }
    
    // Theme Management
    applyTheme() {
        // Find the active theme button
        const activeThemeBtn = document.querySelector('[data-theme].active');
        const theme = activeThemeBtn ? activeThemeBtn.dataset.theme : 'sepia';
        document.body.className = `theme-${theme}`;
    }
    
    updateTheme(theme) {
        document.body.className = `theme-${theme}`;
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
        const currentWord = this.currentWordIndex + 1;
        this.currentWordInput.value = currentWord;
        this.totalWordsDisplay.textContent = this.words.length;
        
        // Update max attribute for validation
        this.currentWordInput.max = this.words.length;
    }
    
    // Playback Control
    startReading(startPosition = null) {
        const text = this.textInput.value.trim();
        if (!text) return;
        
        // Save original text for quiz generation
        this.originalText = text;
        
        // Parse text into words
        this.words = this.parseText(text);
        
        // Determine starting position
        if (startPosition !== null) {
            // Starting from a specific position (e.g., bookmark)
            this.currentWordIndex = Math.max(0, Math.min(startPosition, this.words.length - 1));
        } else {
            // Check if user entered a start word number
            const startWordNum = parseInt(this.startWordInput.value);
            if (!isNaN(startWordNum) && startWordNum >= 1 && startWordNum <= this.words.length) {
                this.currentWordIndex = startWordNum - 1;
            } else {
                this.currentWordIndex = 0;
            }
        }
        
        // Switch to reading view
        this.inputView.classList.add('hidden');
        this.readingView.classList.remove('hidden');
        
        // Display starting word and start playback
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
            case 'b':
            case 'B':
                e.preventDefault();
                this.backFiveSeconds();
                break;
            case 'm':
            case 'M':
                e.preventDefault();
                this.saveBookmark();
                break;
            case 'v':
            case 'V':
                e.preventDefault();
                this.showBookmarksView();
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
    
    backFiveSeconds() {
        // Calculate how many words equal 5 seconds at current WPM
        // WPM = words per minute, so words per second = WPM / 60
        // Words in 5 seconds = (WPM / 60) * 5
        const wordsPerSecond = this.wpm / 60;
        const wordsToGoBack = Math.round(wordsPerSecond * 5);
        
        // Go back that many words, but not below 0
        const newIndex = Math.max(0, this.currentWordIndex - wordsToGoBack);
        
        if (newIndex !== this.currentWordIndex) {
            this.stopPlayback();
            this.currentWordIndex = newIndex;
            this.displayWord(this.words[this.currentWordIndex]);
        }
    }
    
    // Bookmark Methods
    
    getBookmarkContext(wordIndex) {
        // Find sentences in the text
        const sentences = this.findSentences();
        
        // Find which sentence contains the current word
        let currentSentenceIdx = -1;
        let wordCount = 0;
        
        for (let i = 0; i < sentences.length; i++) {
            const sentenceWords = this.parseText(sentences[i]);
            if (wordIndex < wordCount + sentenceWords.length) {
                currentSentenceIdx = i;
                break;
            }
            wordCount += sentenceWords.length;
        }
        
        if (currentSentenceIdx === -1) {
            currentSentenceIdx = sentences.length - 1;
        }
        
        // Get 2 sentences before and after (up to 100 words in each direction)
        let beforeSentences = [];
        let afterSentences = [];
        
        // Collect sentences before
        for (let i = currentSentenceIdx - 1; i >= Math.max(0, currentSentenceIdx - 2); i--) {
            beforeSentences.unshift(sentences[i]);
        }
        
        // Collect sentences after
        for (let i = currentSentenceIdx + 1; i <= Math.min(sentences.length - 1, currentSentenceIdx + 2); i++) {
            afterSentences.push(sentences[i]);
        }
        
        // Current sentence
        const currentSentence = sentences[currentSentenceIdx];
        
        // Combine and limit to 100 words in each direction
        let beforeText = beforeSentences.join(' ');
        let beforeWords = this.parseText(beforeText);
        if (beforeWords.length > 100) {
            beforeWords = beforeWords.slice(-100);
            beforeText = beforeWords.join(' ');
        }
        
        let afterText = afterSentences.join(' ');
        let afterWords = this.parseText(afterText);
        if (afterWords.length > 100) {
            afterWords = afterWords.slice(0, 100);
            afterText = afterWords.join(' ');
        }
        
        // Combine full context
        const fullContextText = [beforeText, currentSentence, afterText]
            .filter(s => s)
            .join(' ');
        
        const contextWords = this.parseText(fullContextText);
        
        // Calculate focal word position in context
        const beforeWordCount = beforeWords.length;
        const currentSentenceWords = this.parseText(currentSentence);
        
        // Position within current sentence
        wordCount = 0;
        for (let i = 0; i <= currentSentenceIdx; i++) {
            if (i === currentSentenceIdx) {
                break;
            }
            wordCount += this.parseText(sentences[i]).length;
        }
        
        const positionInSentence = wordIndex - wordCount;
        const focalIndexInContext = beforeWordCount + positionInSentence;
        
        // Calculate start index in original words array
        const startIdx = Math.max(0, wordIndex - beforeWordCount - positionInSentence);
        
        return {
            contextWords,
            focalIndexInContext: Math.min(focalIndexInContext, contextWords.length - 1),
            startIdx
        };
    }
    
    findSentences() {
        // Split text into sentences using common sentence endings
        const text = this.originalText;
        const sentenceRegex = /[^.!?]+[.!?]+/g;
        const sentences = text.match(sentenceRegex) || [text];
        
        return sentences.map(s => s.trim()).filter(s => s.length > 0);
    }
    
    saveBookmark() {
        // Pause playback when bookmarking
        this.stopPlayback();
        
        // Get context with sentence awareness (2 sentences before and after, up to 100 words each direction)
        const { contextWords, focalIndexInContext, startIdx } = this.getBookmarkContext(this.currentWordIndex);
        
        if (contextWords.length === 0) {
            return;
        }
        
        // Create bookmark object
        const bookmark = {
            id: Date.now(),
            position: this.currentWordIndex,
            word: this.words[this.currentWordIndex],
            context: contextWords,
            focalIndexInContext: focalIndexInContext,
            timestamp: new Date().toLocaleString(),
            textHash: this.hashText(this.originalText),
            originalText: this.originalText
        };
        
        // Check if bookmark at this position already exists
        const existingIndex = this.bookmarks.findIndex(b => b.position === this.currentWordIndex);
        if (existingIndex !== -1) {
            // Don't add duplicate, just show feedback
            this.showBookmarkFeedback(false);
            return;
        }
        
        // Add to bookmarks array
        this.bookmarks.push(bookmark);
        
        // Sort by position
        this.bookmarks.sort((a, b) => a.position - b.position);
        
        // Save to localStorage
        this.saveBookmarksToStorage();
        
        // Show visual feedback
        this.showBookmarkFeedback(true);
        
        // Update button visibility
        this.updateBookmarksButton();
    }
    
    showBookmarkFeedback(success) {
        this.bookmarkBtn.style.transform = 'scale(1.3)';
        if (!success) {
            this.bookmarkBtn.style.opacity = '0.5';
        }
        setTimeout(() => {
            this.bookmarkBtn.style.transform = 'scale(1)';
            this.bookmarkBtn.style.opacity = '1';
        }, 200);
    }
    
    hashText(text) {
        // Simple hash for text comparison
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }
    
    loadBookmark() {
        const savedBookmarks = localStorage.getItem('bookmarks');
        if (savedBookmarks) {
            try {
                this.bookmarks = JSON.parse(savedBookmarks);
                this.updateBookmarksButton();
            } catch (e) {
                console.error('Error loading bookmarks:', e);
                this.bookmarks = [];
            }
        }
    }
    
    saveBookmarksToStorage() {
        localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
    }
    
    updateBookmarksButton() {
        if (this.bookmarks.length > 0) {
            this.viewBookmarksFromInputBtn.classList.remove('hidden');
            this.viewBookmarksFromInputBtn.textContent = `View Bookmarks (${this.bookmarks.length})`;
        } else {
            this.viewBookmarksFromInputBtn.classList.add('hidden');
        }
    }
    
    showBookmarksView() {
        // Pause if currently playing
        this.stopPlayback();
        
        // Hide current view
        this.inputView.classList.add('hidden');
        this.readingView.classList.add('hidden');
        
        // Show bookmarks view
        this.bookmarksView.classList.remove('hidden');
        
        // Render bookmarks
        this.renderBookmarks();
    }
    
    renderBookmarks() {
        this.bookmarksCount.textContent = `${this.bookmarks.length} bookmark${this.bookmarks.length !== 1 ? 's' : ''} saved`;
        this.bookmarksList.innerHTML = '';
        
        if (this.bookmarks.length === 0) {
            return;
        }
        
        // Filter bookmarks that match current text (if we have one)
        const currentHash = this.originalText ? this.hashText(this.originalText) : null;
        
        this.bookmarks.forEach(bookmark => {
            const card = document.createElement('div');
            card.className = 'bookmark-card';
            
            // Build context string with focal word highlighted
            let contextHTML = '';
            bookmark.context.forEach((word, idx) => {
                if (idx === bookmark.focalIndexInContext) {
                    contextHTML += `<span class="bookmark-focal-word">${word}</span> `;
                } else {
                    contextHTML += `${word} `;
                }
            });
            
            const isCurrentText = currentHash && bookmark.textHash === currentHash;
            
            card.innerHTML = `
                <div class="bookmark-header">
                    <span class="bookmark-position">Word ${bookmark.position + 1}</span>
                    <div class="bookmark-actions">
                        <button class="btn-icon" title="Show in text" data-action="show" data-id="${bookmark.id}">📍</button>
                        <button class="btn-icon" title="Copy quote" data-action="copy" data-id="${bookmark.id}">📋</button>
                        <button class="btn-icon" title="Delete bookmark" data-action="delete" data-id="${bookmark.id}">🗑️</button>
                    </div>
                </div>
                <div class="bookmark-context">${contextHTML}</div>
                <div class="bookmark-timestamp">${bookmark.timestamp}${!isCurrentText ? ' (different text)' : ''}</div>
            `;
            
            // Make card selectable (not clickable)
            card.style.cursor = 'default';
            card.style.userSelect = 'text';
            
            if (!isCurrentText) {
                card.style.opacity = '0.6';
            }
            
            // Button actions
            const positionElement = card.querySelector('.bookmark-position');
            const showBtn = card.querySelector('[data-action="show"]');
            const copyBtn = card.querySelector('[data-action="copy"]');
            const deleteBtn = card.querySelector('[data-action="delete"]');
            
            // Only the word number is clickable to jump to reading
            if (isCurrentText) {
                positionElement.classList.add('clickable');
                positionElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.jumpToBookmark(bookmark.id);
                });
            }
            
            showBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showBookmarkInText(bookmark);
            });
            
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.copyBookmarkText(bookmark);
            });
            
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteBookmark(bookmark.id);
            });
            
            this.bookmarksList.appendChild(card);
        });
    }
    
    jumpToBookmark(bookmarkId) {
        const bookmark = this.bookmarks.find(b => b.id === bookmarkId);
        if (!bookmark) return;
        
        // Check if this bookmark is for the current text
        const currentHash = this.originalText ? this.hashText(this.originalText) : null;
        if (bookmark.textHash !== currentHash) {
            alert('This bookmark is for a different text. Please load that text first.');
            return;
        }
        
        // Hide bookmarks view, show reading view
        this.bookmarksView.classList.add('hidden');
        this.readingView.classList.remove('hidden');
        
        // Jump to bookmarked position
        this.currentWordIndex = bookmark.position;
        this.displayWord(this.words[this.currentWordIndex]);
    }
    
    showBookmarkInText(bookmark) {
        // Get the text - try bookmark first, then current originalText
        let text = bookmark.originalText;
        
        if (!text) {
            // Fallback to current originalText if bookmark doesn't have it
            if (this.originalText) {
                text = this.originalText;
            } else {
                alert('Cannot show bookmark in text: original text is not available. Please reload your text.');
                return;
            }
        }
        
        // Load the text into the textarea
        this.textInput.value = text;
        this.originalText = text;
        this.updateWordCount();
        this.updateCursorPosition();
        
        // Switch to input view
        this.bookmarksView.classList.add('hidden');
        this.inputView.classList.remove('hidden');
        
        // Use a more robust method to find the word position
        setTimeout(() => {
            const words = this.parseText(text);
            
            if (bookmark.position >= words.length) {
                return;
            }
            
            const targetWord = words[bookmark.position];
            let charPosition = 0;
            let currentWordIndex = 0;
            
            // Iterate through text to find each word's character position
            const wordRegex = /\S+/g;
            let match;
            
            while ((match = wordRegex.exec(text)) !== null) {
                if (currentWordIndex === bookmark.position) {
                    charPosition = match.index;
                    const wordEnd = charPosition + match[0].length;
                    
                    // Set focus and selection to highlight the word
                    this.textInput.focus();
                    this.textInput.setSelectionRange(charPosition, wordEnd);
                    
                    // Calculate scroll position to center the selection
                    const lines = text.substring(0, charPosition).split('\n').length;
                    const lineHeight = 24;
                    const scrollPosition = (lines * lineHeight) - (this.textInput.clientHeight / 2);
                    this.textInput.scrollTop = Math.max(0, scrollPosition);
                    
                    break;
                }
                currentWordIndex++;
            }
        }, 100);
    }
    
    copyBookmarkText(bookmark) {
        const text = bookmark.context.join(' ');
        
        navigator.clipboard.writeText(text).then(() => {
            // Show feedback
            const copyBtn = this.bookmarksList.querySelector(`[data-action="copy"][data-id="${bookmark.id}"]`);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 1000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy to clipboard');
        });
    }
    
    deleteBookmark(bookmarkId) {
        this.bookmarks = this.bookmarks.filter(b => b.id !== bookmarkId);
        this.saveBookmarksToStorage();
        this.renderBookmarks();
        this.updateBookmarksButton();
    }
    
    clearAllBookmarks() {
        if (this.bookmarks.length === 0) return;
        
        if (confirm('Delete all bookmarks? This cannot be undone.')) {
            this.bookmarks = [];
            this.saveBookmarksToStorage();
            this.renderBookmarks();
            this.updateBookmarksButton();
        }
    }
    
    backFromBookmarksView() {
        this.bookmarksView.classList.add('hidden');
        
        // Go back to reading view if we have words loaded, otherwise input view
        if (this.words.length > 0) {
            this.readingView.classList.remove('hidden');
        } else {
            this.inputView.classList.remove('hidden');
        }
    }
    
    jumpToWord() {
        const wordNumber = parseInt(this.currentWordInput.value);
        
        if (isNaN(wordNumber) || wordNumber < 1 || wordNumber > this.words.length) {
            // Reset to current position if invalid
            this.updateProgress();
            return;
        }
        
        // Convert to 0-indexed
        const wordIndex = wordNumber - 1;
        
        // Only jump if it's different from current position
        if (wordIndex !== this.currentWordIndex) {
            this.stopPlayback();
            this.currentWordIndex = wordIndex;
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
