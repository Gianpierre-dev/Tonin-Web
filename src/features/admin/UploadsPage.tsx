import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import { Button } from '@/shared/ui/button'
import { uploadImagen, uploadMusica, deleteUpload } from '@/shared/api/endpoints'
import { getErrorMessage } from '@/lib/getErrorMessage'
import { validateImageFile, validateAudioFile } from '@/lib/uploadValidation'
import { TrashIcon, UploadIcon, CopyIcon, CheckIcon } from 'lucide-react'

const IMAGE_ACCEPT = '.jpeg,.jpg,.png,.gif,.webp'
const AUDIO_ACCEPT = '.mp3,.wav,.ogg'

interface UploadEntry {
  filename: string
  url: string
  tipo: 'imagen' | 'musica'
}

const UploadsPage = (): React.JSX.Element => {
  const { t } = useTranslation()
  const [uploads, setUploads] = useState<UploadEntry[]>([])
  const [imageLoading, setImageLoading] = useState(false)
  const [audioLoading, setAudioLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedUrl, setCopiedUrl] = useState('')

  const imageInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  // `i18n.t` (no `t` del hook) para que estos callbacks no cambien de
  // identidad al togglear idioma.
  const handleImageUpload = useCallback(async (file: File) => {
    setError('')
    setImageLoading(true)
    try {
      const result = await uploadImagen(file)
      setUploads((prev) => [
        { filename: file.name, url: result.url, tipo: 'imagen' },
        ...prev,
      ])
    } catch (err) {
      setError(getErrorMessage(err, i18n.t('admin.uploads.errorImage')))
    } finally {
      setImageLoading(false)
    }
  }, [])

  const handleAudioUpload = useCallback(async (file: File) => {
    setError('')
    setAudioLoading(true)
    try {
      const result = await uploadMusica(file)
      setUploads((prev) => [
        { filename: file.name, url: result.url, tipo: 'musica' },
        ...prev,
      ])
    } catch (err) {
      setError(getErrorMessage(err, i18n.t('admin.uploads.errorAudio')))
    } finally {
      setAudioLoading(false)
    }
  }, [])

  // Validación unificada: la usan tanto file-picker como drag&drop. Antes el
  // botón confiaba SOLO en el atributo `accept` (bypasseable) y el drop
  // validaba por extensión del nombre (también bypasseable). Ahora MIME real
  // y tamaño, en defensa en profundidad con el back.
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const result = validateImageFile(file)
    if (!result.ok) {
      setError(result.message)
      return
    }
    void handleImageUpload(file)
  }

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const result = validateAudioFile(file)
    if (!result.ok) {
      setError(result.message)
      return
    }
    void handleAudioUpload(file)
  }

  const handleDrop = (tipo: 'imagen' | 'musica') => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return

    const result = tipo === 'imagen' ? validateImageFile(file) : validateAudioFile(file)
    if (!result.ok) {
      setError(result.message)
      return
    }
    if (tipo === 'imagen') {
      void handleImageUpload(file)
    } else {
      void handleAudioUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDelete = async (entry: UploadEntry) => {
    try {
      await deleteUpload(entry.url)
      setUploads((prev) => prev.filter((u) => u.url !== entry.url))
    } catch (err) {
      setError(getErrorMessage(err, t('admin.uploads.errorDelete')))
    }
  }

  const copyToClipboard = async (url: string) => {
    await navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(''), 2000)
  }

  const imageUploads = uploads.filter((u) => u.tipo === 'imagen')
  const audioUploads = uploads.filter((u) => u.tipo === 'musica')

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">{t('admin.uploads.title')}</h1>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Images section */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-medium">{t('admin.uploads.images')}</h2>
        <div
          onDrop={handleDrop('imagen')}
          onDragOver={handleDragOver}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-muted-foreground/50"
        >
          <UploadIcon className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t('admin.uploads.dragImage')}
          </p>
          <Button
            variant="default"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
            disabled={imageLoading}
          >
            {imageLoading ? t('admin.uploads.uploading') : t('admin.uploads.selectFile')}
          </Button>
          <p className="text-xs text-muted-foreground">{t('admin.uploads.formatsImage')}</p>
          <input
            ref={imageInputRef}
            type="file"
            accept={IMAGE_ACCEPT}
            className="hidden"
            onChange={handleImageFileChange}
          />
        </div>

        {imageUploads.length > 0 && (
          <div className="flex flex-col gap-2">
            {imageUploads.map((entry) => (
              <div
                key={entry.url}
                className="flex items-center gap-3 rounded-lg border p-2"
              >
                <img
                  src={entry.url}
                  alt={entry.filename}
                  className="h-10 w-10 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{entry.filename}</p>
                  <p className="text-xs text-muted-foreground truncate">{entry.url}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => void copyToClipboard(entry.url)}
                  aria-label={t('admin.uploads.copyUrl')}
                >
                  {copiedUrl === entry.url ? <CheckIcon /> : <CopyIcon />}
                </Button>
                <Button
                  variant="destructive"
                  size="icon-sm"
                  onClick={() => void handleDelete(entry)}
                  aria-label={t('admin.uploads.deleteAria')}
                >
                  <TrashIcon />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Audio section */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-medium">{t('admin.uploads.music')}</h2>
        <div
          onDrop={handleDrop('musica')}
          onDragOver={handleDragOver}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-muted-foreground/50"
        >
          <UploadIcon className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t('admin.uploads.dragAudio')}
          </p>
          <Button
            variant="default"
            size="sm"
            onClick={() => audioInputRef.current?.click()}
            disabled={audioLoading}
          >
            {audioLoading ? t('admin.uploads.uploading') : t('admin.uploads.selectFile')}
          </Button>
          <p className="text-xs text-muted-foreground">{t('admin.uploads.formatsAudio')}</p>
          <input
            ref={audioInputRef}
            type="file"
            accept={AUDIO_ACCEPT}
            className="hidden"
            onChange={handleAudioFileChange}
          />
        </div>

        {audioUploads.length > 0 && (
          <div className="flex flex-col gap-2">
            {audioUploads.map((entry) => (
              <div
                key={entry.url}
                className="flex items-center gap-3 rounded-lg border p-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-xs">
                  ♪
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{entry.filename}</p>
                  <p className="text-xs text-muted-foreground truncate">{entry.url}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => void copyToClipboard(entry.url)}
                  aria-label={t('admin.uploads.copyUrl')}
                >
                  {copiedUrl === entry.url ? <CheckIcon /> : <CopyIcon />}
                </Button>
                <Button
                  variant="destructive"
                  size="icon-sm"
                  onClick={() => void handleDelete(entry)}
                  aria-label={t('admin.uploads.deleteAria')}
                >
                  <TrashIcon />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default UploadsPage
