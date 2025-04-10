# Hello dev team, I hope you enjoy my journey planner.

## Technical Specs

- Built with React and TypeScript as opposed to js for type safety
- SCSS (It is sass, just uses curly brackets and semicolons like css :) ) for styling.
- React Router for seamless navigation
- Proxy setup for API communication
- Component-based architecture for maintainability

### Note on Loading Indicators

I opted for not adding a loading "view" inbetween calculating and changing to results view. Although loading indicators can enhance user experience by providing feedback (as discussed in [this UX article](https://www.pencilandpaper.io/articles/ux-pattern-analysis-loading-feedback)), which is very interesting, and I would add it however i was experiencing some issues with it and just wanted to get it submitted to you as soon as I could, if you want me to demonstrate the use of something similar I can share with you another site I created.

## Getting Started

### Prerequisites

- Node.js 
- npm 

### Installation

1. Clone the repo:
   ```bash
   git clone [https://github.com/jackbeardless/journey-planner]
   cd journeyplanner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm start
   ```


## Project Structure

```
src/
  ├── components/         # React components
  │   ├── StartView/      # Landing page component
  │   ├── JourneyEntryView/  # Journey input form
  │   └── ResultView/     # Journey results display
  ├── styles/            # Global styles and variables
  └── App.tsx           # Main application component
```
