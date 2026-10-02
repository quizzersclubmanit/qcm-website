import { useState } from 'react';

// Team size limits (keep in sync with server/server.js)
export const MIN_MEMBERS = 4;
export const MAX_MEMBERS = 4;

// Address of your website's backend, with no trailing slash (use '' if the site and backend share one address).
const API_URL =
  import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
    : '';
// Path of the signup route in auth.js: the prefix auth.js is mounted at in your server, then /signup
const SIGNUP_PATH = '/api/auth/signup';

const TEAM_FIELDS = [
  { key: 'teamName', label: 'Team name', placeholder: 'e.g. Byte Busters', autoComplete: 'off', maxLength: 80 },
  { key: 'college', label: 'College name', placeholder: 'Full college name', autoComplete: 'organization', maxLength: 150 },
];

const MEMBER_FIELDS = [
  { key: 'name', label: 'Member name', placeholder: 'Full name', autoComplete: 'off', maxLength: 80 },
  { key: 'phone', label: 'Contact number', placeholder: '10-digit mobile number', type: 'tel', inputMode: 'numeric', autoComplete: 'off', half: true },
  { key: 'email', label: 'Email', placeholder: 'name@college.edu', type: 'email', autoComplete: 'off', maxLength: 120, half: true },
  { key: 'course', label: 'Course', placeholder: 'e.g. B.Tech CSE, 2nd year', autoComplete: 'off', maxLength: 100 },
];

const RULES = {
  teamName: (v) => v.length >= 2 || 'Enter your team name.',
  college: (v) => v.length >= 3 || 'Enter your college name.',
  name: (v) => v.length >= 2 || 'Enter the member\u2019s full name.',
  phone: (v) => {
    let d = v.replace(/\D/g, '');
    if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
    return /^[6-9]\d{9}$/.test(d) || 'Enter a valid 10-digit mobile number.';
  },
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Enter a valid email address.',
  course: (v) => v.length >= 2 || 'Enter the course.',
};

const emptyMember = () => ({ name: '', phone: '', email: '', course: '' });
const initialMembers = () => Array.from({ length: MIN_MEMBERS }, emptyMember);
const idOf = (key) => key.replace(/\./g, '-');

function Field({ def, id, value, error, onChange, onBlur }) {
  return (
    <div className={`field${def.half ? ' half' : ''}${error ? ' bad' : ''}`}>
      <label htmlFor={id}>{def.label}</label>
      <input
        id={id}
        type={def.type || 'text'}
        inputMode={def.inputMode}
        autoComplete={def.autoComplete}
        placeholder={def.placeholder}
        maxLength={def.maxLength}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={`${id}-err`}
      />
      <p className="msg" id={`${id}-err`}>{error || ''}</p>
    </div>
  );
}

export default function RegistrationForm({ onClose, closeLabel }) {
  const [team, setTeam] = useState({ teamName: '', college: '' });
  const [members, setMembers] = useState(initialMembers);
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const ruleFor = (key) => (key.startsWith('members.') ? key.split('.')[2] : key);
  const check = (key, value) => {
    const r = RULES[ruleFor(key)](value.trim());
    return r === true ? '' : r;
  };
  const setError = (key, msg) => setErrors((er) => ({ ...er, [key]: msg }));

  const changeTeam = (key) => (e) => {
    const v = e.target.value;
    setTeam((t) => ({ ...t, [key]: v }));
    if (errors[key]) setError(key, check(key, v));
  };
  const changeMember = (i, f) => (e) => {
    const v = e.target.value;
    const key = `members.${i}.${f}`;
    setMembers((ms) => ms.map((m, idx) => (idx === i ? { ...m, [f]: v } : m)));
    if (errors[key]) setError(key, check(key, v));
  };

  const clearMemberErrors = () =>
    setErrors((er) => Object.fromEntries(Object.entries(er).filter(([k]) => !k.startsWith('members'))));
  const addMember = () => {
    if (members.length >= MAX_MEMBERS) return;
    setMembers((ms) => [...ms, emptyMember()]);
    clearMemberErrors();
  };
  const removeMember = (i) => {
    setMembers((ms) => ms.filter((_, idx) => idx !== i));
    clearMemberErrors();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner('');

    const keys = [
      ...TEAM_FIELDS.map((f) => f.key),
      ...members.flatMap((_, i) => MEMBER_FIELDS.map((f) => `members.${i}.${f.key}`)),
    ];
    const valueOf = (key) => {
      if (!key.startsWith('members.')) return team[key];
      const [, i, f] = key.split('.');
      return members[i][f];
    };
    const found = {};
    keys.forEach((k) => {
      const msg = check(k, valueOf(k));
      if (msg) found[k] = msg;
    });

    // Validate duplicate contact details among team members
    const seenEmails = new Set();
    const seenPhones = new Set();
    members.forEach((m, i) => {
      const em = m.email.trim().toLowerCase();
      const ph = m.phone.trim().replace(/\D/g, '').slice(-10);
      if (em) {
        if (seenEmails.has(em)) {
          found[`members.${i}.email`] = 'Duplicate email: Each member must have a distinct email.';
        }
        seenEmails.add(em);
      }
      if (ph.length === 10) {
        if (seenPhones.has(ph)) {
          found[`members.${i}.phone`] = 'Duplicate phone: Each member must have a distinct phone number.';
        }
        seenPhones.add(ph);
      }
    });

    setErrors(found);
    const firstBad = keys.find((k) => found[k]);
    if (firstBad) {
      document.getElementById(idOf(firstBad))?.focus();
      return;
    }

    const payload = {
      teamName: team.teamName.trim(),
      college: team.college.trim(),
      members: members.map((m) => ({ name: m.name.trim(), phone: m.phone.trim(), email: m.email.trim(), course: m.course.trim() })),
    };

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}${SIGNUP_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSubmitted({
          ...payload,
          id: data.id,
          registrationCode: data.registrationCode || (data.team && data.team.registrationCode) || 'CONFIRMED',
          createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        });
      } else {
        const serverErrors = data.errors || {};
        setErrors(serverErrors);
        setBanner(data.message || 'Could not register. Please try again.');
        const firstServerBad = keys.find((k) => serverErrors[k]);
        if (firstServerBad) document.getElementById(idOf(firstServerBad))?.focus();
      }
    } catch {
      setBanner('Could not reach the server. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setTeam({ teamName: '', college: '' });
    setMembers(initialMembers());
    setErrors({});
    setBanner('');
    setSubmitted(null);
  };

  const copyDetails = async () => {
    if (!submitted) return;
    const text = [
      `QBIT'26 Registration Pass`,
      `Pass Code: ${submitted.registrationCode}`,
      `Team Name: ${submitted.teamName}`,
      `College: ${submitted.college}`,
      `Members:`,
      ...submitted.members.map((m, i) => `  ${i + 1}. ${m.name} (${m.phone}, ${m.email}) - ${m.course}`),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      alert('Registration pass copied to clipboard!');
    } catch {
      // fallback
    }
  };

  if (submitted) {
    return (
      <section className="card done" role="status" aria-live="polite">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="tick" aria-hidden="true" style={{ margin: 0 }}>&#10003;</div>
            <div>
              <h2 style={{ margin: 0 }}>Registration Confirmed!</h2>
              <p style={{ margin: 0, fontSize: '.88rem', color: 'var(--sub)' }}>Quizzers' Club NIT Bhopal &middot; QBIT'26</p>
            </div>
          </div>
          {submitted.registrationCode && (
            <div style={{
              background: '#EFF6FF',
              border: '2px solid #2563EB',
              borderRadius: 12,
              padding: '6px 14px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '.75rem', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '.05em', display: 'block' }}>Pass Code</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E3A8A', fontFamily: 'monospace' }}>{submitted.registrationCode}</span>
            </div>
          )}
        </div>

        <div style={{
          marginTop: 18,
          padding: '12px 16px',
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: 12,
          fontSize: '.88rem',
          color: '#166534'
        }}>
          <strong>Important:</strong> Please save or print this registration slip. Your team will need this Pass Code at the check-in desk at MANIT Bhopal.
        </div>

        <dl style={{ marginTop: 16 }}>
          <div className="row"><dt>Team name</dt><dd>{submitted.teamName}</dd></div>
          <div className="row"><dt>College</dt><dd>{submitted.college}</dd></div>
          {submitted.registrationCode && (
            <div className="row"><dt>Pass Code</dt><dd style={{ color: '#2563EB' }}>{submitted.registrationCode}</dd></div>
          )}
        </dl>

        <h3 style={{ margin: '20px 0 8px', fontSize: '.95rem', fontWeight: 600 }}>Team Members (4)</h3>
        {submitted.members.map((m, i) => (
          <div className="summary-member" key={i}>
            <p className="who">{`Member ${i + 1}`}: {m.name}</p>
            <p>{m.phone} &middot; {m.email}</p>
            <p>{m.course}</p>
          </div>
        ))}

        <div className="no-print" style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <button className="alt" type="button" onClick={() => window.print()} style={{ background: '#2563EB', color: '#fff', border: 'none' }}>
            Print / Save Pass (PDF)
          </button>
          <button className="alt" type="button" onClick={copyDetails}>
            Copy Details
          </button>
          <button className="alt" type="button" onClick={reset}>
            Register another team
          </button>
          {onClose && <button className="alt" type="button" onClick={onClose}>{closeLabel || 'Back to Website'}</button>}
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Register your team</h2>
      {banner && <p className="banner" role="alert">{banner}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <h3 className="sec">Team</h3>
        <div className="grid">
          {TEAM_FIELDS.map((f) => (
            <Field
              key={f.key}
              def={f}
              id={f.key}
              value={team[f.key]}
              error={errors[f.key]}
              onChange={changeTeam(f.key)}
              onBlur={(e) => setError(f.key, check(f.key, e.target.value))}
            />
          ))}
        </div>

        <h3 className="sec">Members <span>All 4 members required</span></h3>
        {members.map((m, i) => (
          <div className="member" role="group" aria-label={`Member ${i + 1}`} key={i}>
            <div className="mhead">
              <span className="num" aria-hidden="true">{i + 1}</span>
              <span className="mtitle">{`Member ${i + 1}`}</span>
            </div>
            <div className="grid">
              {MEMBER_FIELDS.map((f) => {
                const key = `members.${i}.${f.key}`;
                return (
                  <Field
                    key={key}
                    def={f}
                    id={idOf(key)}
                    value={m[f.key]}
                    error={errors[key]}
                    onChange={changeMember(i, f.key)}
                    onBlur={(e) => setError(key, check(key, e.target.value))}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {errors.members && <p className="msg">{errors.members}</p>}

        <button className="go" type="submit" disabled={submitting}>
          {submitting ? 'Registering...' : 'Register team'}
        </button>
      </form>
    </section>
  );
}