'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './ui/button';
import { MessageSquareText, LogOut, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-20">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ rotate: -10, scale: 1.1 }}
            className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-lg shadow-indigo-600/20"
          >
            <MessageSquareText className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:from-indigo-400 h-8">
            Feedback Mystery
          </span>
        </Link>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <UserIcon className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-gray-300">
                   {user?.username || user?.email}
                </span>
              </div>
              <Button 
                onClick={() => signOut()} 
                variant="ghost" 
                className="text-gray-400 hover:text-white hover:bg-white/5 gap-2 group"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in" className="hidden sm:block">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5 font-medium transition-all">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 shadow-xl shadow-indigo-600/20 transition-all active:scale-95">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
