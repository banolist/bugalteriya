import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import dayjs from "dayjs";
import TablePage from "~/components/tablePage";
import { displayPrice, displayTime } from "~/utils";
import { useDatabase } from "~/context/databaseContext";
import { useQuery } from "@tanstack/react-query";
import { FieldDialog } from "~/components/dialog";

export const Route = createFileRoute("/_app/app/transactions")({
  component: RouteComponent,
});

// Define the columns for the table

// Mock data for FinancialOperationDb

const operationSchema = z.object({
  id: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  amount: z.number().min(0, "Amount must be positive"),
  operationType: z.string().min(1, "Operation type is required"),
  productId: z.number().min(1, "Product ID must be positive"),
});

type FinancialOperation = z.infer<typeof operationSchema>;

// const products: Product[] = [
//   { id: 1, name: "Product A", price: 100 },
//   { id: 2, name: "Product B", price: 200 },
// ];
function RouteComponent() {
  const columns: ColumnDef<FinancialOperation, unknown>[] = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
      },
      {
        header: "Дата",
        accessorKey: "date",
        cell: (info) => {
          return displayTime(info.cell.getValue() as string);
        }, // Format the date
      },
      {
        header: "Сумма",
        accessorKey: "amount",
        cell: (info: any) => displayPrice(info), // Format the amount as currency
      },
      {
        header: "Тип операции",
        accessorKey: "operationType",
      },
      {
        header: "Продукт",
        accessorKey: "productId",
      },
    ],
    []
  );
  const db = useDatabase();
  const [data, setData] = useState<FinancialOperation[]>([]);
  useEffect(() => {
    db.financialOperations.select().then((v) => {
      setData(
        v.map((data) => ({
          ...data,
          date: dayjs(data.date).format(),
          id: data.id.toString(),
        }))
      );
    });

    return;
  }, [db]);

  const handleEdit = async (
    data: FinancialOperation & { id: string }
  ): Promise<void> => {
    await db.financialOperations.update(data.id, {
      ...data,
      date: new Date(data.date),
      id: undefined,
    });
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
    await db.financialOperations.delete(parseInt(id));
    setData((perv) => perv.filter((perv) => perv.id != id));
  };

  const handleCreate = async (data: Omit<FinancialOperation, "id">) => {
    const id = await db.financialOperations.insert({
      ...data,
      date: new Date(data.date),
    });
    setData((perv) => [...perv, { ...data, id: id.toString() }]);
  };

  const handleGetByID = async (id: string) => {
    const finded = data.find((v) => v.id == id)!;
    console.log("test", finded, "id", id, data);
    return finded;
  };

  const qyeryProduct = useQuery({
    queryKey: ["products"],
    queryFn: async () => db.products.select(),
  });
  const fieldss: FieldDialog<FinancialOperation>[] = useMemo(
    () => [
      { key: "date", label: "Дата", type: "date" },
      { key: "amount", label: "Сумма", type: "number" },
      { key: "operationType", label: "Тип операции", type: "text" },
      {
        key: "productId",
        label: "Продукт",
        type: "select",
        options: {
          options: qyeryProduct.data!,
        },
      },
    ],
    [qyeryProduct.data]
  );

  return (
    <TablePage
      title="Учет операций"
      createBtnText="Создать операцию"
      columns={columns}
      accessorID="id"
      data={data}
      onCreate={handleCreate}
      onDelete={handleDelete}
      onEdit={handleEdit}
      fields={fieldss as any}
      schema={operationSchema}
      getByID={handleGetByID}
    />
  );
}
