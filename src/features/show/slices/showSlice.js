import { createSlice } from '@reduxjs/toolkit';

export const showSlice = createSlice({
    name: 'show',
    initialState: {
        showList: [],
        showLoaded: false,
    },
    reducers: {
        addShow: (state, action) => {
            state.showList.push(action.payload);
        },
        fetchShowList: (state, action) => {
            state.showList = action.payload;
            state.showLoaded = true;
        },
        markAsDownloadImage: (state, action) => {
            console.log(state.showList);
            state.showList[action.payload.index].imageDownloaded = true;
            state.showList[action.payload.index].image = action.payload.url;
        },
    },
});

export const { addShow, fetchShowList, markAsDownloadImage } =
    showSlice.actions;

export default showSlice.reducer;
