import React,{useState,useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {fetchDevice,setCurrentMonitorId} from '../Device/deviceSlice';
import {fetchContent} from '../Content/contentSlice';
import {RootState,AppDispatch} from '../../app/store';
import{Device} from '../types';

const DeviceSelector=()=>{
    const dispatch=useDispatch<AppDispatch>();
    const devices:Device[]=useSelector((state:RootState) =>state.device.devices);
    const [selectedMonitor,setSelectedMonitor]=useState<string | null>(null);

    useEffect(()=>{
        dispatch(fetchDevice());
    },[dispatch]);
    useEffect(()=>{
        if(selectedMonitor){
            dispatch(setCurrentMonitorId(selectedMonitor));
            dispatch(fetchContent(Number(selectedMonitor)));
        }
    },[selectedMonitor,dispatch]);
    return(
        <div>
            <select value={selectedMonitor ? selectedMonitor : ''} onChange={(e)=>setSelectedMonitor(e.target.value)}>
                <option value="">Select a monitor</option>
                {devices.map((device)=>(
                    <option key={device.id} value={device.id}>
                        {device.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
