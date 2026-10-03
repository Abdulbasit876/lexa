import React from 'react'
import { getAcademySettings } from '@/app/actions/settings'
import { Card } from '@/components/ui/Card'
import { HelpCircle, Phone, Mail, MapPin } from 'lucide-react'

export default async function StudentSupportPage() {
  const settings = await getAcademySettings()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-indigo-600" /> Student Support & Contact
        </h2>
        <p className="text-xs text-slate-500">Need assistance with your account, fees, or course schedule?</p>
      </div>

      <Card className="p-6 space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Academy Administration Office</h3>

        <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-indigo-600 shrink-0" />
            <div>
              <span className="font-semibold block text-slate-900 dark:text-slate-100">Help Line</span>
              <span>{settings.phone || '+92-300-1234567'}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-indigo-600 shrink-0" />
            <div>
              <span className="font-semibold block text-slate-900 dark:text-slate-100">Support Email</span>
              <span>{settings.email || 'info@academylexa.com'}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-indigo-600 shrink-0" />
            <div>
              <span className="font-semibold block text-slate-900 dark:text-slate-100">Campus Address</span>
              <span>{settings.address || '123 Education Street, Knowledge City'}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
