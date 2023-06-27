import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import utilsService from '../api/utils.service';

export const getEntiteti = createAsyncThunk("utils/getEntities", async () => {
   return await utilsService.getEntites();
});

export const getKantoni = createAsyncThunk("utils/getKantoni", async () => {
    return await utilsService.getCantons();
});

export const getZone = createAsyncThunk("utils/getZone", async () => {
   return await utilsService.getZones();
});

const utilsSlice = createSlice({
    name: 'utils',
    initialState: {
        loading: false,
        entiteti: [],
        kantoni: [],
        zone: [],
    },
    reducers: {

    },
    extraReducers: {
        [getEntiteti.fulfilled]: (state, action) => {
            state.loading = false;
            state.entiteti = action.payload;
        },
        [getEntiteti.pending]: (state) => {
            state.loading = true;
        },
        [getEntiteti.rejected]: (state) => {
            state.loading = false;
        },

        [getKantoni.fulfilled]: (state, action) => {
            state.loading = false;
            state.kantoni = action.payload;
        },
        [getKantoni.pending]: (state) => {
            state.loading = true;
        },
        [getKantoni.rejected]: (state) => {
            state.loading = false;
        },

        [getZone.fulfilled]: (state, action) => {
            state.loading = false;
            state.zone = action.payload;
        },
        [getZone.pending]: (state) => {
            state.loading = true;
        },
        [getZone.rejected]: (state) => {
            state.loading = false;
        }
    }
});
// export const {} = utilsSlice.actions
export default utilsSlice.reducer;
