'use client';

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { 
  ArrowRight,
  ClipboardCopy,
  MessageCircle,
  Share2,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const steps = [
  {
    number: "01",
    title: "Claim Your Magic Link",
    description: "Create your unique profile in seconds. Your secure link is your gateway to honest truths.",
    icon: <ClipboardCopy className="w-6 h-6 text-indigo-400" />,
    color: "from-indigo-500 to-blue-500"
  },
  {
    number: "02",
    title: "Share Your Secret ID",
    description: "Share your mystery link on Instagram, WhatsApp, or Discord. Let the messages flow in.",
    icon: <Share2 className="w-6 h-6 text-purple-400" />,
    color: "from-purple-500 to-pink-500"
  },
  {
    number: "03",
    title: "Discover Real Truths",
    description: "Read unfiltered feedback and secrets from your circle in your private, secure dashboard.",
    icon: <MessageCircle className="w-6 h-6 text-pink-400" />,
    color: "from-pink-500 to-rose-500"
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.3 } 
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.7, ease: "easeInOut" } 
  },
};

export default function Page() {
  return (
    <div className="relative min-h-screen bg-[#060607] overflow-hidden text-slate-200 selection:bg-indigo-500/30">
      <Navbar />

      {/* Modern Background Decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-indigo-600/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute top-[30%] left-[-15%] w-[50vw] h-[50vw] bg-purple-600/10 blur-[180px] rounded-full" />
      </div>

      <div className="relative z-10 pt-32 pb-40">
        <motion.main 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-6"
        >
          {/* Hero Section - The Workflow Focus */}
          <div className="flex flex-col items-center text-center mb-40">
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-3xl shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-black tracking-[0.2em] text-indigo-300 uppercase">Your Voice, Anonymous</span>
              </div>
            </motion.div>

            <motion.h1 
              variants={itemVariants} 
              className="text-7xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.95] text-white"
            >
              Create. Share. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-500">
                Collect Feedback.
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants} 
              className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed mb-12"
            >
              The simplest way to receive honest, anonymous reviews from friends and fans. 
              <span className="text-white"> Step into the mystery </span> and learn what people really think.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 items-center">
              <Link href="/sign-up">
                <Button className="h-16 px-12 bg-white text-black hover:bg-slate-200 text-xl font-black rounded-2xl shadow-2xl shadow-white/10 group transition-all">
                  Get Your Link Now
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </Link>
              <div className="flex items-center gap-3 px-6 py-2 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-lg">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-indigo-600" />)}
                 </div>
                 <span className="text-xs font-bold text-slate-500">Liked by 10k+ creators</span>
              </div>
            </motion.div>
          </div>

          {/* New Workflow Visualization - How It To Works */}
          <div className="relative mb-60">
             <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -translate-y-1/2 hidden lg:block z-0" />
             
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                {steps.map((step, idx) => (
                  <motion.div 
                    key={idx} 
                    variants={itemVariants}
                    className="group relative flex flex-col items-center text-center p-12 rounded-[3.5rem] bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 hover:border-indigo-500/2 transition-all duration-700 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-[2rem] bg-gradient-to-br ${step.color} p-0.5 shadow-2xl transition-transform duration-500 group-hover:rotate-[15deg]`}>
                      <div className="w-full h-full rounded-[1.8rem] bg-slate-950 flex items-center justify-center font-black text-2xl text-white">
                         {step.number}
                      </div>
                    </div>

                    <div className="mt-8 mb-8 p-6 rounded-3xl bg-white/5 border border-white/10 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all duration-500">
                       {step.icon}
                    </div>

                    <h3 className="text-3xl font-black mb-6 text-white tracking-tighter group-hover:text-indigo-400 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 font-medium leading-[1.7] text-lg">
                      {step.description}
                    </p>

                    <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-2 items-center text-indigo-400 font-bold text-sm uppercase tracking-widest">
                         Learn More <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>

          {/* Visual Link Mockup */}
          <motion.section 
            variants={itemVariants}
            className="p-8 md:p-20 rounded-[4rem] bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-950 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden"
          >
             <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 blur-[130px] rounded-full" />
             
             <div className="flex-1 text-left">
                <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter text-white">Your link, <br /> your rules.</h2>
                <div className="space-y-6">
                   {[
                     "Auto-generate clean mystery URLs",
                     "Real-time feedback notifications",
                     "AI-powered suggestions to boost engagement",
                     "100% Secure and E2E Encrypted"
                   ].map((text, i) => (
                      <div key={i} className="flex items-center gap-4 group">
                         <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                            <CheckCircle2 className="w-5 h-5 text-indigo-400 group-hover:text-white" />
                         </div>
                         <span className="text-lg font-bold text-slate-300 group-hover:text-white transition-colors">{text}</span>
                      </div>
                   ))}
                </div>
             </div>

             <div className="flex-1 w-full max-w-md p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 backdrop-blur-3xl shadow-2xl">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                      <Zap className="w-8 h-8 text-white fill-white" />
                   </div>
                   <div>
                      <h4 className="font-black text-xl text-white">Live Link Generator</h4>
                      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Status: Ready to deploy</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                      <span className="text-slate-400 font-bold tracking-tight">feedbackmystery.com/u/mystery-user</span>
                      <ClipboardCopy className="w-5 h-5 text-indigo-400" />
                   </div>
                   <div className="flex gap-4">
                      <div className="flex-1 h-14 rounded-2xl bg-[#E4405F]/10 border border-[#E4405F]/20 flex items-center justify-center font-black text-xs text-[#E4405F] uppercase tracking-tighter">Share on IG</div>
                      <div className="flex-1 h-14 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center font-black text-xs text-[#25D366] uppercase tracking-tighter">Share on WA</div>
                   </div>
                </div>
             </div>
          </motion.section>
        </motion.main>

        <footer className="mt-40 text-center flex flex-col items-center gap-12 pt-20 border-t border-white/5">
           <div className="flex gap-12 font-bold text-xs uppercase tracking-[0.3em] text-slate-600">
              <Link href="#" className="hover:text-indigo-400 transition-colors">Support</Link>
              <Link href="#" className="hover:text-indigo-400 transition-colors">Terms</Link>
              <Link href="#" className="hover:text-indigo-400 transition-colors">Cookie Policy</Link>
           </div>
           <p className="text-slate-700 font-bold text-sm">© 2026 Feedback Mystery. Designed with passion for creators.</p>
        </footer>
      </div>
    </div>
  );
}
