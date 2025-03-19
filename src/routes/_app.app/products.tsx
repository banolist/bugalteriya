import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { z } from "zod";
import { createDatabase } from "~/app/database";
import { FieldDialog } from "~/components/dialog";
import TablePage from "~/components/tablePage";
import { useDatabase } from "~/context/databaseContext";
import { displayPrice, displayTime } from "~/utils";

export const Route = createFileRoute("/_app/app/products")({
  component: RouteComponent,
});

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
});
type Product = z.infer<typeof productSchema>;

// const data: Product[] = [
//   { id: "1", name: "Product A", price: 100, quantity: 2 },
//   { id: "2", name: "Product B", price: 200, quantity: 3 },
// ];
const fieldsDialog: FieldDialog<Product>[] = [
  {
    key: "name",
    label: "Название",
    type: "text",
  },
  {
    key: "price",
    label: "Цена",
    type: "number",
  },
  {
    key: "quantity",
    label: "Количество",
    type: "number",
  },
];

function RouteComponent() {
  const database = useDatabase();
  const query = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const data = await database.products.fetch();
      console.log(data);

      return data;
    },
  });

  const columns: ColumnDef<Product, unknown>[] = useMemo(
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
        accessorKey: "price",
        cell: (info: any) => displayPrice(info), // Format the amount as currency
      },
      {
        header: "Количество",
        accessorKey: "quantity",
      },
    ],
    []
  );
  return (
    <TablePage
      title="Продукты"
      data={query.data!}
      columns={columns}
      fields={fieldsDialog}
      schema={productSchema}
      getByID={async (id) => query.data?.find((v) => v.id === id)!}
      onCreate={(data) => {
        return database.products.create(data);
      }}
    />
  );
}
