import Database from "@tauri-apps/plugin-sql";
import { faker } from "@faker-js/faker/locale/ru";
import {
  Product,
  User,
  FinancialOperation,
  Salary,
  Report,
  Employee,
} from "./types";

export const initializeDatabase = async (db: Database) => {
  const dbInstance = createDatabase(db);

  // Проверяем, есть ли данные в базе
  const usersCount = await dbInstance.users
    .select()
    .then((users) => users.length);
  if (usersCount > 0) {
    return; // База уже инициализирована
  }

  // Создаем тестовых пользователей
  const adminUser: Omit<User, "id"> = {
    username: "admin",
    password: "admin123", // В реальном приложении используйте хеширование!
    name: "admin",
  };
  await dbInstance.users.create(adminUser);

  // Создаем сотрудников
  const employees: Omit<Employee, "id">[] = Array.from({ length: 5 }, () => ({
    fullName: faker.person.fullName(),
    position: faker.person.jobTitle(),
    hireDate: faker.date.past({ years: 2 }),
  }));

  const createdEmployees = await Promise.all(
    employees.map((emp) => dbInstance.employees.insert(emp))
  );

  // Создаем продукты
  const products: Omit<Product, "id">[] = Array.from({ length: 10 }, () => ({
    name: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price({ min: 100, max: 10000 })),
    quantity: faker.number.int({ min: 1, max: 100 }),
  }));

  const createdProducts = await Promise.all(
    products.map((prod) => dbInstance.products.insert(prod))
  );

  // Создаем финансовые операции
  const operations: Omit<FinancialOperation, "id">[] = Array.from(
    { length: 20 },
    () => ({
      date: faker.date.recent({ days: 30 }),
      amount: parseFloat(faker.commerce.price({ min: 100, max: 5000 })),
      operationType: faker.helpers.arrayElement(["income", "expense"]),
      productId: faker.helpers.arrayElement(createdProducts),
    })
  );

  const createdOperations = await Promise.all(
    operations.map((op) => dbInstance.financialOperations.insert(op))
  );

  // Создаем зарплаты
  const salaries: Omit<Salary, "id">[] = Array.from({ length: 10 }, () => ({
    employeeId: faker.helpers.arrayElement(createdEmployees),
    period: faker.date.recent({ days: 60 }),
    amount: faker.number.int({ min: 20000, max: 100000 }),
  }));

  await Promise.all(salaries.map((salary) => dbInstance.salary.insert(salary)));

  // Создаем отчеты
  const reports: Omit<Report, "id">[] = Array.from({ length: 5 }, () => ({
    reportType: faker.helpers.arrayElement(["sales", "expenses", "inventory"]),
    createdAt: faker.date.recent({ days: 7 }),
    operationId: faker.helpers.arrayElement(createdOperations),
  }));

  await Promise.all(reports.map((report) => dbInstance.report.insert(report)));
};

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
      select: () => usersQueryBuilder.select(),
      create: (user: Omit<User, "id">) => usersQueryBuilder.insert(user),
      getByLogin: (login: string) =>
        usersQueryBuilder.select({ username: login }).then((users) => users[0]),
      delete: (userId: number) => usersQueryBuilder.delete(userId),
      save: (user: User) => usersQueryBuilder.update(user.id, user),
    },
    products: productQueryBuilder,
    employees: EmployeeQueryBuilder,
    salary: SalaryQueryBuilder,
    financialOperations: FinancialOperationQueryBuilder,
    report: ReportQueryBuilder,
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
  async count() {
    const query = `SELECT COUNT(*) FROM ${this.tableName}`;
    const result = await this.db.execute(query);
    return result;
  }

  async delete(id: number): Promise<void> {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    await this.db.execute(query, [id]);
  }
}
