# AlgoViz - Algorithm Visualizer

[![Netlify Deploy](https://img.shields.io/badge/Deployed%20on-Netlify-blue?style=flat-square&logo=netlify)](https://unique-pavlova-1147f4.netlify.app)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-green?style=flat-square)](https://unique-pavlova-1147f4.netlify.app)

A comprehensive web application for visualizing various algorithms with interactive step-by-step animations.

## 🌐 **Live Demo**
**🚀 Try it now: [https://unique-pavlova-1147f4.netlify.app](https://unique-pavlova-1147f4.netlify.app)**

## 🚀 Features

### 📊 Algorithm Categories
- **Sorting Algorithms**: Bubble, Merge, Quick, Insertion, Selection, Heap, Shell, Counting, Radix, Bucket, Tim, Cocktail, Gnome
- **Graph Algorithms**: Dijkstra, Kruskal, Bellman-Ford, Floyd-Warshall, BFS, DFS, Prim, Topological, Kosaraju, A*, Ford-Fulkerson
- **Dynamic Programming**: LCS, Knapsack, Coin Change, Matrix Chain Multiplication, LIS, Subset Sum
- **String Algorithms**: KMP, Rabin-Karp, Boyer-Moore, Edit Distance
- **Tree Algorithms**: Inorder, Preorder, Postorder, Level Order

### 🎯 Key Features
- **Interactive Visualizations**: Step-by-step algorithm execution with animations
- **"New Data" Functionality**: Generate random data for all algorithms
- **Responsive Design**: Works on desktop and mobile devices
- **Educational Content**: Algorithm explanations, complexity analysis, and use cases
- **Color-Coded Visuals**: Easy-to-understand color coding for algorithm states
- **Performance Optimized**: Efficient rendering with React and SVG

## 🛠️ Technologies Used

### Frontend
- **React 18.2.0** - Modern UI framework
- **Vite 5.2.0** - Fast build tool and development server
- **JavaScript ES6+** - Modern JavaScript features
- **CSS3** - Styled components with CSS-in-JS approach
- **SVG Graphics** - Scalable vector graphics for visualizations

### Development Tools
- **ESLint** - Code linting and formatting
- **Git Hooks** - Version control integration

## 📁 Project Structure

```
algoviz/
├── public/                 # Static assets
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/         # React components
│   │   ├── AlgorithmGenerators.jsx    # Algorithm logic generators
│   │   ├── CanvasComponents.jsx         # Visualization components
│   │   └── UIComponents.jsx           # Reusable UI components
│   ├── constants/          # Application constants
│   │   ├── algorithms.js              # Algorithm definitions
│   │   └── theme.js                   # Theme and styling
│   ├── utils/              # Utility functions
│   │   └── helpers.js                # Data generation helpers
│   ├── AlgorithmVisualizer.jsx # Main application component
│   ├── App.css             # Global styles
│   ├── App.jsx             # App entry point
│   ├── index.css           # Base styles
│   └── main.jsx           # React application entry
├── package.json           # Dependencies and scripts
├── vite.config.js         # Build configuration
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16.0 or higher
- **npm** or **yarn** package manager

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/algoviz.git

# Navigate to project directory
cd algoviz

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev      # Start development server (localhost:5000)
npm run build    # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 📖 Usage Guide

### Basic Workflow
1. **Select Algorithm**: Choose from the dropdown menu
2. **Generate Data**: Click "New Data" for random problem instances
3. **Run Visualization**: Watch step-by-step algorithm execution
4. **Control Playback**: Use play/pause/step controls
5. **Study Results**: Review algorithm complexity and explanations

### Algorithm Controls
- **Play/Pause**: Start or pause algorithm execution
- **Step Forward/Backward**: Navigate through algorithm steps
- **Speed Control**: Adjust animation speed
- **Reset**: Restart algorithm with current data

## 🎨 Customization

### Theme Support
- **Light/Dark Mode**: Toggle between light and dark themes
- **Color Schemes**: Predefined color palettes for accessibility
- **Responsive Design**: Adapts to different screen sizes

## 📚 Algorithm Details

### Dynamic Programming Algorithms
- **LCS (Longest Common Subsequence)**: Finds longest common subsequence between two strings
- **Knapsack**: Optimizes item selection for maximum value within weight constraint
- **Coin Change**: Finds minimum coins needed to make target amount
- **Matrix Chain Multiplication**: Optimizes matrix multiplication order
- **LIS (Longest Increasing Subsequence)**: Finds longest increasing subsequence
- **Subset Sum**: Determines if subset can sum to target value

### String Algorithms
- **KMP (Knuth-Morris-Pratt)**: Efficient pattern matching with LPS array
- **Rabin-Karp**: Rolling hash technique for fast string searching
- **Boyer-Moore**: Bad character heuristic for pattern matching
- **Edit Distance**: Levenshtein distance between two strings

### Graph Algorithms
- **Dijkstra**: Shortest path algorithm with priority queue
- **Kruskal**: Minimum spanning tree with union-find
- **BFS/DFS**: Graph traversal algorithms
- **Prim**: Alternative MST algorithm
- **A***: Heuristic pathfinding algorithm

## 🔧 Development

### Adding New Algorithms
1. **Implement Generator**: Add algorithm logic to `AlgorithmGenerators.jsx`
2. **Create Canvas Component**: Add visualization to `CanvasComponents.jsx`
3. **Add Algorithm Definition**: Update `constants/algorithms.js`
4. **Update Main Component**: Add to `AlgorithmVisualizer.jsx`

### Code Style
- **ESLint Configuration**: Follows established coding standards
- **Component Structure**: Functional components with hooks
- **State Management**: React state for algorithm data
- **Performance**: Optimized rendering with memoization

## 🚀 Deployment

### 🌐 **Live Deployment**
This project is **currently deployed and live** on Netlify:
- **Live URL**: [https://unique-pavlova-1147f4.netlify.app](https://unique-pavlova-1147f4.netlify.app)
- **Status**: ✅ Fully functional with all algorithms working
- **Last Updated**: Successfully deployed with all features

### Build for Production
```bash
npm run build
```

### Deployment Options
- **✅ Netlify**: Currently deployed (recommended)
- **Vercel**: Alternative for React applications
- **GitHub Pages**: Free static hosting
- **Firebase**: Google Firebase hosting

### Environment Variables
Create `.env` file for production:
```env
VITE_API_URL=https://your-api.com
VITE_APP_TITLE=AlgoViz
```

## 🤝 Contributing

### How to Contribute
1. **Fork the Repository**: Create your own copy
2. **Create Feature Branch**: `git checkout -b feature-name`
3. **Make Changes**: Implement your feature with tests
4. **Submit Pull Request**: Create detailed PR description

### Development Guidelines
- **Code Style**: Follow existing ESLint configuration
- **Testing**: Test new algorithms thoroughly
- **Documentation**: Update README for new features
- **Performance**: Consider performance implications

## 📄 License

This project is licensed under Ashraful Alam.

## 👥 Support

For questions, issues, or feature requests:
- **GitHub Issues**: [Create new issue](https://github.com/ashraful2512/algoviz/issues)
- **Discussions**: [Join discussions](https://github.com/ashraful2512/algoviz/discussions)

---

**Made with ❤️ for the algorithm and computer science community**
