import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { z } from "zod";
import { FieldDialog } from "~/components/dialog";
import TablePage from "~/components/tablePage";
import { displayPrice, displayTime } from "~/utils";

export const Route = createFileRoute("/_app/app/salary")({
  component: RouteComponent,
});

function RouteComponent() {
  const [data, setData] = useState<Salary[]>([
    { id: "1", employeeId: "1", amount: 121, period: "" },
    { id: "2", employeeId: "1", amount: 234234, period: "" },
  ]);
  const columns: ColumnDef<Salary, unknown>[] = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
      },
      {
        header: "Период",
        accessorKey: "period",
        cell: (info: any) => displayTime(info), // Format the date
      },
      {
        header: "Выплата",
        accessorKey: "amount",
        cell: (info: any) => displayPrice(info), // Format the amount as currency
      },
      {
        header: "Работник",
        accessorKey: "employeeId",
      },
    ],
    []
  );
  const fieldsDialog: FieldDialog<Salary>[] = useMemo(
    () => [
      {
        key: "employeeId",
        label: "Работник",
        type: "select",
      },
      {
        key: "amount",
        label: "Сумма",
        type: "number",
      },
      {
        key: "period",
        label: "Период",
        type: "date",
      },
    ],
    []
  );
  return (
    <TablePage
      title="Зарплаты"
      data={data}
      columns={columns}
      fields={fieldsDialog}
      schema={salarySchema}
      getByID={async (id) => data.find((v) => v.id === id)!}
      onCreate={(create) => {
        console.log(create);
        setData((perv = []) => [...perv, { id: "", ...create }]);
      }}
    />
  );
}
const salarySchema = z.object({
  id: z.string().optional(),
  employeeId: z.string(),
  period: z.string().min(1),
  amount: z.number(),
});
type Salary = z.infer<typeof salarySchema>;
