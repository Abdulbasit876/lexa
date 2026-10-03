import React from 'react'
import Link from 'next/link'
import {
  GraduationCap,
  BookOpen,
  Video,
  Award,
  Bot,
  ArrowRight,
  ExternalLink,
  Bell,
  CheckCircle2,
  Send,
  Phone,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getAcademySettings } from '@/app/actions/settings'
import { getAcademicClasses } from '@/app/actions/academic'
import { getComputerCourses } from '@/app/actions/courses'
import { getPublicLectures } from '@/app/actions/lectures'
import { getPublicAnnouncements } from '@/app/actions/announcements'
import { getSocialLinks } from '@/app/actions/social-links'
import { formatDate } from '@/lib/utils'

export default async function HomePage() {
  const settings = await getAcademySettings()
  const academicClasses = await getAcademicClasses()
  const computerCourses = await getComputerCourses()
  const recentLectures = await getPublicLectures()
  const announcements = await getPublicAnnouncements()
  const socialLinks = await getSocialLinks(true)

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-[#090d16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
                <Sparkles className="h-3.5 w-3.5" />
                {settings?.tagline || 'Learn Today, Lead Tomorrow'}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.15]">
                Welcome to <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  {settings?.name || 'Academy Lexa'}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Quality Education for a Better Future. Join our academic classes and computer courses designed to build strong foundations and modern digital skills.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/courses">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto font-semibold">
                    Explore Courses
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
                  alt="Academy Lexa Students"
                  className="w-full h-[380px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Admissions Open</p>
                    <p className="text-lg font-bold">Class 6th to Intermediate & Computer Courses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 FEATURE PILLARS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <Card hover className="p-6 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Expert Teachers</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Dedicated faculty covering physics, math, chemistry, computer science and language.
              </p>
            </Card>

            <Card hover className="p-6 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Online Lectures</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Free open lecture links on YouTube, Facebook, Instagram and web resources.
              </p>
            </Card>

            <Card hover className="p-6 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Tests & Results</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Regular testing and transparent grade reports accessible via student login.
              </p>
            </Card>

            <Card hover className="p-6 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">AI Tutor 24/7</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Interactive AI assistant to solve math, physics and programming queries step-by-step.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURED COURSES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="primary">Educational Programs</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Our Courses</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Explore our range of academic classes and skill-focused computer courses.
          </p>
        </div>

        {/* Academic Classes */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" /> Academic Classes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {academicClasses.map((ac) => (
              <Card key={ac.id} hover className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{ac.name}</h4>
                  <Badge variant="info">{ac.subjects.length} Subjects</Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{ac.description || 'Comprehensive curriculum preparation.'}</p>
                <div className="flex flex-wrap gap-1.5">
                  {ac.subjects.map((sub) => (
                    <span key={sub.id} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {sub.name}
                    </span>
                  ))}
                </div>
                <div className="pt-2">
                  <Link href="/courses">
                    <Button variant="outline" size="sm" className="w-full">
                      View Subjects
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Computer Courses */}
        <div className="space-y-4 pt-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-purple-600" /> Computer Courses
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {computerCourses.map((cc) => (
              <Card key={cc.id} hover className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{cc.name}</h4>
                  <Badge variant="secondary">Rs. {Number(cc.fee || 0).toLocaleString()}</Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{cc.description}</p>
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Instructor:</span> {cc.instructor || 'Academy Instructor'}
                </div>
                <div className="pt-2">
                  <Link href="/courses">
                    <Button variant="primary" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PUBLIC LECTURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Badge variant="success">Open Learning Resources</Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">Latest Public Lectures</h2>
          </div>
          <Link href="/lectures">
            <Button variant="outline" size="sm" icon={<ArrowRight className="h-4 w-4" />}>
              View All Lectures
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentLectures.slice(0, 6).map((lec) => (
            <Card key={lec.id} hover className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant={lec.platform === 'YOUTUBE' ? 'danger' : 'info'}>
                  {lec.platform}
                </Badge>
                {lec.duration && <span className="text-xs text-slate-400 font-mono">⏱ {lec.duration}</span>}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{lec.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {lec.description || `${lec.academicSubject?.name || lec.computerCourse?.name || 'Lecture'} resource`}
                </p>
              </div>
              <div className="pt-2">
                <a href={lec.videoUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="primary" size="sm" className="w-full" icon={<ExternalLink className="h-3.5 w-3.5" />}>
                    Open Lecture
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ANNOUNCEMENTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Badge variant="warning">Academy Updates</Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">Announcements</h2>
          </div>
          <Link href="/announcements">
            <Button variant="outline" size="sm">
              View All Announcements
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.slice(0, 4).map((ann) => (
            <Card key={ann.id} className="p-6 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 shrink-0">
                <Bell className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{ann.title}</h4>
                  <span className="text-[11px] text-slate-400 shrink-0">{formatDate(ann.date)}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{ann.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CONTACT & GET IN TOUCH */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8 sm:p-12 overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white border-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <Badge variant="primary" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                Get In Touch
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Contact Academy Lexa</h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
                We are here to help you. Visit our campus or reach out via phone or email for admissions, fee queries, or course information.
              </p>
              <div className="space-y-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-indigo-400" />
                  <span>{settings?.phone || '+92-300-1234567'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-indigo-400" />
                  <span>{settings?.email || 'info@academylexa.com'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-indigo-400" />
                  <span>{settings?.address || '123 Education Street, Knowledge City'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4 text-slate-900 dark:text-slate-100">
              <h3 className="text-base font-bold text-white">Student & Admission Support</h3>
              <p className="text-xs text-slate-300">Have questions about student account login or fee payments?</p>
              <Link href="/payment-info" className="block">
                <Button variant="primary" size="md" className="w-full justify-center">
                  View Payment & Fee Info
                </Button>
              </Link>
              <Link href="/login" className="block">
                <Button variant="outline" size="md" className="w-full justify-center text-white border-white/30 hover:bg-white/10">
                  Student Portal Login
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
