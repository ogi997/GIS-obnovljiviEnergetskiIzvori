import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import windFarmsService from '../api/windFarms.service';
import solarService from '../api/solarPanels.service';

export const getAll = createAsyncThunk("models/getAll", async ({typeModel}, {rejectWithValue}) => {
    switch(typeModel) {
        case "windFarm":
            try {
                return await windFarmsService.getAllWindFarms();
            } catch(err) {
                return rejectWithValue("There is some problem with getting data. Try later.");
            }
        case "solar":
            try {
                return await solarService.getAllSolarPanels();
            } catch(err) {
                return rejectWithValue("There is some problem with getting data. Try later.");
            }
        default:
            return [];
    }
});
export const addModel = createAsyncThunk("models/addModel", async ({value, type}, {rejectWithValue}) => {
    switch(type) {
        case 'windFarm':
            try {
                return await windFarmsService.createWindFarm(value);
            }catch(err){
                return rejectWithValue("Error while adding new model. Please try later.");
            }
        case 'solar':
            try {
                return await solarService.createSolarPanel(value);
            } catch(err) {
                return rejectWithValue("Error while adding new model. Please try later.");
            }
        default: return rejectWithValue("Error.");
    }
});
export const getModel = createAsyncThunk("models/getModel", async ({value, type}, {rejectWithValue}) => {
    switch(type) {
        case 'windFarm':
            try {
                return await windFarmsService.getWindFarm(value);
            } catch(err) {
                return rejectWithValue("There is some problem getting data. Try later.");
            }
        case 'solar':
            try {
                return await solarService.getSolarPanel(value);
            } catch(err) {
                return rejectWithValue("There is some problem getting data. Try later.");
            }
        default: return rejectWithValue("Error.");
    }
});
export const updateModel = createAsyncThunk("models/updateModel", async ({id, value, type}, {rejectWithValue}) => {
    switch (type) {
        case 'windFarm':
            try {
                return await windFarmsService.updateWindFarm(id, value);
            } catch(err) {
                return rejectWithValue("Error while updating model. Please try later.");
            }
        case 'solar':
            try {
                return await solarService.updateSolarPanel(id, value);
            } catch (err) {
                return rejectWithValue("Error while updating model. Please try later.");
            }
        default: return rejectWithValue("Error.");
    }
});
export const deleteModel = createAsyncThunk("models/deleteModel", async ({id, type}, {rejectWithValue}) => {
    switch (type) {
        case 'windFarm':
            try {
                return await windFarmsService.deleteWindFarm(id);
            } catch (err) {
                return rejectWithValue("Error while deleting model. Please try later.");
            }
        case 'solar':
            try {
              return await solarService.deleteSolarPanel(id);
            } catch (err) {
                return rejectWithValue("Error while deleting model. Please try later.");
            }
        default: return rejectWithValue("Error.");
    }
});
const modelsSlice = createSlice({
    name: "models",
    initialState: {
        selectedModel: null,
        windModels: {
            create: false,
            edit: false,
            points: [],
            data: null,
            loading: false,
            loadingData: false,
            error: null,
        },
        solarModels: {
            create: false,
            edit: false,
            points: [],
            data: null,
            loading: false,
            loadingData: false,
            error: null,
        },
    },
    reducers: {
        setSelectedModel: (state, action) => {
            const {modelType} = action.payload;
            state.selectedModel = modelType;
        },
        toggleCreateModel: (state, action) => {
            const {modelAction, modelValue} = action.payload;
            switch (state.selectedModel) {
                case 'windFarm':
                    switch (modelAction) {
                        case "TOGGLE":
                            state.windModels.create = !state.windModels.create;
                            break;
                        case "SET_VALUE":
                            state.windModels.create = modelValue;
                            break;
                        default:
                            return;
                    }
                    break;
                case 'solar':
                    switch (modelAction) {
                        case "TOGGLE":
                            state.solarModels.create = !state.solarModels.create;
                            break;
                        case "SET_VALUE":
                            state.solarModels.create = modelValue;
                            break;
                        default:
                            return;
                    }
                    break;
                default:
                    return;
            }
        },
        toggleEditModel: (state, action) => {
            const {modelAction, modelValue} = action.payload;
            switch (state.selectedModel) {
                case 'windFarm':
                    switch (modelAction) {
                        case 'TOGGLE':
                            state.windModels.edit = !state.windModels.edit;
                            break;
                        case 'SET_VALUE':
                            state.windModels.edit = modelValue;
                            break;
                        default:
                            return;
                    }
                    break;
                case 'solar':
                    switch (modelAction) {
                        case 'TOGGLE':
                            state.solarModels.edit = !state.solarModels.edit;
                            break;
                        case 'SET_VALUE':
                            state.solarModels.edit = modelValue;
                            break;
                        default:
                            return;
                    }
                    break;
                default:
                    return;
            }
        },
    },
    extraReducers: {
        [getAll.fulfilled]: (state, action) => {
            switch (state.selectedModel) {
                case 'windFarm':
                    state.windModels.loading = false;
                    state.windModels.points = action.payload;
                    state.windModels.error = null;
                    break;
                case 'solar':
                    state.solarModels.loading = false;
                    state.solarModels.points = action.payload;
                    state.solarModels.error = null;
                    break;
                default:
                    state.solarModels.loading = false;
                    state.windModels.loading = false;
                    state.windModels.points = [];
                    state.solarModels.points = [];
            }
        },
        [getAll.pending]: (state) => {
            switch (state.selectedModel) {
                case 'windFarm':
                    state.windModels.loading = true;
                    break;
                case 'solar':
                    state.solarModels.loading = true;
                    break;
                default:
                    state.windModels.loading = false;
                    state.solarModels.loading = false;
            }
        },
        [getAll.rejected]: (state, action) => {
            switch (state.selectedModel) {
                case 'windFarm':
                    state.windModels.loading = false;
                    state.windModels.points = [];
                    state.windModels.error = action.payload;
                    break;
                case 'solar':
                    state.solarModels.loading = false;
                    state.solarModels.point = [];
                    state.solarModels.error = action.payload;
                    break;
                default:
                    state.solarModels.loading = false;
                    state.solarModels.point = [];
                    state.solarModels.error = action.payload;
                    state.windModels.loading = false;
                    state.windModels.points = [];
                    state.windModels.error = action.payload;
            }
        },

        [addModel.fulfilled]: (state) => {
            switch (state.selectedModel) {
                case 'windFarm':
                    state.windModels.loading = false;
                    state.windModels.error = null;
                    break;
                case 'solar':
                    state.solarModels.loading = false;
                    state.solarModels.error = null;
                    break;
                default:
                    state.windModels.loading = false;
                    state.solarModels.loading = false;
            }
        },
        [addModel.pending]: (state) => {
            switch (state.selectedModel) {
                case 'windFarm':
                    state.windModels.loading = true;
                    break;
                case 'solar':
                    state.solarModels.loading = true;
                    break;
                default:
                    state.windModels.loading = false;
                    state.solarModels.loading = false;
            }
        },
        [addModel.rejected]: (state, action) => {
            switch (state.selectedModel) {
                case 'windFarm':
                    state.windModels.loading = false;
                    state.windModels.error = action.payload;
                    break;
                case 'solar':
                    state.solarModels.loading = false;
                    state.solarModels.error = action.payload;
                    break;
                default:
                    state.windModels.loading = false;
                    state.windModels.error = action.payload;
                    state.solarModels.loading = false;
                    state.solarModels.error = action.payload;
            }
        },

        [getModel.fulfilled]: (state, action) => {
            switch (state.selectedModel) {
                case 'windFarm':
                    state.windModels.loadingData = false;
                    state.windModels.data = action.payload;
                    state.windModels.error = null;
                    break;
                case 'solar':
                    state.solarModels.loadingData = false;
                    state.solarModels.data = action.payload;
                    state.solarModels.error = null;
                    break;
                default: return;
            }
        },
        [getModel.pending]: (state) => {
            switch (state.selectedModel) {
                case 'windFarm':
                    state.windModels.loadingData = true;
                    break;
                case 'solar':
                    state.solarModels.loadingData = true;
                    break;
                default: return;
            }
        },
        [getModel.rejected]: (state, action) => {
            switch (state.selectedModel) {
                case 'windFarm':
                    state.windModels.loadingData = false;
                    state.windModels.error = action.payload;
                    break;
                case 'solar':
                    state.solarModels.loadingData = false;
                    state.solarModels.error = action.payload;
                    break;
                default: return;
            }
        },

        [updateModel.fulfilled]: (state) => {
            switch (state.selectedModel) {
                case 'windFarm':
                    state.windModels.loadingData = false;
                    state.windModels.error = null;
                    break;
                case 'solar':
                    state.solarModels.loadingData = false;
                    state.solarModels.error = null;
                    break;
                default: return;
            }
        },
        [updateModel.pending]: (state) => {
            switch (state.selectedModel) {
                case 'windFarm':
                    state.windModels.loadingData = true;
                    break;
                case 'solar':
                    state.solarModels.loadingData = true;
                    break;
                default: return;
            }
        },
        [updateModel.rejected]: (state, action) => {
            switch (state.selectedModel) {
                case 'windFarm':
                    state.windModels.loadingData = false;
                    state.windModels.error = action.payload;
                    break;
                case 'solar':
                    state.solarModels.loadingData = false;
                    state.solarModels.error = action.payload;
                    break;
                default: return;
            }
        },

        [deleteModel.fulfilled]: (state) => {
            switch (state.selectedModel) {
                case 'windFarm':
                    state.windModels.loading = false;
                    state.windModels.error = null;
                    break;
                case 'solar':
                    state.solarModels.loading = false;
                    state.solarModels.error = null;
                    break;
                default: return;
            }
        },
        [deleteModel.pending]: (state) => {
            switch (state.selectedModel) {
                case 'windFarm':
                    state.windModels.loading = true;
                    break;
                case 'solar':
                    state.solarModels.loading = true;
                    break;
                default: return;
            }
        },
        [deleteModel.rejected]: (state, action) => {
            switch (state.selectedModel) {
                case 'windFarm':
                    state.windModels.loading = false;
                    state.windModels.error = action.payload;
                    break;
                case 'solar':
                    state.solarModels.loading = false;
                    state.solarModels.error = action.payload;
                    break;
                default: return;
            }
        },
    }
});
export const {toggleCreateModel, toggleEditModel, setSelectedModel} = modelsSlice.actions;
export default modelsSlice.reducer;
