import React,{useState,useEffect} from 'react';
import { useNavigate ,useParams} from 'react-router-dom';
import axios from "axios";
import styles from "./Content.module.css";
import {useSelector,useDispatch} from "react-redux";
import {AppDispatch} from "../../app/store";
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
import { Routes, Route, BrowserRouter,Link } from "react-router-dom";
import{
    SelectContent,
    SelectContentGroup,
    SelectContentGroupMember,
    SelectContentById,
    deleteContent,
    addContent,
    deleteContent_api,
    createContent_api,
    updateContent_api,
    editContent_api,
    uploadContentFile_api
} from './contentSlice'
//コンテンツの新規作成
export const ContentCreator=()=>{
    const dispatch=useDispatch<AppDispatch>();
    const navigate=useNavigate();
    const contents=useSelector(SelectContent);
    const currentMonitorId=useSelector(SelectCurrentMonitorId);
    const[title,setTitle]=useState('');
    const[description,setDescription]=useState('');
    const[file,setFile]=useState<File | null>(null);


    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(!currentMonitorId){
            alert('モニターが選択されていません');
            return;
        }
        //ファイルタイプを判断する
        let contentType='unknown';
        if(file && 'type' in file){
            const fileType=file.type.split('/')[0];
            if(fileType === 'image') contentType='image';
            else if(fileType === 'video') contentType='movie';
        }
        const formData = new FormData();
        formData.append('title',title);
        formData.append('description',description);
        formData.append('device',currentMonitorId);
        if(file instanceof File){
            formData.append('file',file);
        }
        formData.append('content_type',contentType);
        formData.append('status','未使用');
        dispatch(createContent_api({formData}));
        navigate('/');
    };
    //ファイル入力の変更を処理する
    const handleFileChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files && e.target.files.length>0){
            setFile(e.target.files[0]);
        }
    };
    return(
        <div>
            <h2>新規コンテンツを作成</h2>
            <form onSubmit={handleSubmit}>
                <input type="text"
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                />
                <textarea
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}>
                </textarea>
                <input type="file"
                        onChange={handleFileChange}
                />
                <button type="submit">コンテンツを作成</button>
            </form>
        </div>
    );
};
export default ContentCreator