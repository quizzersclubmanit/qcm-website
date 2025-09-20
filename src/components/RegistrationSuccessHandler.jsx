import React, { useEffect, useState } from 'react';
import RegistrationSuccess from './RegistrationSuccess';

export default function RegistrationSuccessHandler() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasShownPopup = localStorage.getItem('registrationSuccessShown');
    if (hasShownPopup) {
      setShowPopup(true);
      localStorage.removeItem('registrationSuccessShown');
    }
  }, []);

  if (!showPopup) return null;

  return <RegistrationSuccess open={showPopup} setOpen={setShowPopup} />;
}
