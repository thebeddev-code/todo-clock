export namespace services {
	
	export class Todo {
	    ID: number;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	    // Go type: gorm
	    DeletedAt: any;
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
	        this.ID = source["ID"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	        this.DeletedAt = this.convertValues(source["DeletedAt"], null);
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
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

