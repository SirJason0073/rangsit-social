'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BrandLogo from '@/components/BrandLogo';
import RouteGuard from '@/components/RouteGuard';
import { useAuth } from '@/components/Providers';
import { uploadProfileImage } from '@/utils/upload-client';
import Button from '@/components/ui/Button';
import { Card, SubtlePanel } from '@/components/ui/Card';
import { FieldError, FieldHint, FieldLabel, TextArea, TextInput, UploadControl } from '@/components/ui/Field';

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [uploadStep, setUploadStep] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
    setError('');
  }

  function validateForm() {
    const errors = {};
    if (!form.firstName.trim()) errors.firstName = 'Enter your first name.';
    if (!form.lastName.trim()) errors.lastName = 'Enter your last name.';
    if (!/^[a-zA-Z0-9._]{3,30}$/.test(form.username.trim())) {
      errors.username = 'Use 3-30 letters, numbers, dots, or underscores.';
    }
    if (!form.birthday) errors.birthday = 'Choose your birthday.';
    if (form.bio.length > 255) errors.bio = 'Keep your bio within 255 characters.';
    if (!avatarFile) errors.avatar = 'Choose a profile photo.';
    return errors;
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFieldErrors((prev) => ({ ...prev, avatar: 'Choose an image file.' }));
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFieldErrors((prev) => ({ ...prev, avatar: 'Choose an image smaller than 5 MB.' }));
      e.target.value = '';
      return;
    }
    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setAvatarFile(file);
    setFieldErrors((prev) => ({ ...prev, avatar: '' }));
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setFieldErrors(validationErrors);
      const firstField = Object.keys(validationErrors)[0];
      document.querySelector(`[name="${firstField}"]`)?.focus();
      return;
    }
    setLoading(true);
    setError('');
    setUploadStep('Uploading profile photo');
    setProgress(35);

    try {
      const uploadedAvatar = await uploadProfileImage(avatarFile);
      setUploadStep('Saving your profile');
      setProgress(75);
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
      setUploadStep('Profile ready');
      setProgress(100);
      router.push('/feed');
    } catch (err) {
      setError(err.message || 'Failed to complete onboarding.');
      setUploadStep('');
      setProgress(0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <RouteGuard onboardingOnly>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] lg:items-start">
        <Card as="section" className="overflow-hidden p-0">
          <div className="bg-gradient-to-br from-brand-strong via-brand to-accent p-8 text-foreground-inverse">
            <BrandLogo compact />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.26em] text-brand">
              Onboarding
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Build a profile people will recognize.
            </h1>
            <p className="mt-3 max-w-md text-sm leading-7 text-foreground-inverse/75">
              Add your name, username, birthday, bio, and profile image. This is what other students will see
              across the feed, comments, and follow lists.
            </p>
          </div>
          <div className="grid gap-4 p-6 text-sm text-foreground-secondary">
            <div className="rounded-panel border border-border bg-foreground-inverse/100 p-4">
              <p className="font-semibold text-foreground">What you can add now</p>
              <p className="mt-1 leading-6">A complete identity that carries across your posts and profile.</p>
            </div>
            <div className="rounded-panel border border-border bg-foreground-inverse/100 p-4">
              <p className="font-semibold text-foreground">Profile image rule</p>
              <p className="mt-1 leading-6">Image files only. Video is blocked here by design.</p>
            </div>
          </div>
        </Card>

        <Card as="form" onSubmit={handleSubmit} className="space-y-5 p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel htmlFor="onboarding-first-name">First name</FieldLabel>
              <TextInput
                id="onboarding-first-name"
                name="firstName"
                autoComplete="given-name"
                className="mt-2"
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                aria-invalid={!!fieldErrors.firstName}
                aria-describedby={fieldErrors.firstName ? 'onboarding-first-name-error' : undefined}
                disabled={loading}
                required
              />
              <FieldError id="onboarding-first-name-error">{fieldErrors.firstName}</FieldError>
            </div>
            <div>
              <FieldLabel htmlFor="onboarding-last-name">Last name</FieldLabel>
              <TextInput
                id="onboarding-last-name"
                name="lastName"
                autoComplete="family-name"
                className="mt-2"
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                aria-invalid={!!fieldErrors.lastName}
                aria-describedby={fieldErrors.lastName ? 'onboarding-last-name-error' : undefined}
                disabled={loading}
                required
              />
              <FieldError id="onboarding-last-name-error">{fieldErrors.lastName}</FieldError>
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="onboarding-username">Username</FieldLabel>
            <TextInput
              id="onboarding-username"
              name="username"
              autoComplete="username"
              className="mt-2"
              value={form.username}
              onChange={(e) => updateField('username', e.target.value)}
              aria-invalid={!!fieldErrors.username}
              aria-describedby={fieldErrors.username ? 'onboarding-username-error' : 'onboarding-username-hint'}
              disabled={loading}
              required
            />
            <FieldHint id="onboarding-username-hint">Use 3-30 letters, numbers, dots, or underscores.</FieldHint>
            <FieldError id="onboarding-username-error">{fieldErrors.username}</FieldError>
          </div>

          <div>
            <FieldLabel htmlFor="onboarding-birthday">Birthday</FieldLabel>
            <TextInput
              id="onboarding-birthday"
              name="birthday"
              className="mt-2"
              type="date"
              value={form.birthday}
              onChange={(e) => updateField('birthday', e.target.value)}
              aria-invalid={!!fieldErrors.birthday}
              aria-describedby={fieldErrors.birthday ? 'onboarding-birthday-error' : undefined}
              disabled={loading}
              required
            />
            <FieldError id="onboarding-birthday-error">{fieldErrors.birthday}</FieldError>
          </div>

          <div>
            <FieldLabel htmlFor="onboarding-bio">Bio</FieldLabel>
            <TextArea
              id="onboarding-bio"
              name="bio"
              className="mt-2"
              value={form.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              maxLength={255}
              aria-invalid={!!fieldErrors.bio}
              aria-describedby={fieldErrors.bio ? 'onboarding-bio-error' : 'onboarding-bio-hint'}
              disabled={loading}
              placeholder="Tell other students what you study, create, or care about."
            />
            <FieldHint id="onboarding-bio-hint">{form.bio.length}/255 characters</FieldHint>
            <FieldError id="onboarding-bio-error">{fieldErrors.bio}</FieldError>
          </div>

          <SubtlePanel className="rounded-panel border-dashed border-border p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <FieldLabel htmlFor="onboarding-avatar">Profile photo</FieldLabel>
                <p className="mt-1 text-sm text-foreground-muted">Upload a clear image from your device.</p>
              </div>
              <span className="badge">Image only</span>
            </div>
            <UploadControl
              id="onboarding-avatar"
              name="avatar"
              className="mt-3"
              accept="image/*"
              label={avatarFile ? avatarFile.name : 'Choose a profile photo'}
              hint="JPG, PNG, or WebP up to 5 MB"
              onChange={handleFileChange}
              aria-invalid={!!fieldErrors.avatar}
              aria-describedby={fieldErrors.avatar ? 'onboarding-avatar-error' : undefined}
              disabled={loading}
              required
            />
            <FieldError id="onboarding-avatar-error">{fieldErrors.avatar}</FieldError>
            {previewUrl && (
              <div className="mt-4 flex items-center gap-4 rounded-panel border border-border bg-surface-elevated p-4">
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="h-24 w-24 rounded-panel border border-border object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">Preview</p>
                  <p className="mt-1 text-sm text-foreground-muted">
                    This image will be used in your feed posts, comments, and profile header.
                  </p>
                </div>
              </div>
            )}
          </SubtlePanel>

          {error && <p role="alert" aria-live="polite" className="text-sm text-danger">{error}</p>}
          {loading ? (
            <div className="space-y-2" role="status" aria-live="polite">
              <div className="flex items-center justify-between text-xs font-medium text-foreground-secondary">
                <span>{uploadStep}</span>
                <span>{progress}%</span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-surface-muted"
                role="progressbar"
                aria-label={uploadStep}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={progress}
              >
                <div className="h-full rounded-full bg-brand transition-all duration-normal" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-4 border-t border-border pt-2">
            <p className="text-xs text-foreground-muted">You can update these details later from Edit profile.</p>
            <Button type="submit" loading={loading} loadingLabel="Finishing setup">
              Finish setup
            </Button>
          </div>
        </Card>
      </div>
    </RouteGuard>
  );
}
