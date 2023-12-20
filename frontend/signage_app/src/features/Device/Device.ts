import {createSlice,PayloadAction,createAsyncThunk} from '@reduxjs/toolkit';
import {DeviceState} from '../types';

const initialState:DeviceState={
    isOn:false,
    currentContent:null,
};

export const deviceSlice = createSlice({
    name:'device',
    initialState,
    reducers:{
        //デバイスのオンオフを切り替える
        toggleDevice:(state)=>{
            state.isOn = !state.isOn;
        },
        //現在表示中のコンテンツを更新する
        setCurrentContent:(state,action:PayloadAction<string>)=>{
            state.currentContent=action.payload;
        },
    },
});

export const {toggleDevice,setCurrentContent}=deviceSlice.actions;
export default deviceSlice.reducer;