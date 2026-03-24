import { useState, useEffect, useCallback } from 'react'
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
import type { EstadoAnimoDTO } from '@/lib/schemas'
import EstadoForm from './EstadoForm'
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'

const EstadosPage = (): React.JSX.Element => {
  const [estados, setEstados] = useState<EstadoAnimoDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEstado, setEditingEstado] = useState<EstadoAnimoDTO | undefined>()

  const fetchEstados = useCallback(async () => {
    try {
      const data = await getEstados()
      setEstados(data)
    } catch {
      // silently fail - table will be empty
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
    if (!window.confirm(`Eliminar estado "${estado.nombre}"?`)) return
    try {
      await deleteEstado(estado.id)
      await fetchEstados()
    } catch {
      // error handled by interceptor
    }
  }

  const handleSubmit = async (data: Omit<EstadoAnimoDTO, 'id'>) => {
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
    return <div className="text-sm text-muted-foreground">Cargando estados...</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Estados de Animo</h1>
        <Button onClick={handleAdd} size="sm">
          <PlusIcon className="size-4" />
          Agregar
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Emoji</TableHead>
            <TableHead>Colores</TableHead>
            <TableHead>Fuente</TableHead>
            <TableHead>Animacion</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {estados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No hay estados registrados
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
                        title={`Primario: ${estado.colorPrimario}`}
                      />
                    )}
                    {estado.colorSecundario && (
                      <span
                        className="inline-block size-4 rounded-full border"
                        style={{ backgroundColor: estado.colorSecundario }}
                        title={`Secundario: ${estado.colorSecundario}`}
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
                      aria-label={`Editar ${estado.nombre}`}
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => void handleDelete(estado)}
                      aria-label={`Eliminar ${estado.nombre}`}
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
