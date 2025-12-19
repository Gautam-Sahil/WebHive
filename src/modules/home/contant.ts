export const PROJECT_TEMPLATES = [
  {
    emoji: "🚀",
    title: "SaaS Landing Page",
    prompt:
      "Build a complete, high-converting SaaS Landing Page. Start with 'use client'. \n" +
      "1. DESIGN: Use a deep 'slate-900' dark mode background with 'indigo-500' accent gradients. \n" +  "2.You are free to use creative mind to build good looking ui. \n" + "3. SECTIONS: \n" + "   - Navbar: Sticky, glassmorphism effect, with logo and 'Get Started' button. \n" + "   - Hero: Large centered H1 'Automate Your Future', subtext, and two buttons (Primary/Secondary). \n" +
   "  - Logos: A row of 5 gray opacity logos saying 'Trusted by tech leaders'. \n" +
      "  - Features: A 2x2 'Bento Grid' layout showing 4 distinct features with icons. \n" +
      "   - Pricing: Three cards (Basic, Pro, Enterprise). Highlight 'Pro' with a border and badge. \n" +
      "   - Footer: 4 columns of links. \n" +
      "4. ICONS: Import 'Zap', 'Shield', 'Globe', 'BarChart' from 'lucide-react'.",
  },
  {
    emoji: "🧮",
    title: "Neumorphic Calculator",
    prompt:
      "Build a stylish Calculator app. Start with 'use client'. \n" +
      "1. STYLE: Use a soft off-white background (#e0e5ec). \n" +
      "2. BUTTONS: Create buttons with 'neumorphic' shadows (box-shadow: 9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)) for a 3D tactile feel. \n" +  "3.You are free to use creative mind to build good looking ui. \n" + 
      "4. DISPLAY: A large inset screen at the top showing the current number. \n" +
      "4. LOGIC: Implement standard add/subtract/multiply/divide logic using React state. \n" +
      "5. LAYOUT: Grid layout for keys (7, 8, 9, /, etc.) centered on the screen.",
  },
  {
    emoji: "👤",
    title: "Personal Portfolio",
    prompt:
      "Build a minimalist personal portfolio. Start with 'use client'. \n" +
      "1. HERO: Split-screen layout. Left side: Large H1 'Hi, I'm [Name]', subtext 'Full Stack Developer', and social links. Right side: A large placeholder image or abstract shape. \n" +  "2.You are free to use creative mind to build good looking ui. \n" + 
      "3. SKILLS: A section with pill-shaped tags (React, Node, TypeScript, Tailwind) using a flex-wrap layout. \n" +
      "4. PROJECTS: A grid of 3 simple project cards with Title, Description, and 'View Code' button. \n" +
      "5. CONTACT: A minimalist footer with 'Github', 'Twitter', and 'Mail' icons from 'lucide-react'. \n" +
      "6. THEME: Clean black-and-white aesthetic (Helvetica style).",
  },
  {
    emoji: "📝",
    title: "Glass Todo App",
    prompt:
      "Build a beautiful Todo List. Start with 'use client'. \n" +  "You are free to use creative mind to build good looking ui. \n" + 
      "1. BACKGROUND: Use a colorful gradient background (bg-gradient-to-br from-purple-400 to-blue-500). \n" +
      "2. CARD: Create a central 'glass' container (white with 20% opacity, backdrop-blur-lg, white border). \n" +
      "3. INPUT: Stylish input field with a floating 'Add' button. \n" +
      "4. LIST: Render tasks with a checkbox. When clicked, strike through the text with a smooth transition. \n" +
      "5. DELETE: Add a small trash icon that appears on hover.",
  },
  {
    emoji: "🛍️",
    title: "Product Card",
    prompt:
      "Build a high-end E-commerce Product detail view. Start with 'use client'. \n" +
       "You are free to use creative mind to build good looking ui. \n" + 
      "1. LAYOUT: A centered card with a shadow-2xl effect. \n" +
      "2. IMAGE: Large product image area on the left (50% width). \n" +
      "3. DETAILS: On the right, show 'Premium Headphones' (H1), '$299.00' (H2), and a paragraph description. \n" +
      "4. ACTIONS: A 'Size Selector' row (S, M, L) and a large black 'Add to Cart' button with hover lift effect. \n" +
      "5. STATE: Clicking 'Add to Cart' should change button text to 'Added!' temporarily.",
  },
  {
    emoji: "🔐",
    title: "Login Screen",
    prompt:
      "Build a professional Login/Signup screen. Start with 'use client'. \n" +
       "You are free to use creative mind to build good looking ui. \n" + 
      "1. LAYOUT: Split screen. Left half is a high-quality abstract image/gradient. Right half is the form centered. \n" +
      "2. FORM: 'Welcome Back' header. Input fields for Email and Password with floating labels (peer-focus styling). \n" +
      "3. BUTTONS: A full-width 'Sign In' button (blue) and 'Sign In with Google' (outline with icon). \n" +
      "4. LINKS: 'Forgot Password?' link and 'Don't have an account? Sign up' at the bottom. \n" +
      "5. Use 'Mail' and 'Lock' icons inside the inputs.",
  },
  {
    emoji: "🌦️",
    title: "Weather Widget",
    prompt:
      "Build a Weather Dashboard component. Start with 'use client'. \n" +
       "You are free to use creative mind to build good looking ui. \n" + 
      "1. CARD: A large card with a deep blue gradient background (to-blue-600 from-blue-900). \n" +
      "2. CURRENT: Top section showing a large 'Sun/Cloud' icon, '72°F' text, and 'New York, USA'. \n" +
      "3. GRID: A bottom section showing 3 extra details: 'Humidity', 'Wind Speed', 'Feels Like' in small semi-transparent boxes. \n" +
      "4. FORECAST: A horizontal scroll list at the very bottom showing 5 days (Mon, Tue, Wed...) with mini icons. \n" +
      "5. Use 'Cloud', 'Sun', 'Wind', 'Droplets' icons from 'lucide-react'.",
  },
  {
    emoji: "📊",
    title: "Analytics Dashboard",
    prompt:
      "Build a clean Analytics Dashboard. Start with 'use client'. \n" +
          "You are free to use creative mind to build good looking ui. \n" + 
      "1. SIDEBAR: Fixed left nav with 'Home', 'Users', 'Revenue', 'Settings' links. \n" +
      "2. CARDS: Top row of 3 stat cards (Total Users, Revenue, Active Now) with soft shadows and trend arrows. \n" +
      "3. CHART: Create a visual 'Traffic' area using colored HTML div bars of different heights (CSS-only bar chart) to avoid library errors. \n" +
      "4. LIST: A 'Recent Transactions' list showing User Avatar, Name, Amount ($), and Status (Success/Pending badge). \n" +
      "5. Use 'BarChart', 'Users', 'CreditCard' icons.",
  },
 {
    emoji: "📝",
    title: "Project Kanban Board",
    prompt:
      "Build a Project Management Board. Start with 'use client'. \n" +
          "You are free to use creative mind to build good looking ui. \n" + 
      "1. LAYOUT: Full-screen gray background with 3 distinct columns: 'To Do', 'In Progress', 'Done'. \n" +
      "2. CARDS: Inside columns, render task cards with white background, shadow, and a colored 'Priority' tag (High/Med/Low). \n" +
      "3. ACTIONS: Add a '+ Add Task' button at the top of the 'To Do' column. \n" +
      "4. LOGIC: Add 'Move Right' and 'Move Left' arrow buttons on cards to shift them between columns (simulating drag and drop). \n" +
      "5. HEADER: Project title and user avatars in top right.",
  },
{
  emoji: "⌚",
  title: "Smart Watch Dashboard",
  prompt:
    "Build a Smart Watch Dashboard UI. Start with 'use client'. \n" +
        "You are free to use creative mind to build good looking ui. \n" + 
    "1. HEADER: Centered watch card with a rounded shape, soft shadow, and dark gradient background. \n" +
    "2. WATCH FACE: Show large digital time (e.g., '09:41') with the date below it. \n" +
    "3. STATUS ICONS: Row of icons for Battery, Heart, and Activity to display watch stats. \n" +
    "4. ACTION BUTTONS: Buttons for Start, Stop, and Reset at the bottom of the watch card, with hover and smooth transition effects. \n" +
    "5. STYLE: Minimal, clean, with smooth animations and good spacing for a polished look. \n" +
    "6. USE icons: Battery, Heart, Activity from 'lucide-react' or similar."
}

] as const;