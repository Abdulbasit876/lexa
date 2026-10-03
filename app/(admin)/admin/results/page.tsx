'use client'

import React, { useState, useEffect } from 'react'
import { getTestResults, recordTestResult } from '@/app/actions/tests'
import { getTests } from '@/app/actions/tests'
import { getStudents } from '@/app/actions/students'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useToast } from '@/components/ui/Toast'
import { Award, Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default function AdminResultsPage() {
  const toast = useToast()
  const [results, setResults] = useState<any[]>([])
  const [tests, setTests] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [addModal, setAddModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    testId: '',
    studentId: '',
    obtainedMarks: '',
    remarks: '',
  })

  const loadData = () => {
    getTestResults().then(setResults)
    getTests().then(setTests)
    getStudents({ status: 'ACTIVE' as any }).then(setStudents)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const res = await recordTestResult({
      testId: formData.testId,
      studentId: formData.studentId,
      obtainedMarks: parseInt(formData.obtainedMarks, 10) || 0,
      remarks: formData.remarks,
    })

    setIsLoading(false)

    if (res.error) {
      toast.error(res.error)
      return
    }

    toast.success('Test result recorded!')
    setFormData({ testId: '', studentId: '', obtainedMarks: '', remarks: '' })
    setAddModal(false)
    loadData()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/tests">
            <Button variant="outline" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Student Results Entry</h2>
            <p className="text-xs text-slate-500">Record obtained marks and grades for students.</p>
          </div>
        </div>
        <Button onClick={() => setAddModal(true)} variant="primary" size="md" icon={<Plus className="h-4 w-4" />}>
          Record Result
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Test Title</th>
                <th className="p-4">Obtained / Total Marks</th>
                <th className="p-4">Percentage</th>
                <th className="p-4">Grade</th>
                <th className="p-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {results.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={r.student.fullName} size="sm" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">{r.student.fullName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{r.student.studentId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{r.test.title}</td>
                  <td className="p-4 font-mono font-bold">
                    {r.obtainedMarks} / {r.totalMarks}
                  </td>
                  <td className="p-4 font-bold text-indigo-600">{Number(r.percentage).toFixed(1)}%</td>
                  <td className="p-4">
                    <Badge variant="info">Grade {r.grade || 'A'}</Badge>
                  </td>
                  <td className="p-4 text-slate-500">{r.remarks || '—'}</td>
                </tr>
              ))}

              {results.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No student results recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal Record Result */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Record Student Test Result">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Select Test *" required value={formData.testId} onChange={(e) => setFormData({ ...formData, testId: e.target.value })}>
            <option value="">-- Choose Test --</option>
            {tests.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.totalMarks} Marks)
              </option>
            ))}
          </Select>

          <Select label="Select Student *" required value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}>
            <option value="">-- Choose Student --</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.studentId})
              </option>
            ))}
          </Select>

          <Input label="Obtained Marks *" type="number" required placeholder="e.g. 85" value={formData.obtainedMarks} onChange={(e) => setFormData({ ...formData, obtainedMarks: e.target.value })} />
          <Input label="Remarks (Optional)" placeholder="Excellent effort" value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} />

          <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full justify-center">
            Save Result
          </Button>
        </form>
      </Modal>
    </div>
  )
}
