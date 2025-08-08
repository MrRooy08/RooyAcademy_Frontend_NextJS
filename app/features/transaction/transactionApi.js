import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
   }),
  
   endpoints: (builder) => ({
    getTransaction: builder.query({
      query: (params) => {
        if (params?.courseId) {
          return `payment/create?courseId=${params.courseId}`; 
        } 
        else {
          return `payment/create`; 
        }
      },
    }),
  }),
});

export const { useGetTransactionQuery, useLazyGetTransactionQuery } = transactionApi;
