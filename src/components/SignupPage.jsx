import { useEffect } from 'react';
import RegistrationForm, { MIN_MEMBERS, MAX_MEMBERS } from './RegistrationForm.jsx';
import './registration.css';
import qcmLogo from '../assets/qcm-logo.png'
import floatingMarks  from '../assets/floating-mark.png';
import { FaArrowLeft, FaCalendarAlt, FaGraduationCap, FaMapMarkerAlt, FaTrophy } from 'react-icons/fa';

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
    const previous = document.title;
    document.title = `${EVENT.name} Registration | Quizzers' Club NIT Bhopal`;
    window.scrollTo(0, 0);
    return () => { document.title = previous; };
  }, []);

  return (
    <div className="qr qr-page">
      <div className="bg" aria-hidden="true">
        <img src={floatingMarks} alt="" />
      </div>

      <div className="page">
        <div className="topbar">
          <a className="brand" href="/" aria-label="Quizzers' Club home">
            <img className="logo" src={qcmLogo} alt="QCM logo" width="54" height="54" />
            <span className="brand-copy"><strong>Quizzers' Club</strong><small>NIT Bhopal</small></span>
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
