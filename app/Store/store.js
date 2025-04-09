import { configureStore } from '@reduxjs/toolkit';
import {categoryApi} from '../features/category/categoryApi';



// const store = configureStore({
//     reducer: {
//       category: categoryReducer, // Thêm slice vào store
//     },
//   });

// export default store;

export const store = configureStore({
  reducer: {
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(categoryApi.middleware),
});

export default store;

