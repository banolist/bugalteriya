import Database from "@tauri-apps/plugin-sql";
import React from "react";
import { createContext, use, useEffect, useState } from "react";
import { createDatabase, DatabaseInst } from "~/app/database";

// Создаем контекст с начальным значением `null` или `undefined`
const DatabaseContext = createContext<DatabaseInst>({} as any);

export const DatabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [database, setDatabase] = useState<Database | null>(null);
  // Передаем загруженную базу данных в контекст
  React.useEffect(() => {
    Database.load("sqlite:mydatabase.db").then((v) => {
      setDatabase(v);
    });

    return () => {
      database?.close().then(() => setDatabase(null));
    };
  }, []);

  return (
    <>
      {database && (
        <DatabaseContext.Provider value={createDatabase(database)}>
          {children}
        </DatabaseContext.Provider>
      )}
      {!database && <div>Loading Database...</div>}
    </>
  );
};
export const useDatabase = () => use(DatabaseContext);
