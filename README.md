# Retrium OS

Retrium OS is a retro-inspired, desktop-in-browser operating system simulator built with React and Vite. It aims to recreate the classic computing experience directly in your web browser, complete with a boot sequence, interactive desktop, window management, and a suite of functional applications.

## Features

- **Retro Aesthetic**: Pixel-art styling, classic fonts, and vintage UI elements reminiscent of early GUI operating systems.
- **Window Management**: Fully functional window system supporting dragging, focusing (z-index management), and closing applications.
- **Boot Sequence**: Immersive startup experience with a simulated boot screen.
- **Desktop Environment**: Includes a top bar, desktop icons, and a dock for launching applications.
- **Built-in Applications**:
  - **Terminal**: A file-system-aware interactive command line interface.
  - **Calculator**: A fully functional retro calculator.
  - **Minesweeper**: The classic grid-based puzzle game.
  - **Memory Match**: A card-matching puzzle game.
  - **Music Player**: A retro-style music playback interface.
  - **Trash**: A recursive "trash-folder" mini-game mechanic.
  - **Community**: A guestbook and real-time chat interface.
- **Interactive Narrative**: Features a chat box system that triggers character dialogues (e.g., "ENNA") based on user actions.

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with custom properties for a cohesive retro look
- **Libraries**: `react-draggable` for window movement

## Project Structure

```text
src/
├── components/          # Reusable UI components (Dock, TopBar, Window, etc.)
│   └── apps/            # Individual OS applications (TerminalApp, CalculatorApp, etc.)
├── index.css            # Global styles and design system
├── App.jsx              # Main application logic and state management (Window manager)
└── main.jsx             # React entry point
```

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd osbyfun
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the URL provided in your terminal).

## Scripts

- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Bundles the app into static files for production.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs Oxlint to check for code issues.

## License

This project is licensed under the MIT License.
