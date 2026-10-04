import { useEffect } from 'react';
import RegistrationForm, { MIN_MEMBERS, MAX_MEMBERS } from './RegistrationForm.jsx';
import './registration.css';
import qcmLogo from '../assets/qcm-logo.png'
import floatingMarks  from '../assets/floating-mark.png';

// Event details for QBIT'26
const EVENT = {
  name: "QBIT'26",
  date: '31 October 2026',
  venue: 'MANIT Bhopal Campus',
  contacts: [
    { name: 'Sakshi Priya', phone: '8226872015' },
    { name: 'Charunya Zerbade', phone: '7222928982' }
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
            <h1>{EVENT.name}</h1>
            <p className="club">Quizzers' Club NIT Bhopal</p>
            <p className="lede">Register your team for {EVENT.name}, the quiz event hosted by QCM.</p>

            {(EVENT.date || EVENT.venue) && (
              <div className="meta-grid">
                {EVENT.date && (
                  <div className="meta-block">
                    <div className="meta-label">DATE</div>
                    <div className="meta-value">{EVENT.date}</div>
                  </div>
                )}
                {EVENT.venue && (
                  <div className="meta-block">
                    <div className="meta-label">VENUE</div>
                    <div className="meta-value">{EVENT.venue}</div>
                  </div>
                )}
              </div>
            )}

            <div className="contact-block">
              <div className="meta-label contact-title">CONTACT US</div>
              {EVENT.contacts.map((contact) => (
                <div key={contact.phone} className="contact-line">
                  <span>{contact.name}:</span> <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                </div>
              ))}
            </div>
          </header>

          <RegistrationForm onClose={() => { window.location.href = '/'; }} closeLabel="Back to website" />
        </div>
      </div>
    </div>
  );
}
