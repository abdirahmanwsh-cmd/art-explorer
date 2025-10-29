import { useEffect } from "react";

function Checkout({ onContinue }) {
  useEffect(() => {
    
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 text-center">
      <h1 className="text-2xl font-semibold text-white">Thank you for your order</h1>
      <p className="mt-3 text-neutral-300">
        Your purchase has been received. A confirmation would normally be emailed.
      </p>

      <div className="mt-8">
        <button
          onClick={onContinue}
          className="rounded-lg bg-neutral-100 text-neutral-900 px-5 py-2.5 font-medium hover:bg-white"
        >
          Continue shopping
        </button>
      </div>
    </main>
  );
}

// Export
export default Checkout;