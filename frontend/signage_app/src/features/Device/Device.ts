import {createSlice,PayloadAction,createAsyncThunk} from '@reduxjs/toolkit';
import {DeviceState} from '../types';

const initialState:DeviceState={
    isOn:false,
    currentContent:null,
};
const API_URL='http://localhost:8000/signage_app/device'
export const fetchCurrentContent = createAsyncThunk(
    'Device/fetchCurrentContent',
    async()=>{
        const response =await fetch(API_URL);
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        return response.json();
    }
)
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