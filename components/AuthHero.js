import BrandLogo from './BrandLogo';

const content = {
  login: {
    eyebrow: 'Rangsit Social',
    title: 'Campus life, in one place.',
    description: 'Share updates, follow classmates, and stay connected to the Rangsit community.',
    points: ['A focused campus feed', 'Real student profiles', 'Photos, videos, and conversations']
  },
  signup: {
    eyebrow: 'Join the community',
    title: 'Your campus network starts here.',
    description: 'Create an account, build your profile, and start connecting with students across campus.',
    points: ['Create your secure account', 'Complete your student profile', 'Post, follow, and participate']
  },
  recovery: {
    eyebrow: 'Account access',
    title: 'Get back to your community.',
    description: 'Use the account access options available for your Rangsit Social account.',
    points: ['Private by default', 'Clear account guidance', 'Secure sign-in flow']
  }
};

export default function AuthHero({ mode = 'login' }) {
  const item = content[mode] || content.login;

  return (
    <section className="auth-hero" aria-labelledby="auth-hero-title">
      <div className="relative z-10">
        <BrandLogo dark />
        <p className="mt-12 text-xs font-semibold uppercase tracking-[0.24em] text-foreground-inverse/70">
          {item.eyebrow}
        </p>
        <h2 id="auth-hero-title" className="mt-4 max-w-xl text-4xl font-bold leading-tight tracking-[-0.035em] text-foreground-inverse md:text-5xl">
          {item.title}
        </h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-foreground-inverse/80 md:text-lg">
          {item.description}
        </p>
      </div>

      <ul className="relative z-10 mt-10 grid gap-3" aria-label="Rangsit Social benefits">
        {item.points.map((point, index) => (
          <li key={point} className="flex items-center gap-3 text-sm font-medium text-foreground-inverse/90">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground-inverse/10 text-xs" aria-hidden="true">
              {index + 1}
            </span>
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
}
