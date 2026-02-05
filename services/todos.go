package services

import (
	"gorm.io/gorm"
)

type (
	Status   string
	Priority string
)

const (
	StatusTodo       Status = "todo"
	StatusInProgress Status = "in_progress"
	StatusDone       Status = "done"

	PriorityLow    Priority = "low"
	PriorityMedium Priority = "medium"
	PriorityHigh   Priority = "high"
)

type Todo struct {
	ID             int      `json:"id" gorm:"primaryKey"`
	Title          string   `json:"title"`
	Description    *string  `json:"description"`
	Tags           []string `json:"tags" gorm:"serializer:json"`
	Color          *string  `json:"color"`
	Status         Status   `json:"status" gorm:"type:varchar(20)"`
	Priority       Priority `json:"priority" gorm:"type:varchar(20)"`
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
	weekday := time.Now().Weekday().String()
	lowercaseWeekday := strings.ToLower(weekday)
	result := s.db.Where("recurrence_rule LIKE ?", "%everyday%").Or("recurrence_rule LIKE ?", "%"+lowercaseWeekday+"%").Find(&todos)
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
