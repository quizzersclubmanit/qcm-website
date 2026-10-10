import { useEffect } from 'react';
import RegistrationForm, { MIN_MEMBERS, MAX_MEMBERS } from './RegistrationForm.jsx';
import './registration.css';
import qcmLogoSm from '../assets/qcm-logo-sm.png'
import floatingMarks  from '../assets/floating-mark.png';
import { FaArrowLeft, FaCalendarAlt, FaGraduationCap, FaMapMarkerAlt, FaTrophy } from 'react-icons/fa';
import SEO from './SEO.jsx';

// Event details for QBIT'26
const EVENT = {
  name: "QBIT'26",
  date: '31 OCT 2026',
  venue: 'MANIT Bhopal Campus',
  prizePool: '₹35,000',
  prizes: [
    { label: 'Winner', value: '₹ 15,000 Cash Prize' },
    { label: 'Runner Up', value: '₹ 10,000' },
    { label: '2nd Runner Up', value: '₹ 7,000' },
    { label: 'Goodies for all participants', value: '' }
  ]
};

export default function SignupPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${EVENT.name} — Quizzers' Club NIT Bhopal`,
    description: `Register your team for ${EVENT.name}, the quiz event hosted by Quizzers' Club NIT Bhopal (QCM MANIT).`,
    startDate: "2026-10-31",
    location: {
      "@type": "Place",
      name: EVENT.venue,
      address: "MANIT Bhopal, Madhya Pradesh, India",
    },
    organizer: {
      "@type": "Organization",
      name: "Quizzers' Club NIT Bhopal",
      url: "https://www.quizzersclub.com/",
    },
  };

  return (
    <div className="qr qr-page">
      <SEO
        title={`${EVENT.name} Registration | Quizzers' Club NIT Bhopal (QCM MANIT)`}
        description={`Register your team for ${EVENT.name} at ${EVENT.venue} — the flagship quiz event by Quizzers' Club NIT Bhopal. Free team registration.`}
        path="/signup"
        schema={eventSchema}
        crumbs={[{ name: `${EVENT.name} Registration`, item: "https://www.quizzersclub.com/signup" }]}
      />
      <div className="bg" aria-hidden="true">
        <img src={floatingMarks} alt="" />
      </div>

      <div className="page">
        <div className="topbar">
          <a href="/" aria-label="Quizzers' Club home">
            <img className="logo" src={qcmLogoSm} alt="QCM logo" width="46" height="46" />
          </a>
          <a className="pill" href="/"><FaArrowLeft aria-hidden="true" />Back to website</a>
        </div>

        <div className="layout hero-layout">
          <header className="intro hero-copy">
            <h1 className="qbit-heading" aria-label="QBIT 26">
              <span className="qbit-main"><span className="qbit-mark">Q</span>-BIT</span>
              <span className="qbit-year">'26</span>
            </h1>
            <p className="club">QUIZZERS' CLUB NIT BHOPAL</p>

            <div className="poster-details">
              <div className="event-facts">
                <div className="poster-date">
                  <FaCalendarAlt aria-hidden="true" />
                  <span><span className="meta-label">DATE</span><span className="meta-value">{EVENT.date}</span></span>
                </div>
                <div className="poster-venue">
                  <FaMapMarkerAlt aria-hidden="true" />
                  <span><span className="meta-label">VENUE</span><span className="meta-value">NIT BHOPAL</span></span>
                </div>
              </div>

              <div className="poster-prizes">
                <div className="prize-total">
                  <FaTrophy aria-hidden="true" />
                  <span><span className="meta-label">TOTAL PRIZE POOL</span><strong>{EVENT.prizePool}</strong></span>
                </div>
                <div className="prize-list">
                  <span className="meta-label">PRIZES</span>
                  <ul>
                    {EVENT.prizes.map((prize) => (
                      <li key={prize.label}>
                        <span className="prize-dot" aria-hidden="true" />
                        <span>{prize.label}{prize.value ? `: ${prize.value}` : ''}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="poster-inline"><FaGraduationCap aria-hidden="true" />FOR COLLEGE STUDENTS</p>
              <p className="poster-strong">Grand Finale at MANIT</p>
            </div>
          </header>

          <RegistrationForm onClose={() => { window.location.href = '/'; }} closeLabel="Back to website" />
        </div>
      </div>
    </div>
  );
}
