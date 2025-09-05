import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set('ngrok-skip-browser-warning', 'true');
      return headers;
    },
  }),
  tagTypes: ["Course","course","Progress", "all-course-metas" ,"course-instructor", "course-meta", "course-section","lesson-section", "course-id", "Invitation"],
  endpoints: (builder) => ({
    //
    getCourses: builder.query({
      query: () => "course",
      providesTags: ["Course"],
    }),
    //
    createCourse: builder.mutation({
      query: (body) => ({
        url: "course/create-course-draft",
        method: "POST",
        body,
      }),
      invalidatesTags: ["course-instructor","Course"],
    }),

    //
    getCoursesByRole: builder.query({
      query: ({ status, page = 0, size = 5 }) =>
        `course/get-courses-instructor?status=${status}&page=${page}&size=${size}`,
      providesTags:(result, error, arg) => [
        { type: 'Course', id: `${arg.status}-courses` },
        { type: 'course-instructor' },
        { type: 'Course' },
      ],
    }),

    //
    getCourseProcessing: builder.query({
      query: ({ status, page = 0, size = 5 }) =>
        `course/get-course-processing?status=${status}&page=${page}&size=${size}`,
      providesTags: (result, error, arg) => [
        { type: 'Course', id: `${arg.status}-courses` },
      ],
    }),

    getCoursesByStatus: builder.query({
      query: ({ status, page = 0, size = 5 }) =>
        `course/get-course-by-status?status=${status}&page=${page}&size=${size}`,
      providesTags: (result, error, arg) => [
        { type: 'Course', id: `${arg.status}-courses` }, 
        { type: 'Course' },
      ],
    }),
    //
    getCourseByCourseId: builder.query({
      query: (courseId ) =>
        `course/get-course-by-id/${courseId}`,
        providesTags: (result, error, courseId) => [
          { type: 'Course', id: courseId },
          { type: 'Course' },
        ],
    }),

    //
    updateCoursePriceByCourseId: builder.mutation({
      query: ({courseId, priceLevel }) => ({
        url: `course/update-course-price/${courseId}`,
        method: "POST",
        body: { id: priceLevel },
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Course", id: courseId },
        { type: "Course" },
      ],
    }),

    //
    getPriceCourse: builder.query({
      query: (courseId) => `course/get-course-price/${courseId}`,
      providesTags: (result, error, courseId) => [
        { type: 'Course', id: courseId },
        { type: 'Course' },
      ],
    }),


    //
    getCourseMeta: builder.query({
      query: (courseId) => `course/get-course-meta/${courseId}`,
      providesTags: (result, error, courseId) => [
        { type: 'course-meta', id: courseId },
        { type: 'Course', id: courseId },
      ],
    }),

    //
    createCourseMeta: builder.mutation({
      query: ({ courseId, meta }) => ({
        url: `course/create-course-meta/${courseId}`,
        method: "POST",
        body: { meta },
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Course", id: courseId },
        { type: "course-meta", id: courseId },
      ],
    }),
    //
    createCourseSection: builder.mutation({
      query: ({ courseId, section }) => ({
        url: `section/create-section/${courseId}`,
        method: "POST",
        body: section,
      }),
      invalidatesTags: ["course-section"],
    }),

    //
    getSectionByCourse: builder.query({
      query: (courseId) => `section/get-section-by-course/${courseId}`,
      providesTags: ["course-section"],
    }),

    //
    updateSectionBySection: builder.mutation({
      query: ({ sectionId, section }) => ({
        url: `section/update-section/${sectionId}`,
        method: "POST", 
        body: section,
      }),
      invalidatesTags: ["course-section"],
    }),

    //
    createLessonBySection: builder.mutation({
      query: ({ sectionId, lesson, files, videoFile }) => {
        const formData = new FormData();
    
        // Gửi lesson dưới dạng chuỗi JSON
        const lessonBlob = new Blob([JSON.stringify(lesson)], { type: "application/json" });

        formData.append("lesson", lessonBlob);
    
        if (files && Array.isArray(files)) {
          files.forEach((file) => {
            if (file instanceof File) {
              formData.append("files", file);
            }
          });
        }
            
        // Gửi video file
        if (videoFile && videoFile instanceof File) {
          formData.append("videoFile", videoFile);
        }
        
    
        return {
          url: `lesson/create-lesson?sectionId=${sectionId}`, // Truyền qua query param
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["course-section"],
    }),

    //
    uploadChunkFile: builder.mutation({
      query: ({chunk, index, filedId}) => {
        const formData = new FormData();
        formData.append("chunk", chunk);
        formData.append("index", index);
        formData.append("fileId", filedId);

        return {
          url: `lesson/upload-chunk-file/${filedId}`,
          method: "POST",
          body: formData,
        };
      },
    }),


    updateLessonBySection: builder.mutation({
      query: ({ lessonId, lesson, files, videoFile }) => {
        const formData = new FormData();
    
        // Gửi lesson dưới dạng chuỗi JSON
        const lessonBlob = new Blob([JSON.stringify(lesson)], { type: "application/json" });

        formData.append("lesson", lessonBlob);
    
        // Gửi các tệp tin
        if (files && Array.isArray(files)) {
          files.forEach((file) => {
            if (file instanceof File) {
              formData.append("files", file);
            }
          });
        }
    
        // Gửi video file
        if (videoFile && videoFile instanceof File) {
          formData.append("videoFile", videoFile);
        }
    
        return {
          url: `lesson/update-lesson?lessonId=${lessonId}`, // Truyền qua query param
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["course-section"],
    }),
    
    //
    updateCourseOverview: builder.mutation({
      query: ({formData, courseId}) => ({
        url: `course/update-course-overview?${courseId}`,
        method: "PUT",
        body: formData,
      }), 
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Course", id: courseId },
        { type: "course-section" },
        { type: "Course" },
      ],
    }),    

    //
    submitCourse: builder.mutation({
      query: (courseId) => ({
        url: `course/submit-public/${courseId}`,
        method: "POST",
      }),
      invalidatesTags: ["Course"],
    }),

    getProgress: builder.query({
      query: (enrollmentId) => `progress/${enrollmentId}/detailed`,
      providesTags: (result, error, enrollmentId) => [
        { type: "Progress", id: enrollmentId },
        "Progress"
      ],
    }),

    getProgressAssignment: builder.query({
      query: (enrollmentId) => `progress/${enrollmentId}/assignments`
    }),
    
    completeLesson: builder.mutation({
      query: ({ enrollmentId, lessonId }) => ({
        url: `progress/complete-lesson`,
        method: "POST",
        body: { enrollmentId, lessonId },
      }),
      invalidatesTags: (result, error, { enrollmentId }) => {
        console.log('💫 Invalidating tags for enrollmentId:', enrollmentId);
        return [
          { type: "Progress", id: enrollmentId },
          "Progress",
          "course-section",
        ];
      },
    }),

    getEnrolledCourses: builder.query({
      query: () => `course/my-enrolled-courses`,
      providesTags: ["Course"],
    }),

    checkCourseProcessing: builder.query({
      query: (courseId) => `course/check-course-processing/${courseId}`,
      providesTags: ["Course"],
    }),

    getInvitation: builder.query({
      query: () => `invitation/myList`,
      providesTags: ["Course", "Invitation"],
    }),

    addInstructor: builder.mutation({
      query: ({courseId,body}) => ({
        url: `course/add-co-instructor/${courseId}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Course", "Invitation"],
    }),

    acceptInvitation: builder.mutation({
      query: ({courseId, status}) => ({
        url: `invitation/response`,
        method: "POST",
        body: { courseId, status },
      }),
      invalidatesTags: ["Course", "Invitation"],
    }),

    rejectInvitation: builder.mutation({
      query: ({courseId, status}) => ({
        url: `invitation/response`,
        method: "POST",
        body: { courseId, status },
      }),
      invalidatesTags: ["Course", "Invitation"],
    }),

    enrollCourse: builder.mutation({
      query: ({courseId}) => ({
        url: `enrollment`,
        method: "POST",
        body: {courseId}
      }),
      invalidatesTags: ["Course"],
    }),
    getPrice: builder.query({
      query: () => ({
        url: `/tier-price`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),

    createCart: builder.mutation({
      query: (body) => ({
        url: `cart`,
        method: "POST",
        body: {items: body},
      }),
    }),

    deleteCartItems: builder.mutation({
      query: ({cartId, courseId}) => ({
        url: `cart/${cartId}/items/${courseId}`,
        method: "DELETE",
      }),
    }),

    createAssignmentBySection: builder.mutation({
      query: (body) => ({
        url: `assignments/create-assignment`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["course-section","Course"],
    }),

    updateAssignmentById: builder.mutation({
      query: ({assignmentId,body}) => ({
        url: `assignments/${assignmentId}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["course-section","Course"],
    }),

    completeAssignment: builder.mutation({
      query: ({assignmentId,body}) => ({
        url: `assignments/${assignmentId}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["course-section","Course"],
    }),

  }),

});

export const {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useCreateCourseMetaMutation,
  useCreateCourseSectionMutation,
  useCreateLessonBySectionMutation,
  useUpdateLessonBySectionMutation,
  useUpdateCoursePriceByCourseIdMutation,
  useUploadChunkFileMutation,
  useGetCoursesByRoleQuery,
  useGetCourseByCourseIdQuery,
  useLazyGetCourseByCourseIdQuery,
  useGetCourseMetaQuery,
  useUpdateSectionBySectionMutation,
  useGetSectionByCourseQuery,
  useGetPriceCourseQuery,
  useGetInvitationQuery,
  useGetProgressQuery,
  useGetCoursesByStatusQuery,
  useGetEnrolledCoursesQuery,
  useCheckCourseProcessingQuery,
  useUpdateCourseOverviewMutation,
  useSubmitCourseMutation,
  useCompleteLessonMutation,
  useAcceptInvitationMutation,
  useRejectInvitationMutation,
  useAddInstructorMutation,
  useEnrollCourseMutation,
  useGetPriceQuery,
  useCreateAssignmentBySectionMutation,
  useUpdateAssignmentByIdMutation,
  useCreateCartMutation,
  useDeleteCartItemsMutation,
  useCompleteAssignmentMutation,
  useGetProgressAssignmentQuery,
} = courseApi;
