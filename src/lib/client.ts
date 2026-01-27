import { query } from "@solidjs/router";
import { isTauri } from '@tauri-apps/api/core';
import * as backend from './backend/router';
import type { EndpointOptions, Endpoints, EndpointResponse } from './backend/router';

const { routerConfig } = backend


class ApiClient {
  constructor() {
  }
  private async request<T>(
    method: string,
    route: string,
    options?: unknown,
  ): Promise<T> {

    if (isTauri()) {
      return backend.handleRequest(method, route, options) as T;
    }
    // TODO: implement web client logic
    // throw new Error("Not yet implemented!")
    console.error("Web not implemented yet!")
    return [] as T;
  }

  async get<E extends Endpoints,
    M extends keyof typeof backend.routerConfig[E]
  >(url: string, options?: EndpointOptions<E, M>) {
    return this.request("GET", url, options);
  }

  async create<E extends Endpoints,
    M extends keyof typeof backend.routerConfig[E]
  >(
    url: string,
    options: EndpointOptions<E, M>
  ) {
    return this.request("POST", url, options);
  }

  async update<E extends Endpoints,
    M extends keyof typeof backend.routerConfig[E]
  >(
    url: string,
    options: EndpointOptions<E, M>
  ) {
    return this.request("PATCH", url, options);
  }

  async delete<E extends Endpoints,
    M extends keyof typeof backend.routerConfig[E]
  >(
    url: string,
    options: EndpointOptions<E, M>
  ) {
    return this.request("DELETE", url, options);
  }
}

export const api = new ApiClient();


export function createTypedQuery<
  E extends Endpoints,
  M extends keyof typeof routerConfig[E]
>(handler: (options: EndpointOptions<E, M>) => Promise<unknown>, route: E) {
  return query((options: EndpointOptions<E, M>) => handler(options) as EndpointResponse<E, M>, route);
}
