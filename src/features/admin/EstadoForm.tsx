import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
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
import { getErrorMessage } from '@/lib/getErrorMessage'
import type { EstadoAnimoDTO, EstadoAnimoWriteDTO } from '@/lib/schemas'

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
  onSubmit: (data: EstadoAnimoWriteDTO) => Promise<void>
  onClose: () => void
}

const EstadoForm = ({ estado, onSubmit, onClose }: EstadoFormProps): React.JSX.Element => {
  const { t } = useTranslation()
  const isEditing = estado !== undefined
  const [codigo, setCodigo] = useState(estado?.codigo ?? '')
  const [tradEs, setTradEs] = useState(estado?.traducciones.es ?? '')
  const [tradEn, setTradEn] = useState(estado?.traducciones.en ?? '')
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
    } catch (err) {
      setError(getErrorMessage(err, t('admin.form.errorUploadIcon')))
    }
  }

  const handleMusicaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const result = await uploadMusica(file)
      setMusicaUrl(result.url)
    } catch (err) {
      setError(getErrorMessage(err, t('admin.form.errorUploadMusica')))
    }
  }

  const handleImagenUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const result = await uploadImagen(file)
      setImagenUrl(result.url)
    } catch (err) {
      setError(getErrorMessage(err, t('admin.form.errorUploadImagen')))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    // Validación cliente: el back ya exige `es` (400), pero damos feedback inmediato.
    if (tradEs.trim().length === 0) {
      setError(t('admin.form.esRequired'))
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        codigo,
        emoji,
        iconUrl: iconUrl || null,
        colorPrimario: colorPrimario || null,
        colorSecundario: colorSecundario || null,
        fontFamily: fontFamily || null,
        animationType: animationType || null,
        musicaUrl: musicaUrl || null,
        imagenUrl: imagenUrl || null,
        traducciones: {
          es: tradEs.trim(),
          // En vacío → mandamos undefined para que el back guarde solo lo que hay.
          ...(tradEn.trim().length > 0 ? { en: tradEn.trim() } : {}),
        },
      })
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, t('admin.form.errorSaveEstado')))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEditing ? t('admin.form.estadoEdit') : t('admin.form.estadoNew')}</DialogTitle>
        <DialogDescription>{t('admin.form.estadoDesc')}</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Código (slug) — inmutable en edición */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="estado-codigo">{t('admin.form.codigoLabel')}</Label>
          <Input
            id="estado-codigo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="feliz, muy-feliz"
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            title={t('admin.form.codigoHelp')}
            required
            disabled={isEditing}
          />
          <p className="text-xs text-muted-foreground">
            {isEditing ? t('admin.form.codigoLocked') : t('admin.form.codigoHelp')}
          </p>
        </div>

        {/* Traducciones del nombre */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="estado-trad-es">{t('admin.form.labelEs')}</Label>
            <Input
              id="estado-trad-es"
              value={tradEs}
              onChange={(e) => setTradEs(e.target.value)}
              placeholder="Feliz"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="estado-trad-en">{t('admin.form.labelEn')}</Label>
            <Input
              id="estado-trad-en"
              value={tradEn}
              onChange={(e) => setTradEn(e.target.value)}
              placeholder="Happy"
            />
          </div>
        </div>

        {/* Emoji */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="estado-emoji">{t('admin.form.emoji')}</Label>
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

        {/* Icono */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="estado-icon">{t('admin.form.icon')}</Label>
          <div className="flex items-center gap-2">
            <Input
              id="estado-icon"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1"
            />
            <Button type="button" variant="outline" size="sm" onClick={() => iconFileRef.current?.click()}>
              {t('admin.form.upload')}
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
            <img src={iconUrl} alt="" className="h-8 w-8 rounded object-cover" />
          )}
        </div>

        {/* Colores */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="estado-color-primario">{t('admin.form.colorPrimary')}</Label>
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
            <Label htmlFor="estado-color-secundario">{t('admin.form.colorSecondary')}</Label>
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

        {/* Fuente y animación */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>{t('admin.form.font')}</Label>
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
            <Label>{t('admin.form.animation')}</Label>
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

        {/* Música */}
        <div className="flex flex-col gap-2">
          <Label>{t('admin.form.music')}</Label>
          <div className="flex items-center gap-2">
            <Input
              value={musicaUrl}
              onChange={(e) => setMusicaUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1"
            />
            <Button type="button" variant="outline" size="sm" onClick={() => musicaFileRef.current?.click()}>
              {t('admin.form.upload')}
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

        {/* Imagen */}
        <div className="flex flex-col gap-2">
          <Label>{t('admin.form.image')}</Label>
          <div className="flex items-center gap-2">
            <Input
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1"
            />
            <Button type="button" variant="outline" size="sm" onClick={() => imagenFileRef.current?.click()}>
              {t('admin.form.upload')}
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
            <img src={imagenUrl} alt="" className="h-20 w-20 rounded object-cover" />
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? t('common.saving') : t('common.save')}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}

export default EstadoForm
