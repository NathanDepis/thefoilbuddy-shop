'use client';

import Image from 'next/image';
import { useFormStatus } from 'react-dom';

function CheckoutSubmit({ label, redirectingLabel }: { label: string; redirectingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#9ED63A] text-[#0B3C5D] font-bold px-6 py-3.5 hover:shadow-[0_0_24px_rgba(158,214,58,0.4)] hover:scale-[1.01] transition disabled:opacity-70 disabled:scale-100"
      >
        {pending ? redirectingLabel : label}
      </button>
      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#091E2C]/95 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 text-center px-6">
            <Image
              src="/logo-icon.png"
              alt="The Foil Buddy"
              width={72}
              height={72}
              className="animate-pulse"
              priority
            />
            <div className="w-10 h-10 border-2 border-white/20 border-t-[#9ED63A] rounded-full animate-spin" />
            <div>
              <div className="text-white text-lg font-semibold mb-1">{redirectingLabel}</div>
              <div className="text-white/60 text-sm">Paiement sécurisé via Wix</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function CheckoutForm({
  action,
  label,
  redirectingLabel,
}: {
  action: () => Promise<void>;
  label: string;
  redirectingLabel: string;
}) {
  return (
    <form action={action}>
      <CheckoutSubmit label={label} redirectingLabel={redirectingLabel} />
    </form>
  );
}
