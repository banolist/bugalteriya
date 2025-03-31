import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { FieldDialog } from "~/components/dialog";
import TablePage from "~/components/tablePage";
import { useDatabase } from "~/context/databaseContext";
import { displayPrice } from "~/utils";

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
  const columns: ColumnDef<Product, unknown>[] = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
      },
      {
        header: "название",
        accessorKey: "name",
        // cell: (info) => displayTime(info.cell.getValue() as string), // Format the date
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

  const db = useDatabase();
  const [data, setData] = useState<Product[]>([]);
  useEffect(() => {
    db.products.select().then((v) => {
      setData(v);
    });

    return;
  }, [db]);

  const handleEdit = async (data: Product & { id: string }): Promise<void> => {
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
    await db.products.delete(parseInt(id));
    setData((perv) => perv.filter((perv) => perv.id != id));
  };

  const handleCreate = async (data: Omit<Product, "id">) => {
    const id = await db.products.insert(data);
    setData((perv) => [...perv, { ...data, id: id.toString() }]);
  };

  const handleGetByID = async (id: string) => {
    const finded = data.find((v) => v.id == id)!;
    console.log("test", finded, "id", id, data);
    return finded;
  };
  return (
    <TablePage
      title="Продукты"
      data={data}
      columns={columns}
      fields={fieldsDialog}
      schema={productSchema}
      getByID={handleGetByID}
      onCreate={handleCreate}
      accessorID="id"
      createBtnText="Добавить продукт"
      onDelete={handleDelete}
      onEdit={handleEdit}
    />
  );
}
