# Family Tree Application

A React-based family tree application that allows users to create, visualize, and manage family relationships. Similar to FamilyEcho, this application provides an intuitive interface for building your family history.

## Features

- **User Authentication**: Secure login with Google via Firebase
- **Family Tree Management**: Create multiple family trees
- **Person Management**: Add, edit, and delete family members with detailed information
- **Traditional Family Visualization**: View family relationships with parents displayed on the same line and children below them
- **Data Persistence**: All data is stored securely in Firebase Firestore
- **Cross-Tree Linking**: Automatically link and synchronize persons with the same name across different family trees

## Technologies Used

- **React**: Frontend library for building user interfaces
- **Vite**: Build tool and development server
- **Firebase**: Authentication and database services
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library
- **React Router**: Navigation handling
- **React D3 Tree**: Tree visualization library

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- A Firebase account

### Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication with Google provider
4. Create a Firestore database
5. Set up appropriate security rules
6. Register a web application and get your configuration

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/family-tree.git
   cd family-tree
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the project root and add your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Update the Firebase configuration in `src/firebase/config.js` with your environment variables:
   ```javascript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID
   };
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open your browser and navigate to `http://localhost:5173/`

## Project Structure

```
family-tree/
├── public/            # Static assets
├── src/               # Source code
│   ├── components/    # React components
│   ├── contexts/      # Context providers
│   ├── firebase/      # Firebase configuration
│   ├── services/      # Service functions for API calls
│   ├── App.jsx        # Main application component
│   ├── index.css      # Global styles
│   └── main.jsx       # Entry point
├── .env               # Environment variables (create this)
├── .gitignore         # Git ignore file
├── package.json       # Dependencies and scripts
└── README.md          # Project documentation
```

## Usage Guide

### Authentication

1. Navigate to the login page
2. Click "Sign in with Google" 
3. Complete the Google authentication process

### Managing Family Trees

1. On the dashboard, create a new family tree by clicking "Create New"
2. Enter a name for your family tree
3. Click "Create" to save it
4. Open a family tree by clicking "Open Tree"
5. Delete a family tree by clicking the trash icon

### Managing Family Members

1. In the tree editor, add a new family member by clicking "Add Person"
2. Fill in the person's details in the form
3. Click "Save" to add the person to your tree
4. View a person's details by clicking on them in the list or tree
5. Edit a person by clicking the edit icon in their details panel
6. Delete a person by clicking the delete icon in their details panel

### Family Tree Visualization

The application uses a traditional family tree layout:

- **Couples Display**: Husbands and wives (or parents) are displayed side by side on the same level
- **Child Inheritance**: Children are positioned below their parents and connected to both of them
- **Gender Coding**: Different colors for males (blue) and females (pink) for easy identification
- **Multiple Generations**: The tree can display multiple generations of ancestors and descendants
- **Interactive Navigation**: Click on any individual to view and edit their details

This structure makes it easy to understand family relationships at a glance, following the conventional representation of family trees where children visually inherit from both parents equally.

### Cross-Tree Linking and Collaboration

The application features an innovative cross-tree linking system that allows for collaboration between users:

1. **Automatic Matching**: When a person is added to a family tree, the system automatically searches for individuals with the same first and last name in other trees.

2. **Link Visualization**: When matches are found, links to these potential matches are displayed in the person's details panel.

3. **Easy Navigation**: Users can click on these links to navigate directly to the matched person in the other family tree.

4. **Data Synchronization**: When editing a person with matches in other trees, users have the option to synchronize certain biographical information (like birth/death dates, locations, occupation) across all linked persons.

5. **Collaboration**: This feature facilitates collaboration between family members working on different branches of a larger family tree, helping to consolidate and validate genealogical information.

## Firestore Data Model

### Collections

1. **familyTrees**
   - `name`: String (Tree name)
   - `userId`: String (Owner's user ID)
   - `createdAt`: Timestamp
   - `updatedAt`: Timestamp

2. **persons**
   - `treeId`: String (Reference to family tree)
   - `firstName`: String
   - `lastName`: String
   - `gender`: String ('male', 'female', 'other')
   - `birthDate`: String (ISO date format)
   - `birthPlace`: String
   - `deathDate`: String (ISO date format)
   - `deathPlace`: String
   - `occupation`: String
   - `notes`: String
   - `motherId`: String (Reference to mother)
   - `fatherId`: String (Reference to father)
   - `linkedPersons`: Array (References to similar persons in other trees)
     - Each entry contains: `id`, `treeId`, `firstName`, `lastName`
   - `createdAt`: Timestamp
   - `updatedAt`: Timestamp

## Future Enhancements

- Export/import functionality for family tree data
- Media upload for photos and documents
- Advanced search and filtering
- Timeline view of family events
- Sharing capabilities
- Mobile responsiveness improvements
- Themes and customization options

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [FamilyEcho](https://familyecho.com/) for inspiration
- [React D3 Tree](https://github.com/bkrem/react-d3-tree) for tree visualization
- [Firebase](https://firebase.google.com/) for authentication and database services
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide React](https://lucide.dev/) for icons