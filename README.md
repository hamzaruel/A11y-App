# AccessiScan – Automated Web Accessibility Scanner

AccessiScan is a fast and lightweight tool that scans any website for accessibility issues based on **WCAG 2.2 guidelines**. It provides clear, developer-friendly reports to help improve accessibility for all users.

---

## 🚀 Features

- **Automatic Accessibility Scanning**
- **WCAG-based rule detection**
- **Clear issue categorization**
  - Color contrast
  - Missing alt text
  - ARIA attribute errors
  - Form & label issues
  - Headings & structure problems
  - Keyboard accessibility issues
- **Modern UI** using React + Tailwind + shadcn/ui
- **Server-side scanning engine** for accurate results
- Fully responsive interface

---

## 🏗️ Tech Stack

### **Frontend**
- React (Vite)
- TypeScript
- TailwindCSS
- shadcn/ui components

### **Backend**
- Node.js
- Server-side scanning
- Vite SSR

---

## 📦 Installation

```bash
git clone https://github.com/hamzaruel/AccessiScan.git
cd AccessiScan
npm install
```

---

## ▶️ Run the Project

```bash
npm run dev
```

The project will be available at:

```
http://localhost:5173
```

---

## 🧪 How to Use

1. Enter the URL you want to scan
2. Click **Scan Website**
3. The tool automatically checks it against WCAG rules
4. A detailed list of issues will appear in categories

---

## 📁 Project Structure

```
client/     → React frontend
server/     → Accessibility scanner backend
shared/     → Shared types and configs
script/     → Build scripts
```

---

## ✔️ Accessibility Checks Included

- Missing or invalid alt text
- Incorrect ARIA attributes
- Low color contrast
- Incorrect heading structure
- Missing labels on form elements
- Non-descriptive or empty links
- Missing landmark roles
- Keyboard accessibility issues
- Focus management problems

---
