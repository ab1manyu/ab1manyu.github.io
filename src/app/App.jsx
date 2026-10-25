import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import Home from "@/routes/Home";
import Navbar from "@/shared/components/layout/Navbar";
import Footer from "@/shared/components/layout/Footer";
import Loader from "@/shared/components/feedback/Loader";
import BackgroundElements from "@/shared/components/layout/BackgroundElements";
import DotGrid from "@/shared/components/layout/DotGrid";

const Gallery = lazy(() => import("@/routes/Gallery"));
const KaiCards = lazy(() => import("@/routes/KaiCards"));
const Pokedex = lazy(() => import("@/routes/Pokedex"));
const DartScore = lazy(() => import("@/routes/DartScore"));
const NotFound = lazy(() => import("@/routes/NotFound"));

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
