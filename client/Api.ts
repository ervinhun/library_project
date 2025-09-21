/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AuthorDto {
  id?: string;
  /** @minLength 3 */
  name?: string;
  /** @format date-time */
  createdat?: string | null;
}

export interface BookDto {
  books?: BookDto[];
  id?: string;
  /** @minLength 3 */
  title?: string;
  /**
   * @format int32
   * @min 49
   * @max 2147483647
   */
  pages?: number;
  /** @format date-time */
  createdat?: string | null;
  genreid?: string | null;
  genre?: GenreDto | null;
  authors?: AuthorDto[];
}

export interface GenreDto {
  id?: string;
  name?: string;
  /** @format date-time */
  createdat?: string | null;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://server-nameless-star-9223.fly.dev";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Library with Books and Authors
 * @version v1.0.0
 * @baseUrl https://server-nameless-star-9223.fly.dev
 *
 * Books with Genres, and Authors API for project.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  addSampleDataOnce = {
    /**
     * No description
     *
     * @tags AddSampleData
     * @name AddSampleDataAddSampleDataOnce
     * @request POST:/AddSampleDataOnce
     */
    addSampleDataAddSampleDataOnce: (params: RequestParams = {}) =>
      this.request<AuthorDto[], any>({
        path: `/AddSampleDataOnce`,
        method: "POST",
        format: "json",
        ...params,
      }),
  };
  getBookById = {
    /**
     * No description
     *
     * @tags Library
     * @name LibraryGetBookById
     * @request GET:/GetBookById
     */
    libraryGetBookById: (
      query?: {
        bookId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BookDto, any>({
        path: `/GetBookById`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  getAuthorById = {
    /**
     * No description
     *
     * @tags Library
     * @name LibraryGetAuthorById
     * @request GET:/GetAuthorById
     */
    libraryGetAuthorById: (
      query?: {
        authorId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AuthorDto, any>({
        path: `/GetAuthorById`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  getGenreById = {
    /**
     * No description
     *
     * @tags Library
     * @name LibraryGetGenreById
     * @request GET:/GetGenreById
     */
    libraryGetGenreById: (
      query?: {
        genreId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GenreDto, any>({
        path: `/GetGenreById`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  getAllBooks = {
    /**
     * No description
     *
     * @tags Library
     * @name LibraryGetAllBooks
     * @request GET:/GetAllBooks
     */
    libraryGetAllBooks: (params: RequestParams = {}) =>
      this.request<BookDto[], any>({
        path: `/GetAllBooks`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  getAllAuthors = {
    /**
     * No description
     *
     * @tags Library
     * @name LibraryGetAllAuthors
     * @request GET:/GetAllAuthors
     */
    libraryGetAllAuthors: (params: RequestParams = {}) =>
      this.request<AuthorDto[], any>({
        path: `/GetAllAuthors`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  getAllGenres = {
    /**
     * No description
     *
     * @tags Library
     * @name LibraryGetAllGenres
     * @request GET:/GetAllGenres
     */
    libraryGetAllGenres: (params: RequestParams = {}) =>
      this.request<GenreDto[], any>({
        path: `/GetAllGenres`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  getAllBooksByGenre = {
    /**
     * No description
     *
     * @tags Library
     * @name LibraryGetAllBooksByGenre
     * @request GET:/GetAllBooksByGenre
     */
    libraryGetAllBooksByGenre: (
      query?: {
        genreId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BookDto[], any>({
        path: `/GetAllBooksByGenre`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  getAllBooksByAuthor = {
    /**
     * No description
     *
     * @tags Library
     * @name LibraryGetAllBooksByAuthor
     * @request GET:/GetAllBooksByAuthor
     */
    libraryGetAllBooksByAuthor: (
      query?: {
        authorId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BookDto[], any>({
        path: `/GetAllBooksByAuthor`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  getAllBooksByTitle = {
    /**
     * No description
     *
     * @tags Library
     * @name LibraryGetAllBooksByTitle
     * @request GET:/GetAllBooksByTitle
     */
    libraryGetAllBooksByTitle: (
      query?: {
        title?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BookDto[], any>({
        path: `/GetAllBooksByTitle`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  addBook = {
    /**
     * No description
     *
     * @tags Library
     * @name LibraryAddBook
     * @request POST:/AddBook
     */
    libraryAddBook: (
      query?: {
        Books?: BookDto[];
        Id?: string;
        /** @minLength 3 */
        Title?: string;
        /**
         * @format int32
         * @min 49
         * @max 2147483647
         */
        Pages?: number;
        /** @format date-time */
        Createdat?: string | null;
        Genreid?: string | null;
        "Genre.Id"?: string;
        "Genre.Name"?: string;
        /** @format date-time */
        "Genre.Createdat"?: string | null;
        Authors?: AuthorDto[];
      },
      params: RequestParams = {},
    ) =>
      this.request<BookDto, any>({
        path: `/AddBook`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
  addAuthor = {
    /**
     * No description
     *
     * @tags Library
     * @name LibraryAddAuthor
     * @request POST:/AddAuthor
     */
    libraryAddAuthor: (
      query?: {
        Id?: string;
        /** @minLength 3 */
        Name?: string;
        /** @format date-time */
        Createdat?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<AuthorDto, any>({
        path: `/AddAuthor`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
  addGenre = {
    /**
     * No description
     *
     * @tags Library
     * @name LibraryAddGenre
     * @request POST:/AddGenre
     */
    libraryAddGenre: (
      query?: {
        Id?: string;
        Name?: string;
        /** @format date-time */
        Createdat?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<GenreDto, any>({
        path: `/AddGenre`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
  updateBook = {
    /**
     * No description
     *
     * @tags Library
     * @name LibraryUpdateBook
     * @request PUT:/UpdateBook
     */
    libraryUpdateBook: (
      query?: {
        bookId?: string;
        Books?: BookDto[];
        Id?: string;
        /** @minLength 3 */
        Title?: string;
        /**
         * @format int32
         * @min 49
         * @max 2147483647
         */
        Pages?: number;
        /** @format date-time */
        Createdat?: string | null;
        Genreid?: string | null;
        "Genre.Id"?: string;
        "Genre.Name"?: string;
        /** @format date-time */
        "Genre.Createdat"?: string | null;
        Authors?: AuthorDto[];
      },
      params: RequestParams = {},
    ) =>
      this.request<BookDto, any>({
        path: `/UpdateBook`,
        method: "PUT",
        query: query,
        format: "json",
        ...params,
      }),
  };
  updateAuthor = {
    /**
     * No description
     *
     * @tags Library
     * @name LibraryUpdateAuthor
     * @request PUT:/UpdateAuthor
     */
    libraryUpdateAuthor: (
      query?: {
        authorId?: string;
        Id?: string;
        /** @minLength 3 */
        Name?: string;
        /** @format date-time */
        Createdat?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<AuthorDto, any>({
        path: `/UpdateAuthor`,
        method: "PUT",
        query: query,
        format: "json",
        ...params,
      }),
  };
  updateGenre = {
    /**
     * No description
     *
     * @tags Library
     * @name LibraryUpdateGenre
     * @request PUT:/UpdateGenre
     */
    libraryUpdateGenre: (
      query?: {
        genreId?: string;
        Id?: string;
        Name?: string;
        /** @format date-time */
        Createdat?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<GenreDto, any>({
        path: `/UpdateGenre`,
        method: "PUT",
        query: query,
        format: "json",
        ...params,
      }),
  };
  deleteBook = {
    /**
     * No description
     *
     * @tags Library
     * @name LibraryDeleteBook
     * @request DELETE:/DeleteBook
     */
    libraryDeleteBook: (
      query?: {
        bookId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<File, any>({
        path: `/DeleteBook`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  deleteAuthor = {
    /**
     * No description
     *
     * @tags Library
     * @name LibraryDeleteAuthor
     * @request DELETE:/DeleteAuthor
     */
    libraryDeleteAuthor: (
      query?: {
        authorId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<File, any>({
        path: `/DeleteAuthor`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  deleteGenre = {
    /**
     * No description
     *
     * @tags Library
     * @name LibraryDeleteGenre
     * @request DELETE:/DeleteGenre
     */
    libraryDeleteGenre: (
      query?: {
        genreId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<File, any>({
        path: `/DeleteGenre`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
}
