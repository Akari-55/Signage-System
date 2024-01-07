import React,{useState,useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {fetchDevice,setCurrentMonitorId} from '../Device/deviceSlice';
import {fetchContent, fetchContentGroup} from '../Content/contentSlice';
import {RootState,AppDispatch} from '../../app/store';
import{Device} from '../types';

export const DeviceSelector=()=>{
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
            dispatch(fetchContentGroup(Number(selectedMonitor)));
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
// Modal

interface ModalProps{
    children:React.ReactNode;
    onConfirm:()=>void;
    onCancel:()=>void;
}
export const Modal : React.FC<ModalProps> = ({ children, onConfirm, onCancel }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }}>
      <div style={{
        padding: '20px',
        background: 'white',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {children}
        <div style={{ marginTop: '20px' }}>
          <button onClick={onConfirm} style={{ marginRight: '10px' }}>はい</button>
          <button onClick={onCancel}>いいえ</button>
        </div>
      </div>
    </div>
  );
};