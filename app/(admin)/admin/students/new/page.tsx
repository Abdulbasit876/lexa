'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createStudent } from '@/app/actions/students'
import { getAcademicClasses } from '@/app/actions/academic'
import { getComputerCourses } from '@/app/actions/courses'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import { ArrowLeft, UserPlus } from 'lucide-react'
import Link from 'next/link'

export default function AddStudentPage() {
  const router = useRouter()
  const toast = useToast()
  const [classes, setClasses] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    phone: '',
    email: '',
    address: '',
    dateOfBirth: '',
    username: '',
    password: '',
    monthlyFee: '2500',
    academicClassId: '',
    computerCourseIds: [] as string[],
    notes: '',
  })

  useEffect(() => {
    getAcademicClasses().then(setClasses)
    getComputerCourses().then(setCourses)
  }, [])

  const toggleCourse = (courseId: string) => {
    setFormData((prev) => ({
      ...prev,
      computerCourseIds: prev.computerCourseIds.includes(courseId)
        ? prev.computerCourseIds.filter((id) => id !== courseId)
        : [...prev.computerCourseIds, courseId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const res = await createStudent({
      fullName: formData.fullName,
      fatherName: formData.fatherName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth,
      username: formData.username,
      password: formData.password,
      monthlyFee: parseFloat(formData.monthlyFee) || 0,
      academicClassId: formData.academicClassId || undefined,
      computerCourseIds: formData.computerCourseIds,
      notes: formData.notes,
    })

    setIsLoading(false)

    if (res.error) {
      toast.error(res.error)
      return
    }

    toast.success('Student added successfully!')
    router.push('/admin/students')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/students">
          <Button variant="outline" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Add New Student</h2>
          <p className="text-xs text-slate-500">Create a student record and generate login credentials.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PERSONAL INFO */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">1. Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  required
                  placeholder="Ali Raza"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
                <Input
                  label="Father Name"
                  placeholder="Ahmed Khan"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                />
                <Input
                  label="Phone Number"
                  placeholder="0300-1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
                <Input
                  label="Address"
                  placeholder="City / Area"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            {/* LOGIN CREDENTIALS */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">2. Account Credentials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Login Username *"
                  required
                  placeholder="ali.raza"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <Input
                  label="Password *"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {/* CATEGORY & COURSE ASSIGNMENTS */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">3. Class & Course Assignment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Academic Class (Optional)"
                  value={formData.academicClassId}
                  onChange={(e) => setFormData({ ...formData, academicClassId: e.target.value })}
                >
                  <option value="">-- None --</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>

                <Input
                  label="Monthly Fee (Rs.) *"
                  type="number"
                  required
                  value={formData.monthlyFee}
                  onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                />
              </div>

              {/* Computer course checkable checkboxes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Computer Courses (Optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {courses.map((course) => (
                    <label
                      key={course.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                        formData.computerCourseIds.includes(course.id)
                          ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-200'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.computerCourseIds.includes(course.id)}
                        onChange={() => toggleCourse(course.id)}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span>{course.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Textarea
                label="Additional Notes"
                placeholder="Admission remarks..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full justify-center" icon={<UserPlus className="h-4 w-4" />}>
              Save & Register Student
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
