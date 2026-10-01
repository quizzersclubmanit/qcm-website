import { useEffect } from 'react';
import RegistrationForm, { MIN_MEMBERS, MAX_MEMBERS } from './RegistrationForm.jsx';
import './registration.css';
import qcmLogo from '../assets/qcm-logo.png'
import floatingMarks  from '../assets/floating-mark.png';

// Fill these in when the details are final; empty values are hidden.
const EVENT = { name: "QBIT'26", date: '', venue: '' };

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

        <div className="layout">
          <header className="intro">
            <h1>{EVENT.name}</h1>
            <p className="club">Quizzers' Club NIT Bhopal</p>
            <p className="lede">Register your team for {EVENT.name}, the quiz event hosted by QCM.</p>

            {(EVENT.date || EVENT.venue) && (
              <dl className="meta">
                {EVENT.date && <div><dt>Date</dt><dd>{EVENT.date}</dd></div>}
                {EVENT.venue && <div><dt>Venue</dt><dd>{EVENT.venue}</dd></div>}
              </dl>
            )}

            <ul className="facts">
              <li>Teams of {MIN_MEMBERS} to {MAX_MEMBERS} members</li>
              <li>One form per team, with every member's details</li>
              <li>Your confirmation appears as soon as you submit</li>
            </ul>

            <div className="art" aria-hidden="true">
              <img className="q" src="/gradient-qcm-logo.png" alt="" />
              <img className="bulb" src="/bulb.png" alt="" />
            </div>
          </header>

          <RegistrationForm onClose={() => { window.location.href = '/'; }} closeLabel="Back to website" />
        </div>
      </div>
    </div>
  );
}
