import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

const CelebrateConfetti = () => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isActive) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min, max) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          setIsActive(false);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          zIndex: 0,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          zIndex: 0,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    }
  }, [isActive]);

  return null;
};

export default CelebrateConfetti; 