# YatraNow - Bus & Train Booking Frontend

A clean, simple, and user-friendly frontend for booking buses and trains, built with pure HTML, CSS, and JavaScript (no frameworks).

## 🚀 Features

### User Features
- **Hero Carousel**: Auto-sliding carousel with smooth transitions, navigation arrows, and indicator dots
- **Browse Routes**: View available bus and train routes with pricing and seat availability
- **Smart Search**: Filter routes by type, price, departure time, and available seats
- **Seat Selection**: Visual seat layout with real-time availability and price calculation
- **Booking Confirmation**: Clean booking success page with detailed trip information

### Owner Features
- **Vehicle Management**: Add buses/trains with automatic seat layout preview
- **Route Management**: Create, edit, and delete routes
- **Booking Overview**: View all customer bookings
- **Complaint Handling**: Manage user complaints with status tracking

### Admin Features
- **User Management**: View, block/unblock, and delete users
- **Owner Management**: Manage travel agency owners
- **Statistics**: Dashboard with key metrics

## 📁 Folder Structure

```
YatraNow - Frontend/
├── index.html                 # Homepage with carousel and routes
├── css/
│   ├── main.css              # Global styles, navbar, carousel
│   ├── auth.css              # Login/Register pages
│   └── dashboard.css         # Results, seats, admin, owner dashboards
├── js/
│   ├── carousel.js           # Hero carousel logic
│   ├── auth.js               # Authentication handling
│   ├── dashboard.js          # Results filtering & sorting
│   ├── seats.js              # Seat selection logic
│   └── data.js               # Dummy JSON data
├── images/
│   ├── carousel/             # Carousel images (bus, train, passengers)
│   └── icons/                # UI icons
└── pages/
    ├── login.html            # Login page
    ├── register.html         # User/Owner registration
    ├── results.html          # Search results with filters
    ├── seats.html            # Seat selection page
    ├── success.html          # Booking confirmation
    ├── admin.html            # Admin dashboard
    └── owner.html            # Owner dashboard
```

## 🎨 Design Features

### Color Scheme
- **Primary Navy**: #1a2a4e (Navbar, headings)
- **Accent Blue**: #4a90e2 (Buttons, links)
- **Success Green**: #28a745 (Prices, confirmations)
- **Danger Red**: #dc3545 (Errors, warnings)
- **Light Background**: #f8f9fa

### Key Design Elements
- **Constant Navy Blue Navbar**: No color changes on click or hover
- **Smooth Transitions**: 0.3s ease-in-out animations
- **Responsive Design**: Mobile-first, works on all devices
- **RedBus-Style Cards**: Clean, minimal route cards
- **Visual Seat Layout**: Color-coded seats (green=available, red=booked, blue=selected)

## 🚦 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required!

### Installation

1. **Clone or download** this repository

2. **Add carousel images** (optional):
   - Replace placeholder images in `images/carousel/`
   - Use these names: `bus.jpg`, `train.jpg`, `passengers.jpg`
   - Recommended size: 1920x1080px

3. **Open in browser**:
   ```
   Simply open index.html in your web browser
   ```

### Quick Test

To test the application:

1. Open `index.html` - Browse routes on homepage
2. Click any route → Redirects to login
3. Login with any credentials (dummy auth)
4. Browse results → Select seats → Confirm booking
5. View success page with booking details

**Test Admin Dashboard:**
- Login and manually change user role to 'admin' in localStorage
- Navigate to `/pages/admin.html`

**Test Owner Dashboard:**
- Login and manually change user role to 'owner' in localStorage
- Navigate to `/pages/owner.html`

## 🔧 Key Functionalities

### Hero Carousel
- **Auto-slide**: Every 5 seconds
- **Pause on hover**: User-friendly interaction
- **Navigation**: Left/right arrows + indicator dots
- **Touch support**: Swipe gestures on mobile
- **Lazy loading**: Optimized image loading

### Seat Selection
- **Visual Grid**: 4-column seat layout
- **Real-time Updates**: Price calculated as you select
- **Booked Seats**: Disabled and color-coded
- **Multiple Selection**: Select multiple seats at once

### Filtering & Sorting
- **Filter by Type**: Bus or Train
- **Sort by**: Price, Time, Seats Available
- **Search**: By From/To cities

## 🔌 API Integration Points

All API connection points are clearly marked with `// TODO: Connect to backend API` comments:

### Authentication (auth.js, login.html, register.html)
```javascript
// TODO: Replace with actual API call
const response = await login(email, password);
```

### Routes (data.js)
```javascript
// TODO: Replace with API endpoint
function getRoutes() {
  return Promise.resolve(dummyRoutes);
}
```

### Bookings (seats.html)
```javascript
// TODO: Connect to backend API
const response = await createBooking(routeId, seats);
```

### Admin Actions (admin.html)
```javascript
// TODO: API call to toggle status
// TODO: API call to delete user
```

### Owner Management (owner.html)
```javascript
// TODO: Connect to backend API for vehicle addition
// TODO: API call to update complaint status
```

## 📱 Responsive Breakpoints

- **Desktop**: > 768px (Full layout)
- **Tablet**: 768px (Adjusted columns)
- **Mobile**: < 480px (Single column, hamburger menu)

## 🎯 User Flows

### User Booking Flow
1. Homepage → Browse routes
2. Click route → Login (if not logged in)
3. Search Results → Filter/Sort
4. Select route → View seats
5. Choose seats → Confirm booking
6. Success page → Download ticket

### Owner Flow
1. Register as owner (with agency logo)
2. Login → Owner Dashboard
3. Add vehicles with seat layout preview
4. Manage routes and bookings
5. Handle user complaints

### Admin Flow
1. Login as admin
2. View statistics
3. Manage users and owners
4. Block/unblock accounts

## 🔐 Current Authentication

**Note**: Currently using localStorage for dummy authentication. Replace with JWT/OAuth when connecting to backend.

```javascript
// Dummy login - REPLACE WITH BACKEND
localStorage.setItem('yatraNowUser', JSON.stringify({
  id: 1,
  name: 'Test User',
  email: email,
  role: 'user' // 'user', 'owner', or 'admin'
}));
```

## 🛠️ Customization

### Change Primary Color
Edit `css/main.css`:
```css
:root {
  --primary-navy: #YOUR_COLOR_HERE;
}
```

### Modify Carousel Speed
Edit `js/carousel.js`:
```javascript
this.autoSlideDelay = 5000; // Change to desired milliseconds
```

### Add More Routes
Edit `js/data.js`:
```javascript
const dummyRoutes = [
  // Add your routes here
];
```

## 📋 Dummy Data

The application includes dummy data for:
- 6 Bus/Train routes
- 3 Sample users
- 2 Sample owners
- 2 Sample bookings
- 2 Sample complaints

All in `js/data.js` - Replace with API calls.

## 🚧 TODO for Production

- [ ] Replace localStorage auth with JWT tokens
- [ ] Connect all API endpoints to backend
- [ ] Add real carousel images
- [ ] Implement PDF ticket generation
- [ ] Add payment gateway integration
- [ ] Implement real-time seat availability updates
- [ ] Add email notifications
- [ ] Implement "Forgot Password" functionality
- [ ] Add image compression for owner uploads
- [ ] Implement proper session management

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

This is a frontend template ready for backend integration. Feel free to customize and extend!

## 📞 Support

For issues or questions:
- Check API integration comments in code
- Review dummy data structure in `js/data.js`
- Inspect browser console for debugging

---

**Built with ❤️ using Pure HTML, CSS, and JavaScript**

No frameworks. No dependencies. Just clean, simple code.
