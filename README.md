🌌 Aura Assistant
Aura Assistant is a fast, elegant AI chat interface designed to feel intuitive, expressive, and frictionless. Built as a full-stack showcase, it merges responsive UI, smart session logic, and real-time AI interaction into a single-page experience that feels alive.

This project demonstrates my proficiency in full-stack development, including API integration, state management, secure Markdown rendering, and responsive, session-aware UI design.

🚀 Live Demo
Experience Aura Assistant in action: https://aura-assistant-six.vercel.app/

🖼️ Screenshots
Light mode Dark mode Add your screenshots or a GIF here to visually showcase the app’s UX and transitions.

✨ Features
🧠 Smart Session Management
Dynamic Session Loading: Resume any past conversation with a single click.

Auto-Generated Titles: Gemini API generates concise, relevant titles for each chat.

Searchable History: Quickly locate conversations by keyword or phrase.

Prompt Filtering: Guide the AI’s response by selecting topic, tone, and focus.

🎨 Premium UI/UX
Responsive Layout: Seamless experience across desktop and mobile.

Light/Dark Mode: Toggle themes with smooth, expressive transitions.

Real-Time Feedback: “Thinking…” state while generating responses.

Abort Controller: Instantly cancel a response mid-generation.

🔐 Secure & Stable
Markdown Rendering: Uses marked.js to convert AI output to HTML.

Sanitization: DOMPurify ensures safe rendering, preventing XSS attacks.

Error Handling: Backend includes robust try-catch logic for graceful failure recovery.

🧰 Tech Stack
Frontend
HTML5 & CSS3: For the application structure and styling, including a modern, clean design and responsive layouts.

JavaScript (ES6+): Manages all client-side logic, including DOM manipulation, API calls, and local storage management. The code is well-structured into logical sections for navigation, history, chat rendering, and generation.

marked.js + DOMPurify: These libraries are used together to securely handle the AI's output. marked.js converts the Markdown text into HTML, while DOMPurify sanitizes the resulting HTML, removing any potentially malicious code or scripts and preventing cross-site scripting (XSS) attacks.

Boxicons: Lightweight icon library for UI clarity.

Backend
Serverless Node.js API: Handles prompt requests in a scalable environment.

Google Generative AI SDK: The core library for interacting with the Gemini API to process prompts and generate responses.

📦 Deployment Guide (Vercel)
Aura Assistant is optimized for seamless deployment on Vercel.

✅ Prerequisites
You'll need a Vercel account and a Google Generative AI API key.

🛠️ Setup Steps
Clone the Repository

bash
git clone [your repo URL]
Create a New Vercel Project

Go to your Vercel Dashboard

Click “Add New” → “Project”

Import your Git repository from GitHub, GitLab, or Bitbucket.

Configure Environment Variables

In your Vercel project settings, go to the "Environment Variables" section.

Add your Gemini API key with the following key and value:

Key: GEMINI_API_KEY

Value: Your actual Google Gemini API key.

Key: GEMINI_API_URL

Value: Your actual Google Gemini API url.

Deploy

Vercel will auto-detect the Node.js setup and deploy your app

Once the deployment is complete, you'll receive a unique URL to access your live application.

💡 Why This Matters
Aura Assistant isn’t just a demo—it’s a design-led experiment in how AI interfaces should feel: responsive, expressive, and emotionally aware. Every detail, from session titles to theme transitions, is crafted to reduce friction and enhance clarity.

Whether you're exploring AI UX, refining full-stack workflows, or just seeking a clean, intuitive chat experience—Aura Assistant is built to inspire.
