import AccountAccessNotice from '@/components/AccountAccessNotice';
import AuthHero from '@/components/AuthHero';

export default function VerifyEmailPage() {
  return (
    <div className="auth-layout">
      <div className="order-2 lg:order-1"><AuthHero mode="recovery" /></div>
      <div className="order-1 flex items-center justify-center lg:order-2">
        <AccountAccessNotice
          eyebrow="Email verification"
          title="Verification is not required"
          description="Rangsit Social currently uses email and password authentication without an email-verification step."
        />
      </div>
    </div>
  );
}
