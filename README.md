# CampusCart - Student Marketplace Frontend

A modern, clean React-based OLX-type marketplace application for students to buy and sell items with peer-to-peer messaging.

**✅ Windows/WAMP Compatible** - Fully optimized for WAMP server deployment on Windows.

## 🚀 Features

- **Product Listings** - Browse items posted by fellow students with search and filtering
- **Product Details** - View detailed product information, seller ratings, and specifications
- **Direct Messaging** - Chat directly with buyers/sellers without exposing contact details initially
- **Post Listings** - Easily create and post new items for sale
- **User Profiles** - Manage your profile, view active listings, and track seller ratings
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Clean UI** - Modern interface built with Tailwind CSS
- **WAMP Ready** - Production-ready for Apache deployment with 1-year asset caching

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing (SPA)
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client ready for API integration
- **Windows/Apache** - WAMP stack compatible

## 📁 Project Structure

```
```

## 🎨 Key Pages

### Home Page
- Displays all available products in a grid layout
- Search functionality with multiple filters
- Category and price range filtering
- Product cards with like functionality

### Product Detail Page
- Full product information with specifications
- Seller information and ratings
- "Text the seller" button for direct messaging
- Safety tips for transactions

### Messaging Page
- List of active conversations
- Real-time chat interface
- Search conversations by seller or product
- Online/offline status indicators

### Post Listing Page
- Form to create new product listings
- Image upload preview
- Category and condition selection
- Location and contact information

### Profile Page
- User profile information
- Active listings management
- Seller ratings and reviews
- Account settings and logout

## ⚙️ Installation & Setup (All Systems)

### Prerequisites
- Node.js (v16 or higher) - [Download](https://nodejs.org/)
- npm or yarn

### Quick Start (Development)

1. Install dependencies:
```powershell
npm install
```

2. Start the development server:
```powershell
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5173
```

## 🚀 WAMP Production Deployment

### Prerequisites
- WAMP Server installed - [Download](https://www.wampserver.com/)
- Apache mod_rewrite enabled
- .htaccess support enabled in Apache

### Deploy to WAMP

1. **Build the project:**
```powershell
npm run build
```

2. **Copy to WAMP:**
```powershell
# Option 1: Command line
xcopy dist C:\wamp64\www\campuscart\ /E /Y

# Option 2: Manual
# Copy contents of 'dist' folder to C:\wamp64\www\campuscart\
```

3. **Access your app:**
```
http://localhost/campuscart
```

### Complete WAMP Setup Guide

For comprehensive WAMP deployment instructions including:
- Virtual host configuration
- Apache module setup
- Database integration
- Troubleshooting

See: **[WAMP-DEPLOYMENT.md](WAMP-DEPLOYMENT.md)**

## 🚢 Build for Production

Build for production:
```powershell
npm run build
```

Preview production build locally:
```powershell
npm run preview
```

Output folder: `dist/` (Deploy this to WAMP)

## 🔄 Development Workflow

The app uses Hot Module Replacement (HMR) for instant updates during development. Changes to components are reflected immediately in the browser.

## 📝 Component Guidelines

- Use functional components with React Hooks
- Keep components focused and reusable
- Use Tailwind CSS for styling (no CSS files needed)
- Follow component imports in App.jsx as reference

## 🔗 API Integration Ready

The project is set up for backend API integration using Axios. Ready to connect with your backend services.

Example:
```javascript
import axios from 'axios'

const API_URL = 'http://localhost/api' // or your WAMP-based API

const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
  }
}
```

## 📱 Responsive Breakpoints

- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

## 🎯 Future Enhancements

- Real-time notifications with Socket.io
- Payment integration
- Advanced filtering options
- User verification system
- Listing analytics
- Review and rating system
- Email notifications
- Admin dashboard
- Analytics tracking

## 📚 Useful Resources

- [WAMP Setup Guide](WAMP-DEPLOYMENT.md)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Apache Rewrite Rules](https://httpd.apache.org/docs/current/mod/mod_rewrite.html)

## 🔧 Troubleshooting

### Issue: Router paths not working in WAMP
- Ensure `.htaccess` is in the deployment directory
- Verify `mod_rewrite` is enabled in Apache
- Check Apache error logs: `C:\wamp64\logs\`

### Issue: CSS/JS not loading
- Clear browser cache (Ctrl+Shift+R)
- Verify files are in correct paths
- Check browser console for 404 errors

### Issue: CORS errors
- Ensure CORS headers are configured in `.htaccess`
- Verify backend API allows cross-origin requests

## 📄 License

This project is licensed under the MIT License - feel free to use it for your campus marketplace.

---

**Happy Selling and Buying! 🎉**

**Last Updated:** March 2026  
**Platform:** Windows/WAMP Compatible  
**Status:** Production Ready

