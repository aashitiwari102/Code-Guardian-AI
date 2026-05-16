export function Blobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="blob"
        style={{
          width: 420,
          height: 420,
          background: "var(--brand-pink)",
          top: -120,
          left: -80,
        }}
      />
      <div
        className="blob"
        style={{
          width: 360,
          height: 360,
          background: "var(--brand-teal)",
          top: 80,
          right: -100,
        }}
      />
      <div
        className="blob"
        style={{
          width: 300,
          height: 300,
          background: "var(--brand-yellow)",
          bottom: -100,
          left: "30%",
        }}
      />
    </div>
  );
}