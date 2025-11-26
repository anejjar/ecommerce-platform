'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endDate: Date;
  text?: string;
}

export function CountdownTimer({ endDate, text }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(endDate).getTime() - new Date().getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.expired) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Clock className="h-5 w-5" />
        <span className="font-semibold">{text || 'Limited Time Offer!'}</span>
      </div>
      <div className="flex justify-center gap-4">
        {timeLeft.days > 0 && (
          <TimeUnit value={timeLeft.days} label="Days" />
        )}
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Min" />
        <TimeUnit value={timeLeft.seconds} label="Sec" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/20 backdrop-blur-sm rounded px-3 py-2 min-w-[50px] text-center">
        <span className="text-2xl font-bold">{value.toString().padStart(2, '0')}</span>
      </div>
      <span className="text-xs mt-1 opacity-90">{label}</span>
    </div>
  );
}
