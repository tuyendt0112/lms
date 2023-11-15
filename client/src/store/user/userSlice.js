import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null
    },
    reducers: {
        // logout: (state) => {
        //     state.isLoading = false
        // }
        login: (state, action) => {
            console.log(action)
            state.isLoggedIn = action.payload.isLoggedIn
            state.current = action.payload.userData
            state.token = action.payload.token
        }
    },
    // // Code logic xử lý async action
    // extraReducers: (builder) => {
    //     // // Bắt đầu thực hiện action login (Promise pending)
    //     builder.addCase(actions.getNewPitches.pending, (state) => {
    //         // Bật trạng thái loading
    //         state.isLoading = true;
    //     });

    //     // Khi thực hiện action login thành công (Promise fulfilled)
    //     builder.addCase(actions.getNewPitches.fulfilled, (state, action) => {
    //         // Tắt trạng thái loading, lưu thông tin user vào store
    //         state.isLoading = false;
    //         state.newPitches = action.payload;
    //     });

    //     // Khi thực hiện action login thất bại (Promise rejected)
    //     builder.addCase(actions.getNewPitches.rejected, (state, action) => {
    //         // Tắt trạng thái loading, lưu thông báo lỗi vào store
    //         state.isLoading = false;
    //         state.errorMessage = action.payload.message;
    //     });
    // }
})

export const { login } = userSlice.actions

export default userSlice.reducer