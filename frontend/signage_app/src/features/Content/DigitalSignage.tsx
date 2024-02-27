
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
//コンテンツ表示
export const DigitalSignage=()=>{
    const[contents,setContents]=useState([]);
    const [currentContentIndex,setCurrentContentIndex]=useState(0);
    const[selectedContents,setSelectedContents]=useState<Content[]>([]);
    const contentRef=useRef<HTMLVideoElement|null>(null);
    const [error,setError]=useState<string|null>(null);
    const dispatch:AppDispatch=useDispatch();
    const content=useSelector(SelectContent);
    const contentgroup=useSelector(SelectContentGroup);
    const contentgroupmembers=useSelector(SelectContentGroupMember);
    const currentMonitorId=useSelector(SelectCurrentMonitorId);
    useEffect(()=>{
        if(contentgroupmembers.length===0){
            dispatch(fetchContentGroupMember());
        }
    },[dispatch,contentgroupmembers.length]);
    useEffect(()=>{
        const publishedContentGroupId=contentgroup
            .filter(group=>group.status==='使用中')
            .map(group=>group.id);
        if(publishedContentGroupId.length>1){
            setError('公開中のContentGroupが複数存在します');
        }else if(publishedContentGroupId.length===1){
            const selectedGroupId=publishedContentGroupId[0];
            console.log(selectedGroupId);
            console.log(contentgroupmembers);
            const relatedContents=contentgroupmembers
                .filter(member=>{
                    console.log('Filtering member',member.group);
                    return member.group ===selectedGroupId;
                })
                .map(member=>{
                    console.log('Mapping member to content:',member);
                    return content.find(c=>c.id===member.content)
                })
                .filter(c=>{
                    console.log('Filterd content:',c);
                
                return c!==undefined;
            });
            console.log("Content",relatedContents);
            setSelectedContents(relatedContents as Content[]);
        }
    },[contentgroup,contentgroupmembers,content])
    useEffect(()=>{
        if(selectedContents.length===0){
            return;
        }
        const currentContent=selectedContents[currentContentIndex];
        //console.log(currentContent);
        const isVideo=currentContent?.type==='movie';
        const timeoutId=setTimeout(()=>{
            if(!isVideo || (contentRef.current && contentRef.current.ended)){
                const nextIndex=(currentContentIndex+1)%selectedContents.length;
                setCurrentContentIndex(nextIndex);
            }

        },isVideo? undefined:10000);
        return()=>{
            clearTimeout(timeoutId);
        };
    },[currentContentIndex,selectedContents])
    
    const currentContent=selectedContents[currentContentIndex];
    console.log(currentContent)
    const ContentDisplay=({content}:{content:Content}):JSX.Element|null=>{
        if(!content){
            return null;
        }
        const fileUrl=content.file;
        console.log("content type",content.content_type);
        if(fileUrl!=null){
            switch (content.content_type) {
                case 'movie':
                    return (
                        <video ref={contentRef} src={fileUrl.toString()} autoPlay onEnded={() => setCurrentContentIndex((currentContentIndex + 1) % selectedContents.length )} className={styles.fullscreen_media_video} />
                    );
                case 'image':
                default:
                    return <img src={fileUrl.toString()} alt={content.title} className={styles.fullscreen_media_img} />;
            }
        }else{
            return<div>表示できるものがありません</div>;
        }
    };
    return(
        <div  className={styles.fullscreen_media}>
            {/* {currentContent &&(
                currentContent.type === 'video'?(
                    <video ref={contentRef} src={currentContent.url} autoPlay onEnded={()=>setCurrentContentIndex((currentContentIndex +1)%selectedContents.length)}/>

                ):(
                    <img src={currentContent.file} alt={currentContent.name} />
                )
            )} */}
            {currentContent && <ContentDisplay content={currentContent} />}
        </div>
    );
};
export default DigitalSignage