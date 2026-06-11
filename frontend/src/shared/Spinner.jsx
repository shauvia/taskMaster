export default function Spinner({ label = "Loading...", className = "" }) {
  return (
    <div
      className={`spinner-wrap ${className}`.trim()}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}
//The .trim() removes extra spaces if className is empty.

// A reusable, accessible loading indicator that:

// shows a spinning animation

// shows a customizable label

// allows extra CSS classes to be added

// announces loading state to screen readers

// accessibility attributes:
//aria-busy="true" - indicates that the content is loading and not ready for interaction
//aria-live="polite" - tells assistive technologies (screen readers) to announce updates to the content in a non-interruptive way,
//  which is appropriate for loading states.
