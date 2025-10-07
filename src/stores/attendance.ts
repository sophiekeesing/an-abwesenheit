import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Absence {
  id: string
  studentId: string
  studentName: string
  classId: string
  startDate: string
  endDate: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  documentPath?: string // Path to uploaded AU scan
  submittedAt: string
  teacherId?: string
  teacherNotes?: string
}

export const useAttendanceStore = defineStore('attendance', () => {
  const absences = ref<Absence[]>([
    // Mock data for development
    {
      id: '1',
      studentId: '2',
      studentName: 'Max Mustermann',
      classId: 'IT4L',
      startDate: '2024-10-01',
      endDate: '2024-10-03',
      reason: 'Erkältung',
      status: 'approved',
      submittedAt: '2024-09-30T10:00:00Z',
      teacherId: '1',
      teacherNotes: 'Ärztliche Bescheinigung vorhanden',
    },
    {
      id: '2',
      studentId: '3',
      studentName: 'Anna Schmidt',
      classId: 'IT4O',
      startDate: '2024-10-05',
      endDate: '2024-10-05',
      reason: 'Arzttermin',
      status: 'pending',
      submittedAt: '2024-10-04T15:30:00Z',
    },
  ])

  const classes = ref<string[]>(['IT4L', 'IT4O', 'IT4K'])

  const getAbsencesForStudent = computed(() => (studentId: string) => {
    return absences.value.filter((absence) => absence.studentId === studentId)
  })

  const getAbsencesForClass = computed(() => (classId: string) => {
    return absences.value.filter((absence) => absence.classId === classId)
  })

  const getPendingAbsences = computed(() => {
    return absences.value.filter((absence) => absence.status === 'pending')
  })

  const submitAbsence = (absence: Omit<Absence, 'id' | 'submittedAt' | 'status'>) => {
    const newAbsence: Absence = {
      ...absence,
      id: Date.now().toString(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    }
    absences.value.push(newAbsence)
  }

  const updateAbsenceStatus = (
    absenceId: string,
    status: Absence['status'],
    teacherId?: string,
    teacherNotes?: string,
  ) => {
    const absence = absences.value.find((a) => a.id === absenceId)
    if (absence) {
      absence.status = status
      if (teacherId) absence.teacherId = teacherId
      if (teacherNotes) absence.teacherNotes = teacherNotes
    }
  }

  const updateAbsenceDates = (absenceId: string, startDate: string, endDate: string) => {
    const absence = absences.value.find((a) => a.id === absenceId)
    if (absence) {
      absence.startDate = startDate
      absence.endDate = endDate
    }
  }

  return {
    absences,
    classes,
    getAbsencesForStudent,
    getAbsencesForClass,
    getPendingAbsences,
    submitAbsence,
    updateAbsenceStatus,
    updateAbsenceDates,
  }
})
