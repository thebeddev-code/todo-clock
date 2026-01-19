use tauri::App;
use tauri_plugin_sql::{Migration, MigrationKind};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
    Migration {
        version: 1,
        description: "create todos table",
        sql: "CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            tags TEXT,
            color TEXT,
            status TEXT NOT NULL CHECK(status IN ('pending', 'in-progress', 'completed', 'overdue')),
            priority TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high')),
            startsAt TEXT,
            due TEXT,
            updatedAt TEXT NOT NULL,
            completedAt TEXT,
            isRecurring INTEGER NOT NULL,
            recurrenceRule TEXT
        )",
        kind: MigrationKind::Up,
    }
];

    tauri::Builder::default()

        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:todos.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
