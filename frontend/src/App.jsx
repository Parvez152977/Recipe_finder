import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import FavoritesPage from './pages/FavoritesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import './styles/App.css';

function App() {
  const userId = 1; // Default user

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-logo">
              <Link to="/">🍳 Recipe Finder</Link>
            </div>
            <div className="nav-links">
              <Link to="/" className="nav-btn">🔍 Search</Link>
              <Link to="/favorites" className="nav-btn">❤️ Favorites</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home userId={userId} />} />
          <Route path="/favorites" element={<FavoritesPage userId={userId} />} />
          <Route path="/recipe/:id" element={<RecipeDetailPage userId={userId} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;