# BlogSphere - Modern Blogging Platform

A full-stack blogging platform built with React, Node.js, and MongoDB, featuring user authentication, content management, payment integration, and real-time interactions.

## 🚀 Live Demo
[Add your live demo link here]

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Security Features](#security-features)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Google OAuth 2.0 integration** for seamless social login
- **Role-based access control** (User, Author, Admin)
- **Password reset functionality** with email verification
- **Session management** with automatic token refresh

### 📝 Content Management
- **Rich text editor** with React Quill for enhanced content creation
- **Image and video upload** with ImageKit integration
- **Post categorization** and tagging system
- **Draft saving** and post scheduling
- **Content moderation** and reporting system
- **SEO optimization** with meta tags and structured data

### 💰 Monetization & Payments
- **Chapa payment integration** for donations and subscriptions
- **Author wallet system** with balance tracking
- **Withdrawal functionality** with minimum balance requirements
- **Payment webhooks** for real-time transaction updates
- **Donation tracking** and receipt generation

### 👥 User Experience
- **Responsive design** with Tailwind CSS and Material-UI
- **Dark/Light theme** support with automatic detection
- **Real-time notifications** using React Query
- **Infinite scroll** for post loading
- **Search functionality** with filters
- **Comment system** with moderation tools

### 🛡️ Admin Features
- **Admin dashboard** with analytics and user management
- **Content moderation** tools
- **User role management**
- **Author request approval** system
- **Report management** and resolution

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router** for client-side routing
- **React Query (TanStack Query)** for server state management
- **Tailwind CSS** for utility-first styling
- **Material-UI** for component library
- **Framer Motion** for animations
- **React Quill** for rich text editing
- **ImageKit** for media management

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Nodemailer** for email services
- **Multer** for file uploads
- **CORS** for cross-origin requests

### Payment & External Services
- **Chapa** for payment processing
- **Google OAuth 2.0** for social authentication
- **ImageKit** for image optimization and CDN

### Development Tools
- **ESLint** for code linting
- **Prettier** for code formatting
- **Nodemon** for development server
- **Vite** for build tooling

## 🏗️ Architecture

### Frontend Architecture
```
client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── routes/         # Page components
│   ├── utils/          # Utility functions
│   ├── assets/         # Static assets
│   └── main.jsx        # Application entry point
```

### Backend Architecture
```
backend/
├── controllers/        # Business logic
├── models/            # Database schemas
├── routes/            # API endpoints
├── middleware/        # Custom middleware
├── lib/              # Database connection
└── index.js          # Server entry point
```

## 🔒 Security Features

### Authentication Security
- **JWT tokens** with configurable expiration
- **Password hashing** using bcrypt with salt rounds
- **Token refresh** mechanism for session management
- **CORS configuration** for secure cross-origin requests
- **Input validation** and sanitization

### Data Protection
- **Environment variables** for sensitive configuration
- **MongoDB injection prevention** with Mongoose
- **XSS protection** through input sanitization
- **CSRF protection** with secure tokens
- **Rate limiting** on API endpoints

### Payment Security
- **Webhook signature verification** for payment confirmations
- **Transaction ID validation** to prevent duplicate processing
- **Secure payment flow** with Chapa integration
- **Audit logging** for all financial transactions

### Content Security
- **File upload validation** with type and size restrictions
- **Image optimization** and compression
- **Content moderation** tools for inappropriate content
- **User reporting system** for community safety

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
CHAPA_SECRET_KEY=your_chapa_secret_key
CHAPA_WEBHOOK_SECRET=your_webhook_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_IK_PUBLIC_KEY=your_imagekit_public_key
VITE_IK_URL_ENDPOINT=your_imagekit_url_endpoint
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `POST /users/google-login` - Google OAuth login
- `POST /users/send-link` - Password reset email
- `POST /users/reset-password` - Password reset

### Content Endpoints
- `GET /posts` - Get all posts with pagination
- `POST /posts/create` - Create new post
- `GET /posts/:slug` - Get single post
- `PATCH /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

### Payment Endpoints
- `POST /payment/donate` - Initiate donation
- `GET /payment/donations/:tx_ref` - Get donation details
- `POST /payment/withdraw/:id` - Request withdrawal
- `GET /payment/donations/wallet/:id` - Get wallet balance

### Comment Endpoints
- `GET /comments/:postId` - Get post comments
- `POST /comments/:postId` - Add comment
- `DELETE /comments/:id` - Delete comment

## 🚀 Deployment

### Backend Deployment (Heroku/Netlify)
```bash
# Build the application
npm run build

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_production_mongodb_uri

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build the application
npm run build

# Deploy to Vercel
vercel --prod
```

## 🔮 Future Improvements

### Enhanced Features
- **Real-time chat** between users and authors
- **Newsletter subscription** system
- **Advanced analytics** dashboard for authors
- **Multi-language support** with i18n
- **Progressive Web App (PWA)** capabilities
- **Mobile app** development with React Native

### Technical Improvements
- **GraphQL API** for more efficient data fetching
- **Redis caching** for improved performance
- **Microservices architecture** for scalability
- **Docker containerization** for easy deployment
- **CI/CD pipeline** with automated testing
- **Performance monitoring** with APM tools

### Security Enhancements
- **Two-factor authentication (2FA)**
- **OAuth integration** with more providers
- **Advanced rate limiting** and DDoS protection
- **Security headers** and CSP implementation
- **Regular security audits** and penetration testing

### Content Features
- **Podcast integration** for audio content
- **Video streaming** capabilities
- **Collaborative editing** for team posts
- **Advanced search** with Elasticsearch
- **Content recommendation** algorithm
- **Social sharing** optimization

### Monetization Features
- **Subscription tiers** for premium content
- **Affiliate marketing** integration
- **Sponsored content** management
- **Merchandise store** integration
- **Crypto payments** support
- **Revenue analytics** dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Fuad Mohammed**
- GitHub: [@your-github-username](https://github.com/your-github-username)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)
- Email: fuadmohammed368@gmail.com

## 🙏 Acknowledgments

- [Chapa](https://chapa.co/) for payment processing
- [ImageKit](https://imagekit.io/) for media management
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Material-UI](https://mui.com/) for components

---

**Built with ❤️ using modern web technologies**
