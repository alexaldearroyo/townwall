# Townwall

Townwall is a social platform designed to help users connect locally through shared interests. It enables users to create and share posts, follow other users, and interact through comments, all while discovering people nearby.

![Screenshot](public/screenshot.png)
![Screenshot 2](Screenshot2.png)

## Features

- **User Authentication**

  - Secure sign-up, log-in, and log-out functionalities.
  - Passwords hashed using bcrypt.
  - Input validation with Zod.
  - Session management with HTTP-only cookies.

- **User Profiles**

  - View and edit profiles, including profile images via Cloudinary integration.
  - Customize profiles with bios, interests, and random animal emojis.
  - Geolocation data captured and stored using HTML5 Geolocation API and PostgreSQL.

- **Posts**

  - Create, edit, and view posts with titles and content.
  - Assign categories to posts.
  - Search posts by username or location.
  - Display posts on user profiles.

- **Comments**

  - Comment on posts and user profiles.
  - Interactive public profiles or "Walls."

- **Follow System**

  - Follow and unfollow users.
  - API endpoint retrieves followers and following lists.

- **Geolocation**
  - Find and connect with nearby users.
  - Integration with Leaflet and PostGIS for geospatial queries.

## Tech Stack

### Frontend

<div>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white" alt="React Badge">
  <br>
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white" alt="Next.js Badge">
  <br>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript Badge">
  <br>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind CSS Badge">
</div>

### Backend

<div>
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js Badge">
  <br>
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white" alt="Express.js Badge">
  <br>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL Badge">
  <br>
  <img src="https://img.shields.io/badge/JWT-000000?style=flat&logo=json-web-tokens&logoColor=white" alt="JWT Badge">
  <br>
  <img src="https://img.shields.io/badge/bcrypt-000000?style=flat&logo=python&logoColor=white" alt="Bcrypt Badge">
</div>

### Database

<div>
  <img src="https://img.shields.io/badge/DrawSQL-000000?style=flat&logo=drawio&logoColor=white" alt="DrawSQL Badge">
  <br>
  <img src="https://img.shields.io/badge/PostGIS-003D34?style=flat&logo=postgis&logoColor=white" alt="PostGIS Badge">
</div>

### Design

<div>
  <img src="https://img.shields.io/badge/Figma-F24E1E?style=flat&logo=figma&logoColor=white" alt="Figma Badge">
  <br>
  Responsive design with light and dark themes
</div>

### Image Uploads

<div>
  <img src="https://img.shields.io/badge/Cloudinary-FFFFFF?style=flat&logo=cloudinary&logoColor=white" alt="Cloudinary Badge">
</div>

### Testing

<div>
  <img src="https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white" alt="Jest Badge">
  <br>
  <img src="https://img.shields.io/badge/Playwright-000000?style=flat&logo=playwright&logoColor=white" alt="Playwright Badge">
</div>

### Deployment

<div>
  <img src="https://img.shields.io/badge/Fly.io-000000?style=flat&logo=fly&logoColor=white" alt="Fly.io Badge">
  <br>
  Continuous integration through GitHub Actions
</div>

## Live Preview

Check out the live app here: [Townwall App](https://townwall.fly.dev)

## Copyright

© 2024 Alex Arroyo
