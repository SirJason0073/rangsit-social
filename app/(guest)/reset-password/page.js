import AccountAccessNotice from '@/components/AccountAccessNotice';
import AuthHero from '@/components/AuthHero';

export default function ResetPasswordPage() {
  return (
    <div className="auth-layout">
      <div className="order-2 lg:order-1"><AuthHero mode="recovery" /></div>
      <div className="order-1 flex items-center justify-center lg:order-2">
        <AccountAccessNotice
          eyebrow="Password reset"
          title="Reset link unavailable"
          description="Password reset requires a verified, server-generated token. Automatic reset links are not enabled for this deployment."
        />
      </div>
    </div>
  );
}
