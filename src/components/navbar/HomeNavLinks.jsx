import { Link } from "react-router-dom";

export default function HomeNavLinks() {
  const handleScrollToHash = (e, hash) => {
    if (window.location.pathname === "/" || window.location.pathname === "") {
      e.preventDefault();
      window.history.pushState(null, "", `/${hash}`);
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 112;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="hidden md:flex gap-8 text-sm font-mono tracking-wider text-defense-muted">
      <Link
        to="/#about"
        onClick={(e) => handleScrollToHash(e, "#about")}
        className="nav-item hover:text-white transition-colors py-1"
      >
        01_INTEL
      </Link>
      <Link
        to="/#skills"
        onClick={(e) => handleScrollToHash(e, "#skills")}
        className="nav-item hover:text-white transition-colors py-1"
      >
        02_OPS
      </Link>
      <Link
        to="/#contact"
        onClick={(e) => handleScrollToHash(e, "#contact")}
        className="nav-item hover:text-white transition-colors py-1"
      >
        03_LINK
      </Link>
    </div>
  );
}
