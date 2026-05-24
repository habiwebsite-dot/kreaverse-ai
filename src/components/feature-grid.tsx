import Link from 'next/link';
import { Wand2, Music4, Video, SlidersHorizontal } from 'lucide-react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

const items = [
  {
    href: '/tools/image',
    title: 'Image-to-Image',
    description: 'Upload hingga 5 referensi untuk model yang mendukung, atur ratio, resolusi, dan prompt.',
    icon: Wand2,
  },
  {
    href: '/tools/music',
    title: 'Music Studio',
    description: 'Form Suno sesuai dokumentasi: custom mode, style, lyrics, persona, gender, dan weight slider.',
    icon: Music4,
  },
  {
    href: '/tools/video',
    title: 'Video Generator',
    description: 'Pilih Seedance, Kling, atau Wan2.7 dengan parameter resmi dan polling hasil task.',
    icon: Video,
  },
  {
    href: '/tools/mastering',
    title: 'Auphonic Mastering',
    description: 'Upload URL audio dari Cloudinary, aktifkan algoritma mastering, dan preview hasil di Results.',
    icon: SlidersHorizontal,
  },
];

export function FeatureGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href}>
            <Card className="h-full transition-transform hover:-translate-y-1">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription className="mt-2">{item.description}</CardDescription>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
