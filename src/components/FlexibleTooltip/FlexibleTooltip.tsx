import * as React from "react";

// Styles
import styles from "./styles.module.scss";

// Component
const FlexibleTooltip = ({
  tipText,
  children,
}: {
  tipText: string;
  children: React.ReactNode;
}) => {
  // References
  const textRef = React.useRef<HTMLElement | null>(null);
  const tipRef = React.useRef<HTMLElement | null>(null);

  // Pieces of state
  const [isTextHovered, setIsTextHovered] = React.useState(false);
  const [tip, setTip] = React.useState({
    position: "above",
    style: {},
  });

  // Layout effects
  React.useLayoutEffect(() => {
    if (!textRef.current || !tipRef.current) return;

    // Rects
    const text = textRef.current.getBoundingClientRect();
    const tip = tipRef.current.getBoundingClientRect();

    // Position
    const isTipAbove = tip.height <= text.top;
    setTip({
      position: isTipAbove ? "above" : "below",
      style: {
        left: text.left + text.width / 2 - tip.width / 2,
        top: isTipAbove
          ? text.top - text.height - tip.height
          : text.bottom + text.height,
      },
    });
  }, [isTextHovered]);

  // Effects
  React.useEffect(() => {
    const handleScroll = () => setIsTextHovered(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <span className={styles["c-flexible-tooltip"]}>
      <span
        className={styles.text}
        ref={textRef}
        onMouseEnter={() => setIsTextHovered(true)}
        onMouseLeave={() => setIsTextHovered(false)}
      >
        {children}
      </span>
      {isTextHovered && (
        <span
          className={`${styles.tip} ${styles["tip--" + tip.position]}`}
          style={tip.style}
          ref={tipRef}
        >
          {tipText}
        </span>
      )}
    </span>
  );
};

export default FlexibleTooltip;
