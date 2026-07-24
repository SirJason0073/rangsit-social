'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';
import { useAuth } from '@/components/Providers';
import { uploadProfileImage } from '@/utils/upload-client';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FieldError, FieldHint, FieldLabel, TextArea, TextInput, UploadControl } from '@/components/ui/Field';
import Icon from '@/components/ui/Icon';

function validateProfile(form, hasAvatar) {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = 'Enter your first name.';
  if (!form.lastName.trim()) errors.lastName = 'Enter your last name.';
  if (!/^[a-zA-Z0-9._]{3,30}$/.test(form.username.trim())) errors.username = 'Use 3-30 letters, numbers, dots, or underscores.';
  if (!form.birthday) errors.birthday = 'Choose your birthday.';
  if (form.bio.length > 255) errors.bio = 'Keep your bio within 255 characters.';
  if (!hasAvatar) errors.avatar = 'Choose a profile photo.';
  return errors;
}

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', birthday: '', bio: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      username: user.username || '',
      birthday: user.birthday ? String(user.birthday).slice(0, 10) : '',
      bio: user.bio || ''
    });
    setPreviewUrl(user.avatar || '');
  }, [user]);

  useEffect(() => () => {
    if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '', form: '' }));
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((current) => ({ ...current, avatar: 'Choose an image file.' }));
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({ ...current, avatar: 'Choose an image smaller than 5 MB.' }));
      event.target.value = '';
      return;
    }
    if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrors((current) => ({ ...current, avatar: '', form: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateProfile(form, Boolean(avatarFile || previewUrl));
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      const firstField = Object.keys(validationErrors)[0];
      document.querySelector(`[name="${firstField}"]`)?.focus();
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      let avatarUrl = previewUrl;
      if (avatarFile) {
        setStatus('Uploading profile photo');
        const uploadedAvatar = await uploadProfileImage(avatarFile);
        avatarUrl = uploadedAvatar.url;
      }

      setStatus('Saving profile');
      const payload = new FormData();
      payload.append('firstName', form.firstName.trim());
      payload.append('lastName', form.lastName.trim());
      payload.append('username', form.username.trim());
      payload.append('birthday', form.birthday);
      payload.append('bio', form.bio.trim());
      payload.append('avatarUrl', avatarUrl);

      const response = await fetch('/api/users/profile', { method: 'PUT', body: payload });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Profile could not be updated.');

      await refresh();
      router.push(`/profile/${user.id}`);
    } catch (error) {
      setErrors({ form: error.message || 'Profile could not be updated.' });
    } finally {
      setSaving(false);
      setStatus('');
    }
  }

  const name = [form.firstName, form.lastName].filter(Boolean).join(' ') || form.username || 'Your profile';

  return (
    <RouteGuard requireProfile>
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href={user ? `/profile/${user.id}` : '/feed'} className="link text-sm">Back to profile</Link>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Edit profile</h1>
            <p className="mt-1 text-sm text-foreground-muted">Keep your identity accurate across posts, comments, and connections.</p>
          </div>
          <Badge tone="neutral"><Icon name="shield" size="sm" />Campus visibility</Badge>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Card as="form" onSubmit={handleSubmit} noValidate className="space-y-6 p-5 md:p-7">
            <section aria-labelledby="identity-heading">
              <h2 id="identity-heading" className="text-lg font-semibold text-foreground">Identity</h2>
              <p className="mt-1 text-sm text-foreground-muted">Your public name and username.</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="profile-first-name">First name</FieldLabel>
                  <TextInput id="profile-first-name" name="firstName" autoComplete="given-name" className="mt-2" value={form.firstName} onChange={(event) => updateField('firstName', event.target.value)} aria-invalid={!!errors.firstName} disabled={saving} />
                  <FieldError>{errors.firstName}</FieldError>
                </div>
                <div>
                  <FieldLabel htmlFor="profile-last-name">Last name</FieldLabel>
                  <TextInput id="profile-last-name" name="lastName" autoComplete="family-name" className="mt-2" value={form.lastName} onChange={(event) => updateField('lastName', event.target.value)} aria-invalid={!!errors.lastName} disabled={saving} />
                  <FieldError>{errors.lastName}</FieldError>
                </div>
              </div>
              <div className="mt-4">
                <FieldLabel htmlFor="profile-username">Username</FieldLabel>
                <TextInput id="profile-username" name="username" autoComplete="username" autoCapitalize="none" className="mt-2" value={form.username} onChange={(event) => updateField('username', event.target.value)} aria-invalid={!!errors.username} disabled={saving} />
                <FieldHint>Use 3-30 letters, numbers, dots, or underscores.</FieldHint>
                <FieldError>{errors.username}</FieldError>
              </div>
            </section>

            <section aria-labelledby="about-heading" className="border-t border-border pt-6">
              <h2 id="about-heading" className="text-lg font-semibold text-foreground">About you</h2>
              <div className="mt-5 grid gap-4">
                <div>
                  <FieldLabel htmlFor="profile-birthday">Birthday</FieldLabel>
                  <TextInput id="profile-birthday" name="birthday" type="date" className="mt-2" value={form.birthday} onChange={(event) => updateField('birthday', event.target.value)} aria-invalid={!!errors.birthday} disabled={saving} />
                  <FieldHint>Currently visible to signed-in campus members.</FieldHint>
                  <FieldError>{errors.birthday}</FieldError>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel htmlFor="profile-bio">Bio</FieldLabel>
                    <span className="text-xs text-foreground-muted">{form.bio.length}/255</span>
                  </div>
                  <TextArea id="profile-bio" name="bio" maxLength={255} className="mt-2" value={form.bio} onChange={(event) => updateField('bio', event.target.value)} placeholder="What do you study, create, or care about?" aria-invalid={!!errors.bio} disabled={saving} />
                  <FieldError>{errors.bio}</FieldError>
                </div>
              </div>
            </section>

            <section aria-labelledby="photo-heading" className="border-t border-border pt-6">
              <h2 id="photo-heading" className="text-lg font-semibold text-foreground">Profile photo</h2>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar src={previewUrl} alt={`${name} preview`} fallback={name} size="xl" />
                <div className="flex-1">
                  <UploadControl id="profile-avatar" name="avatar" accept="image/*" label={avatarFile ? avatarFile.name : 'Choose a new photo'} hint="JPG, PNG, or WebP up to 5 MB" onChange={handleFileChange} disabled={saving} />
                  <FieldError>{errors.avatar}</FieldError>
                </div>
              </div>
            </section>

            {errors.form ? <div role="alert" className="rounded-control border border-danger/30 bg-danger-subtle p-4 text-sm text-danger">{errors.form}</div> : null}

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
              <p className="text-xs text-foreground-muted" aria-live="polite">{saving ? status : 'Changes appear immediately after saving.'}</p>
              <div className="flex gap-2">
                <Link href={user ? `/profile/${user.id}` : '/feed'} className="btn btn-ghost">Cancel</Link>
                <Button type="submit" loading={saving} loadingLabel="Saving profile">Save changes</Button>
              </div>
            </div>
          </Card>

          <aside className="space-y-4">
            <Card className="overflow-hidden">
              <div className="h-24 bg-gradient-to-br from-brand-strong via-brand to-accent" />
              <div className="-mt-8 px-5 pb-5">
                <Avatar src={previewUrl} alt={`${name} profile preview`} fallback={name} size="lg" className="rounded-full bg-surface-elevated p-1" />
                <p className="mt-3 font-semibold text-foreground">{name}</p>
                <p className="text-sm text-foreground-muted">@{form.username || 'student'}</p>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-foreground-secondary">{form.bio || 'Your bio preview appears here.'}</p>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-3">
                <Icon name="shield" className="text-brand" />
                <h2 className="font-semibold text-foreground">Privacy and visibility</h2>
              </div>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="font-medium text-foreground">Profile and posts</p>
                  <p className="mt-1 leading-5 text-foreground-muted">Visible to authenticated members of Rangsit Social.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Birthday</p>
                  <p className="mt-1 leading-5 text-foreground-muted">Currently visible to authenticated members. Per-field privacy controls are not supported by the current data model.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Profile banner</p>
                  <p className="mt-1 leading-5 text-foreground-muted">Generated from the Rangsit brand palette; no personal banner is stored.</p>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </RouteGuard>
  );
}
