// AIネットワーク風の細い線 — 一度だけ描画されるSVGライン演出
export const HeroNetworkLines = () => {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="rgba(159, 224, 255, 0.35)"
        strokeWidth="1"
        strokeLinecap="round"
      >
        <path className="hero-net-line" d="M 60 820 L 340 620 L 520 700" style={{ animationDelay: "0.3s" }} />
        <path className="hero-net-line" d="M 940 180 L 700 320 L 560 260" style={{ animationDelay: "0.6s" }} />
        <path className="hero-net-line" d="M 880 760 L 660 640 L 640 820" style={{ animationDelay: "0.9s" }} />
      </g>
      <g fill="#9be9ff">
        <circle className="hero-net-node" cx="340" cy="620" r="3" style={{ animationDelay: "1.1s" }} />
        <circle className="hero-net-node" cx="520" cy="700" r="2.5" style={{ animationDelay: "1.3s" }} />
        <circle className="hero-net-node" cx="700" cy="320" r="3" style={{ animationDelay: "1.5s" }} />
        <circle className="hero-net-node" cx="560" cy="260" r="2.5" style={{ animationDelay: "1.7s" }} />
        <circle className="hero-net-node" cx="660" cy="640" r="3" style={{ animationDelay: "1.9s" }} />
      </g>
    </svg>
  );
};
