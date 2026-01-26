// Define field name and data type
type FieldName = string; // or use literal union for type safety
type FieldDataType = string | number | boolean | Date;

// Support basic operators
type FilterCondition<T> =
  | T
  | { eq?: T; ne?: T; gt?: T; lt?: T; gte?: T; lte?: T }
  | { in?: T[]; notIn?: T[] }
  | { like?: string; contains?: string };

type Query<Fields> = {
  /**
   * Sort ascending by field(s)
   */
  asc?: (keyof Fields)[];
  /**
   * Sort descending by field(s)
   */
  desc?: (keyof Fields)[];

  /**
   * Advanced filtering with operators
   * Supports both simple values and complex conditions
   */
  where?: {
    [K in keyof Fields]?: FilterCondition<Fields[K]>
  } & {
    // Optional logical operators
    AND?: Array<Query<Fields>['where']>;
    OR?: Array<Query<Fields>['where']>;
    NOT?: Query<Fields>['where'];
  };

  /**
   * Pagination - choose cursor, offset, or page-based
   */
  paginate?: {
    size: number;
    /**
     * Option 1: Offset-based
     */
    offset?: number;
    /**
     * Option 2: Page number (requires knowing page size)
     */
    page?: number;
    /**
     * Option 3: Cursor (for keyset pagination)
     */
    cursor?: string;
  };
};   
