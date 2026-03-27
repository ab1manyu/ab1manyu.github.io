import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';

function App() {
  return (
    <Router>
      <div className="noise pointer-events-none z-50 fixed inset-0"></div>
      <div className="dot-grid pointer-events-none z-[-2] fixed inset-0"></div>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Keeping old URL path for backwards compatibility initially */}
        <Route path="/gallery.html" element={<Gallery />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </Router>
  );
}

export default App;
