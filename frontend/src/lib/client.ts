import { query } from "@solidjs/router";
import type { EndpointOptions, EndpointResponse, Endpoints } from "./router";
import * as backend from "./router";

const { routerConfig } = backend;

class ApiClient<
	E extends Endpoints,
	M extends keyof (typeof backend.routerConfig)[E],
> {
	private async request<T>(
		method: string,
		route: string,
		options = {},
	): Promise<T> {
		return backend.handleRequest(method, route, options) as T;
		// TODO: implement web client logic
	}

	async get(url: string, options?: EndpointOptions<E, M>) {
		return this.request("GET", url, options);
	}

	async create(url: string, options: EndpointOptions<E, M>) {
		return this.request("POST", url, options);
	}

	async update(url: string, options?: EndpointOptions<E, M>) {
		return this.request("PATCH", url, options);
	}

	async delete(url: string, options?: EndpointOptions<E, M>) {
		return this.request("DELETE", url, options);
	}
}

export const api = new ApiClient();

// TODO: Pass a typed fetcher to the handler
export function createTypedQuery<
	E extends Endpoints,
	M extends keyof (typeof routerConfig)[E],
>(
	handler: (
		options: EndpointOptions<E, M>,
		typedApiClient: ApiClient<E, M>,
	) => Promise<unknown>,
	route: E | string,
) {
	return query(
		(options: EndpointOptions<E, M>) =>
			handler(options, api) as EndpointResponse<E, M>,
		route,
	);
}
