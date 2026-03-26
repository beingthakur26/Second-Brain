import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// GET ITEMS
export const fetchItems = createAsyncThunk(
  "items/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/items");
      return res.data.items;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// CREATE ITEM
export const createItem = createAsyncThunk(
  "items/create",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/items", data);
      return res.data.item;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

const itemSlice = createSlice({
  name: "items",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload); // instant UI update
      });
  },
});

export default itemSlice.reducer;