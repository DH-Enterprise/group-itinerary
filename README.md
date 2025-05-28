# Group Itinerary Project

## Docker Setup

This project uses Docker for development with Nginx, PHP 8.3, PHP-FPM, and Node.js.

### Prerequisites

- Docker and Docker Compose installed on your system
- Ports 80 and 5173 available on your machine

### Starting the Development Environment

1. **Add the domain to your hosts file**
   Add the following line to your `/etc/hosts` file:
   ```
   127.0.0.1 group-itinerary.test
   ```

2. **Build and start the containers**
   This will automatically install all PHP and Node.js dependencies during the build process.
   ```bash
   docker-compose up -d --build
   ```
   
   The application will be available once the build process completes.

### Accessing the Application

- Web application: http://group-itinerary.test
- Vite dev server: http://localhost:5173 (for hot module replacement)

### Useful Commands

- Stop all containers:
  ```bash
  docker-compose down
  ```

- View logs:
  ```bash
  docker-compose logs -f
  ```

- Run commands in the PHP container:
  ```bash
  docker-compose exec php [command]
  ```

- Run commands in the Node container:
  ```bash
  docker-compose exec node [command]
  ```

## Project Info

**URL**: https://lovable.dev/projects/fd1a55d1-2201-4cea-853a-b36123bdb382

## Development

### How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/fd1a55d1-2201-4cea-853a-b36123bdb382) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/fd1a55d1-2201-4cea-853a-b36123bdb382) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
