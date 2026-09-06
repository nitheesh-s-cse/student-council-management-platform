// Fixed ambient background layer shared by all routed pages.
// Sits behind everything (z-index below content) and is purely decorative.
// Subtle orange/red orbs + faint dot pattern, consistent with the brand.
export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Upper-left warm orange glow */}
      <div
        className="bg-glow bg-glow-orange bg-glow-lg"
        style={{ left: "-6%", top: "-10%" }}
      />
      {/* Upper-right soft red glow */}
      <div
        className="bg-glow bg-glow-red bg-glow-md"
        style={{ right: "-4%", top: "4%" }}
      />
      {/* Mid-page faint warm bloom */}
      <div
        className="bg-glow bg-glow-warm bg-glow-lg"
        style={{ left: "12%", top: "46%", opacity: 0.6 }}
      />
      {/* Bottom-left orange accent */}
      <div
        className="bg-glow bg-glow-orange bg-glow-sm"
        style={{ left: "-2%", bottom: "6%", opacity: 0.5 }}
      />
      {/* Bottom-right red accent */}
      <div
        className="bg-glow bg-glow-red bg-glow-sm"
        style={{ right: "-2%", bottom: "-4%", opacity: 0.55 }}
      />
      {/* Faint top dot pattern */}
      <div className="background-pattern" />
    </div>
  );
}