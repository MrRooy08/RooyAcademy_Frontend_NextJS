import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: '',
    category: '',
};

const courseFormSlice = createSlice({
    name: 'courseForm',
    initialState,
    reducers: {
        updateForm: (state,action) => {
            return { ...state, ...action.payload};
        },
        resetForm: () => initialState,
    },
});

export const { updateForm, resetForm} = courseFormSlice.actions;
export default courseFormSlice.reducer;