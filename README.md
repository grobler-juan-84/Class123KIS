# ClassDojo Clone - Classroom Management System

A web application inspired by ClassDojo, built with Flask and Bootstrap. This project focuses on the front-end design with dummy data, providing a foundation for classroom management features.

## 🎯 Features

- **Dashboard Overview**: Main dashboard with class statistics and recent activity
- **Class Management**: View and manage multiple classes
- **Student Profiles**: Individual student pages with points tracking
- **Points System**: Award points to students for different skills
- **Skills Tracking**: Track student progress in various skills (Teamwork, Creativity, Perseverance, etc.)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, ClassDojo-inspired interface with Bootstrap 5

## 🚀 Quick Start

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Clone or download this project**
   ```bash
   cd Class123KIS
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

## 📁 Project Structure

```
Class123KIS/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── templates/            # HTML templates
│   ├── base.html         # Base template with navigation
│   ├── index.html        # Dashboard/homepage
│   ├── class.html        # Individual class view
│   └── student.html      # Individual student view
└── static/               # Static files
    ├── css/
    │   └── style.css     # Custom CSS styles
    ├── js/
    │   └── main.js       # JavaScript functionality
    └── images/           # Image assets
```

## 🎨 Design Features

### Color Scheme
- **Primary**: #4A90E2 (Blue)
- **Secondary**: #7ED321 (Green)
- **Accent**: #F5A623 (Orange)
- **Success**: #7ED321 (Green)
- **Warning**: #F5A623 (Orange)
- **Info**: #4A90E2 (Blue)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- Responsive Bootstrap 5 grid system
- Custom card designs with hover effects
- Animated progress bars
- Interactive modals for awarding points
- Mobile-friendly navigation

## 📊 Dummy Data

The application includes comprehensive dummy data:

- **3 Classes**: Grade 3A, Grade 3B, Grade 4A
- **15 Students**: With avatars, points, and class assignments
- **5 Skills**: Teamwork, Creativity, Perseverance, Curiosity, Leadership
- **2 Teachers**: Ms. Johnson and Mr. Smith
- **Recent Activities**: Sample activity feed

## 🔧 Customization

### Adding New Students
Edit the `DUMMY_DATA['students']` list in `app.py`:

```python
{
    'id': 16,
    'name': 'New Student',
    'avatar': '👦',
    'points': 0,
    'class_id': 1
}
```

### Adding New Skills
Edit the `DUMMY_DATA['skills']` list in `app.py`:

```python
{
    'id': 6,
    'name': 'Communication',
    'icon': '💬',
    'color': 'info'
}
```

### Styling
Modify `static/css/style.css` to customize:
- Colors (CSS variables in `:root`)
- Typography
- Component styles
- Animations

## 🚀 Next Steps

This is a front-end focused implementation. To make it production-ready, consider adding:

1. **Database Integration**
   - SQLAlchemy with SQLite/PostgreSQL
   - User authentication
   - Data persistence

2. **Backend Features**
   - Real user management
   - Email notifications
   - Data export/import
   - API endpoints

3. **Advanced Features**
   - Parent portal
   - Mobile app
   - Real-time updates
   - Advanced reporting

## 🛠️ Development

### Running in Development Mode
```bash
python app.py
```
The app runs with `debug=True` for development.

### Adding New Pages
1. Create a new route in `app.py`
2. Create a corresponding template in `templates/`
3. Update navigation in `base.html` if needed

### Styling Guidelines
- Use Bootstrap classes when possible
- Custom styles go in `static/css/style.css`
- Follow the existing color scheme
- Maintain responsive design

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

This is a template project. Feel free to:
- Add new features
- Improve the design
- Add more dummy data
- Implement backend functionality

## 📄 License

This project is for educational purposes. ClassDojo is a trademark of ClassDojo, Inc.

---

**Built with ❤️ using Flask, Bootstrap 5, and modern web technologies**
