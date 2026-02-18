import { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";

interface TooltipProps {
  text: string;
  children?: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  size?: number;
}

export const Tooltip = ({
  text,
  children,
  position = "top",
  size = 14,
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      const t = triggerRef.current.getBoundingClientRect();
      const tip = tooltipRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (position) {
        case "top":
          top = t.top - tip.height - 8;
          left = t.left + t.width / 2 - tip.width / 2;
          break;
        case "bottom":
          top = t.bottom + 8;
          left = t.left + t.width / 2 - tip.width / 2;
          break;
        case "left":
          top = t.top + t.height / 2 - tip.height / 2;
          left = t.left - tip.width - 8;
          break;
        case "right":
          top = t.top + t.height / 2 - tip.height / 2;
          left = t.right + 8;
          break;
      }

      left = Math.max(8, Math.min(left, window.innerWidth - tip.width - 8));
      top = Math.max(8, top);

      setCoords({ top, left });
    }
  }, [visible, position]);

  return (
    <span className="inline-flex items-center">
      <span
        ref={triggerRef}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="inline-flex items-center cursor-help text-gray-300 dark:text-neutral-600 hover:text-gray-400 dark:hover:text-neutral-500 transition-colors"
      >
        {children || <HelpCircle size={size} />}
      </span>

      {visible && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] px-3 py-2 text-xs font-medium text-white bg-gray-900 dark:bg-neutral-700 rounded-lg shadow-xl max-w-[260px] leading-relaxed pointer-events-none"
          style={{
            top: coords.top,
            left: coords.left,
            animation: "tooltipFadeIn 0.15s ease-out",
          }}
        >
          {text}
        </div>
      )}

      <style>{`
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </span>
  );
};
