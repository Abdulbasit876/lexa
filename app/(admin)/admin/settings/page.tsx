'use client'

import React, { useState, useEffect } from 'react'
import { getAcademySettings, updateAcademySettings } from '@/app/actions/settings'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import { Save, Settings } from 'lucide-react'

export default function AdminSettingsPage() {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    address: '',
    phone: '',
    email: '',
  })

  useEffect(() => {
    getAcademySettings().then((s) => {
      setFormData({
        name: s.name || '',
        tagline: s.tagline || '',
        description: s.description || '',
        address: s.address || '',
        phone: s.phone || '',
        email: s.email || '',
      })
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const res = await updateAcademySettings(formData)
    setIsLoading(false)

    if (res.error) {
      toast.error(res.error)
      return
    }

    toast.success('Academy settings updated!')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Settings className="h-6 w-6 text-indigo-600" /> Academy Settings
        </h2>
        <p className="text-xs text-slate-500">Configure academy branding, tagline, and contact information.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Academy Name *" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <Input label="Tagline" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} />
            <Textarea label="About Description" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input label="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              <Input label="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>

            <Input label="Physical Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full justify-center" icon={<Save className="h-4 w-4" />}>
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
