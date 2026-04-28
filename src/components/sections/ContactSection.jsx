import { Link } from 'react-router-dom';
import { Camera, ArrowUpRight } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import styles from './ContactSection.module.css';

export default function ContactSection() {
  return (
    <section id="contact" className="max-w-4xl mx-auto mb-24 scroll-mt-28">
      <div className="flex justify-between items-end mb-8 md:px-0">
        <h2 className="text-3xl font-bold text-white">Links</h2>
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="font-mono text-xs text-red-500">AWAITING CONNECTION</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/gallery" className={`glass-panel ${styles.card} ${styles.cardPhoto}`}>
          <div className={styles.cardIcon}>
            <Camera className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-mono text-gray-500 mb-1">PORTFOLIO</div>
                <h3 className={styles.cardTitle}>Photography</h3>
              </div>
              <div className={styles.cardLinkWrap}>
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400 font-mono">Memories captured through my lens.</p>
            </div>
          </div>
        </Link>

        <a href="https://www.linkedin.com/in/abimanyuananthu/" target="_blank" rel="noopener noreferrer" className={`glass-panel ${styles.card} ${styles.cardLinkedIn}`}>
          <div className={styles.cardIcon}>
            <FaLinkedin className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-mono text-gray-500 mb-1">NETWORK</div>
                <h3 className={styles.cardTitle}>LinkedIn</h3>
              </div>
              <div className={styles.cardLinkWrap}>
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400 font-mono">Connect via secure professional network.</p>
            </div>
          </div>
        </a>

        <a href="https://github.com/ab1manyu" target="_blank" rel="noopener noreferrer" className={`glass-panel ${styles.card} ${styles.cardGitHub}`}>
          <div className={styles.cardIcon}>
            <FaGithub className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-mono text-gray-500 mb-1">REPOSITORY</div>
                <h3 className={styles.cardTitle}>GitHub</h3>
              </div>
              <div className={styles.cardLinkWrap}>
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400 font-mono">Access source code & projects.</p>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
