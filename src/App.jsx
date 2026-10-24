import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import Home from "./pages/Home";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Loader from "./components/feedback/Loader";
import BackgroundElements from "./components/layout/BackgroundElements";
import DotGrid from "./components/layout/DotGrid";

const Gallery = lazy(() => import("./pages/Gallery"));
const KaiCards = lazy(() => import("./pages/KaiCards"));
const Pokedex = lazy(() => import("./pages/Pokedex"));
const DartScore = lazy(() => import("./pages/DartScore"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
          <Route path="/darts" element={<DartScore />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
      <Analytics />
    </Router>
  );
}

export default App;
