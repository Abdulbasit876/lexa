import React from 'react'
import Link from 'next/link'
import { getAcademySettings } from '@/app/actions/settings'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  GraduationCap,
  Target,
  Compass,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  Sparkles,
  Bot,
  Video,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'

export const metadata = {
  title: 'About Us | Academy Lexa',
  description: 'Learn about Academy Lexa, our vision, mission, expert faculty, academic classes, and computer training programs.',
}

export default async function AboutPage() {
  const settings = await getAcademySettings()

  return (
    <div className="space-y-16 pb-20">
      {/* HERO / HEADER SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-[#090d16] border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="h-3.5 w-3.5" />
              About Our Academy
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Empowering Students for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Academic & Technical Excellence
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              {settings?.description ||
                'Quality Education for a Better Future. Join our academic classes and computer courses designed to build strong foundations and modern digital skills.'}
            </p>
          </div>
        </div>
      </section>

      {/* STATS HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center space-y-2 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800 border-indigo-100 dark:border-slate-800">
            <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">Class 6th-12th</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wider">Academic Preparation</p>
          </Card>

          <Card className="p-6 text-center space-y-2 bg-gradient-to-br from-purple-50 to-white dark:from-slate-900 dark:to-slate-800 border-purple-100 dark:border-slate-800">
            <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">IT & Tech</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wider">Computer Courses</p>
          </Card>

          <Card className="p-6 text-center space-y-2 bg-gradient-to-br from-emerald-50 to-white dark:from-slate-900 dark:to-slate-800 border-emerald-100 dark:border-slate-800">
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">24 / 7</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wider">AI Tutor Assistance</p>
          </Card>

          <Card className="p-6 text-center space-y-2 bg-gradient-to-br from-amber-50 to-white dark:from-slate-900 dark:to-slate-800 border-amber-100 dark:border-slate-800">
            <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">100%</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wider">Dedicated Mentorship</p>
          </Card>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card hover className="p-8 space-y-4 border-l-4 border-l-indigo-600">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Our Mission</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              At {settings?.name || 'Academy Lexa'}, our mission is to provide structured, affordable, and high-quality education that bridges conceptual understanding with real-world skills. We aim to equip every student with knowledge, critical thinking abilities, and technical competence.
            </p>
          </Card>

          <Card hover className="p-8 space-y-4 border-l-4 border-l-purple-600">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Compass className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Our Vision</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We envision a modern learning environment where traditional classroom excellence meets cutting-edge technology—offering digital learning materials, open lecture streams, AI step-by-step assistance, and seamless progress tracking for every learner.
            </p>
          </Card>
        </div>
      </section>

      {/* WHY CHOOSE ACADEMY LEXA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="primary">Why Choose Us</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">What Makes Us Stand Out</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Comprehensive care, modern teaching tools, and proven academic tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Comprehensive Curriculum</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              From Class 6th to Intermediate (Physics, Math, Chemistry, Computer), our syllabus focuses on conceptual depth, board preparation, and continuous assessment.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Practical IT Training</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Hands-on training in Web Development, Graphic Design, Office Automation, and Programming taught by experienced instructors to make students career-ready.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">24/7 AI Learning Assistant</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Integrated AI tutor built specifically to assist students with instant step-by-step problem solving, code explanations, and subject revision.
            </p>
          </Card>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8 sm:p-12 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white border-0 text-center space-y-6">
          <Badge variant="primary" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
            Join Academy Lexa Today
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Elevate Your Future?</h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            Explore our academic and computer courses or reach out to our admission helpdesk for enrollment guidelines and fee details.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/courses">
              <Button variant="primary" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                Explore All Courses
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10">
                Contact Admission Desk
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  )
}
