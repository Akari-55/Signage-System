import {createSlice,PayloadAction,createAsyncThunk} from '@reduxjs/toolkit';
import {Device} from '../types';
import {RootState} from "../../app/store"
import axios from "axios";
interface DeviceState{
    devices:Device[];
    isOn:boolean;
    currentContent:string | null;
    currentMonitorId:string | null;
}
const initialState:DeviceState={
    devices:[],
    isOn:false,
    currentContent:null,
    currentMonitorId:null,
};
export const fetchDevice=createAsyncThunk(
    'Device/fetchDevice',
    async()=>{
        const response =await axios.get('http://localhost:8000/signage_app/device',{
            headers:{
                "Content-Type":"application/json",
            }
        });
        return response.data;
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
        selectDevice:(state,action)=>{
            const monitorId=action.payload;
            state.currentMonitorId=monitorId;
        },
        setCurrentMonitorId:(state,action)=>{
            state.currentMonitorId =action.payload;
        },
        },
    extraReducers:(builder)=>{
        builder
            .addCase(fetchDevice.fulfilled,(state,action)=>{
                state.devices=action.payload;
            })
    }
});

export const {toggleDevice,setCurrentContent,selectDevice,setCurrentMonitorId}=deviceSlice.actions;
export const SelectCurrentMonitorId=(state:RootState)=>state.device.currentMonitorId;
export const SelectDevice=(state:RootState)=>state.device.devices;


export default deviceSlice.reducer;