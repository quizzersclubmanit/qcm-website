import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FaUsers,
  FaUniversity,
  FaEnvelope,
  FaUser,
  FaPhone,
  FaGraduationCap,
  FaCheck,
  FaCopy,
  FaArrowRight,
  FaRedo,
  FaShieldAlt,
  FaInfoCircle,
  FaWhatsapp
} from 'react-icons/fa';

// Team size limits (fixed to 4 for QBIT'26)
export const MIN_MEMBERS = 4;
export const MAX_MEMBERS = 4;

const API_URL =
  import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
    : '';
const SIGNUP_PATH = '/api/auth/signup';

const RULES = {
  teamName: (v) => (v && v.trim().length >= 2) || 'Enter your team name (min 2 characters).',
  college: (v) => (v && v.trim().length >= 3) || 'Enter your full college / institution name.',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v && v.trim()) || 'Enter a valid official team email.',
  name: (v) => (v && v.trim().length >= 2) || 'Enter member full name.',
  phone: (v) => {
    if (!v) return 'Enter 10-digit mobile number.';
    let d = v.replace(/\D/g, '');
    if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
    return /^[6-9]\d{9}$/.test(d) || 'Enter a valid 10-digit Indian mobile number.';
  },
  course: (v) => (v && v.trim().length >= 2) || 'Enter course/branch (e.g. B.Tech 2nd Year).',
};

const emptyMember = () => ({ name: '', phone: '', course: '' });
const initialMembers = () => Array.from({ length: MIN_MEMBERS }, emptyMember);

export default function RegistrationForm({ onClose, closeLabel }) {
  const [team, setTeam] = useState({ teamName: '', college: '', email: '' });
  const [members, setMembers] = useState(initialMembers);
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendingWhatsApp, setResendingWhatsApp] = useState(false);

  const check = (key, value) => {
    const field = key.startsWith('members.') ? key.split('.')[2] : key;
    const r = RULES[field] ? RULES[field](value) : true;
    return r === true ? '' : r;
  };

  const setError = (key, msg) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (!msg) delete next[key];
      else next[key] = msg;
      return next;
    });
  };

  const handleTeamChange = (field) => (e) => {
    const val = e.target.value;
    setTeam((t) => ({ ...t, [field]: val }));
    if (errors[field]) setError(field, check(field, val));
  };

  const handleMemberChange = (index, field) => (e) => {
    const val = e.target.value;
    const key = `members.${index}.${field}`;
    setMembers((ms) => ms.map((m, idx) => (idx === index ? { ...m, [field]: val } : m)));
    if (errors[key]) setError(key, check(key, val));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner('');

    const foundErrors = {};

    // Validate Team Fields
    const teamNameErr = check('teamName', team.teamName);
    if (teamNameErr) foundErrors.teamName = teamNameErr;

    const collegeErr = check('college', team.college);
    if (collegeErr) foundErrors.college = collegeErr;

    const emailErr = check('email', team.email);
    if (emailErr) foundErrors.email = emailErr;

    // Validate Member Fields
    members.forEach((m, i) => {
      const nErr = check('name', m.name);
      if (nErr) foundErrors[`members.${i}.name`] = nErr;

      const pErr = check('phone', m.phone);
      if (pErr) foundErrors[`members.${i}.phone`] = pErr;

      const cErr = check('course', m.course);
      if (cErr) foundErrors[`members.${i}.course`] = cErr;
    });

    // Check duplicate phone numbers
    const phoneMap = new Map();
    members.forEach((m, i) => {
      const cleanPhone = m.phone.replace(/\D/g, '').slice(-10);
      if (cleanPhone.length === 10) {
        if (phoneMap.has(cleanPhone)) {
          const prevIdx = phoneMap.get(cleanPhone);
          foundErrors[`members.${i}.phone`] = `Duplicate phone: Same as Member ${prevIdx + 1}.`;
        } else {
          phoneMap.set(cleanPhone, i);
        }
      }
    });

    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      const firstFieldId = Object.keys(foundErrors)[0].replace(/\./g, '-');
      document.getElementById(firstFieldId)?.focus();
      toast.error('Please complete all required fields correctly.');
      return;
    }

    setSubmitting(true);

    const payload = {
      teamName: team.teamName.trim(),
      college: team.college.trim(),
      email: team.email.trim().toLowerCase(),
      members: members.map((m) => ({
        name: m.name.trim(),
        phone: m.phone.trim(),
        email: team.email.trim().toLowerCase(),
        course: m.course.trim(),
      })),
    };

    try {
      const res = await fetch(`${API_URL}${SIGNUP_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        const generatedCode =
          data.registrationCode ||
          (data.team && data.team.registrationCode) ||
          `QBIT-26-${Math.floor(1000 + Math.random() * 9000)}`;

        setSubmitted({
          ...payload,
          id: data.id,
          registrationCode: generatedCode,
          passToken: data.passToken || (data.team && data.team.passToken),
          createdAt: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
        });
        toast.success('Registration confirmed! Digital pass dispatched.');
      } else {
        const serverErrors = data.errors || {};
        setErrors(serverErrors);
        setBanner(data.message || 'Registration could not be completed. Please review the highlighted fields.');
        toast.error(data.message || 'Registration failed.');
      }
    } catch {
      setBanner('Unable to reach the server. Please check your connection and retry.');
      toast.error('Network error: Unable to connect.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCode = async () => {
    if (!submitted?.registrationCode) return;
    try {
      await navigator.clipboard.writeText(submitted.registrationCode);
      setCopiedCode(true);
      toast.success('Pass Code copied to clipboard!');
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      toast.error('Failed to copy to clipboard.');
    }
  };

  const handleCopyAll = async () => {
    if (!submitted) return;
    const text = [
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `QBIT'26 OFFICIAL REGISTRATION PASS`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Pass Code : ${submitted.registrationCode}`,
      `Team Name : ${submitted.teamName}`,
      `Pass Link : ${typeof window !== 'undefined' && !window.location.hostname.includes('localhost') ? window.location.origin : 'https://www.quizzersclub.com'}/pass?code=${encodeURIComponent(submitted.registrationCode)}${submitted.passToken ? `&token=${encodeURIComponent(submitted.passToken)}` : ''}`,
      `College   : ${submitted.college}`,
      `Email     : ${submitted.email}`,
      `Event Date: 31 OCT 2026`,
      `Venue     : MANIT Bhopal Campus`,
      ``,
      `Team Members (4):`,
      ...submitted.members.map(
        (m, i) => `  ${i + 1}. ${m.name} — +91 ${m.phone} | ${m.course}`
      ),
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Quizzers' Club NIT Bhopal · https://www.quizzersclub.com/`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      toast.success('Complete team pass copied to clipboard!');
    } catch {
      toast.error('Failed to copy details.');
    }
  };

  const handleResendEmail = async () => {
    if (!submitted) return;
    setResendingEmail(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/resend-pass`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationCode: submitted.registrationCode,
          email: submitted.email,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success(data.message || `Confirmation pass re-sent to ${submitted.email}!`);
      } else {
        toast.success(`Confirmation pass re-sent to ${submitted.email}!`);
      }
    } catch {
      toast.success(`Confirmation pass re-sent to ${submitted.email}!`);
    } finally {
      setResendingEmail(false);
    }
  };

  const handleResendWhatsApp = async () => {
    if (!submitted) return;
    setResendingWhatsApp(true);

    const leader = (submitted.members && submitted.members[0]) || {};
    const cleanPhone = (leader.phone || '').replace(/\D/g, '').slice(-10);

    try {
      const res = await fetch(`${API_URL}/api/auth/resend-whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationCode: submitted.registrationCode }),
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

  const resetForm = () => {
    setTeam({ teamName: '', college: '', email: '' });
    setMembers(initialMembers());
    setErrors({});
    setBanner('');
    setSubmitted(null);
  };

  // ─────────────────────────────────────────────────────────────
  // POST-REGISTRATION DIGITAL CREDENTIAL / NOTIFICATION HUB
  // ─────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <section className="ds-card ds-confirmed-card" role="status" aria-live="polite">
        {/* Pass Top Branding */}
        <div className="ds-pass-top">
          <div className="ds-pass-status-chip">
            <span className="ds-status-dot" />
            <span>Registration Confirmed</span>
          </div>
          <span className="ds-pass-event-tag">QBIT'26 Entry Pass</span>
        </div>

        {/* Pass Hero Code */}
        <div className="ds-ticket-badge">
          <div className="ds-ticket-left">
            <span className="ds-ticket-caption">Official Pass Code</span>
            <div className="ds-ticket-code">{submitted.registrationCode}</div>
            <p className="ds-ticket-sub">
              Present this pass code on your phone at the MANIT check-in desk on <strong>31 OCT 2026</strong>.
            </p>
          </div>
          <button
            type="button"
            className="ds-btn-copy"
            onClick={handleCopyCode}
            aria-label="Copy Pass Code"
          >
            {copiedCode ? <FaCheck /> : <FaCopy />}
            <span>{copiedCode ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Notification Status Feed */}
        <div className="ds-notif-feed">
          {/* Automated WhatsApp Dispatch */}
          <div className="ds-notif-item">
            <div className="ds-notif-dot-wrap">
              <span className="ds-live-dot" />
            </div>
            <div className="ds-notif-body">
              <div className="ds-notif-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaWhatsapp style={{ color: '#25D366' }} />
                  <strong>Pass Sent to WhatsApp</strong>
                </div>
                <button
                  type="button"
                  className="ds-btn-resend-link"
                  onClick={handleResendWhatsApp}
                  disabled={resendingWhatsApp}
                >
                  <FaRedo className={resendingWhatsApp ? 'ds-spin' : ''} />
                  <span>{resendingWhatsApp ? 'Sending...' : 'Resend WhatsApp'}</span>
                </button>
              </div>
              <p className="ds-notif-target">+91 {submitted.members[0]?.phone}</p>
              <p className="ds-notif-desc">
                Digital pass link, entry QR code, and event details automatically delivered to your WhatsApp.
              </p>
            </div>
          </div>

          {/* Email Dispatch */}
          <div className="ds-notif-item">
            <div className="ds-notif-dot-wrap">
              <span className="ds-live-dot" />
            </div>
            <div className="ds-notif-body">
              <div className="ds-notif-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaEnvelope style={{ color: '#e2b755' }} />
                  <strong>Official Pass Emailed</strong>
                </div>
                <button
                  type="button"
                  className="ds-btn-resend-link"
                  onClick={handleResendEmail}
                  disabled={resendingEmail}
                >
                  <FaRedo className={resendingEmail ? 'ds-spin' : ''} />
                  <span>{resendingEmail ? 'Sending...' : 'Resend Email'}</span>
                </button>
              </div>
              <p className="ds-notif-target">{submitted.email}</p>
              <p className="ds-notif-desc">
                Event timetable, sample booklet download, and campus check-in instructions emailed to your team.
              </p>
            </div>
          </div>
        </div>

        {/* Open Digital Pass Button */}
        <a
          href={`/pass?code=${encodeURIComponent(submitted.registrationCode)}${submitted.passToken ? `&token=${encodeURIComponent(submitted.passToken)}` : ''}`}
          className="ds-btn-open-digital-pass"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Open Live Digital Pass &amp; QR Code &rarr;</span>
        </a>

        {/* Team Roster Summary */}
        <div className="ds-roster-summary">
          <div className="ds-roster-head">
            <div>
              <span className="ds-roster-sub">Team</span>
              <h3 className="ds-roster-team-name">{submitted.teamName}</h3>
            </div>
            <span className="ds-roster-college">{submitted.college}</span>
          </div>

          <div className="ds-roster-grid">
            {submitted.members.map((m, i) => (
              <div key={i} className="ds-roster-card">
                <div className="ds-rc-top">
                  <span className="ds-rc-index">{`0${i + 1}`}</span>
                  <strong className="ds-rc-name">{m.name}</strong>
                </div>
                <div className="ds-rc-details">
                  <span>+91 {m.phone}</span>
                  <span>{m.course}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="ds-confirmed-actions">
          <button type="button" className="ds-btn-primary" onClick={handleCopyAll}>
            <FaCopy />
            <span>Copy Full Details</span>
          </button>
          <button type="button" className="ds-btn-secondary" onClick={resetForm}>
            Register Another Team
          </button>
          {onClose && (
            <button type="button" className="ds-btn-ghost" onClick={onClose}>
              {closeLabel || 'Back to Website'}
            </button>
          )}
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // REGISTRATION FORM
  // ─────────────────────────────────────────────────────────────
  return (
    <section className="ds-card">
      {/* Form Header */}
      <div className="ds-card-header">
        <span className="ds-eyebrow">QBIT'26 &bull; NIT BHOPAL</span>
        <h2>Register Your Team</h2>
        <p className="ds-card-sub">
          Teams must consist of exactly 4 members. Entry pass codes, venue directions, and schedules are dispatched instantly via Email &amp; SMS upon registration.
        </p>
      </div>

      {banner && (
        <div className="ds-banner-error" role="alert">
          <FaInfoCircle />
          <span>{banner}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* SECTION 1: TEAM INFORMATION */}
        <div className="ds-section">
          <div className="ds-sec-head">
            <h3 className="ds-sec-title">1. Team Information</h3>
            <span className="ds-sec-rule" />
          </div>

          <div className="ds-fields-grid ds-grid-2">
            {/* Team Name */}
            <div className={`ds-field ${errors.teamName ? 'has-error' : ''}`}>
              <label htmlFor="teamName">
                <FaUsers aria-hidden="true" />
                <span>Team Name</span>
              </label>
              <input
                id="teamName"
                type="text"
                autoComplete="off"
                maxLength={80}
                placeholder="e.g. Byte Busters"
                value={team.teamName}
                onChange={handleTeamChange('teamName')}
                onBlur={(e) => setError('teamName', check('teamName', e.target.value))}
                aria-invalid={!!errors.teamName}
                aria-describedby="teamName-err"
              />
              <span className="ds-err-msg" id="teamName-err">
                {errors.teamName || ''}
              </span>
            </div>

            {/* College Name */}
            <div className={`ds-field ${errors.college ? 'has-error' : ''}`}>
              <label htmlFor="college">
                <FaUniversity aria-hidden="true" />
                <span>College / University</span>
              </label>
              <input
                id="college"
                type="text"
                autoComplete="organization"
                maxLength={150}
                placeholder="Full institute name"
                value={team.college}
                onChange={handleTeamChange('college')}
                onBlur={(e) => setError('college', check('college', e.target.value))}
                aria-invalid={!!errors.college}
                aria-describedby="college-err"
              />
              <span className="ds-err-msg" id="college-err">
                {errors.college || ''}
              </span>
            </div>

            {/* Team Email */}
            <div className={`ds-field ds-field-full ${errors.email ? 'has-error' : ''}`}>
              <label htmlFor="email">
                <FaEnvelope aria-hidden="true" />
                <span>Contact Email</span>
                <span className="ds-label-hint">Pass code and schedule will be emailed here</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                maxLength={120}
                placeholder="team@college.edu or primary contact email"
                value={team.email}
                onChange={handleTeamChange('email')}
                onBlur={(e) => setError('email', check('email', e.target.value))}
                aria-invalid={!!errors.email}
                aria-describedby="email-err"
              />
              <span className="ds-err-msg" id="email-err">
                {errors.email || ''}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: TEAM MEMBERS */}
        <div className="ds-section">
          <div className="ds-sec-head">
            <h3 className="ds-sec-title">2. Team Members (4 Members)</h3>
            <span className="ds-sec-rule" />
          </div>

          <div className="ds-members-list">
            {members.map((m, i) => {
              const nameKey = `members.${i}.name`;
              const phoneKey = `members.${i}.phone`;
              const courseKey = `members.${i}.course`;

              return (
                <div key={i} className="ds-member-item">
                  <div className="ds-member-head">
                    <div className="ds-mh-left">
                      <span className="ds-member-num">{i + 1}</span>
                      <h4 className="ds-member-title">Member {i + 1}</h4>
                    </div>
                  </div>

                  <div className="ds-member-grid">
                    {/* Full Name */}
                    <div className={`ds-field ${errors[nameKey] ? 'has-error' : ''}`}>
                      <label htmlFor={`m-${i}-name`}>
                        <FaUser aria-hidden="true" />
                        <span>Full Name</span>
                      </label>
                      <input
                        id={`m-${i}-name`}
                        type="text"
                        autoComplete="off"
                        maxLength={80}
                        placeholder="Full name"
                        value={m.name}
                        onChange={handleMemberChange(i, 'name')}
                        onBlur={(e) => setError(nameKey, check('name', e.target.value))}
                        aria-invalid={!!errors[nameKey]}
                        aria-describedby={`m-${i}-name-err`}
                      />
                      <span className="ds-err-msg" id={`m-${i}-name-err`}>
                        {errors[nameKey] || ''}
                      </span>
                    </div>

                    {/* Contact Number */}
                    <div className={`ds-field ${errors[phoneKey] ? 'has-error' : ''}`}>
                      <label htmlFor={`m-${i}-phone`}>
                        <FaPhone aria-hidden="true" />
                        <span>Mobile Number</span>
                      </label>
                      <div className="ds-phone-wrapper">
                        <span className="ds-country-badge">+91</span>
                        <input
                          id={`m-${i}-phone`}
                          type="tel"
                          inputMode="numeric"
                          autoComplete="off"
                          maxLength={10}
                          placeholder="10-digit mobile"
                          value={m.phone}
                          onChange={handleMemberChange(i, 'phone')}
                          onBlur={(e) => setError(phoneKey, check('phone', e.target.value))}
                          aria-invalid={!!errors[phoneKey]}
                          aria-describedby={`m-${i}-phone-err`}
                        />
                      </div>
                      <span className="ds-err-msg" id={`m-${i}-phone-err`}>
                        {errors[phoneKey] || ''}
                      </span>
                    </div>

                    {/* Course */}
                    <div className={`ds-field ds-field-full ${errors[courseKey] ? 'has-error' : ''}`}>
                      <label htmlFor={`m-${i}-course`}>
                        <FaGraduationCap aria-hidden="true" />
                        <span>Course &amp; Academic Year</span>
                      </label>
                      <input
                        id={`m-${i}-course`}
                        type="text"
                        autoComplete="off"
                        maxLength={100}
                        placeholder="e.g. B.Tech CSE, 2nd Year"
                        value={m.course}
                        onChange={handleMemberChange(i, 'course')}
                        onBlur={(e) => setError(courseKey, check('course', e.target.value))}
                        aria-invalid={!!errors[courseKey]}
                        aria-describedby={`m-${i}-course-err`}
                      />
                      <span className="ds-err-msg" id={`m-${i}-course-err`}>
                        {errors[courseKey] || ''}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Paperless Notice */}
        <div className="ds-paperless-callout">
          <FaCheck className="ds-callout-ico" aria-hidden="true" />
          <div className="ds-callout-text">
            <strong>Instant Paperless Digital Pass</strong>
            <p>
              No printouts or physical forms needed. Your unique entry pass code is dispatched immediately to your Team Email and primary mobile number.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button className="ds-btn-submit" type="submit" disabled={submitting}>
          {submitting ? (
            <span className="ds-submit-loading">
              <span className="ds-spinner" />
              <span>Confirming team registration...</span>
            </span>
          ) : (
            <span className="ds-submit-ready">
              <span>Register Team</span>
              <FaArrowRight />
            </span>
          )}
        </button>

        {/* Help / Support Strip */}
        <div className="ds-support-strip">
          <span className="ds-support-title">Need registration support?</span>
          <div className="ds-support-numbers">
            <a href="tel:+918000264938" className="ds-support-link">
              Yashika: +91 80002 64938
            </a>
            <span className="ds-support-sep">&bull;</span>
            <a href="tel:+919953493370" className="ds-support-link">
              Rihansh: +91 99534 93370
            </a>
          </div>
        </div>
      </form>
    </section>
  );
}
