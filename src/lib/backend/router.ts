import createRouteMatcher from '@tscircuit/routematch'
import { handleGetTodos } from './controllers/todo.controller';

export const routerConfig = {
  "/todos": {
    GET: handleGetTodos
  }
}

export type Endpoints = keyof typeof routerConfig;

// Infering route options based off route handler
// Essentially what this type does, it extracts route handler arguments
export type EndpointOptions<
  E extends Endpoints,
  M extends keyof typeof routerConfig[E]
> = Parameters<(typeof routerConfig)[E][M] extends (...args: any[]) => any
  ? (typeof routerConfig)[E][M]
  : never>[0];

export type EndpointResponse<
  E extends Endpoints,
  M extends keyof typeof routerConfig[E]
> = ReturnType<(typeof routerConfig)[E][M] extends (...args: any[]) => any
  ? ((typeof routerConfig)[E][M])
  : never>;

export type EndpointDescription<
  E extends Endpoints,
  M extends keyof typeof routerConfig[E]
> = {
  options: EndpointOptions<E, M>;
  response: EndpointResponse<E, M>;
};


const routeMatcher = createRouteMatcher(Object.keys(routerConfig))

// Simple routing
export function handleRequest<Routes>(method: string, route: string, options: unknown) {
  const result = routeMatcher(route);
  if (!result) {
    throw new Error(`Route [${route}] is not implemented`)
  }
  const handler = routerConfig[result.matchedRoute][method];
  if (!handler) {
    throw new Error(`Method [${method}] is not implemented for [${route}] Route`)
  }
  console.log(`Route: ${result.matchedRoute} ${method}`)
  return handler(options);
}

