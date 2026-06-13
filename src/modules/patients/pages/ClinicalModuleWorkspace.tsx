import React, { useState, useEffect } from 'react'
import { Search, Heart, Stethoscope, Activity, FolderOpen, ClipboardList, FileSpreadsheet } from 'lucide-react'
import { patientService } from '../services/patientService'
import { Patient } from '../types'
import { PageHeader, ContentContainer, CardContainer } from '@/components/layout/LayoutComponents'

// Import actual clinical modules
import { MedicalHistoryTab } from '@/modules/medical-history/components/MedicalHistoryTab'
import { DentalHistoryTab } from '@/modules/dental-history/components/DentalHistoryTab'
import { ExaminationTab } from '@/modules/examination'
import { InvestigationsTab } from '@/modules/investigations'
import { ClinicalNotesTab } from '@/modules/clinical-notes'
import { PrescriptionTab } from '@/modules/prescriptions'

interface ClinicalModuleWorkspaceProps {
  moduleType: 'medical' | 'dental' | 'examination' | 'investigations' | 'notes' | 'prescriptions'
}

export const ClinicalModuleWorkspace: React.FC<ClinicalModuleWorkspaceProps> = ({ moduleType }) => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [isLoadingPatients, setIsLoadingPatients] = useState(false)

  // Load patients directory on mount
  useEffect(() => {
    setIsLoadingPatients(true)
    patientService.getPatients()
      .then(setPatients)
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingPatients(false))
  }, [])

  // Module configuration helper
  const config = React.useMemo(() => {
    switch (moduleType) {
      case 'medical':
        return {
          title: 'Systemic Medical History',
          subtitle: 'Audit patient systemic conditions, vitals, active medications, allergies, and surgeries.',
          icon: <Heart className="w-5 h-5 text-primary shrink-0" />,
          placeholder: 'Select a patient folder to view their Medical History.',
        }
      case 'dental':
        return {
          title: 'Dental History Ledger',
          subtitle: 'Audit patient previous treatments, oral hygiene, and habits risk indicators.',
          icon: <Stethoscope className="w-5 h-5 text-primary shrink-0" />,
          placeholder: 'Select a patient folder to view their Dental History.',
        }
      case 'examination':
        return {
          title: 'Interactive Odontogram Charting',
          subtitle: 'Perform clinical charting, record tooth conditions, and propose treatments.',
          icon: <Activity className="w-5 h-5 text-primary shrink-0" />,
          placeholder: 'Select a patient folder to view their Odontogram Chart.',
        }
      case 'investigations':
        return {
          title: 'Investigations & Imaging Archive',
          subtitle: 'Review intra-oral photos, OPG panoramic radiographs, and 3D STL scans.',
          icon: <FolderOpen className="w-5 h-5 text-primary shrink-0" />,
          placeholder: 'Select a patient folder to open their Diagnostics Vault.',
        }
      case 'notes':
        return {
          title: 'Clinical Treatment Notes',
          subtitle: 'Record procedures done today and formulate sequential future plans.',
          icon: <ClipboardList className="w-5 h-5 text-primary shrink-0" />,
          placeholder: 'Select a patient folder to review their Clinical Notes.',
        }
      case 'prescriptions':
        return {
          title: 'Prescriptions & Medicaments Planner',
          subtitle: 'Generate printable Rx receipts, manage dosages, and propose follow-up dates.',
          icon: <FileSpreadsheet className="w-5 h-5 text-primary shrink-0" />,
          placeholder: 'Select a patient folder to draft prescriptions.',
        }
      default:
        return {
          title: 'Clinical Workspace',
          subtitle: 'Manage patient specific records.',
          icon: <Activity className="w-5 h-5 text-primary shrink-0" />,
          placeholder: 'Please select a patient.',
        }
    }
  }, [moduleType])

  return (
    <ContentContainer className="space-y-6 animate-fadeIn pb-12">
      
      {/* Dynamic Header */}
      <PageHeader
        title={config.title}
        subtitle={config.subtitle}
      />

      {/* 1. Interactive Patient Selector Bar */}
      <CardContainer className="bg-primary/5 border border-primary/10 p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-2">
          <Search className="w-4.5 h-4.5 text-primary animate-pulse" />
          <span className="text-xs font-black text-primary">Patient Selector Portal:</span>
        </div>

        <div className="w-full sm:w-72">
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full bg-white border border-border/80 rounded-xl text-xs font-bold py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-text-primary"
            disabled={isLoadingPatients}
          >
            <option value="">
              {isLoadingPatients ? 'Loading patient registries...' : 'Choose patient folder...'}
            </option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.patientName} ({p.mobileNumber})
              </option>
            ))}
          </select>
        </div>
      </CardContainer>

      {/* 2. RENDERING VIEWSPACE */}
      {selectedPatientId ? (
        <div className="animate-fadeIn">
          {moduleType === 'medical' && <MedicalHistoryTab patientId={selectedPatientId} />}
          {moduleType === 'dental' && <DentalHistoryTab patientId={selectedPatientId} />}
          {moduleType === 'examination' && <ExaminationTab patientId={selectedPatientId} />}
          {moduleType === 'investigations' && <InvestigationsTab patientId={selectedPatientId} />}
          {moduleType === 'notes' && <ClinicalNotesTab patientId={selectedPatientId} />}
          {moduleType === 'prescriptions' && <PrescriptionTab patientId={selectedPatientId} />}
        </div>
      ) : (
        /* Empty selection view state */
        <CardContainer className="text-center py-12 max-w-lg mx-auto select-none">
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary mx-auto mb-4 animate-bounce">
            {config.icon}
          </div>
          <h3 className="text-sm font-heading font-black text-text-primary">{config.title}</h3>
          <p className="text-xs text-text-secondary mt-2 max-w-xs mx-auto leading-relaxed">
            {config.placeholder} Use the selector bar on top to load patient files.
          </p>
        </CardContainer>
      )}

    </ContentContainer>
  )
}
export default ClinicalModuleWorkspace
