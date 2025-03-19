import Database from "@tauri-apps/plugin-sql";
import {
  Product,
  User,
  FinancialOperation,
  Salary,
  Report,
  Employee,
} from "./types";

export const createDatabase = (db: Database) => {
  const usersQueryBuilder = new QueryBuilder<User>("users", db);
  const productQueryBuilder = new QueryBuilder<Product>("products", db);
  const FinancialOperationQueryBuilder = new QueryBuilder<FinancialOperation>(
    "financial_operations",
    db
  );
  const SalaryQueryBuilder = new QueryBuilder<Salary>("salaries", db);
  const ReportQueryBuilder = new QueryBuilder<Report>("reports", db);
  const EmployeeQueryBuilder = new QueryBuilder<Employee>("employees", db);

  return {
    users: {
      fetch: () => usersQueryBuilder.select(),
      create: (user: Omit<User, "id">) => usersQueryBuilder.insert(user),
      getByLogin: (login: string) =>
        usersQueryBuilder.select({ username: login }).then((users) => users[0]),
      delete: (userId: number) => usersQueryBuilder.delete(userId),
      save: (user: User) => usersQueryBuilder.update(user.id, user),
    },
    products: {
      fetch: () => productQueryBuilder.select(),
      create: (user: Omit<Product, "id">) => productQueryBuilder.insert(user),
      delete: (userId: number) => productQueryBuilder.delete(userId),
      save: (user: Product) => productQueryBuilder.update(user.id, user),
    },
    employees: {
      fetch: () => EmployeeQueryBuilder.select(),
      create: (user: Omit<Employee, "id">) => EmployeeQueryBuilder.insert(user),
      delete: (userId: number) => EmployeeQueryBuilder.delete(userId),
      save: (user: Employee) => EmployeeQueryBuilder.update(user.id, user),
    },
    salary: {
      fetch: () => SalaryQueryBuilder.select(),
      create: (user: Omit<Salary, "id">) => SalaryQueryBuilder.insert(user),
      delete: (userId: number) => SalaryQueryBuilder.delete(userId),
      save: (user: Salary) => SalaryQueryBuilder.update(user.id, user),
    },
    financialOperations: {
      fetch: () => FinancialOperationQueryBuilder.select(),
      create: (user: Omit<FinancialOperation, "id">) =>
        FinancialOperationQueryBuilder.insert(user),
      delete: (userId: number) => FinancialOperationQueryBuilder.delete(userId),
      save: (user: FinancialOperation) =>
        FinancialOperationQueryBuilder.update(user.id, user),
    },
    report: {
      fetch: () => ReportQueryBuilder.select(),
      create: (user: Omit<Report, "id">) => ReportQueryBuilder.insert(user),
      delete: (userId: number) => ReportQueryBuilder.delete(userId),
      save: (user: Report) => ReportQueryBuilder.update(user.id, user),
    },
  };
};

export type DatabaseInst = ReturnType<typeof createDatabase>;

class QueryBuilder<T> {
  private tableName: string;
  private db: any;

  constructor(tableName: string, db: any) {
    this.tableName = tableName;
    this.db = db;
  }

  async select(where?: Partial<T>): Promise<T[]> {
    let query = `SELECT * FROM ${this.tableName}`;
    const values: any[] = [];

    if (where) {
      const conditions = Object.keys(where)
        .map((key) => `${key} = ?`)
        .join(" AND ");
      query += ` WHERE ${conditions}`;
      values.push(...Object.values(where));
    }

    return this.db.select(query, values);
  }

  async insert(data: Omit<T, "id">): Promise<number> {
    const columns = Object.keys(data).join(", ");
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", ");
    const values = Object.values(data);

    const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;
    const result = await this.db.execute(query, values);
    return result.lastInsertId!;
  }

  async update(id: number | string, data: Partial<T>): Promise<void> {
    const updates = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(data);
    values.push(id);

    const query = `UPDATE ${this.tableName} SET ${updates} WHERE id = ?`;
    await this.db.execute(query, values);
  }

  async delete(id: number): Promise<void> {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    await this.db.execute(query, [id]);
  }
}
