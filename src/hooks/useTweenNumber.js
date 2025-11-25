import { useEffect, useRef, useState } from 'react';

const easings = {
  easeOutCubic: t => 1 - Math.pow(1 - t, 3),
};

export function useTweenNumber(target, { from = 0, duration = 1000, easing = 'easeOutCubic' } = {}) {
  const [value, setValue] = useState(from);
  const fromRef = useRef(from);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const fromVal = fromRef.current;
    const ease = easings[easing] || easings.easeOutCubic;

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const v = fromVal + (target - fromVal) * ease(t);
      setValue(v);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  // Only restart when the target changes
  }, [target, duration, easing]);

  // update fromRef when animation completes
  useEffect(() => {
    fromRef.current = value;
  }, [value]);

  return value;
}
