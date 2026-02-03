import createRouteMatcher from "@tscircuit/routematch";
import * as todosController from "./controllers/todos.controller.ts";
import { convertStringFieldsToNumbers } from "./utils/object.ts";

export const routerConfig = {
	"/todos": {
		GET: todosController.getTodos,
		POST: todosController.createTodo,
	},
	"/todos/[id]": {
		DELETE: todosController.deleteTodo,
		PATCH: todosController.updateTodo,
	},
};

export type Endpoints = keyof typeof routerConfig;

// Infering route options based off route handler
// Essentially what this type does, it extracts route handler arguments
export type EndpointOptions<
	E extends Endpoints,
	M extends keyof (typeof routerConfig)[E],
> = Parameters<
	(typeof routerConfig)[E][M] extends (...args: any[]) => any
		? (typeof routerConfig)[E][M]
		: never
>[0];

export type EndpointResponse<
	E extends Endpoints,
	M extends keyof (typeof routerConfig)[E],
> = ReturnType<
	(typeof routerConfig)[E][M] extends (...args: any[]) => any
		? (typeof routerConfig)[E][M]
		: never
>;

export type EndpointDescription<
	E extends Endpoints,
	M extends keyof (typeof routerConfig)[E],
> = {
	options: EndpointOptions<E, M>;
	response: EndpointResponse<E, M>;
};

const routeMatcher = createRouteMatcher(Object.keys(routerConfig));

// Simple routing
export function handleRequest(
	method: string,
	route: string,
	options: Record<string, unknown>,
) {
	const result = routeMatcher(route);
	if (!result) {
		throw new Error(`Route [${route}] is not implemented`);
	}
	const { matchedRoute, routeParams } = result;
	// TODO: make handle request generic
	// @ts-expect-error: We can't satisfy the routerConfig generics because handleRequest isn't generic
	const handler = routerConfig[matchedRoute][method];
	if (!handler) {
		throw new Error(
			`Method [${method}] is not implemented for [${route}] Route`,
		);
	}
	console.log(
		`Route: ${result.matchedRoute} ${method} Params: ${routeParams} Data: ${options}`,
	);

	if (Object.keys(routeParams).length > 0) {
		return handler({
			...convertStringFieldsToNumbers(routeParams as Record<string, unknown>),
			...options,
		});
	}
	return handler(options);
}
