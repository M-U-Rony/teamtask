# TeamTask

TeamTask is a collaborative project and task management web application built with Next.js, TypeScript, and MongoDB. It helps small teams organize projects, assign work, invite members, and track task progress through a focused, minimal interface.

## Key Features

- JWT cookie-based authentication (`signup`, `login`, `logout`, `me`)
- Project lifecycle management (create, list, view, update, delete)
- Role-aware collaboration model:
  - Project owners can invite/remove members and manage project data
  - Members can view assigned tasks and update task status
- Task management per project:
  - Create tasks with assignees
  - Fetch all project tasks (owner) or assigned tasks only (member)
  - Update task status (`not-started`, `in-progress`, `done`)
- Invitation and notification workflow:
  - Send invitation by member email
  - Accept/reject invitation
  - Clear invitation history

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Database: MongoDB with Mongoose
- Validation: Zod
- Auth/Security: `jsonwebtoken`, `bcryptjs`, HTTP-only cookies
- UI: React 19, Tailwind CSS 4, React Icons, React Hot Toast

## Project Structure

```text
app/
  api/
    auth/
    projects/
    tasks/
    invitation/
    notifications/
  dashboard/
components/
lib/
models/
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
MONGODB_URL=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_secret
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Overview

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Projects

- `POST /api/projects` - Create project
- `GET /api/projects` - List current user's projects
- `GET /api/projects/:id` - Get project detail
- `PATCH /api/projects/:id/update` - Update project (owner)
- `DELETE /api/projects/:id/delete` - Delete project (owner)
- `GET /api/projects/:id/users` - Get project members (owner)
- `POST /api/projects/:id/invite` - Invite member by email (owner)
- `POST /api/projects/:id/removeMember` - Remove member (owner)

### Tasks

- `POST /api/projects/:id/createTask` - Create task in project (owner)
- `GET /api/projects/:id/allTask` - Get project tasks
- `PATCH /api/tasks/:id` - Update task status
- `DELETE /api/tasks/:id` - Delete task

### Invitations and Notifications

- `GET /api/notifications` - List invitations for current user
- `POST /api/invitation/accept`
- `POST /api/invitation/reject`
- `POST /api/invitation/clear`

## Current Scope Notes

- No automated test suite is configured yet.
- Authentication currently uses an access-token cookie only.
- API authorization is enforced per route using a shared auth middleware.

## License

This project is currently unlicensed. Add a `LICENSE` file if you plan to distribute it.
