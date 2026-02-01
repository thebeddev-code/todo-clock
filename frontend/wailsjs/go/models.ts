export namespace services {
	
	export class Todo {
	    id: number;
	    title: string;
	    description?: string;
	    tags: string[];
	    color?: string;
	    status: string;
	    priority: string;
	    startsAt?: string;
	    due?: string;
	    updatedAt?: string;
	    createdAt?: string;
	    completedAt?: string;
	    isRecurring: boolean;
	    recurrenceRule?: string;
	
	    static createFrom(source: any = {}) {
	        return new Todo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.description = source["description"];
	        this.tags = source["tags"];
	        this.color = source["color"];
	        this.status = source["status"];
	        this.priority = source["priority"];
	        this.startsAt = source["startsAt"];
	        this.due = source["due"];
	        this.updatedAt = source["updatedAt"];
	        this.createdAt = source["createdAt"];
	        this.completedAt = source["completedAt"];
	        this.isRecurring = source["isRecurring"];
	        this.recurrenceRule = source["recurrenceRule"];
	    }
	}

}

