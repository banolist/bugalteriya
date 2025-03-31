export interface Employee {
  id: number; // ID_сотрудника
  fullName: string; // ФИО
  position: string; // Должность
  hireDate: Date; // Дата_приема
}
export interface User {
  id: number; // ID_сотрудника
  username: string; // ФИО
  password: string; // Должность
  name: string; // Дата_приема
}

export interface Product {
  id: string; // ID_товара
  name: string; // Наименование
  price: number; // Цена
  quantity: number; // Количество
}

export interface FinancialOperation {
  id: number; // ID_операции
  date: Date; // Дата
  amount: number; // Сумма
  operationType: string; // Тип_операции
  productId: number; // ID_товара (foreign key to Product)
}

export interface Salary {
  id: number; // ID_зарплаты
  employeeId: number; // ID_сотрудника (foreign key to Employee)
  period: Date; // Период
  amount: number; // Сумма
}

export interface Report {
  id: number; // ID_отчета
  reportType: string; // Тип_отчета
  createdAt: Date; // Дата_создания
  operationId: number; // ID_операции (foreign key to FinancialOperation)
}
