use sea_orm_migration::{prelude::*, schema::*};
// use sea_query::{Alias, Func, table::Alias as TableAlias};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        println!("Running migration for tables");
        // Replace the sample below with your own migration scripts

        // todo!();

        manager
            .create_table(
                Table::create()
                    .table("todos")
                    .if_not_exists()
                    // id: number → INTEGER PRIMARY KEY AUTOINCREMENT
                    .col(
                        ColumnDef::new("id")
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    // title: string → TEXT NOT NULL
                    .col(ColumnDef::new("title").string().not_null())
                    // description: string → TEXT
                    .col(ColumnDef::new("description").string())
                    // tags: string[] → TEXT (store as JSON string)
                    .col(ColumnDef::new("tags").string())
                    // color: string | null → TEXT
                    .col(ColumnDef::new("color").string())
                    // status: enum → TEXT CHECK constraint
                    .col(
                        ColumnDef::new("status")
                            .string()
                            .not_null()
                            .check(Expr::cust(
                                "status IN ('pending', 'in-progress', 'completed', 'overdue')",
                            )),
                    )
                    // priority: enum → TEXT CHECK constraint
                    .col(
                        ColumnDef::new("priority")
                            .string()
                            .not_null()
                            .check(Expr::cust("priority IN ('low', 'medium', 'high')")),
                    )
                    // startsAt?: string | null → TEXT
                    .col(ColumnDef::new("starts_at").string())
                    // due?: string | null → TEXT
                    .col(ColumnDef::new("due").string())
                    // createdAt: string → TEXT NOT NULL (add default NOW)
                    .col(
                        ColumnDef::new("created_at")
                            .string()
                            .not_null()
                            .default(Expr::cust("CURRENT_TIMESTAMP")),
                    )
                    // updatedAt: string → TEXT NOT NULL (add default NOW)
                    .col(
                        ColumnDef::new("updated_at")
                            .string()
                            .not_null()
                            .default(Expr::cust("CURRENT_TIMESTAMP")),
                    )
                    // completedAt?: string | null → TEXT
                    .col(ColumnDef::new("completed_at").string())
                    // isRecurring: boolean → BOOLEAN NOT NULL
                    .col(
                        ColumnDef::new("is_recurring")
                            .boolean()
                            .not_null()
                            .default(false),
                    )
                    // recurrenceRule?: string | null → TEXT
                    .col(ColumnDef::new("recurrence_rule").string())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        todo!();

        manager
            .drop_table(Table::drop().table("todos").to_owned())
            .await
    }
}

// Table constants for cleaner code
#[derive(Iden)]
enum Todos {
    Table,
    Id,
    Title,
    Description,
    Tags,
    Color,
    Status,
    Priority,
    StartsAt,
    Due,
    CreatedAt,
    UpdatedAt,
    CompletedAt,
    IsRecurring,
    RecurrenceRule,
}
