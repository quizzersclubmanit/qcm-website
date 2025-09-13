import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from "react-redux"
import Button from './Button';

export default function PageLoadPoster() {
  const [open, setOpen] = useState(false);
  const { data, loggedIn } = useSelector((state) => state.user)
  const dialogRef = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => setOpen(true), 300);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function close() {
    setOpen(false);
  }
  if (loggedIn || !open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity" aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl rounded-2xl max-h-[90%] shadow-xl overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(10px) saturate(120%)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        <button
          onClick={close}
          className="absolute right-3 top-3 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform"
          aria-label="Close poster"
          title="Close"
          style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="flex flex-col md:flex-row gap-3 items-center justify-center p-6 overflow-y-auto">
          <div className="flex-shrink-0 w-full md:w-1/2 flex items-center justify-center">
            <img
              className="w-full md:w-auto max-w-sm md:max-w-md h-auto object-contain rounded-lg shadow-lg max-h-[70vh] md:max-h-[75vh]"
              src="https://res.cloudinary.com/dajbfxkin/image/upload/v1757754585/WhatsApp_Image_2025-09-13_at_14.26.11_6830c8e9_ivv3b9.jpg"
              alt="poster"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center gap-4 px-0">
            <div className="text-center md:text-left">
              <h2 className="text-lg md:text-xl font-bold text-white mb-2">Join Our Exclusive Event!</h2>
              <p className="text-xs text-white/70 italic">Limited seats — register now</p>
            </div>

            <div className="flex gap-3 mt-1">
              <Button className="px-5 py-2 rounded-lg shadow-lg text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transform transition-all">
                Register
              </Button>

              <Button onClick={close} className="px-4 py-2 rounded-lg border border-white/10 bg-transparent text-white/90">
                Maybe later
              </Button>
            </div>
            
            <p className="text-[10px] text-white/50 mt-2">Press Esc or click the X to dismiss.</p>
          </div>
        </div>
      </div>
    </div>
  );
}