import { useState, useEffect } from 'react'
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
import type { EstadoAnimoDTO, FraseDTO } from '@/lib/schemas'

const MIN_CHARS = 5
const MAX_CHARS = 500

interface FraseFormProps {
  frase?: FraseDTO
  onSubmit: (texto: string, estadoAnimoId: number) => Promise<void>
  onClose: () => void
}

const FraseForm = ({ frase, onSubmit, onClose }: FraseFormProps): React.JSX.Element => {
  const [texto, setTexto] = useState(frase?.texto ?? '')
  const [estadoAnimoId, setEstadoAnimoId] = useState(
    frase?.estadoAnimo.id.toString() ?? '',
  )
  const [estados, setEstados] = useState<EstadoAnimoDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const data = await getEstados()
        setEstados(data)
      } catch {
        setError('Error al cargar estados')
      }
    }
    void fetchEstados()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (texto.length < MIN_CHARS || texto.length > MAX_CHARS) {
      setError(`El texto debe tener entre ${MIN_CHARS} y ${MAX_CHARS} caracteres`)
      return
    }

    if (!estadoAnimoId) {
      setError('Selecciona un estado de animo')
      return
    }

    setLoading(true)
    try {
      await onSubmit(texto, Number(estadoAnimoId))
      onClose()
    } catch {
      setError('Error al guardar frase')
    } finally {
      setLoading(false)
    }
  }

  const charCount = texto.length
  const isOverLimit = charCount > MAX_CHARS
  const isUnderLimit = charCount > 0 && charCount < MIN_CHARS

  return (
    <>
      <DialogHeader>
        <DialogTitle>{frase ? 'Editar Frase' : 'Nueva Frase'}</DialogTitle>
        <DialogDescription>
          Las frases deben validar el sentimiento antes de ofrecer perspectiva.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="frase-texto">Texto</Label>
          <Textarea
            id="frase-texto"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe la frase motivacional..."
            required
            rows={4}
          />
          <p
            className={`text-xs ${
              isOverLimit || isUnderLimit
                ? 'text-destructive'
                : 'text-muted-foreground'
            }`}
          >
            {charCount}/{MAX_CHARS} caracteres
            {isUnderLimit && ` (minimo ${MIN_CHARS})`}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Estado de Animo</Label>
          <Select value={estadoAnimoId} onValueChange={setEstadoAnimoId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar estado..." />
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
            Cancelar
          </Button>
          <Button type="submit" disabled={loading || isOverLimit}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}

export default FraseForm
