import React from 'react'
import { getAcademySettings } from '@/app/actions/settings'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default async function ContactPage() {
  const settings = await getAcademySettings()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <Badge variant="primary">Get In Touch</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">Contact Academy Lexa</h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          We are here to answer your questions regarding admissions, fee details, academic schedules, and computer courses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Academy Contact Details</h3>
          <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-indigo-600 shrink-0" />
              <div>
                <span className="font-semibold block text-slate-900 dark:text-slate-100">Address</span>
                <span>{settings.address || '123 Education Street, Knowledge City'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-indigo-600 shrink-0" />
              <div>
                <span className="font-semibold block text-slate-900 dark:text-slate-100">Phone</span>
                <span>{settings.phone || '+92-300-1234567'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-indigo-600 shrink-0" />
              <div>
                <span className="font-semibold block text-slate-900 dark:text-slate-100">Email</span>
                <span>{settings.email || 'info@academylexa.com'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-indigo-600 shrink-0" />
              <div>
                <span className="font-semibold block text-slate-900 dark:text-slate-100">Office Hours</span>
                <span>Monday – Saturday: 08:00 AM – 06:00 PM</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Send Us a Message</h3>
          <form className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Your Name</label>
              <input type="text" placeholder="Ali Raza" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email or Phone</label>
              <input type="text" placeholder="03001234567" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Message</label>
              <textarea rows={3} placeholder="Ask about admissions or courses..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm resize-none"></textarea>
            </div>
            <button type="button" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
              Send Message
            </button>
          </form>
        </Card>
      </div>
    </div>
  )
}
