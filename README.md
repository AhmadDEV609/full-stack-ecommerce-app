
# Full Stack E-Commerce Web Application

A modern, scalable, and feature-rich full-stack e-commerce platform built with role-based authentication, secure payments, and a powerful admin dashboard.


🚀 Features

👤 User Features

* User registration with email verification
Secure login with JWT authentication

* Google OAuth 2.0 login
* Browse products with search, filtering, and pagination
* Add/remove products from cart and wishlist
* Checkout system with:
Shipping address (city, phone, address)
Multiple payment methods (COD & Online Payment)
Order tracking system

💳 Payment Integration

* Secure online payment gateway integration
* Cash on Delivery (COD) option
* Automatic order creation after successful payment

🧑‍💼 Admin Features

* Secure admin panel with role-based access
* Product management (Create, Update, Delete)
* Order management system:
Update order status (Pending, Processing, Shipped, Delivered)
Dashboard analytics:
Total revenue
Total orders
Pending & delivered orders
Sales overview

⚙️ Tech Stack

Frontend
* React.js , react query 
* Html Css javascript

Backend
* Node.js
* Express.js
* Database
* MongoDB+mongoose
* Authentication
JWT (JSON Web Token)
* Google OAuth 2.0
* Email verification (Nodemailer )
* Payment Gateway
Stripe 


## Badges

![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express.js](https://img.shields.io/badge/Framework-Express.js-lightgrey)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Stripe](https://img.shields.io/badge/Payment-Stripe-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Environment Variables


PORT=5000
MONGO_URI=your_database_url
JWT_SECRET=your_secret_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

EMAIL_VERIFICATION=your_email
EMAIL_VERIFICATION_PASSWORD=your_email_password

STRIPE_SECRET_KEY=your key
STRIPE_PUBLIC_KEY=your key

FRONTEND_URL=
NODE_ENV=development


## Run Locally

Clone the project

```bash
 git clone https://github.com/AhmadDEV609/full-stack-ecommerce-app.git
```

Go to the project directory

```bash
  cd full-stack-ecommerce-app
```

Backend

```bash
cd backend
npm install
npm run dev
```

Frontend

```bash
cd latest
npm install
npm run dev
```
Admin 
```bash
cd latest
npm install
npm run dev
```

