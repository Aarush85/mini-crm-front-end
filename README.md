# MiniCRM Frontend

A modern React-based frontend for the MiniCRM platform, providing an intuitive interface for customer management, order tracking, and marketing campaigns.

## 🚀 Features

- **Modern UI/UX**
  - Responsive design
  - Dark/Light mode support
  - Interactive dashboards
  - Real-time updates

- **Customer Management**
  - Customer list with search and filters
  - Detailed customer profiles
  - Customer segmentation
  - Bulk import functionality

- **Order Management**
  - Order tracking
  - Spending analytics
  - Order history
  - Bulk order processing

- **Campaign Management**
  - Campaign creation wizard
  - AI-powered message generation
  - Campaign scheduling
  - Performance analytics

## 🛠 Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- React Query
- React Hot Toast

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=MiniCRM
VITE_APP_ENV=development
```

## 🚀 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── services/      # API services
├── utils/         # Utility functions
└── assets/        # Static assets
```

## 🔑 Key Features

### Authentication
- Google OAuth integration
- Protected routes
- Session management

### Data Management
- Real-time updates
- Optimistic updates
- Error handling
- Loading states

### UI Components
- Responsive layout
- Interactive tables
- Form validation
- Toast notifications
- Loading spinners

## 🎨 Styling

- Tailwind CSS for styling
- Custom components
- Responsive design
- Dark/Light mode support

## 🧪 Testing

```bash
npm test
```

## 📦 Build

```bash
npm run build
```

## 📝 License

MIT 