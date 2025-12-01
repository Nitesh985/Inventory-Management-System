export function Loader({
  size = 96,
  primary = "#2563eb",
  secondary = "#06b6d4",
  speed = 1.2,
  ariaLabel = "Loading inventory",
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={ariaLabel}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor={primary} stopOpacity="0.95" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.95" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* base pallets */}
      <g transform="translate(10,60)">
        <rect x="0" y="0" width="80" height="6" rx="1" fill="#111827" opacity="0.06" />
        <rect x="0" y="7" width="80" height="6" rx="1" fill="#111827" opacity="0.04" />
      </g>

      {/* stacked boxes - left */}
      <g transform="translate(14,30)">
        <g filter="url(#shadow)">
          <rect x="0" y="18" width="26" height="18" rx="2" fill="url(#g1)">
            <animate attributeName="y" values="18;16;18" dur={`${speed}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.86;1" dur={`${speed}s`} repeatCount="indefinite" />
          </rect>
          <rect x="-4" y="0" width="34" height="14" rx="2" fill={primary}>
            <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0;0 -3;0 0" dur={`${speed}s`} repeatCount="indefinite" />
          </rect>
        </g>
        {/* barcode lines on front box */}
        <g transform="translate(6,22)" fill="#fff" opacity="0.9">
          <rect x="0" y="1" width="2" height="8" />
          <rect x="4" y="1" width="1" height="8" />
          <rect x="7" y="1" width="2" height="8" />
        </g>
      </g>

      {/* stacked boxes - right */}
      <g transform="translate(54,36)">
        <rect x="0" y="14" width="28" height="22" rx="2" fill={secondary}>
          <animate attributeName="x" values="0;1.6;0" dur={`${speed}s`} repeatCount="indefinite" />
        </rect>
        <rect x="2" y="16" width="24" height="6" rx="1" fill="#fff" opacity="0.12">
          <animate attributeName="width" values="24;18;24" dur={`${speed}s`} repeatCount="indefinite" />
        </rect>
      </g>

      {/* floating scan beam */}
      <g>
        <rect x="10" y="42" width="80" height="6" rx="3" fill={primary} opacity="0.06" />
        <rect x="-40" y="42" width="28" height="6" rx="3" fill={primary} opacity="0.18">
          <animate attributeName="x" values="-40;120" dur={`${speed * 1.4}s`} repeatCount="indefinite" />
        </rect>
      </g>

      {/* subtle center label */}
      <text x="50" y="92" fontSize="6" fontFamily="Inter, Arial, sans-serif" fill="#374151" textAnchor="middle">
        Inventory loading...
      </text>
    </svg>
  );
}

export function CoolInventoryLoader({
  size = 128,
  primary = "#8b5cf6",
  accent = "#06b6d4",
  speed = 2,
  ariaLabel = "Processing inventory",
}) {
  // A cooler loader — conveyor with moving boxes and rotating cog
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      role="img"
      aria-label={ariaLabel}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cg" x1="0" x2="1">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feBlend in="SourceGraphic" in2="b" />
        </filter>
      </defs>

      {/* conveyor base */}
      <g transform="translate(10,70)">
        <rect x="0" y="20" width="120" height="10" rx="3" fill="#0f172a" opacity="0.08" />
        <rect x="0" y="26" width="120" height="6" rx="2" fill="#0b1220" opacity="0.04" />
      </g>

      {/* moving boxes group (will translate) */}
      <g>
        <g>
          <g transform="translate(0,42)">
            <g>
              {/* repeated box template, translated using animateTransform */}
              <g>
                <g>
                  <g transform="translate(-40,0)">
                    <rect x="0" y="0" width="20" height="14" rx="2" fill="url(#cg)" filter="url(#soft)">
                      <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0;160 0" dur={`${speed}s`} repeatCount="indefinite" />
                    </rect>
                    {/* barcode */}
                    <g transform="translate(4,3)" fill="#fff" opacity="0.9">
                      <rect x="0" y="0" width="1.6" height="8" />
                      <rect x="3" y="0" width="1" height="8" />
                      <rect x="6" y="0" width="1.6" height="8" />
                    </g>
                  </g>

                  {/* second copy, offset in time using pathOffset trick */}
                  <g transform="translate(-10,0)">
                    <rect x="0" y="0" width="20" height="14" rx="2" fill="url(#cg)" filter="url(#soft)">
                      <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0;160 0" dur={`${speed}s`} begin="-${speed / 2}s" repeatCount="indefinite" />
                    </rect>
                    <g transform="translate(4,3)" fill="#fff" opacity="0.9">
                      <rect x="0" y="0" width="1.6" height="8" />
                      <rect x="3" y="0" width="1" height="8" />
                      <rect x="6" y="0" width="1.6" height="8" />
                    </g>
                  </g>

                  {/* third copy */}
                  <g transform="translate(20,0)">
                    <rect x="0" y="0" width="20" height="14" rx="2" fill="url(#cg)" filter="url(#soft)">
                      <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0;160 0" dur={`${speed}s`} begin="-${speed / 3}s" repeatCount="indefinite" />
                    </rect>
                    <g transform="translate(4,3)" fill="#fff" opacity="0.9">
                      <rect x="0" y="0" width="1.6" height="8" />
                      <rect x="3" y="0" width="1" height="8" />
                      <rect x="6" y="0" width="1.6" height="8" />
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>

      {/* rotating cog on left */}
      <g transform="translate(22,86)">
        <g>
          <g>
            <circle cx="0" cy="0" r="10" fill="#0b1220" opacity="0.12" />
            <g transform="translate(0,0)">
              <g>
                <g>
                  <path d="M-6 -1 L-10 -3 L-10 3 L-6 1 Z" fill={primary} />
                  <path d="M6 -1 L10 -3 L10 3 L6 1 Z" fill={accent} />
                </g>
                <g>
                  <g>
                    <g>
                      <circle cx="0" cy="0" r="4" fill="none" stroke="#fff" strokeOpacity="0.06" />
                    </g>
                  </g>
                </g>
              </g>
              <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 0 0" to="360 0 0" dur={`${speed}s`} repeatCount="indefinite" />
            </g>
          </g>
        </g>
      </g>

      {/* text label */}
      <text x="70" y="128" fontSize="9" fontFamily="Inter, Arial, sans-serif" fill="#0f172a" textAnchor="middle" opacity="0.7">
        ...Please Wait
      </text>
    </svg>
  );
}



// Demo component that renders both loaders for quick preview
export default function InventoryLoader({loading, children}:{loading:boolean, children: React.ReactNode}) {
  if (!loading) return children
  
  return (
    <div className="flex justify-center items-center h-screen" >  
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>

      <div style={{ textAlign: "center" }}>
        <CoolInventoryLoader size={300} />
      </div>
    </div>
    </div>
  );
  
  
}
