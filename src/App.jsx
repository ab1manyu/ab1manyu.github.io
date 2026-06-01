import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import BackgroundElements from './components/BackgroundElements';
import DotGrid from './components/DotGrid';

const Gallery = lazy(() => import('./pages/Gallery'));
const KaiCards = lazy(() => import('./pages/KaiCards'));
const Pokedex = lazy(() => import('./pages/Pokedex'));

function App() {
  return (
    <Router>
      <div className="noise pointer-events-none z-50 fixed inset-0"></div>
      <DotGrid />
      <Loader />
      <BackgroundElements />
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Keeping old URL path for backwards compatibility initially */}
          <Route path="/gallery.html" element={<Gallery />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/kai" element={<KaiCards />} />
          <Route path="/pokedex" element={<Pokedex />} />
        </Routes>
      </Suspense>
      <Footer />
      <Analytics />
    </Router>
  );
}

export default App;
