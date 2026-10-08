import { useEffect } from 'react';
import RegistrationForm, { MIN_MEMBERS, MAX_MEMBERS } from './RegistrationForm.jsx';
import './registration.css';
import qcmLogoSm from '../assets/qcm-logo-sm.png'
import floatingMarks  from '../assets/floating-mark.png';
import SEO from './SEO.jsx';

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
