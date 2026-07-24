import AuthHero from '@/components/AuthHero';
import RecoveryForm from '@/components/RecoveryForm';

export default function ForgotPasswordPage() {
  return (
    <div className="auth-layout">
      <div className="order-2 lg:order-1"><AuthHero mode="recovery" /></div>
      <div className="order-1 flex items-center justify-center lg:order-2"><RecoveryForm /></div>
    </div>
  );
}
