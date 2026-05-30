import { useState, useRef } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
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
import { uploadImagen, uploadMusica } from '@/shared/api/endpoints'
import type { EstadoAnimoDTO } from '@/lib/schemas'

const FONT_OPTIONS = [
  'DM Sans',
  'Fraunces',
  'Outfit',
  'Cormorant Garamond',
  'Playfair Display',
  'Lora',
] as const

const ANIMATION_OPTIONS = ['float', 'pulse', 'wave', 'fade'] as const

interface EstadoFormProps {
  estado?: EstadoAnimoDTO
  onSubmit: (data: Omit<EstadoAnimoDTO, 'id'>) => Promise<void>
  onClose: () => void
}

const EstadoForm = ({ estado, onSubmit, onClose }: EstadoFormProps): React.JSX.Element => {
  const [codigo, setCodigo] = useState(estado?.codigo ?? '')
  const [nombre, setNombre] = useState(estado?.nombre ?? '')
  const [emoji, setEmoji] = useState(estado?.emoji ?? '')
  const [iconUrl, setIconUrl] = useState(estado?.iconUrl ?? '')
  const [colorPrimario, setColorPrimario] = useState(estado?.colorPrimario ?? '#000000')
  const [colorSecundario, setColorSecundario] = useState(estado?.colorSecundario ?? '#000000')
  const [fontFamily, setFontFamily] = useState(estado?.fontFamily ?? 'DM Sans')
  const [animationType, setAnimationType] = useState(estado?.animationType ?? 'float')
  const [musicaUrl, setMusicaUrl] = useState(estado?.musicaUrl ?? '')
  const [imagenUrl, setImagenUrl] = useState(estado?.imagenUrl ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const iconFileRef = useRef<HTMLInputElement>(null)
  const musicaFileRef = useRef<HTMLInputElement>(null)
  const imagenFileRef = useRef<HTMLInputElement>(null)

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const result = await uploadImagen(file)
      setIconUrl(result.url)
    } catch {
      setError('Error al subir icono')
    }
  }

  const handleMusicaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const result = await uploadMusica(file)
      setMusicaUrl(result.url)
    } catch {
      setError('Error al subir musica')
    }
  }

  const handleImagenUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const result = await uploadImagen(file)
      setImagenUrl(result.url)
    } catch {
      setError('Error al subir imagen')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onSubmit({
        codigo,
        nombre,
        emoji,
        iconUrl: iconUrl || null,
        colorPrimario: colorPrimario || null,
        colorSecundario: colorSecundario || null,
        fontFamily: fontFamily || null,
        animationType: animationType || null,
        musicaUrl: musicaUrl || null,
        imagenUrl: imagenUrl || null,
      })
      onClose()
    } catch {
      setError('Error al guardar estado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{estado ? 'Editar Estado' : 'Nuevo Estado'}</DialogTitle>
        <DialogDescription>
          {estado ? 'Modifica los campos del estado de animo.' : 'Crea un nuevo estado de animo.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="estado-codigo">Código (slug)</Label>
            <Input
              id="estado-codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="feliz, muy-feliz"
              pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
              title="Sólo minúsculas, números y guiones (kebab-case)"
              required
              disabled={estado !== undefined}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="estado-nombre">Nombre</Label>
            <Input
              id="estado-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Feliz"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="estado-emoji">Emoji</Label>
            <div className="flex items-center gap-2">
              <Input
                id="estado-emoji"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="😊"
                required
                className="flex-1"
              />
              {emoji && <span className="text-2xl">{emoji}</span>}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="estado-icon">Icono (URL)</Label>
          <div className="flex items-center gap-2">
            <Input
              id="estado-icon"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              placeholder="URL del icono..."
              className="flex-1"
            />
            <Button type="button" variant="outline" size="sm" onClick={() => iconFileRef.current?.click()}>
              Subir
            </Button>
            <input
              ref={iconFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleIconUpload}
            />
          </div>
          {iconUrl && (
            <img src={iconUrl} alt="Icon preview" className="h-8 w-8 rounded object-cover" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="estado-color-primario">Color Primario</Label>
            <div className="flex items-center gap-2">
              <input
                id="estado-color-primario"
                type="color"
                value={colorPrimario}
                onChange={(e) => setColorPrimario(e.target.value)}
                className="h-8 w-10 cursor-pointer rounded border border-input"
              />
              <Input
                value={colorPrimario}
                onChange={(e) => setColorPrimario(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="estado-color-secundario">Color Secundario</Label>
            <div className="flex items-center gap-2">
              <input
                id="estado-color-secundario"
                type="color"
                value={colorSecundario}
                onChange={(e) => setColorSecundario(e.target.value)}
                className="h-8 w-10 cursor-pointer rounded border border-input"
              />
              <Input
                value={colorSecundario}
                onChange={(e) => setColorSecundario(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Fuente</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Animacion</Label>
            <Select value={animationType} onValueChange={setAnimationType}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ANIMATION_OPTIONS.map((anim) => (
                  <SelectItem key={anim} value={anim}>
                    {anim}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Musica</Label>
          <div className="flex items-center gap-2">
            <Input
              value={musicaUrl}
              onChange={(e) => setMusicaUrl(e.target.value)}
              placeholder="URL de musica..."
              className="flex-1"
            />
            <Button type="button" variant="outline" size="sm" onClick={() => musicaFileRef.current?.click()}>
              Subir
            </Button>
            <input
              ref={musicaFileRef}
              type="file"
              accept="audio/mp3,audio/wav,audio/ogg,audio/mpeg"
              className="hidden"
              onChange={handleMusicaUpload}
            />
          </div>
          {musicaUrl && (
            <audio controls src={musicaUrl} className="w-full h-8">
              <track kind="captions" />
            </audio>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Imagen</Label>
          <div className="flex items-center gap-2">
            <Input
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              placeholder="URL de imagen..."
              className="flex-1"
            />
            <Button type="button" variant="outline" size="sm" onClick={() => imagenFileRef.current?.click()}>
              Subir
            </Button>
            <input
              ref={imagenFileRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleImagenUpload}
            />
          </div>
          {imagenUrl && (
            <img src={imagenUrl} alt="Preview" className="h-20 w-20 rounded object-cover" />
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}

export default EstadoForm
