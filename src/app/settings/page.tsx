import { ApiKeySettingsForm } from '@/components/forms/api-key-settings-form';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="container grid gap-6 py-8 lg:grid-cols-[1fr_1fr]">
      <ApiKeySettingsForm />
      <Card>
        <CardTitle>Mode API Key</CardTitle>
        <CardDescription className="mt-2">
          Default website memakai pool server unlimited. Saat admin mematikan mode ini atau saldo pool habis, notifikasi akan meminta API key pribadi.
        </CardDescription>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>GET /api/v1/account/credits pada requirement Anda dipetakan ke endpoint resmi yang didokumentasikan: GET /v1/credits.</li>
          <li>API key pribadi disimpan terenkripsi di database.</li>
          <li>Admin dapat melihat key yang tersimpan beserta snapshot saldo terakhir.</li>
        </ul>
      </Card>
    </div>
  );
}
