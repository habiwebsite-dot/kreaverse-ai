'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Logo } from '@/components/branding/logo'

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = () => {
    setIsLoading(true)
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/dashboard')
    } else {
      router.push('/auth/login')
    }
  }

  const handleWhatsApp = () => {
    const phone = process.env.NEXT_PUBLIC_WA_NUMBER
    const message = encodeURIComponent(
      process.env.NEXT_PUBLIC_WA_MESSAGE || 
      'Halo Admin Kreaverse AI, saya tertarik berlangganan.'
    )
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <Button
            variant="outline"
            onClick={() => router.push('/auth/login')}
          >
            Login
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          Kreaverse AI
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-4">
          Generate Audio, Image, Video & Professional Mastering
        </p>
        <p className="text-gray-400 mb-8">
          Powered by Suno, Midjourney, Seedance & Auphonic
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleWhatsApp}
          >
            Chat via WhatsApp
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🎵', title: 'Music Cover', desc: 'AI-powered voice generation' },
            { icon: '🎨', title: 'Image Gen', desc: 'Text-to-image creation' },
            { icon: '🎬', title: 'Video Gen', desc: 'AI video synthesis' },
            { icon: '🎚️', title: 'AI Mastering', desc: 'Professional audio mastering' },
          ].map((feature, i) => (
            <Card key={i} className="p-6 border-purple-500/20 bg-purple-950/20 hover:bg-purple-950/40 transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
