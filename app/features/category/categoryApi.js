import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "category/get-category",
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
