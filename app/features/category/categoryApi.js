import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080/" }),
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "category/get-category",
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi; // ✅ Export hook để sử dụng
