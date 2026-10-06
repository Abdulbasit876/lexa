import React from 'react'
import { getStudentCertificates } from '@/app/actions/certificates'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Award, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function StudentCertificatesPage() {
  const certificates = await getStudentCertificates()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Award className="h-6 w-6 text-amber-500" />
          My Certificates
        </h2>
        <p className="text-xs text-slate-500">
          View and download your achievement certificates issued by the academy.
        </p>
      </div>

      {certificates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold">No certificates yet</p>
            <p className="text-slate-400 text-xs mt-1">
              Certificates issued by the academy will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Decorative top gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 rounded-t-2xl" />

              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 mt-1">
                  {cert.certificateNumber}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1 leading-tight">
                {cert.title}
              </h3>

              {cert.description && (
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{cert.description}</p>
              )}

              <div className="flex flex-wrap gap-1.5 mb-3">
                {cert.academicClass && (
                  <Badge variant="info" size="sm">{cert.academicClass.name}</Badge>
                )}
                {cert.computerCourse && (
                  <Badge variant="secondary" size="sm">{cert.computerCourse.name}</Badge>
                )}
                {cert.grade && (
                  <Badge variant="success" size="sm">Grade: {cert.grade}</Badge>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                <span className="text-xs text-slate-400">
                  Issued: <span className="font-semibold text-slate-600 dark:text-slate-300">{formatDate(cert.issuedDate)}</span>
                </span>
                <Link href={`/dashboard/certificates/${cert.id}`}>
                  <Button variant="outline" size="sm" icon={<Eye className="h-3.5 w-3.5" />}>
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
