import React,{useState,useEffect,useRef} from 'react';
import { useNavigate ,useParams} from 'react-router-dom';
import axios from "axios";
import styles from "./Content.module.css";
import {useSelector,useDispatch} from "react-redux";
import {AppDispatch} from "../../app/store";
// import {Modal} from "../Core/Core";
import {RootState} from "../../app/store";
import{selectDevice,setCurrentContent,SelectCurrentMonitorId} from '../Device/deviceSlice';
import {Content,ContentGroup,ContentGroupMember,Device} from '../types';
import{Button,
    Menu,
    MenuItem,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    AppBar,
    Box,
  } from '@mui/material'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import{
    SelectContent,
    SelectContentGroup,
    SelectContentGroupMember,
    SelectContentById,
    deleteContent,
    addContent,
    deleteContentGroup_api,
    createContentGroup_api,
    createContentGroupMember_api,
    addContentGroupMember,
    createContent_api,
    updateContent_api,
    editContent_api,
    uploadContentFile_api,
    deleteContentGroup,
    fetchContentGroup,
    fetchContent,
    fetchContentGroupMember,
} from './contentSlice'
import { current } from '@reduxjs/toolkit';
//コンテンツグループの新規作成
export const CreateContentGroup=()=>{
    const dispatch=useDispatch<AppDispatch>();
    const navigate=useNavigate();
    const contents=useSelector(SelectContent);
    const [selectedContents,setSelectedContents]=useState<number[]>([]);
    const [groupName,setGroupName]=useState('');
    const [description,setDescription]=useState('');
    const currentMonitorId=useSelector(SelectCurrentMonitorId);
    useEffect(()=>{
        const monitorId=Number(currentMonitorId);
        if(!isNaN(monitorId)){
            dispatch(fetchContent(monitorId));
        }
    },[dispatch,currentMonitorId]);
    const handleContentSelect=(contentId:number)=>{
        setSelectedContents(prev=>{
            if(prev.includes(contentId)){
                return prev.filter(id=>id!==contentId);
            }else{
                return[...prev,contentId];
            }
        })
    };
    const handleSubmit=async()=>{
        if(!currentMonitorId){
            alert('モニターが選択されていません');
            return;
        }
        const groupformData=new FormData();
        groupformData.append('name',groupName);
        groupformData.append('description',description);
        groupformData.append('device',currentMonitorId);
        groupformData.append('status','未使用');
        const groupResponse=await dispatch(createContentGroup_api({formData:groupformData}));
        if(createContentGroup_api.fulfilled.match(groupResponse)){
            const groupId=groupResponse.payload.id;
            selectedContents.forEach(async(contentId,index)=>{
                const memberFormData=new FormData();
                console.log("ContentId:",contentId.toString());
                memberFormData.append('group',groupId.toString());
                memberFormData.append('content',contentId.toString());
                memberFormData.append('order',index.toString());
                dispatch(createContentGroupMember_api({formData:memberFormData}));
            })
            navigate('/');
        }
    };
    return(
        <div>
            <h2>新規コンテンツグループを作成</h2>
            <input 
                type="text"
                value={groupName}
                onChange={(e)=>setGroupName(e.target.value)}/>
            <textarea
                value={description}
                onChange={(e)=>setDescription(e.target.value)}>
            </textarea>
            <div>
                {contents.map(content=>(
                    <div key={content.id}>
                        <input 
                            type="checkbox"
                            checked={selectedContents.includes(content.id)}
                            onChange={()=>handleContentSelect(content.id)}/>
                        {content.title}
                    </div>
                ))}
            </div>
            <button onClick={handleSubmit}>新規作成</button>
        </div>
    )
}

export default CreateContentGroup