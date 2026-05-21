import { Link } from 'react-router-dom';
import { Camera, ArrowUpRight } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import styles from './ContactSection.module.css';

const ContactCard = ({ link, icon, text, title, caption, className }) => {
  const isExternal = link.startsWith('http');
  const cardClasses = `glass-panel ${styles.card} ${className || ''}`.trim();

  const content = (
    <>
      <div className={styles.cardIcon}>
        {icon}
      </div>
      <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs font-mono text-gray-500 mb-1">{text}</div>
            <h3 className={styles.cardTitle}>{title}</h3>
          </div>
          <div className={styles.cardLinkWrap}>
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-400 font-mono">{caption}</p>
        </div>
      </div>
    </>
  );

  return isExternal ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className={cardClasses}>
      {content}
    </a>
  ) : (
    <Link to={link} className={cardClasses}>
      {content}
    </Link>
  );
};

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


        <ContactCard
          link="/gallery"
          icon={<Camera className="w-32 h-32" />}
          text="PORTFOLIO"
          title="Photography"
          caption="Memories captured through my lens."
          className={styles.cardPhoto}
        />

        <ContactCard
          link="https://www.linkedin.com/in/abimanyuananthu/"
          icon={<FaLinkedin className="w-32 h-32" />}
          text="NETWORK"
          title="LinkedIn"
          caption="Connect via secure professional network."
          className={styles.cardLinkedIn}
        />

        <ContactCard
          link="https://github.com/ab1manyu"
          icon={<FaGithub className="w-32 h-32" />}
          text="REPOSITORY"
          title="GitHub"
          caption="Access source code & projects."
          className={styles.cardGitHub}
        />
      </div>
    </section>
  );
}
