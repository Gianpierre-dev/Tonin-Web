import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
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
  getEstados,
  createEstado,
  updateEstado,
  deleteEstado,
} from '@/shared/api/endpoints'
import { getErrorMessage } from '@/lib/getErrorMessage'
import type { EstadoAnimoDTO, EstadoAnimoWriteDTO } from '@/lib/schemas'
import EstadoForm from './EstadoForm'
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'

const EstadosPage = (): React.JSX.Element => {
  const { t } = useTranslation()
  const [estados, setEstados] = useState<EstadoAnimoDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [crudError, setCrudError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEstado, setEditingEstado] = useState<EstadoAnimoDTO | undefined>()

  // Usamos `i18n.t` (no el `t` del hook) para que `fetchEstados` no cambie de
  // identidad al togglear idioma — antes cada toggle disparaba un re-fetch
  // completo del listado. El `t` del hook se sigue usando en el render.
  const fetchEstados = useCallback(async () => {
    try {
      const data = await getEstados()
      setEstados(data)
    } catch (err) {
      setCrudError(getErrorMessage(err, i18n.t('admin.estadosPage.loadError')))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchEstados()
  }, [fetchEstados])

  const handleAdd = () => {
    setEditingEstado(undefined)
    setDialogOpen(true)
  }

  const handleEdit = (estado: EstadoAnimoDTO) => {
    setEditingEstado(estado)
    setDialogOpen(true)
  }

  const handleDelete = async (estado: EstadoAnimoDTO) => {
    if (!window.confirm(t('admin.estadosPage.deleteConfirm', { name: estado.nombre }))) return
    try {
      setCrudError('')
      await deleteEstado(estado.id)
      await fetchEstados()
    } catch (err) {
      setCrudError(getErrorMessage(err, t('common.errorGeneric')))
    }
  }

  const handleSubmit = async (data: EstadoAnimoWriteDTO) => {
    setCrudError('')
    if (editingEstado) {
      await updateEstado(editingEstado.id, data)
    } else {
      await createEstado(data)
    }
    await fetchEstados()
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingEstado(undefined)
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">{t('admin.estadosPage.loading')}</div>
  }

  return (
    <div className="flex flex-col gap-4">
      {crudError && <p className="text-sm text-destructive">{crudError}</p>}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">{t('admin.estadosPage.title')}</h1>
        <Button onClick={handleAdd} size="sm">
          <PlusIcon className="size-4" />
          {t('common.add')}
        </Button>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('admin.estadosPage.th.nombre')}</TableHead>
            <TableHead>{t('admin.estadosPage.th.emoji')}</TableHead>
            <TableHead>{t('admin.estadosPage.th.colores')}</TableHead>
            <TableHead>{t('admin.estadosPage.th.fuente')}</TableHead>
            <TableHead>{t('admin.estadosPage.th.animacion')}</TableHead>
            <TableHead className="text-right">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {estados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                {t('admin.estadosPage.empty')}
              </TableCell>
            </TableRow>
          ) : (
            estados.map((estado) => (
              <TableRow key={estado.id}>
                <TableCell className="font-medium">{estado.nombre}</TableCell>
                <TableCell>{estado.emoji}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {estado.colorPrimario && (
                      <span
                        className="inline-block size-4 rounded-full border"
                        style={{ backgroundColor: estado.colorPrimario }}
                        title={estado.colorPrimario}
                      />
                    )}
                    {estado.colorSecundario && (
                      <span
                        className="inline-block size-4 rounded-full border"
                        style={{ backgroundColor: estado.colorSecundario }}
                        title={estado.colorSecundario}
                      />
                    )}
                    {!estado.colorPrimario && !estado.colorSecundario && (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{estado.fontFamily ?? '-'}</TableCell>
                <TableCell>{estado.animationType ?? '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleEdit(estado)}
                      aria-label={t('admin.estadosPage.editAria', { name: estado.nombre })}
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => void handleDelete(estado)}
                      aria-label={t('admin.estadosPage.deleteAria', { name: estado.nombre })}
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
        <DialogContent className="sm:max-w-lg">
          <EstadoForm
            estado={editingEstado}
            onSubmit={handleSubmit}
            onClose={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EstadosPage
