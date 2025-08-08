import { configureStore } from '@reduxjs/toolkit';
import {categoryApi} from '../features/category/categoryApi';
import { courseApi } from  "@/app/features/courses/courseApi";
import courseFormReducer from '@/app/features/courses/courseFormSlice';
import { adminApi } from '@/app/features/admin/adminApi';
import { transactionApi } from '@/app/features/transaction/transactionApi';
// const store = configureStore({
//     reducer: {
//       category: categoryReducer, // Thêm slice vào store
//     },
//   });

// export default store;

export const store = configureStore({
  reducer: {
    courseForm: courseFormReducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(categoryApi.middleware,courseApi.middleware,adminApi.middleware,transactionApi.middleware),
});

export default store;

