import { createSlice } from "@reduxjs/toolkit";
import * as actions from './asyncAction'

export const pitchSlice = createSlice({
    name: 'pitch',
    initialState: {
        newPitches: null,
        errorMessage: ''
    },
    reducers: {
        // logout: (state) => {
        //     state.isLoading = false
        // }

    },
    // Code logic xử lý async action
    extraReducers: (builder) => {
        // // Bắt đầu thực hiện action login (Promise pending)
        builder.addCase(actions.getNewPitches.pending, (state) => {
            // Bật trạng thái loading
            state.isLoading = true;
        });

        // Khi thực hiện action login thành công (Promise fulfilled)
        builder.addCase(actions.getNewPitches.fulfilled, (state, action) => {
            // Tắt trạng thái loading, lưu thông tin user vào store
            state.isLoading = false;
            state.newPitches = action.payload;
        });

        // Khi thực hiện action login thất bại (Promise rejected)
        builder.addCase(actions.getNewPitches.rejected, (state, action) => {
            // Tắt trạng thái loading, lưu thông báo lỗi vào store
            state.isLoading = false;
            state.errorMessage = action.payload.message;
        });
    }
})

//export const { } = appSlice.actions

export default pitchSlice.reducer