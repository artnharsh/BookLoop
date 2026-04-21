# BookLoop

BookLoop is a full-stack textbook marketplace for college students. It helps students list used books, discover listings, message sellers in real time, save books to a wishlist, and manage trust through seller ratings.

## What this project includes

- Student authentication with JWT
- Listing creation with image uploads (up to 3 images)
- Search and filtering for active listings
- Wishlist management
- Real-time chat using Socket.IO
- Seller rating system
- Admin analytics and user moderation

## Tech stack

### Frontend

- React 19 + Vite
- React Router
- Axios
- Socket.IO Client
- Tailwind CSS 4

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Multer for uploads
- Socket.IO

## Monorepo structure

```text
BookLoop/
  backend/
    config/
    controllers/
    middlewares/
    models/
    routes/
    sockets/
    uploads/
    index.js
  frontend/
    src/
      components/
      context/
      pages/
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (local or cloud, e.g. MongoDB Atlas)

## Setup and run

### 1) Clone and install dependencies

```bash
git clone <your-repo-url>
cd BookLoop

cd backend
npm install

cd ../frontend
npm install
```

### 2) Configure backend environment

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<dbname>
JWT_SECRET=replace_with_a_long_random_secret
```

### 3) Start backend

```bash
cd backend
npm run dev
```

The API will run on `http://localhost:5000`.

### 4) Start frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on Vite's default dev URL (usually `http://localhost:5173`).

## Available scripts

### Backend (`backend/package.json`)

- `npm run dev` - start API with nodemon

### Frontend (`frontend/package.json`)

- `npm run dev` - run Vite dev server
- `npm run build` - create production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## API overview

Base URL: `http://localhost:5000`

### Auth

- `POST /api/auth/register` - Register student user
- `POST /api/auth/login` - Login user

### Users

- `GET /api/users/wishlist` - Get wishlist (auth)
- `POST /api/users/wishlist/:listingId` - Add listing to wishlist (auth)
- `DELETE /api/users/wishlist/:listingId` - Remove listing from wishlist (auth)
- `POST /api/users/rate` - Rate a seller (auth)

### Listings

- `GET /api/listings` - Get active listings (supports keyword/courseCode/condition/minPrice/maxPrice query params)
- `GET /api/listings/:id` - Get listing details
- `POST /api/listings` - Create listing with multipart form-data (auth)
- `PUT /api/listings/:id` - Update listing (owner/admin)
- `DELETE /api/listings/:id` - Delete listing (owner/admin)

### Messages

- `GET /api/messages/conversations` - Get conversation summaries (auth)
- `GET /api/messages/:listingId?userId=<id>` - Get chat messages (auth)
- `POST /api/messages` - Send message (auth)

### Admin

- `GET /api/admin/analytics` - Platform statistics (auth + admin)
- `GET /api/admin/users` - List users (auth + admin)
- `DELETE /api/admin/users/:id` - Delete non-admin user (auth + admin)

## Real-time events (Socket.IO)

Client connects to `http://localhost:5000` and uses:

- `setup` - join personal room by user ID
- `join chat` - join listing-based room
- `new message` - emit a new message
- `message received` - receive incoming message

## Authentication flow

- Backend returns JWT on register/login.
- Frontend stores user info in localStorage.
- Frontend sets Axios default `Authorization: Bearer <token>` after login.
- Protected backend routes use `protect` middleware.

## File uploads

- Upload middleware accepts `jpg`, `jpeg`, `png`
- Limit: 5 MB per image
- Max images per listing: 3
- Static upload path served from `/uploads`

## Admin access

Admin-only features are guarded by:

- Backend: `protect` + `admin` middleware
- Frontend: route check on `user.role === 'admin'`

To test admin locally, set a user document role to `admin` in MongoDB.

## Notes for local development

This codebase currently hardcodes backend URLs in several frontend files:

- Axios base URL: `frontend/src/context/AuthContext.jsx`
- Socket endpoint: `frontend/src/pages/ChatWindow.jsx`
- Listing image URL building: `frontend/src/components/listings/ListingCard.jsx` and `frontend/src/pages/BookDetails.jsx`

If you change backend host/port, update those references.

## Troubleshooting

### Backend fails immediately on start

Check route syntax in `backend/routes/authRoutes.js`. Ensure route lines end with semicolons and not colons.

### MongoDB connection error

- Verify `MONGO_URI` in `backend/.env`
- Confirm network access/IP whitelist in MongoDB Atlas

### JWT errors on protected routes

- Confirm `JWT_SECRET` is set
- Re-login to refresh token in localStorage

### Image URLs not loading

- Confirm backend is running on `http://localhost:5000`
- Confirm files exist under `backend/uploads`

## Suggested improvements

- Move frontend API/socket base URLs to Vite env vars
- Add refresh token or session expiry handling
- Add tests for controllers and route guards
- Add Docker setup for one-command local run
- Add CI checks (lint + build + tests)

## License

No license is currently defined in this repository.
