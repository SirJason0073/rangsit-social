'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BrandLogo from '@/components/BrandLogo';
import RouteGuard from '@/components/RouteGuard';
import { useAuth } from '@/components/Providers';
import { uploadProfileImage } from '@/utils/upload-client';
import Button from '@/components/ui/Button';
import { Card, SubtlePanel } from '@/components/ui/Card';
import { FieldHint, FieldLabel, TextArea, TextInput } from '@/components/ui/Field';

export default function OnboardingPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    birthday: '',
    bio: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateForm() {
    if (!form.firstName.trim()) return 'First name is required.';
    if (!form.lastName.trim()) return 'Last name is required.';
    if (!/^[a-zA-Z0-9._]{3,30}$/.test(form.username.trim())) {
      return 'Username must be 3-30 characters and use only letters, numbers, dots, or underscores.';
    }
    if (!form.birthday) return 'Birthday is required.';
    if (form.bio.length > 255) return 'Bio must be 255 characters or fewer.';
    if (!avatarFile) return 'Profile image is required.';
    return '';
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError('');

    try {
      const uploadedAvatar = await uploadProfileImage(avatarFile);
      const payload = new FormData();
      payload.append('firstName', form.firstName);
      payload.append('lastName', form.lastName);
      payload.append('username', form.username);
      payload.append('birthday', form.birthday);
      payload.append('bio', form.bio);
      payload.append('avatarUrl', uploadedAvatar.url);

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        body: payload
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to complete onboarding.');
      }

      await refresh();
      router.push('/feed');
    } catch (err) {
      setError(err.message || 'Failed to complete onboarding.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <RouteGuard onboardingOnly>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] lg:items-start">
        <Card as="section" className="overflow-hidden p-0">
          <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-8 text-white">
            <BrandLogo compact />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200">
              Onboarding
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Build a profile people will recognize.
            </h1>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
              Add your name, username, birthday, bio, and profile image. This is what other students will see
              across the feed, comments, and follow lists.
            </p>
          </div>
          <div className="grid gap-4 p-6 text-sm text-slate-600">
            <div className="rounded-[24px] border border-slate-200/80 bg-white/80 p-4">
              <p className="font-semibold text-slate-950">What you can add now</p>
              <p className="mt-1 leading-6">A complete identity that carries across your posts and profile.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-white/80 p-4">
              <p className="font-semibold text-slate-950">Profile image rule</p>
              <p className="mt-1 leading-6">Image files only. Video is blocked here by design.</p>
            </div>
          </div>
        </Card>

        <Card as="form" onSubmit={handleSubmit} className="space-y-5 p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel>First name</FieldLabel>
              <TextInput
                className="mt-2"
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                required
              />
            </div>
            <div>
              <FieldLabel>Last name</FieldLabel>
              <TextInput
                className="mt-2"
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <FieldLabel>Username</FieldLabel>
            <TextInput
              className="mt-2"
              value={form.username}
              onChange={(e) => updateField('username', e.target.value)}
              required
            />
            <FieldHint>Use 3-30 letters, numbers, dots, or underscores.</FieldHint>
          </div>

          <div>
            <FieldLabel>Birthday</FieldLabel>
            <TextInput
              className="mt-2"
              type="date"
              value={form.birthday}
              onChange={(e) => updateField('birthday', e.target.value)}
              required
            />
          </div>

          <div>
            <FieldLabel>Bio</FieldLabel>
            <TextArea
              className="mt-2"
              value={form.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="Tell other students what you study, create, or care about."
            />
            <FieldHint>{form.bio.length}/255 characters</FieldHint>
          </div>

          <SubtlePanel className="rounded-[28px] border-dashed border-slate-300/80 p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <FieldLabel>Profile photo</FieldLabel>
                <p className="mt-1 text-sm text-slate-500">Upload a clear image from your device.</p>
              </div>
              <span className="badge">Image only</span>
            </div>
            <input className="input mt-2" type="file" accept="image/*" onChange={handleFileChange} required />
            {previewUrl && (
              <div className="mt-4 flex items-center gap-4 rounded-[24px] border border-slate-200 bg-white p-4">
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="h-24 w-24 rounded-[24px] border border-slate-200 object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Preview</p>
                  <p className="mt-1 text-sm text-slate-500">
                    This image will be used in your feed posts, comments, and profile header.
                  </p>
                </div>
              </div>
            )}
          </SubtlePanel>

          {error && <p className="text-sm text-rose-500">{error}</p>}

          <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-2">
            <p className="text-xs text-slate-400">You can update your profile later by extending the profile settings flow.</p>
            <Button disabled={loading}>
              {loading ? 'Saving...' : 'Finish setup'}
            </Button>
          </div>
        </Card>
      </div>
    </RouteGuard>
  );
}
