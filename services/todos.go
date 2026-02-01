package services

import (
	"gorm.io/gorm"
)

type Todo struct {
	ID             int      `json:"id" gorm:"primaryKey"`
	Title          string   `json:"title"`
	Description    *string  `json:"description"`
	Tags           []string `json:"tags" gorm:"serializer:json"`
	Color          *string  `json:"color"`
	Status         string   `json:"status"`
	Priority       string   `json:"priority"`
	StartsAt       *string  `json:"startsAt"`
	Due            *string  `json:"due"`
	UpdatedAt      *string  `json:"updatedAt"`
	CreatedAt      *string  `json:"createdAt"`
	CompletedAt    *string  `json:"completedAt"`
	IsRecurring    bool     `json:"isRecurring"`
	RecurrenceRule *string  `json:"recurrenceRule"`
}

type TodoService struct {
	db *gorm.DB
}

func NewTodoService(db *gorm.DB) *TodoService {
	db.AutoMigrate(&Todo{})
	return &TodoService{db: db}
}

func (s *TodoService) GetTodos() ([]Todo, error) {
	var todos []Todo
	result := s.db.Find(&todos)
	return todos, result.Error
}

func (s *TodoService) CreateTodo(todo Todo) error {
	return s.db.Create(&todo).Error
}

func (s *TodoService) UpdateTodo(id int, updated Todo) error {
	var todo Todo
	if err := s.db.First(&todo, id).Error; err != nil {
		return err
	}
	return s.db.Model(&todo).Updates(updated).Error
}

func (s *TodoService) DeleteTodo(id int) error {
	return s.db.Delete(&Todo{}, id).Error
}
