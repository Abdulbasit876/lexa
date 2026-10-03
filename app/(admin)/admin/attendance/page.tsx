'use client'

import React, { useState, useEffect } from 'react'
import { getAcademicClasses } from '@/app/actions/academic'
import { getComputerCourses } from '@/app/actions/courses'
import { getAttendanceForClassOrCourse, saveAttendanceBatch } from '@/app/actions/attendance'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { CalendarCheck, Save, Search } from 'lucide-react'
import { AttendanceStatus } from '@prisma/client'

export default function AdminAttendancePage() {
  const toast = useToast()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [categoryType, setCategoryType] = useState<'ACADEMIC' | 'COMPUTER'>('ACADEMIC')
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [classes, setClasses] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [records, setRecords] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    getAcademicClasses().then((cls) => {
      setClasses(cls)
      if (cls.length > 0) setSelectedClassId(cls[0].id)
    })
    getComputerCourses().then((crs) => {
      setCourses(crs)
    })
  }, [])

  const fetchAttendance = async () => {
    setIsLoading(true)
    const data = await getAttendanceForClassOrCourse({
      date,
      academicClassId: categoryType === 'ACADEMIC' ? selectedClassId : undefined,
      computerCourseId: categoryType === 'COMPUTER' ? selectedCourseId : undefined,
    })
    setRecords(data)
    setIsLoading(false)
  }

  useEffect(() => {
    if ((categoryType === 'ACADEMIC' && selectedClassId) || (categoryType === 'COMPUTER' && selectedCourseId)) {
      fetchAttendance()
    }
  }, [date, categoryType, selectedClassId, selectedCourseId])

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    const res = await saveAttendanceBatch({
      date,
      academicClassId: categoryType === 'ACADEMIC' ? selectedClassId : undefined,
      computerCourseId: categoryType === 'COMPUTER' ? selectedCourseId : undefined,
      records: records.map((r) => ({
        studentId: r.studentId,
        status: r.status,
        note: r.note,
      })),
    })
    setIsSaving(false)

    if (res.error) {
      toast.error(res.error)
      return
    }

    toast.success('Attendance saved successfully!')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Attendance Management</h2>
          <p className="text-xs text-slate-500">Mark daily attendance for academic classes or computer courses.</p>
        </div>

        <Button
          onClick={handleSave}
          variant="primary"
          size="md"
          isLoading={isSaving}
          disabled={records.length === 0}
          icon={<Save className="h-4 w-4" />}
        >
          Save Attendance
        </Button>
      </div>

      {/* Selector Controls Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Category Type</label>
            <select
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold"
            >
              <option value="ACADEMIC">Academic Class</option>
              <option value="COMPUTER">Computer Course</option>
            </select>
          </div>

          {categoryType === 'ACADEMIC' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Select Class</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Select Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <option value="">-- Choose Course --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button onClick={fetchAttendance} variant="outline" size="sm" icon={<Search className="h-4 w-4" />}>
            Load Roster
          </Button>
        </div>
      </Card>

      {/* Attendance Marking Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Student ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {records.map((r) => (
                <tr key={r.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{r.studentIdNum}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{r.fullName}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(r.studentId, 'PRESENT')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          r.status === 'PRESENT'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(r.studentId, 'ABSENT')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          r.status === 'ABSENT'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(r.studentId, 'LEAVE')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          r.status === 'LEAVE'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        Leave
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {records.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500">
                    No active students enrolled in this selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
