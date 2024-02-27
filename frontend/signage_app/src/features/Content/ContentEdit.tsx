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
const initialDevice:Device={
    id:-1,
    serial_number:"",
    monitor_id:null,
    name:"",
    location:"",
    status:"inactive",
    last_active:new Date().toISOString(),
}
//編集画面
function isString(value:any){
    return typeof value === 'string' || value instanceof String;
}
export const ContentEdit=()=>{
    const {id}=useParams<{id:string}>();
    //console.log(id);
    const navigate=useNavigate();
    const dispatch=useDispatch<AppDispatch>();
    // const content=useSelector((state:RootState)=>{
    //     const numericId=id ? parseInt(id):null;
    //     return state.content.contents.find(c=>c.id === numericId);
    // });
    
    const numericId=id ? parseInt(id):0;
    const content=useSelector((state:RootState)=>SelectContentById(state,numericId));
    const[editData,setEditData]=useState<Partial<Content>>({
        id:-1,
        title:"",
        description:"",
        device:initialDevice,
        status:"draft",
        content_type:"text",
        created_at:new Date().toISOString(),
        updated_at:new Date().toISOString(),
    });
    const [fileData,setFileData]=useState<File|null>(null);
    useEffect(()=>{
        if(id){
            const numericId=parseInt(id);
            if(!isNaN(numericId)){
                dispatch(editContent_api(numericId));
            }
        }
    },[id,dispatch]);
    
    useEffect(()=>{
        if(content){
            setEditData({
                id:content.id,
                title:content.title,
                description:content.description,
                device:content.device,
                status:content.status,
                content_type:content.content_type,
                created_at:content.created_at,
                updated_at:content.updated_at,
                file:content.file,
            });
            setFileData(content.file);
        }
    },[content]);
    useEffect(()=>{
        console.log('Edit Data Changed:',editData);
    },[editData]);
    const handleInputChange=(e:any)=>{
        const {name,value}=e.target;
        setEditData(prev=>({
            ...prev,
            [name]:value,
        }));
    };
    const handleFileChange=async(event:any)=>{
        // setFileData(event.target.files[0]);
        if(event.target.files.length>0){
            const file=event.target.files[0];
            setFileData(file);
            if(editData !==null){
                const fileFormData=new FormData();
                fileFormData.append('file',file);
                try{
                    const response=await fetch(`http://localhost:8000/signage_app/content/${editData.id}/update_file/`,{
                        method:`PUT`,
                        body:fileFormData,
                    });
                    if(response.ok){
                        console.log("ファイル更新成功");
                        // 必要に応じて状態を更新する
                    } else {
                        console.error("サーバーエラー");
                    }
                }catch (error) {
                    console.error("更新中にエラーが発生しました:", error);
                }
            }
        }
        
    }
    const handleSubmit=async(e:any)=>{
        e.preventDefault();
        console.log(fileData);
        if(!editData.title || !editData.description ||!editData.content_type || !editData.status){
            console.error('All fields are required.');
            return;
        }
        if (!isString(editData.title) || !isString(editData.description) || !isString(editData.content_type) || !isString(editData.status)) {
            // エラーメッセージを表示するなどのハンドリングをここに書く
            console.error("Title and Description must be strings.");
            return; // 送信を中断
        }else{
            console.log("ok");
        }
        
        if(editData && id){
            const formData=new FormData();
            Object.keys(editData).forEach(key=>{
                const value=editData[key];
                formData.append(key, editData[key]);
                    
                    if(typeof value==='number'){
                        formData.append(key,value.toString());
                    }else if(value instanceof File){
                        formData.append(key,value,value.name);
                    }else if(typeof value === 'string'){
                        formData.append(key,value);
                    }else if(typeof value === 'object' && key==='Device'){ 
                        formData.append(key,JSON.stringify(value));
                    }
                
            })
            console.log("File:",setFileData)
            console.log("File:",fileData)
            //console.log(fileData);
            if(fileData && fileData instanceof Blob){
                console.log("aaa");
                formData.append('file',fileData,fileData.name);
                // try{
                //     const numericId=parseInt(id);
                //     await dispatch(uploadContentFile_api({numericId,formData}));
                // }catch(error){
                //     console.error("An error occurred",error);
                // }
            }
            try{
                //const fileType=fileData.type.split('/')[0];
                if(fileData !==null){
                    //const fileType=fileData.type.split('/')[0];
                    //console.log("FileType:",typeof fileData);
                    //const file=createFile(fileData);
                    if(editData !==null){
                        const response=await fetch(`http://localhost:8000/signage_app/content/${editData.id}/get_file/`);
                        console.log("response:",fileData);
                        const blob=await response.blob();
                        const fileExtension=blob.type.split('/')[1];
                        const fileName=`${editData.title}.${fileExtension}`;
                        console.log("fileName:",fileName);

                        const file=new File([blob],fileName,{type:blob.type});
                        console.log("File:",file);
                        console.log(file.name);
                        if(file && 'type'in file){
                            const fileType=file.type.split('/')[0];
                            if(fileType ==='image')editData.content_type='image';
                            else if(fileType==='video')editData.content_type='movie';
                        }
                        await dispatch(updateContent_api({...editData as Content,file:file}));
                    }
                //     fetch(`http://localhost:8000/signage_app/content/${editData.id}/serve_file/`)
                //         .then(response => response.blob())  // レスポンスからBlobオブジェクトを取得
                //         .then(blob => {
                // // Blobオブジェクトを利用する。例えば、BlobからオブジェクトURLを作成し、img要素のsrc属性に設定する。
                //         const url = URL.createObjectURL(blob);
                //         const fileData=url;
                //         console.log(url);  // これはBlobオブジェクトに対応するURLです
                //     });
                // const data=new Blob([fileData],{type:'image/jpeg'});
                // const file=new File([data],"filename.JPG",{type:"image/jpeg"})
                    // console.log(editData)
                    // console.log("File Data:",fileData);
                    // console.log(typeof fileData);
                    // await dispatch(updateContent_api({...editData as Content,file:fileData}));
                }
                //await dispatch(updateContent_api({...editData as Content,file:fileData}));
                navigate('/');
                // await dispatch(updateContent_api(formData));
            }catch(error){
                console.error("An error occurrd while updating content",error);
            }
        }
    };

    return(
        <div>
            <h1>編集</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>Title:</label>
                    <input type="text"
                            name="title"
                            value={editData.title || ''}
                            onChange={handleInputChange}
                            />
                </div>
                <div>
                    <label>description:</label>
                    <textarea 
                            name="description"
                            value={editData.description || ''}
                            onChange={handleInputChange}
                            />
                </div>
                <div>
                    <label>File:</label>
                    <span>{fileData ? fileData.name: 'No file selected'}</span>
                    <input type="file"
                            name="file"
                            onChange={handleFileChange}
                            />
                </div>
                <button type="submit">Save Changes</button>
            </form>
            {/* <img id="myImage"/> */}
        </div>
    )
}
export default ContentEdit

