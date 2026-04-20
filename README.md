# Food Wastage Detection in Restaurants

<<<<<<< HEAD
This is a Next.js application built in Firebase Studio that uses AI to help restaurants track and reduce food waste.
=======
This is a Next.js application that uses AI to help restaurants track and reduce food waste.
>>>>>>> 8bf5851f73e9948b564474fac3c9e484efe6c354

## How to Build and Run the Web Application

To build and run the production version of this web application on your computer, follow these three steps in your terminal:

1.  **Install Dependencies** (only needs to be done once):
    ```bash
    npm install
    ```

2.  **Build the Application**: This compiles and optimizes the code for production.
    ```bash
    npm run build
    ```

3.  **Start the Server**: This runs the built application.
    ```bash
    npm run start
    ```
    After this, open your browser and navigate to **http://localhost:3000** to see your application live.

---

## Running the Project Locally with VS Code (for Development)

To run this application on your local machine using Visual Studio Code for development purposes, follow these steps:

### Prerequisites

1.  **Node.js**: Make sure you have Node.js (version 18 or later) installed. You can download it from [nodejs.org](https://nodejs.org/).
2.  **VS Code**: Download and install [Visual Studio Code](https://code.visualstudio.com/).
3.  **Git**: Make sure you have Git installed. You can download it from [git-scm.com](https://git-scm.com/).

### 1. Set Up the Project

First, you need to recreate the project structure on your computer.

1.  **Create a Project Folder**: On your computer, create a new folder for your project (e.g., `food-waste-app`).
2.  **Open in VS Code**: Open this folder in VS Code.
3.  **Recreate Files**: Manually create the files and directories from the project. You can ask me to provide the code for any file you need. The most important files to start with are:
    *   `package.json`
    *   `next.config.ts`
    *   `tailwind.config.ts`
    *   `tsconfig.json`
    *   Then, create the `src` directory and populate it with the application source code.

### 2. Install Dependencies

Once you have the `package.json` file in your project folder, open the terminal in VS Code (`View` > `Terminal`) and run the following command to install all the necessary packages:

```bash
npm install
```

### 3. Set Up Environment Variables

The application uses the Gemini API for its AI features, which requires an API key.

1.  **Get a Gemini API Key**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to create and get your API key.
2.  **Create a `.env.local` file**: In the root of your project, create a new file named `.env.local`.
3.  **Add the API Key**: Add your Gemini API key to the `.env.local` file like this:

    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

    Replace `YOUR_API_KEY_HERE` with the actual key you obtained from Google AI Studio.

### 4. Run the Application in Development Mode

Now you're ready to start the development server. Run the following command in your VS Code terminal:

```bash
npm run dev
```

This will start the application, and you can view it by opening your web browser and navigating to **http://localhost:9002**.

---

## How to Share This Project on GitHub

1.  **Initialize a Git Repository**: Open a terminal in your project's root folder and run this command. This tells Git to start tracking your files.
    ```bash
    git init
    ```

2.  **Add and Commit Your Code**: These commands stage all your files and then save them as the first official version in your Git history.
    ```bash
    git add .
    git commit -m "Initial commit"
    ```

3.  **Create a New Repository on GitHub**: Go to [GitHub.com](https://github.com), log in, and click the "New" button to create a new repository. Give it a name (like `food-waste-app`) and keep it public. Do not initialize it with a README or .gitignore file, as we already have those.

4.  **Link and Push Your Code**: On the next page, GitHub will give you a URL for your new repository. Copy it and run the following commands in your terminal, replacing `<YOUR_GITHUB_REPO_URL>` with the URL you copied.

    ```bash
    git remote add origin <YOUR_GITHUB_REPO_URL>
    git branch -M main
    git push -u origin main
    ```

Now, your entire project is safely stored on GitHub!

If you need the code for any specific file, just ask, and I'll provide it!
