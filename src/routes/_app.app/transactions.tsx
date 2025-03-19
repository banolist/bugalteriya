import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { z } from "zod";
import dayjs from "dayjs";
import TablePage from "~/components/tablePage";
import { displayPrice, displayTime } from "~/utils";

export const Route = createFileRoute("/_app/app/transactions")({
  component: RouteComponent,
});

// Define the columns for the table

// Mock data for FinancialOperationDb
const data: FinancialOperation[] = [
  {
    id: "",
    date: "",
    amount: 100.5,
    operationType: "Purchase",
    productId: 101,
  },
  {
    id: "",
    date: "",
    amount: 200.75,
    operationType: "Sale",
    productId: 102,
  },
  {
    id: "",
    date: "",
    amount: 150.0,
    operationType: "Refund",
    productId: 103,
  },
];

const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
});

const operationSchema = z.object({
  id: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  amount: z.number().min(0, "Amount must be positive"),
  operationType: z.string().min(1, "Operation type is required"),
  productId: z.number().min(1, "Product ID must be positive"),
});

type Product = z.infer<typeof productSchema>;
type FinancialOperation = z.infer<typeof operationSchema>;

const products: Product[] = [
  { id: 1, name: "Product A", price: 100 },
  { id: 2, name: "Product B", price: 200 },
];
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
        cell: (info: any) => displayTime(info), // Format the date
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
        cell: (info: any) => <></>,
      },
    ],
    []
  );

  return (
    <TablePage
      title="Учет операций"
      createBtnText="Создать операцию"
      columns={columns}
      data={data}
      fields={[
        { key: "date", label: "Date", type: "date" },
        { key: "amount", label: "Amount", type: "number" },
        { key: "operationType", label: "Operation Type", type: "text" },
        {
          key: "productId",
          label: "Product",
          type: "select",
          options: {
            options: products,
          },
        },
      ]}
      schema={operationSchema}
      getByID={async (id) => {
        return data.find((v) => id !== v.id)!;
      }}
    />
  );
}
