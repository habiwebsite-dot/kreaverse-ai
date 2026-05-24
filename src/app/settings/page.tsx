import { ApiKeySettingsForm } from '@/components/forms/api-key-settings-form';
import { ProfileEditorCard } from '@/components/forms/profile-editor-card';

export default function SettingsPage() {
  return (
    <div className="container space-y-6 py-6">
      <ProfileEditorCard />
      <ApiKeySettingsForm />
    </div>
  );
}