use tauri_plugin_sql::{Migration, MigrationKind};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:mydatabase.db", get_migrations())
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

pub fn get_migrations() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "create_initial_tables",
        sql: "
                 CREATE TABLE users (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    username TEXT NOT NULL,
                    password TEXT NOT NULL
                );

                CREATE TABLE employees (
                    id INTEGER PRIMARY KEY,
                    fullName TEXT NOT NULL,
                    position TEXT NOT NULL,
                    hireDate TEXT NOT NULL
                );
                
                CREATE TABLE products (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    price REAL NOT NULL,
                    quantity INTEGER NOT NULL
                );
                
                CREATE TABLE financial_operations (
                    id INTEGER PRIMARY KEY,
                    date TEXT NOT NULL,
                    amount REAL NOT NULL,
                    operationType TEXT NOT NULL,
                    productId INTEGER NOT NULL,
                    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
                );
                
                CREATE TABLE salaries (
                    id INTEGER PRIMARY KEY,
                    employeeId INTEGER NOT NULL,
                    period TEXT NOT NULL,
                    amount REAL NOT NULL,
                    FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE
                );
                
                CREATE TABLE reports (
                    id INTEGER PRIMARY KEY,
                    reportType TEXT NOT NULL,
                    createdAt TEXT NOT NULL,
                    operationId INTEGER NOT NULL,
                    FOREIGN KEY (operationId) REFERENCES financial_operations(id) ON DELETE CASCADE
                );
            ",
        kind: MigrationKind::Up,
    }]
}
