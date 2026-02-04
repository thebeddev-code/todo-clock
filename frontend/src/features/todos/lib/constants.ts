export const TODO_QUERY_KEYS = {
	todos: "/todos",
	todo(todoId: number) {
		return `${this.todos}/${todoId}`;
	},
};

export const WEEKDAYS = [
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
	"sunday",
];

export const DEFAULT_TAGS = [...WEEKDAYS, "everyday", "monthly", "weekly"];
