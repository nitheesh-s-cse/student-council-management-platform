// Global layered ambient background system.
// Sits fixed behind all content (pointer-events: none, z-index -10).
// Creates a subtle, warm, modern, slightly dynamic institutional atmosphere
// with low-opacity orange/red ambient glows and a faint geometric pattern.
export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Upper-left subtle warm orange radial glow */}
      <div
        className="background-glow background-glow-orange bg-glow-lg"
        style={{ left: "-6%", top: "-10%" }}
      />
      {/* Upper-right soft red radial glow */}
      <div
        className="background-glow background-glow-red bg-glow-md"
        style={{ right: "-4%", top: "4%" }}
      />
      {/* Mid-page faint warm bloom */}
      <div
        className="background-glow background-glow-warm bg-glow-lg"
        style={{ left: "12%", top: "44%", opacity: 0.7 }}
      />
      {/* Mid-right gentle orange arc */}
      <div
        className="background-glow background-glow-orange bg-glow-md"
        style={{ right: "6%", top: "62%", opacity: 0.55 }}
      />
      {/* Bottom-left subtle orange accent */}
      <div
        className="background-glow background-glow-orange bg-glow-sm"
        style={{ left: "-2%", bottom: "4%", opacity: 0.5 }}
      />
      {/* Bottom-right soft red accent */}
      <div
        className="background-glow background-glow-red bg-glow-sm"
        style={{ right: "-2%", bottom: "-4%", opacity: 0.5 }}
      />
      {/* Faint geometric dot pattern with soft radial mask */}
      <div className="background-pattern" />
    </div>
  );
}