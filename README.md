# Social Calendar

A modern web application for managing your social events and connecting with friends. Built with Remix, React, and Supabase.

## Features

- User authentication and profile management
- Create and manage personal events
- Discover and join public events
- Connect with friends and view their schedules
- Real-time updates for event changes

## Prerequisites

- Node.js (v20 or higher)
- Supabase account (for backend services)

## Setup

### 1. Clone the repository

```sh
git clone <repository-url>
cd Social-Calendar
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure Supabase

1. Create a new project in [Supabase](https://supabase.com)
2. Copy the SQL schema from `supabase-schema.sql` and run it in the Supabase SQL editor
3. Copy your Supabase URL and anon key from the project settings
4. Create a `.env` file in the root directory based on `.env.example`:

```
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

Run the dev server:

```sh
npm run dev
```

The application will be available at http://localhost:5173

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

## Project Structure

- `/app/routes` - Application routes and pages
- `/app/utils` - Utility functions including Supabase client
- `/app/context` - React context providers
- `/app/styles` - CSS and styling files

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling. See the [Vite docs on CSS](https://vitejs.dev/guide/features.html#css) for more information.
