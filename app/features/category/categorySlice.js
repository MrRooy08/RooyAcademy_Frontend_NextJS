import { init } from "aos";
import React from "react";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk để gọi API
export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async () => {
    const response = await fetch("http://localhost:8080/category/get-category");
    const data = await response.json();
    return data.result || [];
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      return action.payload; // Gán kết quả API cho state
    });
  },
});

