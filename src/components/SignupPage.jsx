import { useEffect } from 'react';
import RegistrationForm, { MIN_MEMBERS, MAX_MEMBERS } from './RegistrationForm.jsx';
import './registration.css';
import qcmLogo from '../assets/qcm-logo.png'
import floatingMarks  from '../assets/floating-mark.png';

// Event details for QBIT'26
const EVENT = {
  name: "QBIT'26",
  date: '31 OCT',
  venue: 'MANIT Bhopal Campus',
  prizePool: '₹ 35,000',
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
          <a href="/" aria-label="Quizzers' Club home">
            <img className="logo" src={qcmLogo} alt="QCM logo" width="46" height="46" />
          </a>
          <a className="pill" href="/">Back to website</a>
        </div>

        <div className="layout hero-layout">
          <header className="intro hero-copy">
            <h1 className="qbit-heading" aria-label="QBIT 26">
              <span className="qbit-main">QBIT</span>
              <span className="qbit-year">'26</span>
            </h1>
            <p className="club">Quizzers' Club NIT Bhopal</p>

            <div className="poster-details">
              <div className="poster-date">
                <span className="meta-label">DATE</span>
                <span className="meta-value">{EVENT.date}</span>
              </div>

              <div className="poster-prizes">
                <div className="total-prize">
                  TOTAL PRIZE POOL: <span>{EVENT.prizePool}</span>
                </div>
                <div className="meta-label">PRIZES</div>
                <ul>
                  {EVENT.prizes.map((prize) => (
                    <li key={prize.label} className={prize.value ? 'has-value' : 'no-value'}>
                      <span className="prize-dot" aria-hidden="true" />
                      <span className="prize-copy">
                        {prize.label}: {prize.value ? <span className="prize-value">{prize.value}</span> : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="poster-inline">Open to All UG and PG Students</p>
              <p className="poster-strong">Grand Finale at MANIT Bhopal Campus</p>
              <p className="poster-strong poster-strong--free">Free Registration</p>
            </div>
          </header>

          <RegistrationForm onClose={() => { window.location.href = '/'; }} closeLabel="Back to website" />
        </div>
      </div>
    </div>
  );
}
