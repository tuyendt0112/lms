import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from '../../apis'

export const getNewPitches = createAsyncThunk('pitch/newPitches', async (data, { rejectWithValue }) => {
    const response = await apis.apiGetPitches({ sort: '-createdAt' })
    if (!response.success) return rejectWithValue(response)
    return response.pitches

})