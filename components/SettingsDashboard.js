'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './Providers';
import { useTheme } from './ThemeProvider';
import { usePreferences } from './PreferencesProvider';
import Avatar from './ui/Avatar';
import Button from './ui/Button';
import Icon from './ui/Icon';
import Switch from './ui/Switch';
import { Card, SubtlePanel } from './ui/Card';
import { useToast } from './ui/Toast';

const sections = [
  { id: 'account', label: 'Account', icon: 'user' },
  { id: 'profile', label: 'Profile', icon: 'edit' },
  { id: 'privacy', label: 'Privacy', icon: 'eye' },
  { id: 'security', label: 'Security', icon: 'shield' },
  { id: 'appearance', label: 'Appearance', icon: 'appearance' },
  { id: 'accessibility', label: 'Accessibility', icon: 'accessibility' },
  { id: 'sessions', label: 'Sessions', icon: 'monitor' },
  { id: 'media', label: 'Media', icon: 'image' }
];

function displayName(user) {
  return [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'Rangsit student';
}

function SettingGroup({ title, description, children }) {
  return <Card className="p-card"><div className="border-b border-border pb-4"><h2 className="type-h3">{title}</h2>{description ? <p className="mt-1 text-sm text-foreground-secondary">{description}</p> : null}</div><div className="divide-y divide-border pt-2">{children}</div></Card>;
}

function StatusRow({ label, value, icon = 'check', tone = 'success' }) {
  return <div className="flex items-start gap-3 py-4"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-control ${tone === 'success' ? 'bg-success-subtle text-success' : 'bg-brand-subtle text-brand-strong'}`}><Icon name={icon} size="sm" /></span><div><p className="text-sm font-semibold text-foreground">{label}</p><p className="mt-0.5 text-sm text-foreground-secondary">{value}</p></div></div>;
}

export default function SettingsDashboard() {
  const { user, setUser } = useAuth();
  const { preference, setTheme } = useTheme();
  const { preferences, updatePreference, resetPreferences } = usePreferences();
  const { notify } = useToast();
  const router = useRouter();
  const [active, setActive] = useState('account');
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Unable to log out.');
      setUser(null);
      window.location.assign('/login');
    } catch (error) {
      notify(error.message, { tone: 'danger' });
      setLoggingOut(false);
    }
  }

  const content = {
    account: <SettingGroup title="Account information" description="The identity used to sign in to Rangsit Social."><StatusRow label="Email address" value={user?.email || 'Not available'} icon="mail" tone="brand" /><StatusRow label="Account status" value={user?.profile_completed ? 'Active with a completed campus profile' : 'Active — profile setup is still required'} /><div className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="text-sm font-semibold">Account access</p><p className="text-sm text-foreground-secondary">Account deletion and email changes require server-side verification and are not currently available.</p></div></div></SettingGroup>,
    profile: <SettingGroup title="Public profile" description="Manage the information other signed-in students can see."><div className="flex flex-col items-start gap-4 py-4 sm:flex-row sm:items-center"><Avatar src={user?.avatar} fallback={displayName(user)} alt={displayName(user)} size="lg" /><div className="min-w-0 flex-1"><p className="truncate font-semibold">{displayName(user)}</p><p className="truncate text-sm text-foreground-secondary">@{user?.username || 'profile-incomplete'}</p></div><Link href={user?.profile_completed ? '/profile/edit' : '/onboarding'} className="btn btn-outline w-full sm:w-auto">{user?.profile_completed ? 'Edit profile' : 'Finish setup'}</Link></div><StatusRow label="Profile visibility" value="Your profile is visible to signed-in Rangsit Social members." icon="users" tone="brand" /></SettingGroup>,
    privacy: <SettingGroup title="Privacy" description="A clear view of the privacy rules supported by the current platform."><StatusRow label="Member-only network" value="Profiles, posts, follower lists, and saved content require an authenticated account." icon="shield" /><StatusRow label="Birthday visibility" value="Your birthday is currently shown on your profile to signed-in members. Per-field visibility controls require future backend support." icon="calendar" tone="brand" /><StatusRow label="Saved posts" value="Saved posts are private to your account and are not displayed on your public profile." icon="bookmark" /></SettingGroup>,
    security: <SettingGroup title="Security" description="Authentication and account protection status."><StatusRow label="Secure authentication cookie" value="Your JWT session is stored in an HTTP-only cookie and cannot be read by browser scripts." icon="lock" /><StatusRow label="Password protection" value="Passwords are hashed before storage. Password changes and recovery require a verified recovery backend and are not currently enabled." icon="shield" tone="brand" /><div className="flex flex-col items-start justify-between gap-4 py-4 sm:flex-row sm:items-center"><div><p className="text-sm font-semibold">End this session</p><p className="text-sm text-foreground-secondary">Sign out on this browser immediately.</p></div><Button variant="danger" size="sm" className="w-full sm:w-auto" loading={loggingOut} loadingLabel="Signing out" onClick={logout}>Log out</Button></div></SettingGroup>,
    appearance: <SettingGroup title="Appearance" description="Theme preferences are saved in this browser."><div className="py-4"><p className="mb-3 text-sm font-semibold">Color theme</p><div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Color theme">{['light', 'dark'].map((theme) => <button key={theme} type="button" role="radio" aria-checked={preference === theme} onClick={() => setTheme(theme)} className={`rounded-card border p-4 text-left transition-colors ${preference === theme ? 'border-brand bg-brand-subtle' : 'border-border bg-surface-muted hover:border-border-strong'}`}><span className="flex items-center gap-2 font-semibold capitalize"><Icon name={theme === 'dark' ? 'moon' : 'sun'} />{theme}</span><span className="mt-1 block text-sm text-foreground-secondary">{theme === 'dark' ? 'Dim surfaces for low-light use.' : 'Bright surfaces with crisp contrast.'}</span></button>)}</div></div></SettingGroup>,
    accessibility: <SettingGroup title="Accessibility" description="These preferences change the interface on this device."><Switch checked={preferences.reduceMotion} onChange={(value) => updatePreference('reduceMotion', value)} label="Reduce motion" description="Minimize transitions, animated feedback, and shimmer effects." /><Switch checked={preferences.highContrast} onChange={(value) => updatePreference('highContrast', value)} label="Increase contrast" description="Strengthen borders and secondary text contrast." /><div className="py-4"><p className="text-sm font-semibold">Text size</p><p className="mb-3 text-sm text-foreground-secondary">Increase the base interface text without browser zoom.</p><div className="flex gap-2" role="radiogroup" aria-label="Text size">{[['default', 'Default'], ['large', 'Large']].map(([value, label]) => <button key={value} type="button" role="radio" aria-checked={preferences.textSize === value} onClick={() => updatePreference('textSize', value)} className={preferences.textSize === value ? 'btn btn-primary' : 'btn btn-outline'}>{label}</button>)}</div></div><div className="py-4"><Button variant="ghost" size="sm" onClick={() => { resetPreferences(); notify('Device preferences reset.'); }}>Reset device preferences</Button></div></SettingGroup>,
    sessions: <SettingGroup title="Sessions" description="Session visibility supported by the current JWT authentication system."><div className="flex flex-col items-stretch justify-between gap-4 py-4 sm:flex-row sm:items-start"><div className="flex gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-success-subtle text-success"><Icon name="monitor" /></span><div><p className="text-sm font-semibold">This browser</p><p className="text-sm text-foreground-secondary">Current active session · expires within seven days of login</p><span className="mt-2 inline-flex rounded-pill bg-success-subtle px-2.5 py-1 text-xs font-semibold text-success">Current session</span></div></div><Button variant="outline" size="sm" loading={loggingOut} onClick={logout}>Sign out</Button></div><div className="py-4"><p className="text-sm font-semibold">Other devices</p><p className="mt-1 text-sm text-foreground-secondary">The current backend does not store a session registry, so other sessions cannot be listed or revoked individually yet.</p></div></SettingGroup>,
    media: <SettingGroup title="Media" description="Playback and bandwidth preferences are stored on this device."><Switch checked={preferences.autoplayVideo} onChange={(value) => updatePreference('autoplayVideo', value)} label="Autoplay muted videos" description="Start videos silently when they appear in the feed." disabled={preferences.dataSaver} /><Switch checked={preferences.dataSaver} onChange={(value) => updatePreference('dataSaver', value)} label="Data saver" description="Avoid preloading video metadata and disable autoplay." /><StatusRow label="Upload quality" value="Post media is uploaded through Cloudinary using the original file selected on your device." icon="upload" tone="brand" /></SettingGroup>
  };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6"><p className="text-sm font-semibold text-brand-strong">Your account</p><h1 className="type-h1">Settings</h1><p className="mt-1 max-w-2xl text-sm text-foreground-secondary">Manage your profile, interface preferences, and the security options currently supported by Rangsit Social.</p></header>
      <div className="grid gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <Card as="nav" aria-label="Settings sections" className="h-fit overflow-hidden p-2 lg:sticky lg:top-[calc(var(--header-height)+1rem)]">
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-1">{sections.map((section) => <button key={section.id} type="button" onClick={() => setActive(section.id)} aria-pressed={active === section.id} className={`flex min-h-11 min-w-0 items-center gap-2 rounded-control px-3 py-2 text-left text-sm font-semibold transition-colors ${active === section.id ? 'bg-brand-subtle text-brand-strong' : 'text-foreground-secondary hover:bg-surface-muted hover:text-foreground'}`}><Icon name={section.icon} size="sm" className="shrink-0" /><span className="truncate">{section.label}</span></button>)}</div>
        </Card>
        <section aria-live="polite" aria-label={`${sections.find((section) => section.id === active)?.label} settings`}>{content[active]}</section>
      </div>
    </div>
  );
}
