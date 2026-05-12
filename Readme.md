🛒 Full Stack E-Commerce Web Application

A modern, scalable, and feature-rich full-stack e-commerce platform built with role-based authentication, secure payments, and a powerful admin dashboard.

🚀 Features

👤 User Features

User registration with email verification
Secure login with JWT authentication
Google OAuth 2.0 login
Browse products with search, filtering, and pagination
Add/remove products from cart and wishlist
Checkout system with:
Shipping address (city, phone, address)
Multiple payment methods (COD & Online Payment)
Order tracking system

💳 Payment Integration

Secure online payment gateway integration
Cash on Delivery (COD) option
Automatic order creation after successful payment

🧑‍💼 Admin Features

Secure admin panel with role-based access
Product management (Create, Update, Delete)
Order management system:
Update order status (Pending, Processing, Shipped, Delivered)
Dashboard analytics:
Total revenue
Total orders
Pending & delivered orders
Sales overview
⚙️ Tech Stack
Frontend
React.js , react query 
Html Css javascript
Backend
Node.js
Express.js
Database
MongoDB+mongoose
Authentication
JWT (JSON Web Token)
Google OAuth 2.0
Email verification (Nodemailer )
Payment Gateway
Stripe 


📦 Installation & Setup
1. Clone the repository
git clone https://github.com/your-username/your-repo-name.git
2. Install dependencies
Backend
cd backend
npm install
Frontend
cd frontend
npm install
3. Environment Variables

Create a .env file in backend:

PORT=5000
MONGO_URI=your_database_url
JWT_SECRET=your_secret_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

STRIPE_SECRET_KEY=your key
STRIPE_PUBLIC_KEY=your key

FRONTEND_URL=
NODE_ENV=development

4. Run the application
Backend
npm run dev
Frontend
npm start


└── README.md
🔐 Security Features
Password hashing (bcrypt)
JWT authentication
Protected routes (User/Admin)
Secure payment handling
📈 Future Improvements
Real-time order tracking
Chat support system
Product recommendation system
Redis caching for performance
Docker deployment

👨‍💻 Author
Muhammad Ahmad
Full Stack Developer
GitHub: https://github.com/your-username

⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!