import React, { useEffect, useRef } from 'react';
import Button from './Button';
import { FaWhatsapp, FaDownload } from 'react-icons/fa';

export default function RegistrationSuccess({ open, setOpen }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function close() { setOpen(false); }

  function handleWhatsapp() { window.open('https://whatsapp.com/channel/0029Vaj1E2e7DAWvNkgDhy2O', '_blank'); setOpen(false); }
  function handleDownload() {
    const link = document.createElement('a');
    link.href = '/SampleQuestionsIQC.pdf';
    link.download = 'IQC_2025_Sample_Questions.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpen(false);
  }

  if (!open) return null;

  /*
    Glassy card with colored CTAs:
    - WhatsApp button: green gradient
    - Download button: blue gradient
    Buttons keep full width, slightly rounded, with subtle shadow and hover transform.
  */

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
        style={{
          maxHeight: '88vh',
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(10px) saturate(110%)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        {/* glassy close button overlapping the card */}
        <button
          onClick={close}
          aria-label="Close"
          title="Close"
          className="absolute top-3 right-3 z-40 w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            color: 'white',
            boxShadow: '0 6px 18px rgba(0,0,0,0.35)'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Card interior uses the same frosted look but with inner padding */}
        <div className="p-6 flex flex-col items-center gap-4" style={{ minHeight: 0 }}>

          {/* Video - 3:2 aspect ratio */}
          <div className="w-full rounded-md overflow-hidden shadow-inner" style={{ width: '100%' }}>
            <div style={{ position: 'relative', width: '100%', paddingTop: '66.6667%' }}>
              <iframe
                src="https://www.youtube.com/embed/ZhvfIklHY0w?autoplay=1&mute=1&controls=0"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white">Registration Successful!</h3>
            <p className="text-sm text-white/80 mt-1">Welcome to QCM</p>
          </div>

          {/* Buttons: colored gradients */}
          <div className="w-full flex flex-col gap-3" style={{ flexShrink: 0 }}>
            <Button
              className="w-full px-4 py-2 rounded-md text-white font-medium flex items-center justify-center gap-2 transform transition-all shadow-md"
              onClick={handleWhatsapp}
              style={{ background: 'linear-gradient(90deg,#25D366,#128C7E)' }}
            >
              <FaWhatsapp />
              <span>Join WhatsApp</span>
            </Button>

            <Button
              className="w-full px-4 py-2 rounded-md text-white font-medium flex items-center justify-center gap-2 transform transition-all shadow-md"
              onClick={handleDownload}
              style={{ background: 'linear-gradient(90deg,#4F46E5,#2563EB)' }}
            >
              <FaDownload />
              <span>Download Sample Questions Booklet</span>
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
