import { useState, useEffect } from 'react';
import RegistrationForm from './RegistrationForm.jsx';
import QbitLogo from './QbitLogo.jsx';
import './registration.css';
import qcmLogo from '../assets/qcm-logo.png';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaFilePdf,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaTrophy,
  FaExternalLinkAlt,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import SEO from './SEO.jsx';

const EVENT = {
  name: "QBIT'26",
  tagline: 'INTER-COLLEGE QUIZZING CHALLENGE',
  date: '31 OCT 2026',
  venue: 'NIT Bhopal (MANIT Campus)',
  prizePool: '₹35,000',
  prizes: [
    { rank: '1st', label: 'WINNER', value: '₹15,000' },
    { rank: '2nd', label: 'RUNNER UP', value: '₹10,000' },
    { rank: '3rd', label: 'SECOND RUNNER UP', value: '₹7,000' },
    { rank: 'All', label: 'FINALISTS', value: 'Exciting Goodies' },
  ],
};

export default function SignupPage() {
  const [showPrizesMobile, setShowPrizesMobile] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${EVENT.name} — Quizzers' Club NIT Bhopal`,
    description: `Register your team for ${EVENT.name}, the flagship inter-college quiz event hosted by Quizzers' Club NIT Bhopal (QCM MANIT).`,
    startDate: '2026-10-31',
    location: {
      '@type': 'Place',
      name: EVENT.venue,
      address: 'MANIT Bhopal, Madhya Pradesh, India',
    },
    organizer: {
      '@type': 'Organization',
      name: "Quizzers' Club NIT Bhopal",
      url: 'https://www.quizzersclub.com/',
    },
  };

  return (
    <div className="ds-page-root">
      <SEO
        title={`${EVENT.name} Registration | Quizzers' Club NIT Bhopal (QCM MANIT)`}
        description={`Register your team for ${EVENT.name} at ${EVENT.venue} — flagship quiz challenge by Quizzers' Club NIT Bhopal.`}
        path="/signup"
        schema={eventSchema}
        crumbs={[{ name: `${EVENT.name} Registration`, item: 'https://www.quizzersclub.com/signup' }]}
      />

      {/* Theatrical spotlight & subtle background lighting */}
      <div className="ds-ambient-lighting" aria-hidden="true">
        <div className="ds-spotlight" />
      </div>

      <div className="ds-container">
        {/* Navigation Bar */}
        <header className="ds-topbar">
          <a className="ds-brand" href="/" aria-label="Quizzers' Club NIT Bhopal Home">
            <img className="ds-logo" src={qcmLogo} alt="Quizzers' Club NIT Bhopal" width="36" height="36" />
            <div className="ds-brand-info">
              <span className="ds-brand-name">Quizzers' Club</span>
              <span className="ds-brand-sep">/</span>
              <span className="ds-brand-loc">NIT Bhopal</span>
            </div>
          </a>

          <a className="ds-back-link" href="/" aria-label="Back to main website">
            <FaArrowLeft aria-hidden="true" />
            <span className="ds-back-text">Back to website</span>
            <span className="ds-back-text-mobile">Back</span>
          </a>
        </header>

        {/* Main 2-Column Responsive Layout */}
        <main className="ds-layout">
          {/* Left Column: Editorial Event Presentation */}
          <aside className="ds-hero-side">
            {/* Clean Collegiate Wordmark */}
            <div className="ds-brand-hero">
              <QbitLogo />
              <div className="ds-tagline-wrap">
                <span className="ds-tagline-line" aria-hidden="true" />
                <span className="ds-hero-tagline">{EVENT.tagline}</span>
                <span className="ds-tagline-line" aria-hidden="true" />
              </div>
              <div className="ds-hero-location">MANIT BHOPAL &bull; 31 OCT 2026</div>
            </div>

            <p className="ds-hero-desc">
              Central India's premier inter-college quiz event at MANIT Bhopal. Register your 4-member team to compete for a <strong>₹35,000 cash prize pool</strong>.
            </p>

            {/* Event Specs Bento Card */}
            <div className="ds-event-card">
              <div className="ds-specs-grid">
                <div className="ds-spec-item">
                  <div className="ds-spec-icon">
                    <FaCalendarAlt aria-hidden="true" />
                  </div>
                  <div>
                    <span className="ds-spec-label">EVENT DATE</span>
                    <strong className="ds-spec-val">{EVENT.date}</strong>
                    <span className="ds-spec-sub">Saturday</span>
                  </div>
                </div>

                <div className="ds-spec-item">
                  <div className="ds-spec-icon">
                    <FaMapMarkerAlt aria-hidden="true" />
                  </div>
                  <div>
                    <span className="ds-spec-label">VENUE</span>
                    <strong className="ds-spec-val">NIT BHOPAL</strong>
                    <span className="ds-spec-sub">MANIT Campus</span>
                  </div>
                </div>

                <div className="ds-spec-item ds-spec-gold">
                  <div className="ds-spec-icon gold">
                    <FaTrophy aria-hidden="true" />
                  </div>
                  <div>
                    <span className="ds-spec-label">CASH PRIZE POOL</span>
                    <strong className="ds-spec-val text-gold">{EVENT.prizePool}</strong>
                    <span className="ds-spec-sub">Cash Awards</span>
                  </div>
                </div>

                <div className="ds-spec-item">
                  <div className="ds-spec-icon">
                    <FaGraduationCap aria-hidden="true" />
                  </div>
                  <div>
                    <span className="ds-spec-label">ELIGIBILITY</span>
                    <strong className="ds-spec-val">COLLEGE STUDENTS</strong>
                    <span className="ds-spec-sub">Teams of 4</span>
                  </div>
                </div>
              </div>

              {/* Mobile Collapsible Trigger for Prizes & Booklet */}
              <button
                type="button"
                className="ds-mobile-prizes-toggle"
                onClick={() => setShowPrizesMobile(!showPrizesMobile)}
                aria-expanded={showPrizesMobile}
              >
                <span>{showPrizesMobile ? 'Hide Prize Distribution & Booklet' : '🏆 View Prize Breakdown & Sample Booklet'}</span>
                {showPrizesMobile ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {/* Prize Breakdown Table & Booklet */}
              <div className={`ds-expandable-content ${showPrizesMobile ? 'is-open' : ''}`}>
                <div className="ds-prizes-section">
                  <div className="ds-prizes-title">
                    <span>PRIZE ENDOWMENT DISTRIBUTION</span>
                    <span className="ds-prizes-pill">4 Awards</span>
                  </div>
                  <div className="ds-prizes-rows">
                    {EVENT.prizes.map((p) => (
                      <div key={p.label} className="ds-prize-row">
                        <span className="ds-prize-badge">{p.rank}</span>
                        <span className="ds-prize-name">{p.label}</span>
                        <strong className="ds-prize-amt">{p.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Official Sample Booklet Resource Card */}
                <div className="ds-booklet-wrapper">
                  <a
                    className="ds-booklet-card"
                    href="https://drive.google.com/file/d/1VEjbkVDRFUO42aibk2DdbdnD2vLRiv-w/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="ds-booklet-icon-box">
                      <FaFilePdf aria-hidden="true" />
                    </div>
                    <div className="ds-booklet-text">
                      <div className="ds-booklet-top">
                        <strong>Official Sample Booklet</strong>
                        <span className="ds-badge-pdf">PDF</span>
                      </div>
                      <p>Download previous rounds question patterns, format &amp; guidelines</p>
                    </div>
                    <FaExternalLinkAlt className="ds-booklet-external" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Registration Card */}
          <section className="ds-form-side">
            <RegistrationForm
              onClose={() => {
                window.location.href = '/';
              }}
              closeLabel="Back to website"
            />
          </section>
        </main>
      </div>
    </div>
  );
}
