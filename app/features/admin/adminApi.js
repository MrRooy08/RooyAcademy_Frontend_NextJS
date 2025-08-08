
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
   }),
  tagTypes: ['Course'], 
  endpoints: (builder) => ({
    approveCourse: builder.mutation({
        query: (courseId) => ({
          url: `/course/approve-public/${courseId}`,
          method: 'POST',
        }),
        invalidatesTags: (courseId) => [
          { type: 'Course', id: 'processing-courses' },
          { type: 'Course', id: 'draft-courses' }, 
          { type: 'Course', id: 'APPROVED-courses' },
          { type: 'Course', id: courseId },
        ],
      }),
      rejectCourse: builder.mutation({
        query: (courseId) => ({
          url: `/course/reject-public/${courseId}`,
          method: 'POST',
        }),
        invalidatesTags: (courseId) => [
            { type: 'Course', id: 'processing-courses' },   
            { type: 'Course', id: 'draft-courses' },
            { type: 'Course', id: 'APPROVED-courses' },
            { type: 'Course', id: courseId },
                      ],
      }),
  }),
})

export const { useApproveCourseMutation, useRejectCourseMutation } = adminApi
