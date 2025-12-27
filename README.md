# Townspark - Local Issue Reporting Platform

## What is Townspark?

Townspark is a web-based platform designed to help community members report and track local issues in their neighborhood. Think of it as a digital complaint box for your community where you can report problems like:

- Potholes on roads
- Graffiti on walls
- Broken streetlights
- Damaged sidewalks
- Any other community problems

The main goal is to create a bridge between residents and local authorities, making it easier for problems to be noticed, reported, and eventually fixed.

## Key Features

- **Easy Issue Reporting**: Simple forms to report problems in your community
- **Photo Upload**: Take a picture of the problem and attach it to your report for better documentation
- **Community Discussion**: Comment on issues and discuss potential solutions with other residents
- **Mobile Responsive**: Works perfectly on phones, tablets, and computers - report issues from anywhere
- **Issue Tracking**: Follow the progress of reported issues from submission to resolution

## User Types and Permissions

Townspark has two types of users, each with different capabilities:

### 1. **Normal Users (Regular Community Members)**

These are everyday residents who use the platform. They can:

- **Report Issues**: Create new reports about problems they see in their community
- **View Issues**: See all issues reported by everyone in the community
- **Comment**: Share their thoughts or additional information about any issue
- **Like Issues**: Show support for issues that need attention
- **Update Their Own Issues**: Edit or update the status of issues they personally reported
- **Delete Their Own Issues**: Remove issues they created if needed

### 2. **Admin Users (Community Managers)**

These are trusted individuals who help manage the platform. They have all the powers of normal users, plus:

- **Manage All Issues**: Can edit or update any issue, not just their own
- **Assign to Authorities**: Forward issues to the relevant local government departments
- **Delete Any Issue**: Can remove inappropriate or duplicate reports
- **Monitor Platform**: Keep an eye on the overall health of the community reporting system

### Important Permission Rules

- **Deleting Issues**: Only the person who reported an issue OR an admin can delete it
- **Editing Issues**: Only the person who reported an issue OR an admin can edit its details
- **Commenting**: Anyone can comment on any issue

## 🔄 How Does the Platform Work? (Step-by-Step Workflow)

Let's walk through a typical scenario of how an issue gets reported and tracked:

### Step 1: Spotting the Problem

A resident notices a problem in their neighborhood (for example, a large pothole on Main Street).

### Step 2: Logging In

The resident opens the Townspark website and logs into their account.

### Step 3: Reporting the Issue

The resident fills out a simple form with:

- A description of the problem ("Large pothole on Main Street near the library")
- The location (address or area)
- A photo of the pothole (optional but helpful)
- Category (road damage, public safety, etc.)

### Step 4: Issue Becomes Public

Once submitted, the issue appears on the platform where other community members can see it, comment on it, or "like" it to show it affects them too.

### Step 5: Admin Review

An admin user logs in, sees the new issue, reviews the details, and decides which local authority should handle it (in this case, the Public Works Department).

### Step 6: Communication with Authorities

The admin contacts the relevant authority outside the platform (via phone, email, etc.) and forwards the issue to them. This communication happens offline.

### Step 7: Status Updates

As the admin receives updates from the authority, they log back into Townspark and update the issue status:

- "Pending" → The issue is waiting to be reviewed
- "In Progress" → Someone is working on fixing it
- "Resolved" → The problem has been fixed

### Step 8: Community Notification

Users who reported or are following the issue can see these status updates and know the progress being made.

## Important Understanding: What This Platform IS and ISN'T

- This is just a issue REPORTING app not a problem FIXING app.

so please understand the difference.

- the admin will only work as a middleman to push your issues to the concerned authorities. and also follow up with them to get updates.

**This Platform IS:**

- A reporting tool for documenting community issues
- A tracking system to monitor progress
- A communication channel between residents and admins

**This Platform IS NOT:**

- A direct line to government authorities (admins handle that communication separately)
- A tool for actually fixing problems (fixing happens in the real world, offline)
- A guarantee that issues will be solved immediately

**The Admin's Role:**
Think of admins as "middlemen" or coordinators. They:

- Receive issue reports from the platform
- Contact the appropriate authorities outside the platform
- Follow up with authorities if needed
- Update the platform with progress information

Once an admin hands off an issue to an authority, they don't directly solve it themselves - they just keep the platform updated with whatever information the authorities provide them.

## Technologies Used (What Powers This Platform)

If you're new to web development, here's a simple explanation of the technologies used:

### Frontend (What You See and Interact With)

- **Next.js**: A modern framework for building fast, user-friendly websites using React
- **HTML**: The building blocks of web pages (structure)
- **CSS & Tailwind**: Styling languages that make the website look beautiful
- **shadcn/ui**: Pre-built, beautiful UI components that speed up development

### Backend (The Behind-the-Scenes Server)

- **Django**: A powerful Python framework that handles data, user accounts, and business logic
- **Django REST Framework**: Makes it easy for the frontend to communicate with the backend through APIs (Application Programming Interfaces)

### Database (Where All Data is Stored)

- **SQLite**: A lightweight database used during development (like a practice environment)
- **PostgreSQL**: A robust, production-grade database used when the app goes live for real users

### Authentication (How Users Log In Securely)

- **JWT (JSON Web Tokens)**: A secure method for managing user sessions and keeping accounts safe

**Simple Analogy**: Think of the frontend as the storefront of a shop (what customers see), the backend as the storage room and office (where work happens), and the database as the filing cabinets (where information is kept).

## Running the Project Locally (For Developers)

This section explains how to set up and run the Townspark frontend on your own computer. This is useful if you want to:

- Test the application
- Contribute to development
- Learn how it works

### ⚠️ Important Note

This repository contains **only the frontend** (the visual part users interact with). To have a fully working application, you also need the backend server running. The backend code is in a separate repository: [Townspark Backend Repository](https://github.com/shristi555/townspark_backend_new).

**Think of it this way**: The frontend is like a car's dashboard and steering wheel, while the backend is the engine. You need both to drive!

### Prerequisites (What You Need First)

Before you start, make sure you have these installed on your computer:

1. **Node.js**: A JavaScript runtime that lets you run JavaScript code on your computer (not just in browsers)
    - Download from: [nodejs.org](https://nodejs.org/)
    - Recommended: Download the LTS (Long Term Support) version
    - To check if it's installed, open your terminal and type: `node --version`

2. **pnpm**: A fast, disk-efficient package manager (tool for installing code libraries)
    - We recommend pnpm over npm for better performance and smaller disk usage
    - Installation guide: [pnpm.io/installation](https://pnpm.io/installation)
    - Quick install: `npm install -g pnpm`
    - To verify: `pnpm --version`

**Note**: You can also use npm, yarn, bun, or deno instead of pnpm if you prefer, but you'll need to adjust the commands accordingly. This guide uses pnpm commands.

### 🚀 Step-by-Step Setup Instructions

#### Step 1: Clone the Repository

"Cloning" means downloading a copy of the code to your computer.

Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and run:

```bash
git clone https://github.com/shristi555/townspark_frontend_new.git
cd townspark_frontend_new
```

**What this does**:

- First command: Downloads the project code to a new folder
- Second command: Moves you into that folder

#### Step 2: Install Dependencies

"Dependencies" are external code libraries that this project needs to work (like React, Next.js, etc.).

Run this command:

```bash
pnpm install
```

**What this does**: Downloads and installs all the required libraries listed in the `package.json` file. This might take a few minutes.

**Troubleshooting**: If you get an error, make sure pnpm is installed correctly by running `pnpm --version`.

#### Step 3: Configure Environment Variables

"Environment variables" are configuration settings that tell the app where to find the backend server.

The repository includes a `.env.local` file with default settings. The default backend URL is set to `http://localhost:8000/`.

**If your backend is running on a different port or URL**:

1. Open the `.env.local` file in a text editor
2. Change the `NEXT_PUBLIC_API_URL` value to match your backend URL
3. Save the file

**Example**:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/
```

#### Step 4: Start the Development Server

Now you're ready to run the application!

Run this command:

```bash
pnpm dev
```

**What this does**: Starts a local web server that runs your application.

You should see output similar to this:

```bash
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.5s
```

#### Step 5: Open in Browser

1. Hold **Ctrl** (Windows/Linux) or **Cmd** (Mac) and click on the `http://localhost:3000` link in your terminal
2. OR manually open your web browser and type: `http://localhost:3000`

🎉 **Congratulations!** You should now see the Townspark application running in your browser!

### What to Expect

- The app will automatically reload when you make changes to the code
- If you see errors about API connections, make sure your backend server is running
- The terminal where you ran `pnpm dev` will show logs and any error messages

## Project Structure (How the Code is Organized)

This project uses **Next.js with App Router**, which is a modern way to structure web applications. All code is written in **JavaScript** and **JSX** (not TypeScript).

Here's what each folder contains:

### Main Folders

```
townspark_frontend_new/
├── app/                    # Pages and routes of the application
├── components/             # Reusable UI components (buttons, forms, cards, etc.)
├── services/               # Code for communicating with the backend API
├── lib/                    # Utility functions and helper code
├── public/                 # Static files (images, icons, logos)
└── [config files]          # Configuration files for the project
```

### Detailed Breakdown

#### **`app/` folder** - Pages and Layouts

This is where all your website pages live. Next.js uses a file-based routing system, which means:

- Each folder represents a URL path
- Each `page.jsx` file becomes a web page

**Example**:

- `app/page.jsx` → Homepage (http://localhost:3000/)
- `app/login/page.jsx` → Login page (http://localhost:3000/login)
- `app/me/page.jsx` → User profile page (http://localhost:3000/me)

The `layout.jsx` file defines the common structure (like headers/footers) shared across multiple pages.

#### **`components/` folder** - Reusable UI Building Blocks

Contains pieces of UI that can be used in multiple places. Think of these as LEGO blocks for your interface.

**Examples**:

- `login-form.jsx` - The login form component
- `ui/button.jsx` - Button components with different styles
- `ui/card.jsx` - Card containers for displaying content
- `ui/input.jsx` - Input fields for forms

These components are primarily from **shadcn/ui**, a collection of pre-built, customizable components.

#### **`services/` folder** - Backend Communication

Contains code that talks to the backend server (makes API calls). This keeps your pages clean and organized.

**Architecture Principle**: We follow a **separation of concerns** pattern:

- ❌ **DON'T** call the backend directly from pages or components
- ✅ **DO** create service functions that pages/components can use

**Current Services**:

- `auth_service.js` - Handles login, registration, logout, token management
- `api.js` - Base API configuration and common functions
- (More services will be added as features grow)

**Example**: Instead of writing API code in a login page, the page calls `authService.login()`, keeping code organized and reusable.

#### **`lib/` folder** - Utility Functions

Contains helper functions created by shadcn and other utilities. For example, `utils.js` has functions for combining CSS class names intelligently.

#### **`public/` folder** - Static Assets

Store images, icons, fonts, and other files that don't change. These files can be accessed directly by their path.

**Example**: A file at `public/logo.png` can be used in code as `/logo.png`.

### Understanding the Service Architecture

We use a **Service Layer Pattern** to organize how the frontend talks to the backend:

**Benefits**:

1. **Reusability**: Write API call code once, use it anywhere
2. **Maintainability**: If the backend API changes, update only the service file
3. **Testability**: Easy to test API logic separately
4. **Clarity**: Pages focus on UI, services focus on data

**Example Structure**:

```
Page Component (app/login/page.jsx)
      ↓ calls
Service Function (services/auth_service.js → login())
      ↓ makes request to
Backend API (http://localhost:8000/api/auth/login/)
```

## Understanding the Authentication System

Authentication (often shortened to "auth") is the process of verifying who a user is. When you log into a website, that's authentication in action!

### How Authentication Works in Townspark

This project uses **JWT (JSON Web Tokens)** for authentication, which is a popular, secure method for managing user sessions.

#### What is JWT?

Think of a JWT as a special digital key card:

- When you log in successfully, the server gives you a "key card" (JWT token)
- Every time you want to do something (view issues, post comments), you show this "key card"
- The server checks if your "key card" is valid and lets you proceed

#### Our Cookie-Based Approach (Simplified & Secure)

We use a **cookie-based JWT system**, which is different from the traditional approach. Here's why it's better:

**Traditional Method** (Header-based):

```
Your Browser → Sends token in special header → Backend Server
```

- You have to manually attach the token to every request
- If you forget to attach it to one request, that request fails
- Tokens stored in browser JavaScript can be stolen by malicious code (XSS attacks)

**Our Method** (Cookie-based):

```
Your Browser → Automatically sends secure cookie → Backend Server
```

- Tokens are stored in **httpOnly cookies** (can't be accessed by JavaScript)
- Browser automatically sends cookies with every request
- Much more secure against XSS (Cross-Site Scripting) attacks
- No need to manually add tokens to requests - it happens automatically!

#### Two Types of Tokens

Our system uses two tokens (think of them as two different types of key cards):

1. **Access Token** (Short-lived - expires quickly)
    - Used for everyday actions (viewing issues, posting comments)
    - Expires after a short time (e.g., 15 minutes)
    - If someone steals it, it becomes useless quickly

2. **Refresh Token** (Long-lived - expires slowly)
    - Used to get a new access token when the old one expires
    - Expires after a longer time (e.g., 7 days)
    - Means you don't have to log in every 15 minutes!

**How They Work Together**:

```
1. You log in → Get both tokens
2. Browse the site → Use access token
3. Access token expires → System automatically uses refresh token to get a new access token
4. Continue browsing → No interruption!
5. Refresh token expires → You have to log in again
```

#### CSRF Protection

CSRF (Cross-Site Request Forgery) protection prevents hackers from tricking your browser into making unwanted requests to our server.

**Simple Explanation**:
Imagine someone sends you a link, and clicking it secretly tries to delete your Townspark account. CSRF protection stops this by requiring a special verification code that only legitimate requests from our website have.

### Why This Approach is Great

✅ **More Secure**: Tokens can't be stolen by malicious JavaScript  
✅ **Simpler Code**: No need to manually attach tokens everywhere  
✅ **Better UX**: Fewer bugs related to missing authentication headers  
✅ **Protection**: Built-in CSRF protection prevents certain attacks  
✅ **Automatic**: Browser handles cookie management automatically

## Understanding Backend Response Format (SRE Architecture)

When the frontend asks the backend for data (like "get me all issues" or "create a new user"), the backend sends back a response. To keep things organized and predictable, we use a consistent format called **SRE Architecture**.

### What is SRE Architecture?

SRE stands for **Success-Response-Error**. Every response from the backend follows this same structure, making it easy to handle in the frontend code.

### The Response Format

Every response is a JSON object (a structured data format) with three fields:

```json
{
  "success": true or false,
  "response": data or null,
  "error": null or error information
}
```

Let's break down each field:

#### 1. **`success`** (boolean - true or false)

This tells you immediately if the request worked or not.

- `true` = Everything went well! ✅
- `false` = Something went wrong ❌

**Example Usage**: Your code can check this first to decide what to do next.

#### 2. **`response`** (object, array, or null)

Contains the actual data you requested.

- If `success` is `true`, this usually contains your data
- If `success` is `false`, this is usually `null` (empty)
- Can be an object `{}`, an array `[]`, or `null`

**Examples**:

```json
// List of issues
"response": [
  {"id": 1, "title": "Pothole on Main St", ...},
  {"id": 2, "title": "Broken streetlight", ...}
]

// Single user object
"response": {
  "id": 123,
  "username": "john_doe",
  "email": "john@example.com"
}

// Empty/null response
"response": null
```

#### 3. **`error`** (null, string, or object)

Contains error information if something went wrong.

- If `success` is `true`, this is usually `null`
- If `success` is `false`, this contains error details
- Can be a simple error message (string) or detailed error object

**Examples**:

```json
// Simple error message
"error": "Invalid username or password"

// Detailed error object
"error": {
  "username": ["This field is required"],
  "email": ["Enter a valid email address"]
}

// No error
"error": null
```

### Real-World Examples

#### ✅ Successful Login

```json
{
	"success": true,
	"response": {
		"user": {
			"id": 42,
			"username": "jane_smith",
			"email": "jane@example.com",
			"is_admin": false
		}
	},
	"error": null
}
```

**How to handle in code**:

```javascript
if (data.success) {
	// Login succeeded! Use the data
	const user = data.response.user;
	console.log(`Welcome, ${user.username}!`);
}
```

#### ❌ Failed Login

```json
{
	"success": false,
	"response": null,
	"error": "Invalid credentials. Please check your username and password."
}
```

**How to handle in code**:

```javascript
if (!data.success) {
	// Login failed - show error to user
	alert(data.error);
}
```

#### ⚠️ Partial Success (Rare but possible)

Sometimes you might get both `response` and `error` if there are warnings:

```json
{
	"success": true,
	"response": {
		"issues_created": 5
	},
	"error": "Warning: 2 duplicate issues were skipped"
}
```

### Why This Format is Helpful

1. **Consistency**: Every API call follows the same pattern
2. **Easy to Handle**: Your code can always check `success` first
3. **Clear Errors**: When things fail, you know exactly what went wrong
4. **Type Safety**: You always know what structure to expect

### Special Case: 404 Errors

**Note**: If you request a URL that doesn't exist (404 Not Found), Django might return an HTML error page instead of JSON. This is a special case to be aware of.

**How to avoid**:

- Make sure all API endpoints are correct
- Add 404 error handling in your frontend code if needed

### How to Use This in Code

Here's a typical pattern for handling SRE responses:

```javascript
// Making an API call
const data = await authService.login(username, password);

// Check if it succeeded
if (data.success) {
	// Success! Use the response data
	const userData = data.response;
	// Do something with userData...
} else {
	// Failed! Show the error
	const errorMessage = data.error;
	// Display error to user...
}
```

This consistent format makes error handling straightforward and reduces bugs!

## Contributing to the Project

If you want to improve Townspark or add new features, that's great! Here are the guidelines to follow so that everyone's code stays consistent and organized.

### General Contribution Guidelines

#### 1. **Use Meaningful Commit Messages**

When you save your changes to git (called "committing"), write clear messages that explain what you changed.

**Good Examples**:

- ✅ `Add photo upload functionality to issue form`
- ✅ `Fix login button not working on mobile devices`
- ✅ `Update README with better installation instructions`

**Bad Examples**:

- ❌ `Update` (too vague)
- ❌ `Fixed stuff` (not specific)
- ❌ `asdfg` (meaningless)

#### 2. **Follow Existing Code Style**

Look at how existing code is written and match that style. This includes:

- Indentation (spaces vs tabs)
- Naming conventions (how variables and functions are named)
- File organization
- Comment style

**Consistency makes code easier to read and maintain!**

#### 3. **JavaScript and JSX Only - No TypeScript**

This project is written in JavaScript. Please don't mix in TypeScript code.

**Why not to mix typescript?**

- Keeps the codebase consistent
- Avoids tooling complications
- Makes it easier for beginners to contribute

#### 4. **Use pnpm as Package Manager (Recommended)**

When installing new packages, use:

```bash
pnpm add package-name
```

**Why pnpm?**

- Faster installation
- Uses less disk space
- Better handling of dependencies

**Alternative**: You can use npm, yarn, or bun if you prefer, but be aware that different package managers can sometimes cause issues. Which means you may need to delete `node_modules` and lock files and reinstall dependencies if you switch.

#### 5. **Follow SRE Architecture for Backend Communication**

When writing code that talks to the backend:

- Always expect responses in the SRE format (`success`, `response`, `error`)
- Check the `success` field first before using `response` data
- Handle errors gracefully by checking the `error` field

**Example**:

```javascript
const data = await apiCall();
if (data.success) {
	// Use data.response
} else {
	// Show data.error to user
}
```

#### 6. **Create Services for API Calls**

**Never call the backend API directly from components or pages!**

**Wrong Way** ❌:

```javascript
// Inside a component file
const response = await fetch("http://localhost:8000/api/issues");
```

**Right Way** ✅:

```javascript
// In services/issue_service.js
export async function getIssues() {
	const response = await fetch("http://localhost:8000/api/issues");
	return response.json();
}

// In your component
import { getIssues } from "@/services/issue_service";
const issues = await getIssues();
```

**Why?**

- Keeps code organized and reusable
- Makes testing easier
- Makes API changes easier to manage
- Follows best practices

#### 7. **Test Your Changes Thoroughly**

Before submitting your code:

1. **Test all functionality** - Make sure your changes work
2. **Test edge cases** - What happens with invalid input?
3. **Test on different browsers** - Chrome, Firefox, Safari
4. **Test responsive design** - Check on phone-sized screens
5. **Check for console errors** - Open browser developer tools

**How to test**:

```bash
# Run the development server
pnpm dev

# Open http://localhost:3000 in your browser
# Try using the features you changed
# Look for errors in the browser console (F12)
```

### Contribution Workflow

Here's a step-by-step guide to contributing:

1. **Fork the repository** - Create your own copy on GitHub
2. **Clone your fork** - Download it to your computer
3. **Create a branch** - For your specific feature/fix
    ```bash
    git checkout -b feature/add-comment-editing
    ```
4. **Make your changes** - Edit the code
5. **Test thoroughly** - Make sure everything works
6. **Commit your changes** - Save with a good message
    ```bash
    git add .
    git commit -m "Add ability to edit comments"
    ```
7. **Push to GitHub** - Upload your changes
    ```bash
    git push origin feature/add-comment-editing
    ```
8. **Create a Pull Request** - Ask for your changes to be reviewed and merged

### Code Organization Rules

- **Components** should be in the `components/` folder
- **Pages** should be in the `app/` folder
- **Services** should be in the `services/` folder
- **Utilities** should be in the `lib/` folder
- **Static files** should be in the `public/` folder

### Questions or Issues?

If you:

- Don't understand something in the code
- Found a bug
- Have questions about contributing
- Need help with setup

Feel free to:

- Open an issue on GitHub
- Ask in the project discussions
- Contact the maintainers

**Remember**: There are no stupid questions! Everyone starts somewhere, and we're here to help.

## Troubleshooting Common Issues

Having trouble getting the project to run? Here are solutions to common problems:

### Problem 1: "pnpm: command not found" or "pnpm is not recognized"

**Symptoms**:

```bash
pnpm: command not found
```

or

```bash
'pnpm' is not recognized as an internal or external command
```

**Solution**:
You haven't installed pnpm yet. Install it with one of these methods:

**Using npm** (easiest):

```bash
npm install -g pnpm
```

**Using standalone script** (Windows):

```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

**Verify installation**:

```bash
pnpm --version
```

If you still get errors, close and reopen your terminal, then try again.

### Problem 2: Dependencies fail to install

**Symptoms**:

```bash
ERR_PNPM_UNEXPECTED_STORE
```

or errors during `pnpm install`

**Solution 1** - Clear pnpm cache:

```bash
pnpm store prune
pnpm install
```

**Solution 2** - Delete and reinstall:

```bash
# Delete node_modules and lock file
rm -rf node_modules pnpm-lock.yaml

# Reinstall from scratch
pnpm install
```

**Solution 3** - Try using npm instead:

```bash
npm install
npm run dev
```

### Problem 3: "Cannot connect to backend" or API errors

**Symptoms**:

- Login doesn't work
- Issues don't load
- Console shows errors like `Failed to fetch` or `Network error`

**Causes & Solutions**:

**Cause 1**: Backend server is not running

- Make sure you've set up and started the backend server
- Backend repo: [Townspark Backend](https://github.com/shristi555/townspark_backend_new)
- Backend should be running on `http://localhost:8000`

**Cause 2**: Wrong backend URL in environment file

- Open `.env.local`
- Check that `NEXT_PUBLIC_API_URL=http://localhost:8000/`
- Make sure the URL matches where your backend is actually running
- Restart the dev server after changing this file

**Cause 3**: CORS (Cross-Origin Resource Sharing) issues

- This is a backend configuration issue
- Check your backend Django settings for CORS configuration
- Make sure `http://localhost:3000` is in the allowed origins

### Problem 4: Port 3000 is already in use

**Symptoms**:

```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution 1** - Use a different port:

```bash
PORT=3001 pnpm dev
```

Then open `http://localhost:3001`

**Solution 2** - Stop the process using port 3000:

**Windows**:

```powershell

# Find the process ID (PID) and kill it
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

```

**Mac/Linux**:

```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
```

### Problem 5: Changes not showing up in browser

**Symptoms**:
You edited code but the browser still shows the old version

**Solutions**:

**Solution 1** - Hard refresh the browser:

- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

**Solution 2** - Clear browser cache:

- Open developer tools (F12)
- Right-click the refresh button
- Select "Empty Cache and Hard Reload"

**Solution 3** - Restart the development server:

```bash
# Stop the server (Ctrl+C in terminal)
# Then start again
pnpm dev
```

### Problem 6: Module not found errors

**Symptoms**:

```bash
Module not found: Can't resolve '@/components/...'
```

**Solution 1** - Reinstall dependencies:

```bash
rm -rf node_modules
pnpm install
```

**Solution 2** - Check your imports:

- Make sure file paths are correct
- Check capitalization (file names are case-sensitive)
- Use `@/` for absolute imports from the project root

### Problem 7: Styling issues or components look broken

**Symptoms**:

- Components don't have proper styling
- Layout looks wrong
- Tailwind classes not working

**Solutions**:

**Solution 1** - Make sure PostCSS and Tailwind are installed:

```bash
pnpm install -D tailwindcss postcss autoprefixer
```

**Solution 2** - Restart the dev server:

```bash
# Sometimes Tailwind needs a restart to pick up new classes
# Press Ctrl+C to stop, then:
pnpm dev
```

**Solution 3** - Check the globals.css is imported:

- Open `app/layout.jsx`
- Make sure it has: `import './globals.css'`

### Problem 8: Permission errors

**Symptoms**:

```bash
EACCES: permission denied
```

**Solution** - Run with proper permissions:

**Windows**: Run terminal as Administrator

**Mac/Linux**: Add `sudo` (use cautiously):

```bash
sudo pnpm install
```

**Better solution**: Fix npm permissions:

```bash
# Create a directory for global packages
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Add to PATH (add this to your .bashrc or .zshrc)
export PATH=~/.npm-global/bin:$PATH
```

### Still Having Issues?

If none of these solutions work:

1. **Check the browser console** (F12) for error messages
2. **Check the terminal** where you ran `pnpm dev` for error logs
3. **Search for the specific error message** on Google or Stack Overflow
4. **Open an issue** on the GitHub repository with:
    - Your operating system
    - Node.js version (`node --version`)
    - pnpm version (`pnpm --version`)
    - Full error message
    - Steps you've already tried

### Useful Commands for Debugging

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check pnpm version
pnpm --version

# Clear all caches
pnpm store prune
rm -rf node_modules
rm pnpm-lock.yaml

# Fresh install
pnpm install

# Run with verbose logging
pnpm dev --verbose
```

## Learning Resources

If you're new to web development or want to learn more about the technologies used in this project, here are some excellent resources:

### For Complete Beginners

- **[MDN Web Docs](https://developer.mozilla.org/)** - Comprehensive guides for HTML, CSS, and JavaScript
- **[freeCodeCamp](https://www.freecodecamp.org/)** - Free interactive coding lessons
- **[JavaScript.info](https://javascript.info/)** - Modern JavaScript tutorial from basics to advanced

### Next.js & React

- **[Next.js Official Tutorial](https://nextjs.org/learn)** - Step-by-step guide to learning Next.js
- **[React Documentation](https://react.dev/)** - Official React docs with interactive examples
- **[Next.js App Router Course](https://nextjs.org/learn/dashboard-app)** - Learn the App Router pattern used in this project

### Styling & UI

- **[Tailwind CSS Docs](https://tailwindcss.com/docs)** - Official documentation for Tailwind CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library used in this project

### Git & Version Control

- **[Git Handbook](https://guides.github.com/introduction/git-handbook/)** - Understanding Git basics
- **[GitHub Learning Lab](https://lab.github.com/)** - Interactive Git tutorials

### API & Backend Communication

- **[What is an API?](https://www.freecodecamp.org/news/what-is-an-api-in-english-please-b880a3214a82/)** - Simple explanation of APIs
- **[HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)** - Understanding response codes (200, 404, 500, etc.)

## License

This is a **private repository**. All rights reserved.

Unauthorized copying, modification, distribution, or use of this software is strictly prohibited without explicit permission from the repository owner.

---

## Contact & Support

If you have questions, suggestions, or need help:

- **Open an Issue**: [GitHub Issues](https://github.com/shristi555/townspark_frontend_new/issues)
- **Read the Docs**: Check this README thoroughly first
- **Backend Repository**: [Townspark Backend](https://github.com/shristi555/townspark_backend_new)

---

## Acknowledgments

- **shadcn/ui** - For beautiful, accessible UI components
- **Next.js Team** - For an amazing React framework
- **Tailwind CSS** - For utility-first CSS framework
- All contributors who help improve this project

---

**Made with ❤️ for building better communities**

<!-- _Last Updated: December 2025_ -->
