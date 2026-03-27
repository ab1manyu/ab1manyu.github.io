import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import BlankGallery from './pages/BlankGallery';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import BackgroundElements from './components/BackgroundElements';

function App() {
  return (
    <Router>
      <div className="noise pointer-events-none z-50 fixed inset-0"></div>
      <div className="dot-grid pointer-events-none z-[-2] fixed inset-0"></div>
      <Loader />
      <BackgroundElements />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Keeping old URL path for backwards compatibility initially */}
        <Route path="/gallery.html" element={<Gallery />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/blank-gallery" element={<BlankGallery />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
