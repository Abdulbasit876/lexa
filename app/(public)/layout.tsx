import React from 'react'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { getAcademySettings } from '@/app/actions/settings'
import { getSocialLinks } from '@/app/actions/social-links'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getAcademySettings()
  const socialLinks = await getSocialLinks(true)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
      <Navbar settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} socialLinks={socialLinks} />
    </div>
  )
}
