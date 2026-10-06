import React from 'react'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { serialize, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { PrintButton } from '@/components/ui/PrintButton'
import { ArrowLeft } from 'lucide-react'

async function getCertificate(id: string) {
  await requireAdmin()
  const cert = await prisma.certificate.findUnique({
    where: { id },
    include: {
      student: true,
      academicClass: true,
      computerCourse: true,
    },
  })
  return cert ? serialize(cert) : null
}

async function getAcademySettings() {
  const settings = await prisma.academySettings.findFirst()
  return settings ? serialize(settings) : { name: 'Academy Lexa', tagline: 'Education for the Future' }
}

export default async function CertificatePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [cert, settings] = await Promise.all([getCertificate(id), getAcademySettings()])

  if (!cert) notFound()

  const forLabel = cert.academicClass
    ? cert.academicClass.name
    : cert.computerCourse
    ? cert.computerCourse.name
    : null

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between print:hidden">
        <Link href="/admin/certificates">
          <Button variant="outline" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
        </Link>
      <PrintButton />
      </div>

      {/* Certificate Document */}
      <div
        id="certificate-print"
        className="bg-white text-slate-900 mx-auto print:mx-0"
        style={{
          width: '297mm',
          minHeight: '210mm',
          padding: '16mm 20mm',
          fontFamily: "'Georgia', serif",
          position: 'relative',
          boxShadow: '0 4px 40px rgba(0,0,0,0.15)',
        }}
      >
        {/* Outer Border */}
        <div
          style={{
            position: 'absolute',
            inset: '8mm',
            border: '3px solid #3730a3',
            pointerEvents: 'none',
          }}
        />
        {/* Inner Border */}
        <div
          style={{
            position: 'absolute',
            inset: '11mm',
            border: '1px solid #818cf8',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div className="relative flex flex-col items-center text-center h-full" style={{ gap: '4mm' }}>
          {/* Academy Name */}
          <div style={{ marginBottom: '2mm' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '14mm',
                height: '14mm',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                marginBottom: '3mm',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="white" />
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="white" opacity="0.7" />
              </svg>
            </div>
            <div style={{ fontSize: '20pt', fontWeight: 'bold', color: '#3730a3', letterSpacing: '3px', textTransform: 'uppercase' }}>
              {settings.name}
            </div>
            {settings.tagline && (
              <div style={{ fontSize: '9pt', color: '#6366f1', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '1mm' }}>
                {settings.tagline}
              </div>
            )}
          </div>

          {/* Decorative divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4mm', width: '80%' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #c7d2fe)' }} />
            <span style={{ color: '#818cf8', fontSize: '14pt' }}>✦</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, #c7d2fe)' }} />
          </div>

          {/* Certificate of */}
          <div style={{ fontSize: '11pt', color: '#6b7280', letterSpacing: '4px', textTransform: 'uppercase' }}>
            This is to certify that
          </div>

          {/* Title */}
          <div style={{ fontSize: '22pt', fontWeight: 'bold', color: '#1e1b4b', letterSpacing: '1px', margin: '1mm 0' }}>
            {cert.title}
          </div>

          {/* Student Name */}
          <div
            style={{
              fontSize: '28pt',
              fontWeight: 'bold',
              color: '#3730a3',
              borderBottom: '2px solid #c7d2fe',
              paddingBottom: '2mm',
              paddingLeft: '8mm',
              paddingRight: '8mm',
              margin: '2mm 0',
            }}
          >
            {cert.student.fullName}
          </div>

          <div style={{ fontSize: '9pt', color: '#6b7280' }}>
            Student ID: <span style={{ fontWeight: 'bold', color: '#374151' }}>{cert.student.studentId}</span>
          </div>

          {/* Description */}
          {(cert.description || forLabel) && (
            <div style={{ fontSize: '11pt', color: '#374151', maxWidth: '200mm', lineHeight: 1.6, margin: '2mm 0' }}>
              {cert.description || `has successfully completed the requirements of`}
              {forLabel && (
                <span style={{ fontWeight: 'bold', color: '#3730a3' }}> {forLabel}</span>
              )}
            </div>
          )}

          {/* Grade */}
          {cert.grade && (
            <div
              style={{
                background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                border: '1px solid #c7d2fe',
                borderRadius: '8px',
                padding: '3mm 8mm',
                margin: '2mm 0',
              }}
            >
              <span style={{ fontSize: '9pt', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '2px' }}>Grade / Achievement</span>
              <div style={{ fontSize: '18pt', fontWeight: 'bold', color: '#3730a3' }}>{cert.grade}</div>
            </div>
          )}

          {/* Remarks */}
          {cert.remarks && (
            <div style={{ fontSize: '10pt', color: '#6b7280', fontStyle: 'italic' }}>
              &ldquo;{cert.remarks}&rdquo;
            </div>
          )}

          {/* Decorative divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4mm', width: '80%', margin: '2mm 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #c7d2fe)' }} />
            <span style={{ color: '#818cf8', fontSize: '14pt' }}>✦</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, #c7d2fe)' }} />
          </div>

          {/* Footer: Date + Cert Number */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 'auto', paddingTop: '4mm' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '8pt', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>Issued On</div>
              <div style={{ fontSize: '11pt', fontWeight: 'bold', color: '#374151' }}>
                {formatDate(cert.issuedDate)}
              </div>
              {cert.validUntil && (
                <div style={{ fontSize: '8pt', color: '#9ca3af', marginTop: '1mm' }}>
                  Valid Until: {formatDate(cert.validUntil)}
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '40mm', borderTop: '2px solid #374151', paddingTop: '2mm', marginTop: '8mm' }}>
                <div style={{ fontSize: '8pt', color: '#9ca3af', textTransform: 'uppercase' }}>Authorized Signature</div>
                <div style={{ fontSize: '9pt', fontWeight: 'bold', color: '#374151', marginTop: '1mm' }}>{settings.name}</div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '8pt', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>Certificate No.</div>
              <div style={{ fontSize: '11pt', fontWeight: 'bold', color: '#374151', fontFamily: 'monospace' }}>
                {cert.certificateNumber}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #certificate-print, #certificate-print * { visibility: visible; }
          #certificate-print { position: fixed; left: 0; top: 0; width: 100vw; box-shadow: none !important; }
        }
      `}</style>
    </div>
  )
}
