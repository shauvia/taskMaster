export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="spinner-wrap" aria-busy="true" aria-live="polite">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}

// accessibility attributes:
//aria-busy="true" - indicates that the content is loading and not ready for interaction
//aria-live="polite" - tells assistive technologies (screen readers) to announce updates to the content in a non-interruptive way,
//  which is appropriate for loading states.
