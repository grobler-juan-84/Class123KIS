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

    // Expose functions globally
    window.animatePoints = animatePoints;
    window.toggleStudentSelection = toggleStudentSelection;
    window.selectWholeClass = selectWholeClass;
    window.addStudent = addStudent;
    window.toggleMultiSelectMode = toggleMultiSelectMode;
});

// Multi-select functions
function toggleMultiSelectMode() {
    multiSelectMode = !multiSelectMode;
    const studentsGrid = document.getElementById('studentsGrid');
    const multiSelectBtn = document.getElementById('multiSelectBtn');
    
    if (multiSelectMode) {
        studentsGrid.classList.add('multi-select-mode');
        multiSelectBtn.classList.add('active');
        multiSelectBtn.innerHTML = '<i class="fas fa-check-square"></i><span>Exit multi-select</span>';
    } else {
        studentsGrid.classList.remove('multi-select-mode');
        multiSelectBtn.classList.remove('active');
        multiSelectBtn.innerHTML = '<i class="fas fa-check-square"></i><span>Select multiple</span>';
        selectedStudents.clear();
        updateStudentCards();
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
    
    updateStudentCards();
    
    // Show award points button if students are selected
    if (selectedStudents.size > 0) {
        showAwardPointsButton();
    } else {
        hideAwardPointsButton();
    }
}

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
    new bootstrap.Modal(document.getElementById('awardPointsModal')).show();
}

function addStudent() {
    alert('Add student functionality would be implemented here');
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
