import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import GenericDialog, { FieldDialog } from "./dialog";
import GenericTable from "./table";
import IcBaselineEdit from "~icons/ic/baseline-edit?width=24px&height=24px";
import IcBaselineDeleteForever from "~icons/ic/baseline-delete-forever?width=24px&height=24px";
import { z } from "zod";
import { exportToXLSX } from "~/app/utils";

interface TablePageProps<T extends Record<string, any>, K = unknown> {
  data?: T[];
  columns: ColumnDef<T, unknown>[];
  fields: FieldDialog<T, K>[];
  schema: z.ZodSchema<T>;
  accessorID: keyof T;

  title: string;
  createBtnText?: string;

  onCreate?: (data: Omit<T, "id">) => void;
  onEdit?: (data: T & { id: string }) => void;
  onDelete?: (id: string) => void;
  getByID: (id: string) => Promise<T>;
}

export default function TablePage<T extends Record<string, any>>(
  props: TablePageProps<T>
) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<T | null>(null);
  const handleCloseDialog = () => {
    setSelectedValue(null);
    setIsDialogOpen(false);
  };
  const handleOpenDialog = () => setIsDialogOpen(true);
  const data = useMemo(() => props.data, [props.data]);

  async function handleSave(data: T & { id?: string }) {
    if (data.id) {
      props.onEdit?.(data as T & { id: string });
    } else {
      const { id, ...rest } = data;
      props.onCreate?.(rest as Omit<T, "id">);
    }
    handleCloseDialog();
  }

  const handleEdit = async (id: string) => {
    try {
      const selected = await props.getByID(id);
      console.log(selected);
      if (selected) {
        setSelectedValue(selected);
        handleOpenDialog();
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных", error);
    }
  };
  const handleDelete = (id: string) => {
    props.onDelete && props.onDelete(id);
  };

  const columns: ColumnDef<T, unknown>[] = useMemo(
    () => [
      ...props.columns,
      {
        header: "Действия",
        accessorKey: props.accessorID || "id",
        cell: (data) => (
          <div className="flex gap-2 *:btn *:btn-circle">
            <button
              onClick={() => {
                handleEdit(data.row.original[props.accessorID]);
              }}
              className="btn-primary"
            >
              <IcBaselineEdit className="w-5" />
            </button>
            <button
              onClick={() => handleDelete(data.row.original[props.accessorID])}
              className="btn-error"
            >
              <IcBaselineDeleteForever className="w-5" />
            </button>
          </div>
        ),
      },
    ],
    [props.columns, props.accessorID]
  );

  return (
    <div className="p-4 bg-base-100 rounded-2xl">
      <GenericTable
        title={props.title}
        columns={columns}
        data={data}
        toolbar={
          <>
            <button
              className="btn"
              onClick={() => {
                if (!data) return;
                exportToXLSX(data);
              }}
            >
              Скачать в xlsx
            </button>
            <button
              className="btn btn-success"
              onClick={() => setIsDialogOpen(true)}
            >
              {props.createBtnText || "Создать"}
            </button>
          </>
        }
        getRowId={(row, index) => `${row[props.accessorID] || "row"}-${index}`}
      />
      <GenericDialog
        defaultValues={selectedValue || undefined}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSave}
        schema={props.schema}
        fields={props.fields}
      />
    </div>
  );
}
