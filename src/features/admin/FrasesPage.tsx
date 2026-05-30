import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/shared/ui/table'
import { Dialog, DialogContent } from '@/shared/ui/dialog'
import {
  getFrases,
  createFrase,
  updateFrase,
  deleteFrase,
} from '@/shared/api/endpoints'
import { getErrorMessage } from '@/lib/getErrorMessage'
import type { FraseDTO, FraseWriteDTO } from '@/lib/schemas'
import FraseForm from './FraseForm'
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'

const TRUNCATE_LENGTH = 60

const truncate = (text: string, length: number): string =>
  text.length > length ? `${text.slice(0, length)}...` : text

const FrasesPage = (): React.JSX.Element => {
  const { t } = useTranslation()
  const [frases, setFrases] = useState<FraseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [crudError, setCrudError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFrase, setEditingFrase] = useState<FraseDTO | undefined>()

  const fetchFrases = useCallback(async () => {
    try {
      const data = await getFrases()
      setFrases(data)
    } catch (err) {
      setCrudError(getErrorMessage(err, t('admin.frasesPage.loadError')))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    void fetchFrases()
  }, [fetchFrases])

  const handleAdd = () => {
    setEditingFrase(undefined)
    setDialogOpen(true)
  }

  const handleEdit = (frase: FraseDTO) => {
    setEditingFrase(frase)
    setDialogOpen(true)
  }

  const handleDelete = async (frase: FraseDTO) => {
    if (!window.confirm(t('admin.frasesPage.deleteConfirm', { text: truncate(frase.texto, 40) }))) return
    try {
      setCrudError('')
      await deleteFrase(frase.id)
      await fetchFrases()
    } catch (err) {
      setCrudError(getErrorMessage(err, t('common.errorGeneric')))
    }
  }

  const handleSubmit = async (data: FraseWriteDTO) => {
    setCrudError('')
    if (editingFrase) {
      await updateFrase(editingFrase.id, data)
    } else {
      await createFrase(data)
    }
    await fetchFrases()
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingFrase(undefined)
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">{t('admin.frasesPage.loading')}</div>
  }

  return (
    <div className="flex flex-col gap-4">
      {crudError && <p className="text-sm text-destructive">{crudError}</p>}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">{t('admin.frasesPage.title')}</h1>
        <Button onClick={handleAdd} size="sm">
          <PlusIcon className="size-4" />
          {t('common.add')}
        </Button>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('admin.frasesPage.th.texto')}</TableHead>
            <TableHead>{t('admin.frasesPage.th.estado')}</TableHead>
            <TableHead className="text-right">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {frases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                {t('admin.frasesPage.empty')}
              </TableCell>
            </TableRow>
          ) : (
            frases.map((frase) => (
              <TableRow key={frase.id}>
                <TableCell className="max-w-xs" title={frase.texto}>
                  {truncate(frase.texto, TRUNCATE_LENGTH)}
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1">
                    {frase.estadoAnimo.emoji} {frase.estadoAnimo.nombre}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleEdit(frase)}
                      aria-label={t('admin.frasesPage.editAria')}
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => void handleDelete(frase)}
                      aria-label={t('admin.frasesPage.deleteAria')}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <FraseForm
            frase={editingFrase}
            onSubmit={handleSubmit}
            onClose={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FrasesPage
