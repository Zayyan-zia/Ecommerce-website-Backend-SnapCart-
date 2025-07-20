# 🛒 SnapCart Backend

Welcome to the **SnapCart Backend** – the server-side application for the SnapCart e-commerce platform. This backend is built with **Node.js**, **Express**, and **MongoDB**, and provides all the core functionality needed for the SnapCart frontend to operate, including product management, image handling, user interactions, and email services.

---

## 🚧 Project Overview

This backend handles:

- 🛍️ Product listing (Main page, Shoes, Accessories)
- 📷 Image upload and retrieval with **Multer**
- 📬 Contact and signup email notifications via **Nodemailer**
- 🧾 Order confirmation email on checkout
- 🔎 Product search using **Fuse.js**
- 📡 REST API endpoints for React frontend

---

## 📦 Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Multer** (for image uploads)
- **Nodemailer** (for sending emails)
- **Fuse.js** (for fuzzy searching)
- **dotenv** (for environment variable management)

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/yourusername/snapcart-backend.git
cd snapcart-backend

### Install Dependencies

- **npm install**
 
### Create .env file

- **PORT=3001**
- **mongodb_connectionname=your_mongodb_connection_string**
- **email_hostname=smtp.your-email-provider.com**
- **email_username=your_email@example.com**
- **email_passname=your_email_password**
- **email_from="SnapCart <your_email@example.com>"**

### Start The Server

- **node server.js**
