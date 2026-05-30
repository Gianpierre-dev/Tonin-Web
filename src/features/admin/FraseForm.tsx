import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/dialog'
import { getEstados } from '@/shared/api/endpoints'
import { getErrorMessage } from '@/lib/getErrorMessage'
import type { EstadoAnimoDTO, FraseDTO, FraseWriteDTO } from '@/lib/schemas'

const MIN_CHARS = 5
const MAX_CHARS = 500

interface FraseFormProps {
  frase?: FraseDTO
  onSubmit: (data: FraseWriteDTO) => Promise<void>
  onClose: () => void
}

const FraseForm = ({ frase, onSubmit, onClose }: FraseFormProps): React.JSX.Element => {
  const { t } = useTranslation()
  const isEditing = frase !== undefined
  const [tradEs, setTradEs] = useState(frase?.traducciones.es ?? '')
  const [tradEn, setTradEn] = useState(frase?.traducciones.en ?? '')
  const [estadoAnimoId, setEstadoAnimoId] = useState(
    frase?.estadoAnimo.id.toString() ?? '',
  )
  const [estados, setEstados] = useState<EstadoAnimoDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // `i18n.t` (no `t` del hook) para no re-fetchear estados cada vez que se
  // cambia el idioma con el dialog abierto.
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const data = await getEstados()
        setEstados(data)
      } catch (err) {
        setError(getErrorMessage(err, i18n.t('admin.form.errorLoadEstados')))
      }
    }
    void fetchEstados()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (tradEs.trim().length === 0) {
      setError(t('admin.form.esRequired'))
      return
    }
    if (tradEs.length < MIN_CHARS || tradEs.length > MAX_CHARS) {
      setError(t('admin.form.charsOutOfRange', { min: MIN_CHARS, max: MAX_CHARS }))
      return
    }
    if (!estadoAnimoId) {
      setError(t('admin.form.selectMood'))
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        traducciones: {
          es: tradEs.trim(),
          ...(tradEn.trim().length > 0 ? { en: tradEn.trim() } : {}),
        },
        estadoAnimoId: Number(estadoAnimoId),
      })
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, t('admin.form.errorSaveFrase')))
    } finally {
      setLoading(false)
    }
  }

  const charCountEs = tradEs.length
  const isOverLimit = charCountEs > MAX_CHARS
  const isUnderLimit = charCountEs > 0 && charCountEs < MIN_CHARS

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEditing ? t('admin.form.fraseEdit') : t('admin.form.fraseNew')}</DialogTitle>
        <DialogDescription>{t('admin.form.fraseDesc')}</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Traducción ES */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="frase-trad-es">{t('admin.form.labelEs')}</Label>
          <Textarea
            id="frase-trad-es"
            value={tradEs}
            onChange={(e) => setTradEs(e.target.value)}
            placeholder="Sé feliz hoy"
            required
            rows={3}
          />
          <p
            className={`text-xs ${
              isOverLimit || isUnderLimit ? 'text-destructive' : 'text-muted-foreground'
            }`}
          >
            {t('admin.form.charCount', { count: charCountEs, max: MAX_CHARS })}
            {isUnderLimit && t('admin.form.charMin', { min: MIN_CHARS })}
          </p>
        </div>

        {/* Traducción EN */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="frase-trad-en">{t('admin.form.labelEn')}</Label>
          <Textarea
            id="frase-trad-en"
            value={tradEn}
            onChange={(e) => setTradEn(e.target.value)}
            placeholder="Be happy today"
            rows={3}
          />
        </div>

        {/* Estado de ánimo */}
        <div className="flex flex-col gap-2">
          <Label>{t('admin.form.moodLabel')}</Label>
          <Select value={estadoAnimoId} onValueChange={setEstadoAnimoId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('admin.form.selectMood')} />
            </SelectTrigger>
            <SelectContent>
              {estados.map((estado) => (
                <SelectItem key={estado.id} value={estado.id.toString()}>
                  {estado.emoji} {estado.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={loading || isOverLimit}>
            {loading ? t('common.saving') : t('common.save')}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}

export default FraseForm
