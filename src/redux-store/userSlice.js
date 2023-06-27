import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import authService from "../api/auth.service";
import userService from "../api/user.service";

export const login = createAsyncThunk("userSlice/login", async ({email, password}) => {
    return await authService.login(email, password);
});

export const status = createAsyncThunk("userSlice/status", async () => {
   return await userService.status();
});

const logoutAction = (state) => {
    authService.logout();
    state.authenticated = false;
    state.loading = false;
    state.user = null;
}

const userSlice = createSlice({
    name: 'users',
    initialState: {
        authenticated: false,
        authenticatedFailed: false,
        loading: false,
        user: null,
        role: null,
    },
    reducers: {
        logout: logoutAction,
    },
    extraReducers: {
        [login.fulfilled]: (state) => {
            state.authenticated = true;
            state.authenticatedFailed = false;
            state.loading = false;
        },
        [login.pending]: (state) => {
            state.loading = true;
        },
        [login.rejected]: (state) => {
            state.authenticatedFailed = true;
            state.loading = false;
        },

        [status.fulfilled]: (state, action) => {
            state.authenticated = true;
            state.loading = false;
            state.user = action.payload;
        },
        [status.pending]: (state) => {
            state.loading = true;
        },
        [status.rejected]: (state) => {
            state.authenticated = false;
            state.loading = false;
            state.authenticatedFailed = true;
            state.user = null;
        }
    }
});
export const {logout} = userSlice.actions
export default userSlice.reducer;
