// ClassDojo Clone - Main JavaScript

// Global variables for multi-select
let selectedStudents = new Set();
let multiSelectMode = false;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card, .student-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading states to buttons
    document.querySelectorAll('button[type="submit"]').forEach(button => {
        button.addEventListener('click', function() {
            if (this.form && this.form.checkValidity()) {
                this.classList.add('loading');
                this.disabled = true;
                this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
            }
        });
    });

    // Auto-hide alerts after 5 seconds
    document.querySelectorAll('.alert').forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });

    // Multi-select functionality
    const multiSelectBtn = document.getElementById('multiSelectBtn');
    if (multiSelectBtn) {
        multiSelectBtn.addEventListener('click', function() {
            toggleMultiSelectMode();
        });
    }

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            if (view === 'students') {
                document.getElementById('studentsGrid').style.display = 'grid';
            } else if (view === 'groups') {
                document.getElementById('studentsGrid').style.display = 'none';
                // Show groups view here
            }
        });
    });

    // Points animation
    function animatePoints(element, startValue, endValue, duration = 1000) {
        const startTime = performance.now();
        
        function updatePoints(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updatePoints);
            }
        }
        
        requestAnimationFrame(updatePoints);
    }

    // Initialize timer functionality
    initializeTimer();
    
    // Expose functions globally
    window.animatePoints = animatePoints;
    window.toggleStudentSelection = toggleStudentSelection;
    window.selectWholeClass = selectWholeClass;
    window.addStudent = addStudent;
    window.toggleMultiSelectMode = toggleMultiSelectMode;
    window.selectAllStudents = selectAllStudents;
    window.selectNoneStudents = selectNoneStudents;
});

// Multi-select functions
function toggleMultiSelectMode() {
    multiSelectMode = !multiSelectMode;
    window.multiSelectMode = multiSelectMode; // Make it globally accessible
    const studentsGrid = document.getElementById('studentsGrid');
    const multiSelectBtn = document.getElementById('multiSelectBtn');
    const multiSelectActions = document.getElementById('multiSelectActions');
    
    if (multiSelectMode) {
        studentsGrid.classList.add('multi-select-mode');
        multiSelectBtn.classList.add('active');
        multiSelectBtn.innerHTML = '<i class="fas fa-check-square"></i><span>Exit multi-select</span>';
        
        // Show multi-select action buttons
        if (multiSelectActions) {
            multiSelectActions.style.display = 'block';
        }
    } else {
        studentsGrid.classList.remove('multi-select-mode');
        multiSelectBtn.classList.remove('active');
        multiSelectBtn.innerHTML = '<i class="fas fa-check-square"></i><span>Select multiple</span>';
        selectedStudents.clear();
        window.selectedStudents = selectedStudents; // Make it globally accessible
        updateStudentCards();
        
        // Hide multi-select action buttons
        if (multiSelectActions) {
            multiSelectActions.style.display = 'none';
        }
    }
}

function toggleStudentSelection(studentId) {
    if (!multiSelectMode) {
        // If not in multi-select mode, go to student page
        window.location.href = `/student/${studentId}`;
        return;
    }
    
    if (selectedStudents.has(studentId)) {
        selectedStudents.delete(studentId);
    } else {
        selectedStudents.add(studentId);
    }
    
    window.selectedStudents = selectedStudents; // Make it globally accessible
    updateStudentCards();
    
    // Show award points button if students are selected
    if (selectedStudents.size > 0) {
        showAwardPointsButton();
    } else {
        hideAwardPointsButton();
    }
}

// Make function globally accessible
window.toggleStudentSelection = toggleStudentSelection;

function selectWholeClass() {
    if (!multiSelectMode) {
        // Award points to whole class
        showAwardPointsModal();
        return;
    }
    
    // Select all students
    const studentCards = document.querySelectorAll('.student-card[data-student-id]');
    studentCards.forEach(card => {
        const studentId = parseInt(card.dataset.studentId);
        selectedStudents.add(studentId);
    });
    
    updateStudentCards();
    showAwardPointsButton();
}

function updateStudentCards() {
    const studentCards = document.querySelectorAll('.student-card[data-student-id]');
    studentCards.forEach(card => {
        const studentId = parseInt(card.dataset.studentId);
        if (selectedStudents.has(studentId)) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

function showAwardPointsButton() {
    // Create or show award points button
    let awardBtn = document.getElementById('awardSelectedBtn');
    if (!awardBtn) {
        awardBtn = document.createElement('button');
        awardBtn.id = 'awardSelectedBtn';
        awardBtn.className = 'btn btn-primary position-fixed';
        awardBtn.style.cssText = 'top: 20px; right: 20px; z-index: 1000;';
        awardBtn.innerHTML = '<i class="fas fa-star me-1"></i>Award Points to Selected';
        awardBtn.onclick = showAwardPointsModal;
        document.body.appendChild(awardBtn);
    }
    awardBtn.style.display = 'block';
}

function hideAwardPointsButton() {
    const awardBtn = document.getElementById('awardSelectedBtn');
    if (awardBtn) {
        awardBtn.style.display = 'none';
    }
}

function showAwardPointsModal() {
    // Use the new function that handles multiple students
    if (typeof awardPointsToSelected === 'function') {
        awardPointsToSelected();
    } else {
        new bootstrap.Modal(document.getElementById('awardPointsModal')).show();
    }
}

function addStudent() {
    alert('Add student functionality would be implemented here');
}

function selectAllStudents() {
    if (!selectedStudents) {
        selectedStudents = new Set();
    }
    
    // Select all students
    const studentCards = document.querySelectorAll('.student-card[data-student-id]');
    studentCards.forEach(card => {
        const studentId = parseInt(card.dataset.studentId);
        selectedStudents.add(studentId);
    });
    
    window.selectedStudents = selectedStudents; // Make it globally accessible
    updateStudentCards();
    showAwardPointsButton();
}

function selectNoneStudents() {
    if (selectedStudents) {
        selectedStudents.clear();
    }
    
    window.selectedStudents = selectedStudents; // Make it globally accessible
    updateStudentCards();
    hideAwardPointsButton();
}

// Utility functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(notification);
        bsAlert.close();
    }, 3000);
}

// Export for use in other scripts
window.showNotification = showNotification;

// Timer functionality
let timerInterval = null;
let timerSeconds = 0;
let isRunning = false;
let isPaused = false;

// Dragging functionality
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let modalStartX = 0;
let modalStartY = 0;

// Timer functions
function initializeTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    const timerStatus = document.getElementById('timerStatus');
    const startBtn = document.getElementById('startTimerBtn');
    const pauseBtn = document.getElementById('pauseTimerBtn');
    const resetBtn = document.getElementById('resetTimerBtn');
    const addButtons = document.querySelectorAll('.timer-add-btn');
    const timerModal = document.getElementById('timerModal');
    
    if (!timerDisplay || !timerStatus || !startBtn || !pauseBtn || !resetBtn) {
        return; // Elements not found, skip initialization
    }
    
    // Add time buttons
    addButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const seconds = parseInt(this.dataset.seconds);
            addTime(seconds);
        });
    });
    
    // Start button
    startBtn.addEventListener('click', function() {
        if (timerSeconds > 0) {
            startTimer();
        }
    });
    
    // Pause button
    pauseBtn.addEventListener('click', function() {
        if (isRunning) {
            pauseTimer();
        }
    });
    
    // Reset button
    resetBtn.addEventListener('click', function() {
        resetTimer();
    });
    
    // Reset timer when modal is closed
    if (timerModal) {
        timerModal.addEventListener('hidden.bs.modal', function() {
            resetTimer();
        });
        
        // Add dragging functionality
        setupModalDragging();
        
        // Add resize observer for dynamic timer sizing
        setupDynamicTimerResizing();
    }
    
    // Initialize display with proper default size
    updateTimerDisplay();
    
    // Set initial reasonable size to prevent it from being too big on open
    if (timerDisplay) {
        timerDisplay.style.fontSize = '3rem';
    }
}

function addTime(seconds) {
    timerSeconds += seconds;
    updateTimerDisplay();
    updateButtonStates();
}

function startTimer() {
    if (timerSeconds <= 0) return;
    
    isRunning = true;
    isPaused = false;
    
    timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();
        updateButtonStates();
        
        if (timerSeconds <= 0) {
            finishTimer();
        }
    }, 1000);
    
    updateTimerStatus('Running');
    addTimerClass('timer-running');
}

function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    isRunning = false;
    isPaused = true;
    
    updateTimerStatus('Paused');
    addTimerClass('timer-paused');
    updateButtonStates();
}

function resetTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    timerSeconds = 0;
    isRunning = false;
    isPaused = false;
    
    updateTimerDisplay();
    updateTimerStatus('Ready');
    removeTimerClasses();
    updateButtonStates();
}

function finishTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    isRunning = false;
    isPaused = false;
    
    updateTimerStatus('Finished!');
    addTimerClass('timer-finished');
    updateButtonStates();
    
    // Show notification
    if (typeof showNotification === 'function') {
        showNotification('Timer finished!', 'success');
    }
    
    // Play sound if available
    playTimerSound();
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function updateTimerStatus(status) {
    const timerStatus = document.getElementById('timerStatus');
    if (timerStatus) {
        timerStatus.textContent = status;
    }
}

function updateButtonStates() {
    const startBtn = document.getElementById('startTimerBtn');
    const pauseBtn = document.getElementById('pauseTimerBtn');
    const resetBtn = document.getElementById('resetTimerBtn');
    
    if (startBtn) {
        startBtn.disabled = timerSeconds <= 0 || isRunning;
    }
    
    if (pauseBtn) {
        pauseBtn.disabled = !isRunning;
    }
    
    if (resetBtn) {
        resetBtn.disabled = timerSeconds <= 0 && !isRunning && !isPaused;
    }
}

function addTimerClass(className) {
    const timerModal = document.getElementById('timerModal');
    if (timerModal) {
        removeTimerClasses();
        timerModal.classList.add(className);
    }
}

function removeTimerClasses() {
    const timerModal = document.getElementById('timerModal');
    if (timerModal) {
        timerModal.classList.remove('timer-running', 'timer-paused', 'timer-finished');
    }
}

function playTimerSound() {
    // Create a simple beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        // Fallback: just show notification
        console.log('Audio not supported');
    }
}

// Setup modal dragging functionality
function setupModalDragging() {
    const timerModal = document.getElementById('timerModal');
    const modalDialog = timerModal.querySelector('.timer-modal-dialog');
    const modalHeader = timerModal.querySelector('.timer-modal-header');
    
    if (!modalDialog || !modalHeader) return;
    
    // Make modal draggable when shown
    timerModal.addEventListener('shown.bs.modal', function() {
        modalDialog.classList.add('draggable');
        modalHeader.classList.add('draggable');
        
        // Add mouse event listeners
        modalHeader.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    });
    
    // Remove dragging when modal is hidden
    timerModal.addEventListener('hidden.bs.modal', function() {
        modalDialog.classList.remove('draggable');
        modalHeader.classList.remove('draggable');
        
        // Remove event listeners
        modalHeader.removeEventListener('mousedown', startDrag);
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    });
}

function startDrag(e) {
    if (e.target.closest('.btn-close')) return; // Don't drag when clicking close button
    
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    
    const modalDialog = document.querySelector('.timer-modal-dialog.draggable');
    if (modalDialog) {
        const rect = modalDialog.getBoundingClientRect();
        modalStartX = rect.left;
        modalStartY = rect.top;
    }
    
    e.preventDefault();
}

function drag(e) {
    if (!isDragging) return;
    
    const modalDialog = document.querySelector('.timer-modal-dialog.draggable');
    if (!modalDialog) return;
    
    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;
    
    const newX = modalStartX + deltaX;
    const newY = modalStartY + deltaY;
    
    // Keep modal within viewport bounds
    const maxX = window.innerWidth - modalDialog.offsetWidth;
    const maxY = window.innerHeight - modalDialog.offsetHeight;
    
    modalDialog.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
    modalDialog.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
    modalDialog.style.transform = 'none';
}

function stopDrag() {
    isDragging = false;
}

// Setup dynamic timer resizing based on modal size
function setupDynamicTimerResizing() {
    const timerModal = document.getElementById('timerModal');
    const timerDisplay = document.getElementById('timerDisplay');
    
    if (!timerModal || !timerDisplay) return;
    
    // Create resize observer
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const modalContent = entry.target;
            const width = modalContent.offsetWidth;
            const height = modalContent.offsetHeight;
            
            // Smart scaling that considers available space and prevents overlap
            const baseWidth = 400;
            const baseHeight = 300;
            const baseFontSize = 3; // rem
            
            // Calculate available space for timer (accounting for controls)
            const controlsHeight = 120; // Approximate height of controls
            const availableHeight = height - controlsHeight - 100; // Extra padding
            const availableWidth = width - 40; // Account for padding
            
            // Calculate scale factors based on available space
            const widthScale = availableWidth / baseWidth;
            const heightScale = availableHeight / baseHeight;
            
            // Use the smaller scale factor to prevent overlap
            const scaleFactor = Math.min(widthScale, heightScale) * 0.9;
            
            // Reasonable range: 1rem to 6rem to prevent overlap
            const newFontSize = Math.max(1, Math.min(6, baseFontSize * scaleFactor));
            
            timerDisplay.style.fontSize = newFontSize + 'rem';
            
            // Also adjust line height for better proportions
            timerDisplay.style.lineHeight = '1';
            
            // Optional: Add a subtle scale animation for very large changes
            if (Math.abs(scaleFactor - 1) > 0.5) {
                timerDisplay.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    timerDisplay.style.transform = 'scale(1)';
                }, 200);
            }
        }
    });
    
    // Start observing when modal is shown
    timerModal.addEventListener('shown.bs.modal', function() {
        const modalContent = timerModal.querySelector('.timer-modal-content');
        if (modalContent) {
            resizeObserver.observe(modalContent);
        }
    });
    
    // Stop observing when modal is hidden
    timerModal.addEventListener('hidden.bs.modal', function() {
        resizeObserver.disconnect();
    });
}

// Initialize timer functionality when DOM is loaded
// This will be called from the existing DOMContentLoaded event listener