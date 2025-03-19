import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { z } from "zod";
import { FieldDialog } from "~/components/dialog";
import TablePage from "~/components/tablePage";
import { displayPrice, displayTime } from "~/utils";

export const Route = createFileRoute("/_app/app/employee")({
  component: RouteComponent,
});

function RouteComponent() {
  const columns: ColumnDef<Employee, unknown>[] = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
      },
      {
        header: "Полное имя",
        accessorKey: "fullName",
      },
      {
        header: "Должность",
        accessorKey: "position",
      },
      {
        header: "Дата приема",
        accessorKey: "hireDate",
        cell: (info: any) => displayTime(info), // Format the date
      },
    ],
    []
  );
  const fieldsDialog: FieldDialog<Employee>[] = useMemo(
    () => [
      {
        key: "fullName",
        label: "Полное имя",
        type: "text",
      },
      {
        key: "position",
        label: "Должность",
        type: "text",
      },
      {
        key: "hireDate",
        label: "Дата приема",
        type: "date",
      },
    ],
    []
  );
  return (
    <TablePage
      title="Сотрудники"
      data={data}
      columns={columns}
      fields={fieldsDialog}
      schema={employeeSchema}
      getByID={async (id) => data.find((v) => v.id === id)!}
    />
  );
}
const employeeSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  position: z.string(),
  hireDate: z.string(),
});
type Employee = z.infer<typeof employeeSchema>;

const data: Employee[] = [
  { id: "1", fullName: "1", position: "121", hireDate: "" },
  { id: "2", fullName: "1", position: "234234", hireDate: "" },
];
