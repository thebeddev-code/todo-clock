// use migration::{Migrator, MigratorTrait};
use sea_orm::DatabaseConnection;
use std::env;
use std::sync::Arc;
use tauri::App;
use tauri::Manager;

struct DbState {
    conn: Arc<DatabaseConnection>,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            tauri::async_runtime::block_on(async {
                let current_dir = std::env::current_dir().unwrap();
                let path = current_dir.join("db.sqlite");
                let database_url = format!("sqlite://{}?mode=rwc", path.to_string_lossy());
                println!("{}", database_url);
                let conn = sea_orm::Database::connect(&database_url)
                    .await
                    .expect("Failed to connect to db");

                // Migrator::up(&conn, None).await;
                app.manage(DbState {
                    conn: Arc::new(conn),
                });
                Ok::<(), ()>(())
            })
            .unwrap();
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
