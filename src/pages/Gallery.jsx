import { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, X, Aperture, Sliders } from 'lucide-react';

const galleryItems = [
  {
    id: 1,
    location: "Hampi, Karnataka, India",
    title: "Lakshmi the Elephant",
    date: "2026-01-04",
    cam: "SONY a6000",
    lens: "40mm",
    settings: "f/4 1/320s ISO 500",
    image: "/gallery/lakshmi.JPG",
    desc: "The friendly face of Virupaksha Temple in Hampi, Lakshmi is an Indian Elephant you can meet inside of the temple and occasionally bathing in the Tungabhadra River. I got the opportunity to meet her twice while I was in Hampi. Once was during my visit to the Virupaksha Temple, at the end of my first day, where she was standing by the temple exit. She is very friendly and is trained to bless you by placing her trunk on your head after donating a rupee note to her. Unfortunately, I did not have any bills, so I placed a coin in her trunk and she was smart enough to notice and did not bless me. No hard feelings, but it goes to show how intelligent Lakshmi is. The next day, I was able to see her again in the morning around 9:00 AM at the Tungabhadra River, where 2 men were scrubbing her with a hard brush to give her a daily bath. I was able to get up close to her in the river, as close to splashing some water on her head. It was an extremely special moment and I feel lucky to have met Lakshmi during both days of my Hampi Trip."
  },
  {
    id: 2,
    location: "Hampi, Karnataka, India",
    title: "Tungabhadra River",
    date: "2026-01-05",
    cam: "SONY a6000",
    lens: "40mm",
    settings: "f/20 1/20s ISO 100",
    image: "/gallery/hampi.JPG",
    desc: "Hampi is a city located in one of the southern states of India called Karnataka. At one time, the population of this city could have easily been upwards of 500,000+, yet now there are only about 3000 locals that live there. As a UNESCO world heritage site, Hampi brings in hundreds of thousands of tourists every year. This reigion is other worldly, containing mountains of boulders that stretch as far as the eyes can see, and ancient temples and structures that have intricate, beautiful and even impossible to fathom, all carved in stone. Unfortunately, the Hampi we see today will never match what it would have been due to constant invasions and desctructions by the Moghul Empire some 500 years ago, but many sites are being restored and areas are marked for preservation."
  },
  {
    id: 3,
    location: "Halebidu, Karnataka, India",
    title: "Hoysaleswara Temple",
    date: "2026-01-04",
    cam: "SONY a6000",
    lens: "40mm",
    settings: "f/7.1 1/200s ISO 100",
    image: "/gallery/halebidu.JPG",
    desc: "The Hoysaleswara Temple, also known as Halebidu Temple is a 12th century Shiva Temple. It was constructed during the mid 1100s. However it has been pillaged and plundered during the 14th century by Muslim invaders, and the temple had been abandoned since late 19th century. Since then, recovered pieces have been marked and slowly started to be restored. The temple is made out of soapstone, giving it a faded and dark finish. The level of intricacy and detail that this temple shows is unexplainable. The outer walls are layered with friezes (or bands) of elephants, dancers, horses, lions, and scenes from the Mahabarata, Ramayana, and the Puranas. Taking a close look at the image, we can see Indra and Indrani on Airavata (Right), one of the most iconic panels in the temple. Indra, the king of the gods, sits with his wife Indrani atop the divine elephant Airavata. To the left of Indra, in the middle of the image, we see Garuda is carrying Vishnu and Lakshmi on his shoulders."
  }
];

export default function Gallery() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Intersection Observer for glass-panels
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".glass-panel").forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease";
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeItem();
    };
    if (selectedItem) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [selectedItem]);

  const openItem = (item) => {
    setSelectedItem(item);
    setZoomLevel(0);
  };

  const closeItem = () => {
    setSelectedItem(null);
  };

  const handleZoom = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => (prev + 1) % 3);
  };

  return (
    <>
      <div className="dot-grid"></div>

      <main className="pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto min-h-screen relative z-10 transition-opacity duration-500">
        <div className="flex justify-between items-end mb-8 border-defense-border pb-4">
          <div>
            <div className="font-mono text-xs text-defense-accent mb-2">PERSPECTIVES_CAPTURED</div>
            <h1 className="text-4xl font-bold text-white uppercase tracking-tight">Photography</h1>
            <p className="text-md text-gray-500 tracking-tight max-w-2xl mt-2">
              A showcase containing the experiences that I have captured throughout my travel and daily life. 
              Click on any image to view it in full resolution and learn the history behind it.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => openItem(item)}
              className="glass-panel p-0 group relative overflow-hidden aspect-video flex items-center justify-center cursor-pointer"
            >
              <div className="absolute inset-0 bg-defense-accent/0 group-hover:bg-white/10 transition-colors z-10"></div>
              <img src={item.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt={item.title} />
              <div className="absolute bottom-4 left-4 font-mono text-[12px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity z-20">
                {item.image.split('/').pop().toUpperCase()}
              </div>
              <div className="absolute top-0 left-0 w-full h-[1px] bg-defense-accent/20 transform -translate-x-full group-hover:animate-[slideRight_2s_linear_infinite] z-20"></div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      <div id="gallery-modal" className={`fixed inset-0 z-[60] flex items-center justify-center px-4 transition-all duration-300 ${selectedItem ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${selectedItem ? 'opacity-100' : 'opacity-0'}`} onClick={closeItem}></div>
        
        {selectedItem && (
          <div className={`relative w-[95vw] h-[95vh] bg-defense-base border border-defense-border rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row transition-transform duration-300 ${selectedItem ? 'scale-100' : 'scale-95'}`}>
            <div className="w-full md:w-3/4 bg-black/50 relative flex items-center justify-center border-b md:border-b-0 md:border-r border-defense-border h-1/2 md:h-full overflow-hidden">
              <img 
                src={selectedItem.image} 
                onClick={handleZoom}
                className={`w-full h-full object-contain max-h-[90%] transition-transform duration-300 origin-center ${zoomLevel === 0 ? 'cursor-zoom-in scale-100' : zoomLevel === 1 ? 'cursor-zoom-in scale-[2.5]' : 'cursor-zoom-out scale-[5]'}`} 
                alt={selectedItem.title} 
              />
            </div>

            <div className="w-full md:w-1/4 p-8 flex flex-col bg-defense-panel backdrop-blur-md overflow-y-auto h-1/2 md:h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="font-mono text-[10px] text-defense-muted uppercase tracking-widest">
                  {selectedItem.location || 'LOCATION'}
                </div>
                <button onClick={closeItem} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                {selectedItem.title}
              </h2>

              <div className="font-mono text-xs text-defense-accent mb-6">
                {selectedItem.date}
              </div>

              <div className="font-sans text-sm text-gray-300 leading-relaxed mb-6">
                {selectedItem.desc}
              </div>

              <div className="mt-auto pt-6 border-t border-defense-border">
                <div className="font-mono text-[10px] text-defense-muted mb-2 uppercase tracking-wider">Camera Intel</div>
                <div className="grid grid-cols-1 gap-2 text-xs font-mono text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Camera className="w-3 h-3 text-defense-accent" />
                    <span className="text-white">{selectedItem.cam}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Aperture className="w-3 h-3 text-defense-accent" />
                    <span>{selectedItem.lens}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sliders className="w-3 h-3 text-defense-accent" />
                    <span>{selectedItem.settings}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-defense-accent/10 border border-defense-accent/20 text-[10px] font-mono text-defense-accent rounded">INTEL</span>
                  <span className="px-2 py-1 bg-defense-accent/10 border border-defense-accent/20 text-[10px] font-mono text-defense-accent rounded">OPS</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
