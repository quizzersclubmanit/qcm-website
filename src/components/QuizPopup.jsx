import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function QuizLivePoster({
  delay = 300,              
  quizPath = "/quiz/instr/0",      
  autoOpen = true,          
}) {
  const [open, setOpen] = useState(false);
  const { loggedIn } = useSelector((s) => s.user || {});
  const dialogRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date();
    const shouldOpen = autoOpen && now.getHours() === 16 && now.getMinutes() <= 5;
    
    const id = setTimeout(() => setOpen(true), delay);
    return () => clearTimeout(id);
  }, [autoOpen, delay]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
  }

  function handlePlay() {
    setOpen(false);
    navigate(quizPath);
  }

  if (!open || !loggedIn) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg rounded-2xl max-h-[90%] shadow-xl overflow-hidden flex flex-col justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(8px) saturate(120%)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <button
          onClick={close}
          className="absolute right-3 top-3 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform"
          aria-label="Close poster"
          title="Close"
          style={{ background: "rgba(0,0,0,0.6)", color: "white" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="p-6 flex flex-col gap-4 items-center text-center h-50">
          <h2 className="text-5xl md:text-4xl font-bold text-white overflow-hidden">Quiz is Live!</h2>
          <p className="text-sm text-white/80 max-w-[34rem]">
            The IQC 2025 Round 1 quiz is now live! This is your chance to test your knowledge and skills.
            <span className="font-semibold mx-1">Play Quiz</span> to join.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full justify-center">
            <Button
              onClick={handlePlay}
              className="px-6 py-2 rounded-lg shadow-lg text-xl text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transform transition-all w-full sm:w-auto"
            >
              Play Quiz
            </Button>

            <Button
              onClick={close}
              className="px-4 py-2 rounded-lg border border-white/10 bg-transparent text-white/90 w-full sm:w-auto"
            >
              Maybe later
            </Button>
          </div>

          <p className="text-[11px] text-white/50 mt-1">Press Esc or click the X to dismiss.</p>
        </div>
      </div>
    </div>
  );
}
