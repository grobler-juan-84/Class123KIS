# pip install -r requirements.txt

from flask import Flask, render_template, request, redirect, url_for, flash
from flask_bootstrap import Bootstrap
import json
import os

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this in production
Bootstrap(app)

# Dummy data for the application
DUMMY_DATA = {
    'teachers': [
        {
            'id': 1,
            'name': 'Ms. Johnson',
            'email': 'ms.johnson@school.edu',
            'avatar': '👩‍🏫',
            'classes': [1, 2]
        },
        {
            'id': 2,
            'name': 'Mr. Smith',
            'email': 'mr.smith@school.edu',
            'avatar': '👨‍🏫',
            'classes': [3]
        }
    ],
    'classes': [
        {
            'id': 1,
            'name': 'Grade 3A',
            'teacher_id': 1,
            'subject': 'Elementary',
            'students': [1, 2, 3, 4, 5]
        },
        {
            'id': 2,
            'name': 'Grade 3B',
            'teacher_id': 1,
            'subject': 'Elementary',
            'students': [6, 7, 8, 9, 10]
        },
        {
            'id': 3,
            'name': 'Grade 4A',
            'teacher_id': 2,
            'subject': 'Elementary',
            'students': [11, 12, 13, 14, 15]
        }
    ],
    'students': [
        {'id': 1, 'name': 'Alice Johnson', 'avatar': '👾', 'points': 45, 'class_id': 1},
        {'id': 2, 'name': 'Bob Wilson', 'avatar': '👹', 'points': 38, 'class_id': 1},
        {'id': 3, 'name': 'Charlie Brown', 'avatar': '👻', 'points': 52, 'class_id': 1},
        {'id': 4, 'name': 'Diana Prince', 'avatar': '🤖', 'points': 41, 'class_id': 1},
        {'id': 5, 'name': 'Ethan Hunt', 'avatar': '👽', 'points': 47, 'class_id': 1},
        {'id': 6, 'name': 'Fiona Green', 'avatar': '🐲', 'points': 39, 'class_id': 2},
        {'id': 7, 'name': 'George Lucas', 'avatar': '🦄', 'points': 44, 'class_id': 2},
        {'id': 8, 'name': 'Hannah Montana', 'avatar': '🐸', 'points': 50, 'class_id': 2},
        {'id': 9, 'name': 'Ian Fleming', 'avatar': '🦁', 'points': 36, 'class_id': 2},
        {'id': 10, 'name': 'Julia Roberts', 'avatar': '🐨', 'points': 48, 'class_id': 2},
        {'id': 11, 'name': 'Kevin Hart', 'avatar': '🐧', 'points': 42, 'class_id': 3},
        {'id': 12, 'name': 'Luna Lovegood', 'avatar': '🦊', 'points': 49, 'class_id': 3},
        {'id': 13, 'name': 'Mike Tyson', 'avatar': '🐯', 'points': 37, 'class_id': 3},
        {'id': 14, 'name': 'Nina Dobrev', 'avatar': '🐰', 'points': 46, 'class_id': 3},
        {'id': 15, 'name': 'Oliver Queen', 'avatar': '🐻', 'points': 43, 'class_id': 3}
    ],
    'skills': [
        {'id': 1, 'name': 'Teamwork', 'icon': '🤝', 'color': 'success'},
        {'id': 2, 'name': 'Creativity', 'icon': '🎨', 'color': 'warning'},
        {'id': 3, 'name': 'Perseverance', 'icon': '💪', 'color': 'info'},
        {'id': 4, 'name': 'Curiosity', 'icon': '🤔', 'color': 'primary'},
        {'id': 5, 'name': 'Leadership', 'icon': '👑', 'color': 'danger'}
    ],
    'recent_activities': [
        {'student': 'Alice Johnson', 'action': 'earned points', 'skill': 'Teamwork', 'points': 5, 'time': '2 minutes ago'},
        {'student': 'Bob Wilson', 'action': 'earned points', 'skill': 'Creativity', 'points': 3, 'time': '5 minutes ago'},
        {'student': 'Charlie Brown', 'action': 'earned points', 'skill': 'Perseverance', 'points': 4, 'time': '10 minutes ago'},
        {'student': 'Diana Prince', 'action': 'earned points', 'skill': 'Leadership', 'points': 6, 'time': '15 minutes ago'},
        {'student': 'Ethan Hunt', 'action': 'earned points', 'skill': 'Curiosity', 'points': 2, 'time': '20 minutes ago'}
    ]
}

def get_students_by_class(class_id):
    return [student for student in DUMMY_DATA['students'] if student['class_id'] == class_id]

def get_class_by_id(class_id):
    return next((cls for cls in DUMMY_DATA['classes'] if cls['id'] == class_id), None)

def get_teacher_by_id(teacher_id):
    return next((teacher for teacher in DUMMY_DATA['teachers'] if teacher['id'] == teacher_id), None)

@app.route('/')
def index():
    """Main dashboard page"""
    return render_template('index.html', 
                         classes=DUMMY_DATA['classes'],
                         teachers=DUMMY_DATA['teachers'],
                         recent_activities=DUMMY_DATA['recent_activities'][:5])

@app.route('/class/<int:class_id>')
def class_view(class_id):
    """Individual class view"""
    class_info = get_class_by_id(class_id)
    if not class_info:
        flash('Class not found!', 'error')
        return redirect(url_for('index'))
    
    students = get_students_by_class(class_id)
    teacher = get_teacher_by_id(class_info['teacher_id'])
    
    return render_template('class.html', 
                         class_info=class_info,
                         students=students,
                         teacher=teacher,
                         skills=DUMMY_DATA['skills'])

@app.route('/student/<int:student_id>')
def student_view(student_id):
    """Individual student view"""
    student = next((s for s in DUMMY_DATA['students'] if s['id'] == student_id), None)
    if not student:
        flash('Student not found!', 'error')
        return redirect(url_for('index'))
    
    class_info = get_class_by_id(student['class_id'])
    teacher = get_teacher_by_id(class_info['teacher_id'])
    
    return render_template('student.html', 
                         student=student,
                         class_info=class_info,
                         teacher=teacher,
                         skills=DUMMY_DATA['skills'])

@app.route('/award_points', methods=['POST'])
def award_points():
    """Award points to a student (dummy implementation)"""
    student_id = request.form.get('student_id')
    skill_id = request.form.get('skill_id')
    points = int(request.form.get('points', 1))
    
    # In a real app, this would update the database
    flash(f'Awarded {points} points to student!', 'success')
    
    return redirect(request.referrer or url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
