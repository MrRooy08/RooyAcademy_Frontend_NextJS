import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api",
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set('ngrok-skip-browser-warning', 'true');
      return headers;
    },
   }),
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "category/get-category",
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
