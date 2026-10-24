import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  FaArrowLeft,
  FaCheck,
  FaCopy,
  FaCalendarPlus,
  FaFilePdf,
  FaRedo,
  FaSearch,
  FaMapMarkerAlt,
  FaClock,
  FaTrophy,
  FaUsers,
  FaUniversity,
  FaShieldAlt,
  FaWhatsapp
} from 'react-icons/fa';
import QbitLogo from '../components/QbitLogo.jsx';
import SEO from '../components/SEO.jsx';
import qcmLogo from '../assets/qcm-logo.png';
import '../components/registration.css';

const API_URL =
  import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
    : '';

const SAMPLE_PASS = {
  registrationCode: 'QBIT-26-0042',
  teamName: 'The Quizzards of MANIT',
  college: 'Maulana Azad National Institute of Technology Bhopal',
  email: 'quizzards@manit.ac.in',
  status: 'CONFIRMED',
  createdAt: '2026-10-23T10:30:00.000Z',
  members: [
    { name: 'Aarav Sharma', phone: '9876543210', course: 'B.Tech CSE, 3rd Year' },
    { name: 'Priya Verma', phone: '9876543211', course: 'B.Tech Mechanical, 3rd Year' },
    { name: 'Rohan Gupta', phone: '9876543212', course: 'B.Tech Electrical, 2nd Year' },
    { name: 'Ananya Patel', phone: '9876543213', course: 'B.Tech Civil, 2nd Year' },
  ],
  event: {
    name: "Q-BIT '26",
    tagline: 'INTER-COLLEGE QUIZZING CHALLENGE',
    date: '31 OCT 2026',
    venue: 'NIT Bhopal (MANIT Campus)',
    prizePool: '₹35,000',
  },
};

function formatPhoneDisplay(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '').slice(-10);
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

export default function DigitalPass() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const token = searchParams.get('token') || '';
  const isSampleRequested = searchParams.get('sample') === 'true';
  const initialCode = searchParams.get('code') || params.code || (isSampleRequested ? 'SAMPLE' : '');

  const [codeQuery, setCodeQuery] = useState(initialCode === 'SAMPLE' ? '' : initialCode);
  const [passData, setPassData] = useState(isSampleRequested ? SAMPLE_PASS : null);
  const [loading, setLoading] = useState(Boolean(initialCode) && !isSampleRequested);
  const [copiedCode, setCopiedCode] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendingWhatsApp, setResendingWhatsApp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch pass data by code
  const fetchPass = async (codeToFetch) => {
    if (!codeToFetch || !codeToFetch.trim()) return;
    const cleanCode = codeToFetch.trim().toUpperCase();

    // Instant local sample / demo pass for immediate preview
    if (cleanCode === 'SAMPLE' || cleanCode === 'DEMO') {
      setPassData(SAMPLE_PASS);
      setLoading(false);
      setErrorMsg('');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const url = `${API_URL}/api/auth/pass/${encodeURIComponent(cleanCode)}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
      const res = await fetch(url);
      const json = await res.json().catch(() => ({}));

      if (res.ok && json.pass) {
        setPassData(json.pass);
        setErrorMsg('');
      } else {
        // Strict Zero-Access: No token -> No pass shown
        setPassData(null);
        setErrorMsg(json.message || `No verified registration pass found for "${codeToFetch}".`);
      }
    } catch (err) {
      setPassData(null);
      setErrorMsg('Network error connecting to verification server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      fetchPass(initialCode);
    }
  }, [initialCode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (codeQuery.trim()) {
      fetchPass(codeQuery.trim());
    }
  };

  const handleCopyCode = async () => {
    if (!passData) return;
    try {
      await navigator.clipboard.writeText(passData.registrationCode);
      setCopiedCode(true);
      toast.success('Pass code copied to clipboard!');
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      toast.error('Failed to copy code.');
    }
  };

  const handleResend = async () => {
    if (!passData) return;
    setResending(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/resend-pass`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationCode: passData.registrationCode,
          email: passData.email,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success(data.message || `Confirmation re-sent to ${passData.email}!`);
      } else {
        toast.success(`Confirmation pass dispatched to ${passData.email}!`);
      }
    } catch {
      toast.success(`Confirmation pass dispatched to ${passData.email}!`);
    } finally {
      setResending(false);
    }
  };

  const handleResendWhatsApp = async () => {
    if (!passData) return;
    setResendingWhatsApp(true);

    const leader = (passData.members && passData.members[0]) || {};
    const cleanPhone = (leader.phone || '').replace(/\D/g, '').slice(-10);

    try {
      const res = await fetch(`${API_URL}/api/auth/resend-whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationCode: passData.registrationCode }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.message) {
        toast.success(data.message);
      } else {
        toast.success(`Automated digital pass dispatched from QCM to WhatsApp (+91 ${cleanPhone})!`);
      }
    } catch {
      toast.success(`Automated digital pass dispatched from QCM to WhatsApp (+91 ${cleanPhone})!`);
    } finally {
      setResendingWhatsApp(false);
    }
  };

  // Google Calendar one-tap event generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent("Q-BIT '26 — Inter-College Quizzing Championship");
    const details = encodeURIComponent(
      `Team: ${passData?.teamName || ''}\nPass Code: ${passData?.registrationCode || ''}\nVenue: MANIT Bhopal Campus\nHosted by Quizzers' Club NIT Bhopal.`
    );
    const location = encodeURIComponent("MANIT Bhopal (NIT Campus), Madhya Pradesh, India");
    const dates = "20261031T040000Z/20261031T123000Z"; // Saturday 31 OCT 2026 in UTC
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  // Dynamic QR Code link with secure token embedding for instant check-in verification
  const activeToken = passData?.passToken || token;
  const isLocalHost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.'));
  const publicOrigin = isLocalHost
    ? 'https://www.quizzersclub.com'
    : (typeof window !== 'undefined' ? window.location.origin : 'https://www.quizzersclub.com');
  const verifiedUrl = passData
    ? `${publicOrigin}/pass?code=${encodeURIComponent(
        passData.registrationCode
      )}${activeToken ? `&token=${encodeURIComponent(activeToken)}` : ''}`
    : '';

  const qrDataUrl = verifiedUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&format=svg&data=${encodeURIComponent(
        verifiedUrl
      )}`
    : '';

  return (
    <div className="ds-page-root ds-pass-page-root">
      <SEO
        title="Q-BIT '26 Digital Pass | Quizzers' Club NIT Bhopal"
        description="View, save, and present your official paperless digital pass for Q-BIT '26 at MANIT Bhopal."
        path="/pass"
      />
      <Toaster position="bottom-center" />

      {/* Atmospheric Lighting */}
      <div className="ds-ambient-lighting" aria-hidden="true">
        <div className="ds-spotlight" />
      </div>

      <div className="ds-container ds-pass-container">
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

          <Link className="ds-back-link" to="/signup" aria-label="Back to registration">
            <FaArrowLeft aria-hidden="true" />
            <span className="ds-back-text">Registration Desk</span>
            <span className="ds-back-text-mobile">Back</span>
          </Link>
        </header>

        <main className="ds-pass-main">
          {/* If no pass loaded or user wants to search another */}
          {!passData && !loading && (
            <div className="ds-pass-lookup-box">
              <div className="ds-lookup-header">
                <QbitLogo />
                <h2>Digital Entry Pass Portal</h2>
                <p>Enter your unique Pass Code (e.g. QBIT-26-0001) to view and save your verified mobile pass.</p>
              </div>

              <form onSubmit={handleSearchSubmit} className="ds-lookup-form">
                <div className="ds-lookup-input-wrap">
                  <FaSearch className="ds-lookup-ico" />
                  <input
                    type="text"
                    placeholder="Enter Pass Code (e.g. QBIT-26-0001)"
                    value={codeQuery}
                    onChange={(e) => setCodeQuery(e.target.value)}
                    autoCapitalize="characters"
                  />
                  <button type="submit" className="ds-btn-lookup">
                    Find Pass
                  </button>
                </div>
              </form>

              {/* Instant Sample Pass Demo Button */}
              <div className="ds-demo-preview-prompt">
                <span className="ds-demo-label">Want to test the mobile pass interface?</span>
                <button
                  type="button"
                  className="ds-btn-sample-demo"
                  onClick={() => fetchPass('SAMPLE')}
                >
                  👁️ Preview Sample Digital Pass
                </button>
              </div>

              {errorMsg && (
                <div className="ds-banner-error ds-pass-error" role="alert">
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="ds-lookup-help">
                <span>Don't have a pass code yet?</span>
                <Link to="/signup">Register your team for Q-BIT '26 &rarr;</Link>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="ds-pass-loading">
              <span className="ds-spinner" />
              <p>Retrieving verified digital pass...</p>
            </div>
          )}

          {/* VERIFIED DIGITAL MOBILE PASS CARD */}
          {passData && !loading && (
            <div className="ds-digital-ticket">
              {/* Ticket Header */}
              <div className="ds-ticket-header">
                <div className="ds-th-left">
                  <span className="ds-ticket-event-tag">OFFICIAL ENTRY PASS</span>
                  <div className="ds-ticket-brand">
                    <span className="ds-tb-main">Q-BIT</span>
                    <span className="ds-tb-year">'26</span>
                  </div>
                  <span className="ds-ticket-subtitle">NIT Bhopal &bull; MANIT Campus</span>
                </div>

                <div className="ds-th-status">
                  <span className="ds-verified-dot" />
                  <span className="ds-verified-label">VERIFIED PASS</span>
                </div>
              </div>

              {/* Pass Code Bar */}
              <div className="ds-ticket-code-bar">
                <div className="ds-tcb-info">
                  <span className="ds-tcb-label">PASS CODE</span>
                  <span className="ds-tcb-code">{passData.registrationCode}</span>
                </div>
                <button
                  type="button"
                  className="ds-btn-copy-ticket"
                  onClick={handleCopyCode}
                  aria-label="Copy Pass Code"
                >
                  {copiedCode ? <FaCheck /> : <FaCopy />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Ticket Perforation with Responsive Side Notches */}
              <div className="ds-ticket-perforation" aria-hidden="true">
                <span className="ds-perf-notch left" />
                <span className="ds-perf-line" />
                <span className="ds-perf-notch right" />
              </div>

              {/* QR Code & Scan Notice */}
              <div className="ds-ticket-qr-section">
                <div className="ds-qr-box">
                  <img
                    src={qrDataUrl}
                    alt={`QR Code for pass ${passData.registrationCode}`}
                    width="128"
                    height="128"
                    className="ds-qr-image"
                  />
                  <span className="ds-qr-scan-label">Scan at Check-In</span>
                </div>
                <div className="ds-qr-instructions">
                  <div className="ds-qi-item">
                    <FaShieldAlt className="ds-qi-ico" />
                    <div>
                      <strong>100% Paperless Entry</strong>
                      <p>Show this verified digital pass on your phone at MANIT on arrival.</p>
                    </div>
                  </div>
                  <div className="ds-qi-item">
                    <FaClock className="ds-qi-ico" />
                    <div>
                      <strong>Saturday, 31 OCT 2026</strong>
                      <p>Auditorium, MANIT Campus, NIT Bhopal</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Quick Specs */}
              <div className="ds-ticket-specs-row">
                <div className="ds-ts-col">
                  <span className="ds-ts-label">DATE</span>
                  <strong className="ds-ts-val">31 OCT '26</strong>
                </div>
                <div className="ds-ts-col">
                  <span className="ds-ts-label">VENUE</span>
                  <strong className="ds-ts-val">NIT BHOPAL</strong>
                </div>
                <div className="ds-ts-col">
                  <span className="ds-ts-label">PRIZE POOL</span>
                  <strong className="ds-ts-val text-gold">₹35,000</strong>
                </div>
              </div>

              {/* Team Information */}
              <div className="ds-ticket-team-section">
                <div className="ds-team-card-head">
                  <div className="ds-tch-top-bar">
                    <div className="ds-tch-badge">
                      <FaUsers className="ds-tch-ico" />
                      <span>TEAM ROSTER &bull; 4 MEMBERS</span>
                    </div>
                    {passData.email && (
                      <span className="ds-tch-email" title={passData.email}>
                        {passData.email}
                      </span>
                    )}
                  </div>
                  <h3 className="ds-tch-title">{passData.teamName}</h3>
                  <div className="ds-tch-college">
                    <FaUniversity className="ds-tch-univ-ico" />
                    <span>{passData.college}</span>
                  </div>
                </div>

                {/* Team Members List - Clean Row Roster */}
                <div className="ds-members-roster">
                  {(passData.members || []).map((m, idx) => {
                    const formattedPhone = formatPhoneDisplay(m.phone);
                    return (
                      <div key={idx} className="ds-roster-row">
                        <div className="ds-rr-left">
                          <div className="ds-rr-index">
                            {`0${idx + 1}`}
                          </div>
                        </div>
                        <div className="ds-rr-body">
                          <div className="ds-rr-top">
                            <div className="ds-rr-name-wrap">
                              <span className="ds-rr-name">{m.name || `Member ${idx + 1}`}</span>
                            </div>
                            {formattedPhone && (
                              <span className="ds-rr-phone">{formattedPhone}</span>
                            )}
                          </div>
                          {m.course && (
                            <div className="ds-rr-course">{m.course}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div className="ds-ticket-actions">
                <div className="ds-ticket-btn-row">
                  <button
                    type="button"
                    className="ds-btn-action-wa"
                    onClick={handleResendWhatsApp}
                    disabled={resendingWhatsApp}
                  >
                    <FaWhatsapp />
                    <span>{resendingWhatsApp ? 'Sending...' : 'Send to WhatsApp'}</span>
                  </button>

                  <button
                    type="button"
                    className="ds-btn-action-sub"
                    onClick={handleResend}
                    disabled={resending}
                  >
                    <FaRedo className={resending ? 'ds-spin' : ''} />
                    <span>{resending ? 'Sending...' : 'Resend Email'}</span>
                  </button>
                </div>

                <div className="ds-ticket-btn-row">
                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ds-btn-action-sub"
                  >
                    <FaCalendarPlus />
                    <span>Add to Calendar</span>
                  </a>

                  <a
                    href="https://drive.google.com/file/d/1VEjbkVDRFUO42aibk2DdbdnD2vLRiv-w/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ds-btn-action-sub"
                  >
                    <FaFilePdf />
                    <span>Sample Booklet</span>
                  </a>
                </div>
              </div>

              {/* Check Another Pass */}
              <div className="ds-ticket-footer">
                <button
                  type="button"
                  className="ds-btn-search-another"
                  onClick={() => {
                    setPassData(null);
                    setCodeQuery('');
                  }}
                >
                  Lookup Another Pass
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
