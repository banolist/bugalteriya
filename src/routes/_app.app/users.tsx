import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { FieldDialog } from "~/components/dialog";
import TablePage from "~/components/tablePage";
import { useDatabase } from "~/context/databaseContext";

export const Route = createFileRoute("/_app/app/users")({
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
        accessorKey: "name",
      },
      {
        header: "username",
        accessorKey: "username",
      },
    ],
    []
  );
  const fieldsDialog: FieldDialog<Employee>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Полное имя",
        type: "text",
      },
      {
        key: "username",
        label: "username",
        type: "text",
      },
      {
        key: "password",
        label: "Пароль",
        type: "text",
      },
    ],
    []
  );

  const db = useDatabase();
  const [data, setData] = useState<Employee[]>([]);
  useEffect(() => {
    db.users.select().then((v) => {
      setData(v);
    });

    return;
  }, [db]);

  const handleEdit = async (data: Employee & { id: string }): Promise<void> => {
    await db.employees.update(data.id, data);
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
    await db.users.delete(parseInt(id));
    setData((perv) => perv.filter((perv) => perv.id != parseInt(id)));
  };

  const handleCreate = async (data: Omit<Employee, "id">) => {
    const id = await db.users.create(data);
    setData((perv) => [...perv, { ...data, id }]);
  };

  const handleGetByID = async (id: string) => {
    const finded = data.find((v) => v.id == parseInt(id))!;
    console.log("test", finded, "id", id, data);
    return finded;
  };

  return (
    <TablePage
      title="Пользователи"
      data={data}
      columns={columns}
      fields={fieldsDialog}
      schema={employeeSchema}
      getByID={handleGetByID}
      accessorID="id"
      createBtnText="Создать пользователя"
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
const employeeSchema = z.object({
  id: z.number().optional(),
  username: z.string(),
  password: z.string(),
  name: z.string(),
});
type Employee = z.infer<typeof employeeSchema>;
