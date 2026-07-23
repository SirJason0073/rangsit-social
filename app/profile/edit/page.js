'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';
import { useAuth } from '@/components/Providers';
import { uploadProfileImage } from '@/utils/upload-client';
import Button from '@/components/ui/Button';
import { Card, SubtlePanel } from '@/components/ui/Card';
import { FieldHint, FieldLabel, TextArea, TextInput } from '@/components/ui/Field';

function validateProfile(form, hasAvatar) {
  if (!form.firstName.trim()) return 'First name is required.';
  if (!form.lastName.trim()) return 'Last name is required.';
  if (!/^[a-zA-Z0-9._]{3,30}$/.test(form.username.trim())) {
    return 'Username must be 3-30 characters and use only letters, numbers, dots, or underscores.';
  }
  if (!form.birthday) return 'Birthday is required.';
  if (form.bio.length > 255) return 'Bio must be 255 characters or fewer.';
  if (!hasAvatar) return 'Profile image is required.';
  return '';
}

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, refresh } = useAuth();
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

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const validationError = validateProfile(form, !!(avatarFile || previewUrl));
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('firstName', form.firstName.trim());
      payload.append('lastName', form.lastName.trim());
      payload.append('username', form.username.trim());
      payload.append('birthday', form.birthday);
      payload.append('bio', form.bio.trim());

      if (avatarFile) {
        const uploadedAvatar = await uploadProfileImage(avatarFile);
        payload.append('avatarUrl', uploadedAvatar.url);
      } else if (previewUrl) {
        payload.append('avatarUrl', previewUrl);
      }

      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        body: payload
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile.');
      }

      await refresh();
      router.push(`/profile/${user.id}`);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <RouteGuard requireProfile>
      <div className="space-y-6">
        <Card className="p-6 md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Profile</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Edit your profile</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Keep your campus identity current across posts, comments, follows, and profile lists.
          </p>
        </Card>

        <Card as="form" onSubmit={handleSubmit} className="space-y-5 p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel>First name</FieldLabel>
              <TextInput className="mt-2" value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} />
            </div>
            <div>
              <FieldLabel>Last name</FieldLabel>
              <TextInput className="mt-2" value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} />
            </div>
          </div>

          <div>
            <FieldLabel>Username</FieldLabel>
            <TextInput className="mt-2" value={form.username} onChange={(e) => updateField('username', e.target.value)} />
            <FieldHint>Use 3-30 letters, numbers, dots, or underscores.</FieldHint>
          </div>

          <div>
            <FieldLabel>Birthday</FieldLabel>
            <TextInput className="mt-2" type="date" value={form.birthday} onChange={(e) => updateField('birthday', e.target.value)} />
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
                <p className="mt-1 text-sm text-slate-500">Upload a new image only if you want to replace the current one.</p>
              </div>
              <span className="badge">Image only</span>
            </div>
            <input className="input mt-2" type="file" accept="image/*" onChange={handleFileChange} />
            {previewUrl ? (
              <div className="mt-4 flex items-center gap-4 rounded-[24px] border border-slate-200 bg-white p-4">
                <img src={previewUrl} alt="Profile preview" className="h-24 w-24 rounded-[24px] border border-slate-200 object-cover" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Preview</p>
                  <p className="mt-1 text-sm text-slate-500">This image is visible across the full social experience.</p>
                </div>
              </div>
            ) : null}
          </SubtlePanel>

          {error ? <p className="text-sm text-rose-500">{error}</p> : null}

          <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-2">
            <p className="text-xs text-slate-400">Profile updates are applied immediately after saving.</p>
            <Button disabled={loading}>
              {loading ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </Card>
      </div>
    </RouteGuard>
  );
}
