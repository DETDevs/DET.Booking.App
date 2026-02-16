import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";

interface SimpleTooltipProps {
  content: string;
  children: React.ReactNode;
  enabled?: boolean;
}

export const SimpleTooltip = ({
  content,
  children,
  enabled = true,
}: SimpleTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + rect.height / 2,
        left: rect.right + 12,
      });
    }
  }, []);

  useEffect(() => {
    if (isVisible) updatePosition();
  }, [isVisible, updatePosition]);

  if (!enabled) return <>{children}</>;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="fixed px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-md shadow-xl z-[9999] whitespace-nowrap pointer-events-none"
            style={{
              top: coords.top,
              left: coords.left,
              transform: "translateY(-50%)",
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
