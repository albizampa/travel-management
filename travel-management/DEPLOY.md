# Travel Management System Deployment Guide

This guide explains how to deploy the Travel Management System using Vercel (frontend) and Supabase (backend).

## Prerequisites

- GitHub account
- Vercel account (signup at [vercel.com](https://vercel.com))
- Supabase account (signup at [supabase.com](https://supabase.com))

## Step 1: Set up Supabase

1. Log in to your Supabase account
2. Create a new project:
   - Name: `travel-management` (or your preferred name)
   - Set a strong database password
   - Choose a region closest to your users

3. Once the project is created, go to the SQL Editor

4. Run the SQL script in `setup-supabase.sql` to create all required tables and setup access policies

5. Save the following credentials from your Supabase dashboard:
   - Project URL (Settings > API > Project URL)
   - Anon Key (Settings > API > Project API keys > anon public)

## Step 2: Update Environment Variables

1. Edit the `.env` file in the server directory:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Ensure the frontend has a `.env` file with:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Step 3: Deploy Frontend to Vercel

1. Push your project to a GitHub repository

2. Log in to your Vercel account

3. Click "Add New" > "Project"

4. Import your GitHub repository

5. Configure the project:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Root Directory: `client` (important!)

6. Add environment variables:
   - `REACT_APP_SUPABASE_URL`: Your Supabase project URL
   - `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anon key

7. Click "Deploy"

## Step 4: Link Backend to Supabase

1. Update authentication to use Supabase Auth instead of JWT:
   - Modify frontend components to use Supabase authentication
   - Update API requests to include Supabase authentication tokens

2. For API features:
   - You can use Supabase Functions for serverless backend functions
   - Use Supabase's REST API for database operations
   - Use Supabase Storage for file uploads

## Step 5: Test the Deployed Application

1. Visit your Vercel deployment URL
2. Test user registration and login using Supabase Auth
3. Verify all functionality is working correctly
4. Test on different devices to verify responsive design

## Troubleshooting

- **Frontend not connecting to Supabase**: Check if environment variables are properly set in Vercel
- **Authentication issues**: Verify Supabase Auth configuration and RLS policies
- **Database errors**: Check Supabase logs and database schema

## Additional Information

### Supabase Auth Configuration

For a complete authentication setup, configure additional settings in Supabase:

1. Go to Authentication > Settings
2. Configure redirect URLs for your Vercel domain
3. Set up email templates for user confirmation and password reset

### Database Backups

Supabase provides automatic backups. Additionally:

1. Go to Database > Backups
2. Configure backup schedule and retention period

### Monitoring

1. Monitor application performance using Vercel Analytics
2. Use Supabase Dashboard to monitor database usage and performance 