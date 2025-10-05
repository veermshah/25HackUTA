// Reading Practice Script
class ReadingPractice {
    constructor() {
        this.currentStage = 'paragraph';
        this.currentSentenceIndex = 0;
        this.currentWordIndex = 0;
        this.starsEarned = 0;
        this.isRecording = false;
        
        // Practice content
        this.paragraph = "The brave little fox loved to explore the forest every morning. She would walk along the winding paths, listening to the birds sing their beautiful songs. Sometimes she would find interesting rocks or colorful flowers that made her day special. The fox knew that reading books was just like exploring the forest - every page held new adventures and discoveries waiting to be found.";
        
        this.sentences = [
            "The brave little fox loved to explore the forest every morning.",
            "She would walk along the winding paths, listening to the birds sing their beautiful songs.",
            "Sometimes she would find interesting rocks or colorful flowers that made her day special.",
            "The fox knew that reading books was just like exploring the forest - every page held new adventures and discoveries waiting to be found."
        ];
        
        this.words = [
            {
                word: "explore",
                phonetics: "/ɪkˈsplɔːr/",
                meaning: "To travel through or investigate a place to learn about it",
                context: "...loved to explore the forest...",
                hint: "Think of 'ex' (out) + 'plore' (like explore a new place)"
            },
            {
                word: "winding",
                phonetics: "/ˈwaɪn.dɪŋ/",
                meaning: "Having many curves and turns",
                context: "...along the winding paths...",
                hint: "Think of 'wind' (like the wind blowing in curves) + 'ing'"
            },
            {
                word: "listening",
                phonetics: "/ˈlɪs.ən.ɪŋ/",
                meaning: "Giving attention with the ear to hear sounds",
                context: "...listening to the birds...",
                hint: "Think of 'listen' + 'ing' (the action of hearing)"
            },
            {
                word: "beautiful",
                phonetics: "/ˈbjuː.tɪ.fəl/",
                meaning: "Pleasing the senses or mind aesthetically",
                context: "...sing their beautiful songs...",
                hint: "Think of 'beauty' + 'ful' (full of beauty)"
            },
            {
                word: "interesting",
                phonetics: "/ˈɪn.trə.stɪŋ/",
                meaning: "Arousing curiosity or interest",
                context: "...find interesting rocks...",
                hint: "Think of 'interest' + 'ing' (causing interest)"
            },
            {
                word: "adventures",
                phonetics: "/ədˈven.tʃərz/",
                meaning: "Exciting or unusual experiences",
                context: "...new adventures and discoveries...",
                hint: "Think of 'adventure' + 's' (more than one adventure)"
            }
        ];
        
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        // Screen elements
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.practiceInterface = document.getElementById('practiceInterface');
        
        // Progress elements
        this.progressSteps = document.querySelectorAll('.progress-step');
        this.currentStageEl = document.getElementById('currentStage');
        
        // Stage elements
        this.paragraphStage = document.getElementById('paragraphStage');
        this.sentenceStage = document.getElementById('sentenceStage');
        this.wordStage = document.getElementById('wordStage');
        this.completeStage = document.getElementById('completeStage');
        
        // Paragraph elements
        this.paragraphText = document.getElementById('paragraphText');
        this.paragraphAudioBtn = document.getElementById('paragraphAudioBtn');
        this.paragraphRecordBtn = document.getElementById('paragraphRecordBtn');
        this.paragraphFeedback = document.getElementById('paragraphFeedback');
        this.nextToSentence = document.getElementById('nextToSentence');
        
        // Sentence elements
        this.sentenceCounter = document.getElementById('sentenceCounter');
        this.currentSentenceEl = document.getElementById('currentSentence');
        this.sentenceAudioBtn = document.getElementById('sentenceAudioBtn');
        this.sentenceRecordBtn = document.getElementById('sentenceRecordBtn');
        this.sentenceFeedback = document.getElementById('sentenceFeedback');
        this.prevSentence = document.getElementById('prevSentence');
        this.nextSentence = document.getElementById('nextSentence');
        
        // Word elements
        this.wordCounter = document.getElementById('wordCounter');
        this.practiceWord = document.getElementById('practiceWord');
        this.wordPhonetics = document.getElementById('wordPhonetics');
        this.wordHintBtn = document.getElementById('wordHintBtn');
        this.wordAudioBtn = document.getElementById('wordAudioBtn');
        this.wordRecordBtn = document.getElementById('wordRecordBtn');
        this.wordFeedback = document.getElementById('wordFeedback');
        this.prevWord = document.getElementById('prevWord');
        this.nextWord = document.getElementById('nextWord');
        
        // Completion elements
        this.totalWords = document.getElementById('totalWords');
        this.totalSentences = document.getElementById('totalSentences');
        this.starsEarnedEl = document.getElementById('starsEarned');
        this.practiceAgain = document.getElementById('practiceAgain');
        this.backToProfile = document.getElementById('backToProfile');
        
        // Navigation elements
        this.backBtn = document.getElementById('backBtn');
        this.homeBtn = document.getElementById('homeBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        
        // Modal elements
        this.hintModal = document.getElementById('hintModal');
        this.closeHint = document.getElementById('closeHint');
        this.hintBody = document.getElementById('hintBody');
        
        // Start button
        this.startBtn = document.getElementById('startBtn');
    }
    
    bindEvents() {
        // Start button
        this.startBtn.addEventListener('click', () => this.startPractice());
        
        // Navigation
        this.backBtn.addEventListener('click', () => this.goBack());
        this.homeBtn.addEventListener('click', () => this.goHome());
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        
        // Paragraph stage
        this.paragraphAudioBtn.addEventListener('click', () => this.playParagraphAudio());
        this.paragraphRecordBtn.addEventListener('click', () => this.recordParagraph());
        this.nextToSentence.addEventListener('click', () => this.moveToSentenceStage());
        
        // Sentence stage
        this.sentenceAudioBtn.addEventListener('click', () => this.playSentenceAudio());
        this.sentenceRecordBtn.addEventListener('click', () => this.recordSentence());
        this.prevSentence.addEventListener('click', () => this.previousSentence());
        this.nextSentence.addEventListener('click', () => this.nextSentenceHandler());
        
        // Word stage
        this.wordHintBtn.addEventListener('click', () => this.showWordHint());
        this.wordAudioBtn.addEventListener('click', () => this.playWordAudio());
        this.wordRecordBtn.addEventListener('click', () => this.recordWord());
        this.prevWord.addEventListener('click', () => this.previousWord());
        this.nextWord.addEventListener('click', () => this.nextWordHandler());
        
        // Completion
        this.practiceAgain.addEventListener('click', () => this.restartPractice());
        this.backToProfile.addEventListener('click', () => this.goToProfile());
        
        // Modal
        this.closeHint.addEventListener('click', () => this.hideHint());
        this.hintModal.addEventListener('click', (e) => {
            if (e.target === this.hintModal) this.hideHint();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    startPractice() {
        this.welcomeScreen.style.display = 'none';
        this.practiceInterface.style.display = 'block';
        this.showParagraphStage();
        this.updateProgress();
    }
    
    updateProgress() {
        this.progressSteps.forEach((step, index) => {
            const stage = step.dataset.stage;
            step.className = 'progress-step';
            
            if (stage === this.currentStage) {
                step.classList.add('active');
            } else if (this.isStageCompleted(stage)) {
                step.classList.add('completed');
            } else {
                step.classList.add('pending');
            }
        });
        
        // Update stage indicator
        const stageNames = {
            paragraph: 'Paragraph Reading',
            sentence: 'Sentence Practice',
            word: 'Word Focus'
        };
        this.currentStageEl.textContent = stageNames[this.currentStage] || 'Practice Complete';
    }
    
    isStageCompleted(stage) {
        switch (stage) {
            case 'paragraph':
                return this.currentStage !== 'paragraph';
            case 'sentence':
                return this.currentStage === 'word' || this.currentStage === 'complete';
            case 'word':
                return this.currentStage === 'complete';
            default:
                return false;
        }
    }
    
    showParagraphStage() {
        this.currentStage = 'paragraph';
        this.hideAllStages();
        this.paragraphStage.style.display = 'block';
        this.updateProgress();
    }
    
    showSentenceStage() {
        this.currentStage = 'sentence';
        this.hideAllStages();
        this.sentenceStage.style.display = 'block';
        this.updateSentenceDisplay();
        this.updateProgress();
    }
    
    showWordStage() {
        this.currentStage = 'word';
        this.hideAllStages();
        this.wordStage.style.display = 'block';
        this.updateWordDisplay();
        this.updateProgress();
    }
    
    showCompleteStage() {
        this.currentStage = 'complete';
        this.hideAllStages();
        this.completeStage.style.display = 'block';
        this.updateCompletionStats();
        this.updateProgress();
    }
    
    hideAllStages() {
        this.paragraphStage.style.display = 'none';
        this.sentenceStage.style.display = 'none';
        this.wordStage.style.display = 'none';
        this.completeStage.style.display = 'none';
    }
    
    // Paragraph stage methods
    playParagraphAudio() {
        this.simulateAudioPlayback(this.paragraphAudioBtn, 'Playing story...', 'Listen to Story');
    }
    
    recordParagraph() {
        this.simulateRecording(this.paragraphRecordBtn, () => {
            this.paragraphFeedback.style.display = 'block';
            this.starsEarned += 3;
        });
    }
    
    moveToSentenceStage() {
        this.showSentenceStage();
    }
    
    // Sentence stage methods
    updateSentenceDisplay() {
        this.sentenceCounter.textContent = `Sentence ${this.currentSentenceIndex + 1} of ${this.sentences.length}`;
        this.currentSentenceEl.textContent = this.sentences[this.currentSentenceIndex];
        this.sentenceFeedback.style.display = 'none';
        
        // Update navigation buttons
        this.prevSentence.style.display = this.currentSentenceIndex > 0 ? 'flex' : 'none';
        this.nextSentence.textContent = this.currentSentenceIndex < this.sentences.length - 1 ? 'Next Sentence' : 'Continue to Words';
    }
    
    playSentenceAudio() {
        this.simulateAudioPlayback(this.sentenceAudioBtn, 'Playing sentence...', 'Listen');
    }
    
    recordSentence() {
        this.simulateRecording(this.sentenceRecordBtn, () => {
            this.sentenceFeedback.style.display = 'block';
            this.starsEarned += 2;
        });
    }
    
    previousSentence() {
        if (this.currentSentenceIndex > 0) {
            this.currentSentenceIndex--;
            this.updateSentenceDisplay();
        }
    }
    
    nextSentenceHandler() {
        if (this.currentSentenceIndex < this.sentences.length - 1) {
            this.currentSentenceIndex++;
            this.updateSentenceDisplay();
        } else {
            this.showWordStage();
        }
    }
    
    // Word stage methods
    updateWordDisplay() {
        const word = this.words[this.currentWordIndex];
        this.wordCounter.textContent = `Word ${this.currentWordIndex + 1} of ${this.words.length}`;
        this.practiceWord.textContent = word.word;
        this.wordPhonetics.textContent = word.phonetics;
        
        // Update word info
        const wordInfo = this.wordStage.querySelector('.word-info');
        wordInfo.innerHTML = `
            <div class="word-meaning">
                <h4>Meaning:</h4>
                <p>${word.meaning}</p>
            </div>
            <div class="word-context">
                <h4>In the story:</h4>
                <p>${word.context}</p>
            </div>
        `;
        
        this.wordFeedback.style.display = 'none';
        
        // Update navigation buttons
        this.prevWord.style.display = this.currentWordIndex > 0 ? 'flex' : 'none';
        this.nextWord.textContent = this.currentWordIndex < this.words.length - 1 ? 'Next Word' : 'Finish Practice';
    }
    
    showWordHint() {
        const word = this.words[this.currentWordIndex];
        this.hintBody.innerHTML = `
            <p><strong>Hint:</strong> ${word.hint}</p>
            <p><strong>Break it down:</strong> Try to sound out each part of the word slowly.</p>
            <p><strong>Remember:</strong> Take your time and don't worry about being perfect!</p>
        `;
        this.hintModal.style.display = 'flex';
    }
    
    hideHint() {
        this.hintModal.style.display = 'none';
    }
    
    playWordAudio() {
        this.simulateAudioPlayback(this.wordAudioBtn, 'Playing word...', 'Listen');
    }
    
    recordWord() {
        this.simulateRecording(this.wordRecordBtn, () => {
            this.wordFeedback.style.display = 'block';
            this.starsEarned += 1;
        });
    }
    
    previousWord() {
        if (this.currentWordIndex > 0) {
            this.currentWordIndex--;
            this.updateWordDisplay();
        }
    }
    
    nextWordHandler() {
        if (this.currentWordIndex < this.words.length - 1) {
            this.currentWordIndex++;
            this.updateWordDisplay();
        } else {
            this.showCompleteStage();
        }
    }
    
    // Completion methods
    updateCompletionStats() {
        this.totalWords.textContent = this.words.length;
        this.totalSentences.textContent = this.sentences.length;
        this.starsEarnedEl.textContent = this.starsEarned;
    }
    
    restartPractice() {
        this.currentStage = 'paragraph';
        this.currentSentenceIndex = 0;
        this.currentWordIndex = 0;
        this.starsEarned = 0;
        
        this.showParagraphStage();
        this.paragraphFeedback.style.display = 'none';
        this.updateProgress();
    }
    
    // Utility methods
    simulateAudioPlayback(button, playingText, normalText) {
        const originalContent = button.innerHTML;
        button.innerHTML = `<i class="fas fa-volume-up"></i><span>${playingText}</span>`;
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.disabled = false;
        }, 2000);
    }
    
    simulateRecording(button, callback) {
        const originalContent = button.innerHTML;
        button.innerHTML = '<i class="fas fa-stop"></i><span>Recording...</span>';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-microphone"></i><span>Processing...</span>';
            
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.disabled = false;
                if (callback) callback();
            }, 1500);
        }, 2000);
    }
    
    // Navigation methods
    goBack() {
        window.history.back();
    }
    
    goHome() {
        window.location.href = 'profile.html';
    }
    
    goToProfile() {
        window.location.href = 'profile.html';
    }
    
    openSettings() {
        console.log('Settings clicked');
    }
    
    // Keyboard shortcuts
    handleKeyboard(e) {
        switch(e.key) {
            case ' ':
                e.preventDefault();
                if (this.currentStage === 'paragraph' && this.paragraphRecordBtn.style.display !== 'none') {
                    this.recordParagraph();
                } else if (this.currentStage === 'sentence' && this.sentenceRecordBtn.style.display !== 'none') {
                    this.recordSentence();
                } else if (this.currentStage === 'word' && this.wordRecordBtn.style.display !== 'none') {
                    this.recordWord();
                }
                break;
            case 'h':
                e.preventDefault();
                if (this.currentStage === 'word') {
                    this.showWordHint();
                }
                break;
            case 'a':
                e.preventDefault();
                if (this.currentStage === 'paragraph') {
                    this.playParagraphAudio();
                } else if (this.currentStage === 'sentence') {
                    this.playSentenceAudio();
                } else if (this.currentStage === 'word') {
                    this.playWordAudio();
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (this.currentStage === 'sentence' && this.nextSentence.style.display !== 'none') {
                    this.nextSentenceHandler();
                } else if (this.currentStage === 'word' && this.nextWord.style.display !== 'none') {
                    this.nextWordHandler();
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (this.currentStage === 'sentence' && this.prevSentence.style.display !== 'none') {
                    this.previousSentence();
                } else if (this.currentStage === 'word' && this.prevWord.style.display !== 'none') {
                    this.previousWord();
                }
                break;
            case 'Escape':
                this.hideHint();
                break;
        }
    }
}

// Initialize the practice when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ReadingPractice();
});

// Add entrance animations
document.addEventListener('DOMContentLoaded', () => {
    const welcomeCards = document.querySelectorAll('.info-card');
    welcomeCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200 + 500);
    });
    
    const startBtn = document.querySelector('.start-btn');
    startBtn.style.opacity = '0';
    startBtn.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        startBtn.style.transition = 'all 0.6s ease';
        startBtn.style.opacity = '1';
        startBtn.style.transform = 'translateY(0)';
    }, 1200);
});
