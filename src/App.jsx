import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import KaiCards from './pages/KaiCards';
import Pokedex from './pages/Pokedex';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import BackgroundElements from './components/BackgroundElements';
import DotGrid from './components/DotGrid';

function App() {
  return (
    <Router>
      <div className="noise pointer-events-none z-50 fixed inset-0"></div>
      <DotGrid />
      <Loader />
      <BackgroundElements />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Keeping old URL path for backwards compatibility initially */}
        <Route path="/gallery.html" element={<Gallery />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/kai" element={<KaiCards />} />
        <Route path="/pokedex" element={<Pokedex />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
