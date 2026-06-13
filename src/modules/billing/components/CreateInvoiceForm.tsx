import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, IndianRupee, Save, Calendar, Search, Tag, Receipt } from 'lucide-react'
import { invoiceFormSchema, InvoiceFormSchemaType, getEmptyInvoiceForm } from '../schemas'
import { patientService } from '@/modules/patients/services/patientService'
import { Patient } from '@/modules/patients/types'
import { examinationService } from '@/modules/examination/services/examinationService'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface CreateInvoiceFormProps {
  onSuccess: (data: InvoiceFormSchemaType) => Promise<void>
  onCancel?: () => void
}

export const CreateInvoiceForm: React.FC<CreateInvoiceFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoadingPatients, setIsLoadingPatients] = useState(false)

  // Local inputs state for adding a treatment item
  const [itemTreatmentName, setItemTreatmentName] = useState('')
  const [itemToothNumber, setItemToothNumber] = useState('All')
  const [itemQuantity, setItemQuantity] = useState(1)
  const [itemUnitCost, setItemUnitCost] = useState('')
  const [localError, setLocalError] = useState('')

  const treatmentSuggestions = examinationService.getTreatmentSuggestions()

  // Configure Form hook
  const methods = useForm<InvoiceFormSchemaType>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: getEmptyInvoiceForm(),
  })

  const { register, control, handleSubmit, setValue, formState: { errors, isSubmitting } } = methods

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  // Load patient directory
  useEffect(() => {
    setIsLoadingPatients(true)
    patientService.getPatients()
      .then(setPatients)
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingPatients(false))
  }, [])

  // Auto-populate when selecting patient
  const handleSelectPatient = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    if (!id) return

    const p = patients.find((pat) => pat.id === id)
    if (p) {
      setValue('patientId', p.id)
      setValue('patientName', p.patientName)
      setValue('branchName', p.branchName || 'Saket - New Delhi')
    }
  }

  // Handle adding custom billing item
  const handleAddItem = () => {
    if (!itemTreatmentName.trim()) {
      setLocalError('Treatment name is required.')
      return
    }
    if (!itemToothNumber.trim()) {
      setLocalError('Tooth reference is required (e.g. 14, 36, All).')
      return
    }
    const cost = parseFloat(itemUnitCost) || 0
    if (cost < 0) {
      setLocalError('Unit cost cannot be negative.')
      return
    }

    setLocalError('')
    append({
      id: Math.random().toString(36).substring(2, 9),
      treatmentName: itemTreatmentName.trim(),
      toothNumber: itemToothNumber.trim(),
      quantity: Number(itemQuantity),
      unitCost: cost,
      amount: Number(itemQuantity) * cost,
    })

    // Reset local inputs
    setItemTreatmentName('')
    setItemToothNumber('All')
    setItemQuantity(1)
    setItemUnitCost('')
  }

  // Watch items, discount and tax to do automatic calculations in real-time!
  const watchedItems = useWatch({ control, name: 'items' }) || []
  const watchedDiscount = useWatch({ control, name: 'discount' }) || 0
  const watchedTax = useWatch({ control, name: 'tax' }) || 0

  const summaryCalculations = React.useMemo(() => {
    const totalAmount = watchedItems.reduce((acc, item: any) => acc + (item.quantity * item.unitCost), 0)
    
    const discountVal = (totalAmount * watchedDiscount) / 100
    const subtotal = totalAmount - discountVal
    
    const taxVal = (subtotal * watchedTax) / 100
    const netAmount = Math.round(subtotal + taxVal)

    return { totalAmount, discountVal, taxVal, netAmount }
  }, [watchedItems, watchedDiscount, watchedTax])

  return (
    <div className="space-y-6 text-left max-w-xl mx-auto">
      
      <div>
        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide">
          Invoice Generation Studio
        </p>
        <p className="text-xs text-text-secondary/70 mt-1">
          Perform treatment billing with automatic discount/tax adjustments. Reuses table and grid widgets.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSuccess)} className="space-y-6">
        
        {/* 1. Patient Directory Search Selection */}
        <div className="bg-background/25 border border-border/60 rounded-xl p-4.5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5 select-none">
              <Search className="w-4 h-4 text-primary" />
              <span>Patient Reference Folder</span>
            </label>
            
            <select
              onChange={handleSelectPatient}
              className="w-full bg-surface border border-border/80 rounded-input text-xs font-semibold py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-text-primary"
              disabled={isLoadingPatients}
              defaultValue=""
            >
              <option value="" disabled>
                {isLoadingPatients ? 'Loading Sirona registry...' : 'Select patient from database...'}
              </option>
              {patients.map((pat) => (
                <option key={pat.id} value={pat.id}>
                  {pat.patientName} ({pat.mobileNumber})
                </option>
              ))}
            </select>
            {errors.patientId && (
              <span className="text-xs font-semibold text-danger animate-fadeIn">
                {errors.patientId.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Invoice Date"
              type="date"
              leftIcon={<Calendar className="w-4 h-4 text-text-secondary" />}
              error={errors.invoiceDate?.message}
              {...register('invoiceDate')}
            />
            <Input
              label="Settlement Due Date"
              type="date"
              leftIcon={<Calendar className="w-4 h-4 text-text-secondary" />}
              error={errors.dueDate?.message}
              {...register('dueDate')}
            />
          </div>
        </div>

        {/* 2. Add Billing Item subform */}
        <div className="bg-background/25 border border-border/60 rounded-xl p-4.5 space-y-4">
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5 select-none">
            <Receipt className="w-4.5 h-4.5 text-primary" />
            <span>Add Treatment Billing Item</span>
          </h4>

          {localError && (
            <span className="text-xs font-semibold text-danger block animate-fadeIn">
              {localError}
            </span>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5 md:col-span-2 text-left">
              <span className="text-xs font-semibold text-text-primary">Treatment / Material Charged</span>
              <input
                type="text"
                placeholder="e.g. Scaling & cleanup..."
                value={itemTreatmentName}
                onChange={(e) => setItemTreatmentName(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-input text-xs font-semibold py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-text-primary placeholder:text-text-secondary/40"
                list="treatment-options"
              />
              <datalist id="treatment-options">
                {treatmentSuggestions.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <Input
              label="Tooth Reference"
              placeholder="e.g. 14, All"
              value={itemToothNumber}
              onChange={(e) => setItemToothNumber(e.target.value)}
            />

            <Input
              label="Unit Cost (INR)"
              placeholder="e.g. 1500"
              type="number"
              value={itemUnitCost}
              onChange={(e) => setItemUnitCost(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="w-32 text-left shrink-0">
              <Input
                label="Quantity"
                type="number"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(Math.max(1, Number(e.target.value)))}
              />
            </div>
            
            <Button
              type="button"
              variant="outline"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleAddItem}
              className="w-full sm:w-auto font-bold border-primary/20 text-primary hover:bg-primary-light/10 text-xs py-2.5 px-5 h-auto shrink-0"
            >
              Add Item
            </Button>
          </div>
        </div>

        {/* 3. Items list tracker */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider select-none">
            Billing Items Added ({fields.length})
          </h4>
          {errors.items && (
            <span className="text-xs font-semibold text-danger block animate-fadeIn">
              {errors.items.message}
            </span>
          )}

          {fields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-border/50 rounded-xl text-xs text-text-secondary/50 font-semibold bg-background/5 select-none">
              No treatment charges added yet. Use the card above to register charges.
            </div>
          ) : (
            <div className="border border-border/60 rounded-xl overflow-hidden bg-white shadow-premium text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-background/40 text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                    <th className="p-3 pl-4">Description</th>
                    <th className="p-3">Tooth</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Unit Cost</th>
                    <th className="p-3 pr-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, idx) => {
                    const item = field as unknown as any
                    return (
                      <tr key={field.id} className="border-b border-border/30 last:border-b-0 font-semibold text-text-primary">
                        <td className="p-3 pl-4 font-bold">{item.treatmentName}</td>
                        <td className="p-3">
                          <span className="text-[9px] font-black text-primary bg-primary-light px-2 py-0.5 rounded-full uppercase leading-none">
                            {item.toothNumber === 'All' ? 'Full Arch' : `#${item.toothNumber}`}
                          </span>
                        </td>
                        <td className="p-3 font-bold">{item.quantity}</td>
                        <td className="p-3 font-bold">₹{item.unitCost.toLocaleString()}</td>
                        <td className="p-3 pr-4 text-right font-black flex items-center justify-end gap-1.5">
                          <span className="flex items-center gap-0.5">
                            <IndianRupee className="w-3.5 h-3.5 text-text-secondary" />
                            <span>{(item.quantity * item.unitCost).toLocaleString()}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="text-text-secondary hover:text-danger p-1 rounded hover:bg-danger/5 cursor-pointer ml-1"
                            title="Remove charge item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 4. Automated billing summary details */}
        {fields.length > 0 && (
          <div className="bg-background/25 border border-border/60 rounded-xl p-4.5 space-y-4 text-xs font-semibold select-none">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide border-b border-border/40 pb-2 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-primary shrink-0" />
              <span>Invoice Calculations</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Apply Discount Percentage (%)"
                placeholder="e.g. 10"
                type="number"
                error={errors.discount?.message}
                {...register('discount', { valueAsNumber: true })}
              />
              <Input
                label="Apply Tax Percentage (%)"
                placeholder="e.g. 18"
                type="number"
                error={errors.tax?.message}
                {...register('tax', { valueAsNumber: true })}
              />
            </div>

            {/* Calculations Breakdown list */}
            <div className="border-t border-border/30 pt-3.5 space-y-2 text-left">
              <div className="flex justify-between text-xs text-text-secondary font-bold">
                <span>Subtotal Amount</span>
                <span className="flex items-center gap-0.5 text-text-primary">
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>{summaryCalculations.totalAmount.toLocaleString()}</span>
                </span>
              </div>
              
              <div className="flex justify-between text-xs text-text-secondary font-bold">
                <span>Discount Applied ({watchedDiscount}%)</span>
                <span className="flex items-center gap-0.5 text-danger font-extrabold">
                  <span>-</span>
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>{summaryCalculations.discountVal.toLocaleString()}</span>
                </span>
              </div>

              <div className="flex justify-between text-xs text-text-secondary font-bold">
                <span>Tax Charged ({watchedTax}% GST)</span>
                <span className="flex items-center gap-0.5 text-text-primary">
                  <span>+</span>
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>{summaryCalculations.taxVal.toLocaleString()}</span>
                </span>
              </div>

              <div className="flex justify-between text-sm border-t border-dashed border-border/60 pt-2 font-black text-text-primary">
                <span>Grand Net Amount Due</span>
                <span className="flex items-center gap-0.5 text-primary text-base">
                  <IndianRupee className="w-4.5 h-4.5" />
                  <span>{summaryCalculations.netAmount.toLocaleString()}</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Form controls */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border/40 shrink-0 select-none">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="font-bold text-xs bg-white border border-border/80 text-text-secondary hover:bg-background"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || fields.length === 0}
            leftIcon={<Save className="w-4 h-4" />}
            className="font-bold text-xs shadow-premium"
          >
            Generate &amp; Issue Invoice
          </Button>
        </div>

      </form>
    </div>
  )
}
export default CreateInvoiceForm
