"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Sparkles, Mic, ArrowRight, Target, Globe, ShieldCheck } from "lucide-react";
import { CrowdCanvas } from "@/components/CrowdCanvas";
import { HeaderNav } from "@/components/HeaderNav";
import { DataPixelArcCanvas } from "@/shaders/data-pixel-arc/DataPixelArcCanvas";
import { FlyingPigeonsCanvas } from "@/components/FlyingPigeonsCanvas";
import { SunflowerCanvas } from "@/components/SunflowerCanvas";
import { AuthGuard } from "@/components/AuthGuard";
import { useLanguage } from "@/context/LanguageContext";
import "@/shaders/threeui.css";

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  const [promptText, setPromptText] = useState("");

  const { scrollYProgress } = useScroll();

  // Hero layer & CrowdCanvas parallax scroll bindings
  // Hero + CrowdCanvas starts at opacity: 1 and fades out smoothly (opacity: 0) between 0% and 40% scroll progress.
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const peepsTranslateY = useTransform(scrollYProgress, [0, 0.4], [0, 80]);
  const peepsScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.96]);

  // Pinned Persistent Ambient Arc Canvas: Naturally oriented, fixed background continuously animating across all sections
  const rawOpacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 0.7]);
  const canvasOpacity = useSpring(rawOpacity, { stiffness: 90, damping: 26, mass: 0.5 });

  const suggestionPrompts = [
    t("hero.suggestions.eligible"),
    t("hero.suggestions.farmers"),
    t("hero.suggestions.scholarships"),
    t("hero.suggestions.state"),
  ];

  const howItWorksSteps = [
    {
      number: t("howItWorks.step1.number"),
      title: t("howItWorks.step1.title"),
      description: t("howItWorks.step1.desc"),
    },
    {
      number: t("howItWorks.step2.number"),
      title: t("howItWorks.step2.title"),
      description: t("howItWorks.step2.desc"),
    },
    {
      number: t("howItWorks.step3.number"),
      title: t("howItWorks.step3.title"),
      description: t("howItWorks.step3.desc"),
    },
  ];

  const citizenFeatures = [
    {
      icon: Target,
      color: "text-cyan-400",
      title: t("features.card1.title"),
      description: t("features.card1.desc"),
    },
    {
      icon: Globe,
      color: "text-emerald-400",
      title: t("features.card2.title"),
      description: t("features.card2.desc"),
    },
    {
      icon: Mic,
      color: "text-amber-400",
      title: t("features.card3.title"),
      description: t("features.card3.desc"),
    },
    {
      icon: ShieldCheck,
      color: "text-indigo-400",
      title: t("features.card4.title"),
      description: t("features.card4.desc"),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(promptText.trim())}`);
  };

  const handlePillClick = (suggestion: string) => {
    setPromptText(suggestion);
    router.push(`/chat?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <AuthGuard>
      <main className="relative min-h-screen w-full text-white selection:bg-white selection:text-black">
      {/* PINNED PERSISTENT AMBIENT BACKGROUND CANVAS */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div style={{ opacity: canvasOpacity }} className="w-full h-full">
          <DataPixelArcCanvas
            className="w-full h-full"
            mode="dark"
            speed={1.0}
            hue={0}
            saturation={1.0}
            brightness={1.0}
          />
        </motion.div>
      </div>

      {/* AMBIENT FLYING WHITE PIGEONS LAYER */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
        <FlyingPigeonsCanvas />
      </div>

      {/* 1. TOP NAVIGATION HEADER */}
      <HeaderNav />

      {/* 2. SECTION 1: TOP HERO SECTION WITH PARALLAX SCROLL */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="relative min-h-[calc(100vh-80px)] w-full flex flex-col justify-between overflow-hidden"
      >
        {/* GIANT BOLD BACKGROUND: YOJANA CONNECT */}
        <div className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center">
          <h1 className="text-center font-black tracking-tighter text-[12vw] leading-none text-white/20 uppercase">
            YOJANA<br className="sm:hidden" /> CONNECT
          </h1>
        </div>

        {/* FOREGROUND HERO CONTENT */}
        <section className="relative z-20 flex flex-col items-center justify-center pt-16 sm:pt-24 px-4 text-center max-w-4xl mx-auto">
          <span className="mb-4 inline-block rounded-full border border-neutral-800 bg-neutral-900/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-400 backdrop-blur-md">
            {t("hero.badge")}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl leading-tight">
            {t("hero.title")}
          </h2>
          <p className="mt-4 text-neutral-400 text-sm sm:text-base max-w-lg">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/explore"
              className="rounded-full bg-white px-7 py-3 text-sm font-bold text-black transition hover:bg-neutral-200 inline-block text-center shadow-lg"
            >
              {t("hero.exploreBtn")}
            </Link>
            <button
              type="button"
              onClick={() => {
                document.getElementById("yojana-ai-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-full border border-neutral-700 bg-neutral-900/50 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-neutral-800 cursor-pointer active:scale-95"
            >
              {t("hero.askAiBtn")}
            </button>
          </div>
        </section>

        {/* WALKING CROWD ANIMATION (PARALLAX TRANSLATE & FADE) */}
        <motion.div
          style={{ y: peepsTranslateY, scale: peepsScale }}
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-[65vh] w-full z-10"
        >
          <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} />
        </motion.div>
      </motion.div>

      {/* 3. SECTION 2: YOJANA AI ASSISTANT SECTION (BELOW THE FOLD) */}
      <section
        id="yojana-ai-section"
        className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20"
      >
        {/* Center Glass Card */}
        <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-8 sm:p-12 backdrop-blur-2xl shadow-2xl max-w-2xl w-full flex flex-col items-center text-center relative z-10 overflow-hidden">
          {/* Ambient Top Glow */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent" />

          {/* Top Badge: Frosted squircle with cyan/white sparkle icon */}
          <div className="bg-neutral-800/80 border border-white/15 p-3 rounded-2xl mb-6 shadow-inner flex items-center justify-center relative z-10">
            <Sparkles className="h-6 w-6 text-cyan-400" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight relative z-10">
            {t("yojanaAi.greeting")}
          </h2>
          <p className="text-neutral-300 text-xl sm:text-2xl font-semibold mt-1 mb-8 relative z-10">
            {t("yojanaAi.question")}
          </p>

          {/* Prompt Input Box */}
          <form
            onSubmit={handleSubmit}
            className="bg-neutral-950/80 border border-white/10 focus-within:border-white/30 rounded-2xl px-5 py-3.5 flex items-center gap-3 w-full shadow-lg transition relative z-10 mb-6"
          >
            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder={t("yojanaAi.inputPlaceholder")}
              className="text-white placeholder-neutral-500 bg-transparent outline-none flex-1 text-sm sm:text-base"
            />

            {/* Action Icons */}
            <button
              type="button"
              className="text-neutral-400 hover:text-white transition p-1.5 rounded-lg cursor-pointer"
              title={t("yojanaAi.voiceInput")}
              aria-label={t("yojanaAi.voiceInput")}
            >
              <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <button
              type="submit"
              className="bg-white/10 hover:bg-white text-neutral-400 hover:text-black p-2 rounded-xl transition cursor-pointer active:scale-95 flex items-center justify-center shrink-0"
              title={t("yojanaAi.sendQuestion")}
              aria-label={t("yojanaAi.sendQuestion")}
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Suggestion Prompt Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 relative z-10">
            {suggestionPrompts.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePillClick(suggestion)}
                className="bg-neutral-900/80 border border-white/5 hover:border-white/20 text-neutral-400 hover:text-white text-xs sm:text-sm px-4 py-2 rounded-xl transition cursor-pointer active:scale-95"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECTION 3: HOW IT WORKS SECTION */}
      <section
        id="about"
        className="relative z-10 py-32 px-6 max-w-6xl mx-auto w-full"
      >
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-center text-white mb-4">
            {t("howItWorks.title")}
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base text-center max-w-lg mx-auto mb-16">
            {t("howItWorks.subtitle")}
          </p>
        </div>

        {/* Dark Glass Step Cards (Grid of 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {howItWorksSteps.map((step) => (
            <div
              key={step.number}
              className="bg-neutral-900/50 border border-white/[0.08] backdrop-blur-xl rounded-3xl p-8 flex flex-col justify-between shadow-2xl hover:border-white/20 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Subtle top-edge inner glow gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />

              <div className="relative z-10">
                <span className="block font-mono text-4xl sm:text-5xl font-extrabold text-white/15 mb-6 group-hover:text-white/25 transition-colors">
                  {step.number}
                </span>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SECTION 4: BUILT FOR EVERY CITIZEN SECTION */}
      <section className="relative z-10 py-24 sm:py-32 px-6 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-center text-white mb-4">
            {t("features.title")}
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base text-center max-w-xl mx-auto mb-16">
            {t("features.subtitle")}
          </p>
        </div>

        {/* Four-Card Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {citizenFeatures.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                className="bg-neutral-900/50 border border-white/[0.08] backdrop-blur-xl rounded-3xl p-6 sm:p-7 flex flex-col justify-start shadow-2xl hover:border-white/20 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Subtle top-edge inner glow gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />

                <div className="relative z-10">
                  {/* Frosted Icon Badge */}
                  <div
                    className={`w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${feature.color} mb-5 group-hover:scale-105 transition-transform`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xs font-bold tracking-widest text-neutral-300 uppercase mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. SECTION 5: OFFICIAL INFORMATION & TRUST */}
      <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="relative p-[1px] rounded-3xl overflow-hidden group border border-white/10 group-hover:border-transparent transition-colors duration-300">
          {/* RGB Rotating Conic Gradient Glow Layer */}
          <div className="absolute -inset-[100%] m-auto bg-[conic-gradient(from_0deg,#ff007a,#7928ca,#0070f3,#00dfd8,#ff007a)] animate-rgb-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px] pointer-events-none" />

          {/* Inner Content Card */}
          <div className="relative rounded-[23px] bg-neutral-950/90 backdrop-blur-xl h-full w-full p-8 sm:p-12 text-center overflow-hidden">
            {/* Ambient Top Glow */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-center text-white mb-4">
                {t("trust.title")}
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base text-center max-w-2xl mx-auto leading-relaxed mb-8">
                {t("trust.description")}
              </p>

              {/* Badges Row */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-neutral-300 font-medium">
                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                  {t("trust.badgeOfficial")}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                  {t("trust.badgeUpdated")}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                  {t("trust.badgeLanguages")}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                  {t("trust.badgeNoLogin")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WRAPPER FOR FINAL CTA & SWAYING SUNFLOWERS FIELD */}
      <div className="relative w-full overflow-hidden">
        {/* 7. SECTION 6: FINAL CALL TO ACTION BANNER */}
        <section className="relative z-10 pt-4 pb-32 sm:pb-40 px-6 max-w-5xl mx-auto w-full">
          <div className="relative p-[1px] rounded-3xl overflow-hidden group border border-white/10 group-hover:border-transparent transition-colors duration-300">
            {/* RGB Rotating Conic Gradient Glow Layer */}
            <div className="absolute -inset-[100%] m-auto bg-[conic-gradient(from_0deg,#ff007a,#7928ca,#0070f3,#00dfd8,#ff007a)] animate-rgb-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px] pointer-events-none" />

            {/* Inner Content Card */}
            <div className="relative rounded-[23px] bg-neutral-950/90 backdrop-blur-xl h-full w-full p-10 sm:p-16 text-center flex flex-col items-center justify-center overflow-hidden">
              {/* Ambient Top Glow */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />

              <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-center text-white mb-3">
                  {t("cta.title")}
                </h2>
                <p className="text-neutral-400 text-sm sm:text-base text-center mb-8">
                  {t("cta.subtitle")}
                </p>

                <Link
                  href="/find"
                  className="bg-white text-black font-bold text-sm px-8 py-3.5 rounded-full hover:bg-neutral-200 transition shadow-lg active:scale-95 inline-block text-center"
                >
                  {t("cta.button")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SWAYING SUNFLOWERS FIELD (MIRRORING CROWDCANVAS HERO SETUP) */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-44 sm:h-56 z-[2] overflow-hidden">
          <SunflowerCanvas />
        </div>
      </div>

      {/* 8. FOOTER SECTION */}
      <footer
        id="contact"
        className="relative z-10 w-full border-t border-white/[0.08] bg-neutral-950/80 backdrop-blur-lg py-8 px-6 sm:px-12"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left Side (Brand) */}
          <Link className="flex items-center gap-3 group" href="/">
            <Image
              src="/images/yojana-symbol.png"
              alt="Yojana Connect"
              width={32}
              height={32}
              className="h-7 sm:h-8 w-auto object-contain brightness-0 invert group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all"
            />
            <span className="font-bold text-base sm:text-lg tracking-tight text-white">
              YOJANA<span className="text-neutral-400 font-normal ml-1.5">CONNECT</span>
            </span>
          </Link>

          {/* Right Side (Navigation Links) */}
          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-neutral-400 font-medium">
            <Link href="/explore" className="hover:text-white transition-colors duration-200">
              {t("footer.exploreSchemes")}
            </Link>
            <a
              href="#yojana-ai-section"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("yojana-ai-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-white transition-colors duration-200 cursor-pointer"
            >
              {t("footer.yojanaAi")}
            </a>
            <a href="#about" className="hover:text-white transition-colors duration-200">
              {t("footer.about")}
            </a>
            <Link href="/privacy" className="hover:text-white transition-colors duration-200">
              {t("footer.privacy")}
            </Link>
            <a href="#contact" className="hover:text-white transition-colors duration-200">
              {t("footer.contact")}
            </a>
          </nav>
        </div>
      </footer>
    </main>
    </AuthGuard>
  );
}