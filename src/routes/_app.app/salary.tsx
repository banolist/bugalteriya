import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { FieldDialog } from "~/components/dialog";
import TablePage from "~/components/tablePage";
import { useDatabase } from "~/context/databaseContext";
import { displayPrice, displayTime } from "~/utils";

export const Route = createFileRoute("/_app/app/salary")({
  component: RouteComponent,
});

function RouteComponent() {
  const db = useDatabase();

  const employeeQuery = useQuery({
    queryKey: ["emploee"],
    queryFn: async () => await db.employees.select(),
  });
  const columns: ColumnDef<Salary, unknown>[] = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
      },
      {
        header: "Период",
        accessorKey: "period",
        cell: (info: any) => displayTime(info.cell.getValue() as string), // Format the date
      },
      {
        header: "Выплата",
        accessorKey: "amount",
        cell: (info: any) => displayPrice(info), // Format the amount as currency
      },
      {
        header: "Работник",
        accessorKey: "employeeId",
        cell: (info) => {
          const result = employeeQuery.data?.find(
            (v) => v.id == info.cell.getValue()
          );

          return result?.fullName;
        },
      },
    ],
    [employeeQuery.data]
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

  const [data, setData] = useState<Salary[]>([]);
  useEffect(() => {
    db.salary.select().then((v) => {
      setData(
        v.map((data) => {
          return {
            ...data,
            period: new Date(data.period).toISOString(),
          };
        })
      );
    });

    return;
  }, [db]);

  const handleEdit = async (data: Salary & { id: string }): Promise<void> => {
    await db.products.update(data.id, data);
    setData((perv) =>
      perv.map((perv) => {
        if (perv.id == data.id) {
          return data;
        }
        return perv;
      })
    );
  };
  const handleDelete = async (id: string) => {
    await db.salary.delete(parseInt(id));
    setData((perv) => perv.filter((perv) => perv.id != parseInt(id)));
  };

  const handleCreate = async (data: Omit<Salary, "id">) => {
    const id = await db.salary.insert({
      ...data,
      period: new Date(data.period),
    });
    setData((perv) => [...perv, { ...data, id: id }]);
  };

  const handleGetByID = async (id: string) => {
    const finded = data.find((v) => v.id == parseInt(id))!;
    return finded;
  };
  return (
    <TablePage
      title="Зарплаты"
      accessorID="id"
      data={data}
      columns={columns}
      fields={fieldsDialog}
      schema={salarySchema}
      getByID={handleGetByID}
      onCreate={handleCreate}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />
  );
}
const salarySchema = z.object({
  id: z.number().optional(),
  employeeId: z.number(),
  period: z.string().min(1),
  amount: z.number(),
});
type Salary = z.infer<typeof salarySchema>;
