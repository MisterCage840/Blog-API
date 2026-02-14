🚀 Blog API – Full Stack Platform

A production-ready full-stack blog platform built using a modern API-first architecture.

This project demonstrates how to separate backend logic from frontend applications while maintaining security, flexibility, and scalability.

🌍 Live Application

Public Blog: [https://YOUR_PUBLIC_URL.vercel.app](https://blog-gufrjpfil-mistercage840s-projects.vercel.app/)

Admin Dashboard: [https://YOUR_ADMIN_URL.vercel.app](https://blog-api-7cxd-gznud8nxi-mistercage840s-projects.vercel.app/)

Backend API: [https://YOUR_RENDER_API.onrender.com](https://blog-api-3r9a.onrender.com)

🏗 Architecture Overview

This platform is built around a decoupled system:

🔧 Backend API – Express + Prisma + PostgreSQL

🗄 Database – Supabase (PostgreSQL)

🎨 Public Frontend – React (Vite)

🛠 Admin Dashboard – React (Vite)

☁️ Hosting – Render (API) + Vercel (Frontends)


✨ Features
Public Blog

View published posts

Read comments

Submit comments (anonymous or identified)

Admin Dashboard

Secure authentication (JWT)

Create, edit, delete posts

Publish / unpublish posts

Manage comments

Backend

RESTful API design

JWT-based route protection

Role-based admin access

Prisma ORM integration

CORS protection

Production deployment configuration

🔐 Authentication Flow

Admin logs in.

API issues a JWT.

Token is stored client-side.

Protected routes validate the token via Authorization: Bearer.

🎯 Key Concepts Demonstrated

API-only backend architecture

Separation of concerns

Production CORS handling

Environment-based configuration

Cloud database integration

Multi-platform deployment

