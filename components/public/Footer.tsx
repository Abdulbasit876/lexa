import React from 'react'
import Link from 'next/link'
import { GraduationCap, MapPin, Phone, Mail } from 'lucide-react'

export function Footer({ settings, socialLinks }: { settings?: any; socialLinks?: any[] }) {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight uppercase">
                {settings?.name || 'Academy Lexa'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {settings?.tagline || 'Learn Today, Lead Tomorrow'} — {settings?.description || 'Providing world-class academic education and computer courses.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link href="/courses" className="hover:text-indigo-400 transition-colors">Academic & Computer Courses</Link></li>
              <li><Link href="/lectures" className="hover:text-indigo-400 transition-colors">Public Lectures</Link></li>
              <li><Link href="/announcements" className="hover:text-indigo-400 transition-colors">Announcements</Link></li>
              <li><Link href="/payment-info" className="hover:text-indigo-400 transition-colors">Fee & Payment Details</Link></li>
            </ul>
          </div>

          {/* Student Access */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Student Portal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/login" className="hover:text-indigo-400 transition-colors">Student Login</Link></li>
              <li><Link href="/login" className="hover:text-indigo-400 transition-colors">Admin Login</Link></li>
              <li><Link href="/payment-info" className="hover:text-indigo-400 transition-colors">Fee Structure</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Help & Support</Link></li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Contact Us</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>{settings?.address || '123 Education Street, Knowledge City'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>{settings?.phone || '+92-300-1234567'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>{settings?.email || 'info@academylexa.com'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Academy Lexa. All rights reserved.</p>
          <p>Powered by Next.js & Neon PostgreSQL</p>
        </div>
      </div>
    </footer>
  )
}
