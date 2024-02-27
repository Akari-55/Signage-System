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
interface ModalProps{
    children:React.ReactNode;
    onConfirm:()=>void;
    onCancel:()=>void;
}
const Modal : React.FC<ModalProps> = ({ children, onConfirm, onCancel }) => {
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
    )
}
const initialDevice:Device={
    id:-1,
    serial_number:"",
    monitor_id:null,
    name:"",
    location:"",
    status:"inactive",
    last_active:new Date().toISOString(),
}

const ContentGroupDisplay=()=>{
    const dispatch:AppDispatch=useDispatch();
    const contentgroups=useSelector(SelectContentGroup);
    const [searchTerm,setSearchTerm]=useState('');
    const [contentgroupStatus,setContentGroupStatus]=useState('all');
    const [SelectedContentGroupIds,setSelectedContentGroupIds]=useState<Set<number>>(new Set());
    const [isModalOpen,setIsModalOpen]=useState(false);
    const handleSearchChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        setSearchTerm(event.target.value);
    }
    console.log(contentgroups);
    const handleContentGroupStatusChange=(status:'公開'|'未公開'|'all')=>{
        setContentGroupStatus(prevStatus=>prevStatus ===status ? 'all':status);
    }
    const resetFilters=()=>{
        setContentGroupStatus('all');
    }
    const handleCheckboxChange=(id:number)=>{
        setSelectedContentGroupIds(prev=>{
            const newSet=new Set(prev);
            if(newSet.has(id)){
                newSet.delete(id);
            }else{
                newSet.add(id);
            }
            return newSet;
        })
    };
    const handleSelectAllChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        const newSelectedContentIds=new Set<number>();
        if(event.target.checked){
            filterdContentGroups.forEach(contentgroup=>newSelectedContentIds.add(contentgroup.id));
        }
        setSelectedContentGroupIds(newSelectedContentIds);
    };
    const handleDeleteClick=()=>{
        setIsModalOpen(true)
    }
    const handleConfirmDelete=()=>{
        SelectedContentGroupIds.forEach(id=>{
            dispatch(deleteContentGroup(id));
            dispatch(deleteContentGroup_api(id));
        });
        setSelectedContentGroupIds(new Set());
        setIsModalOpen(false);
    };
    const handleCancel=()=>{
        setIsModalOpen(false);
    }
    const filterdContentGroups=contentgroups.filter(contentgroup=>{
        return(
            (contentgroup.name.toLowerCase().includes(searchTerm.toLowerCase()))&&
            (contentgroupStatus === 'all' || contentgroup.status===contentgroupStatus)
        );
    });
    const getButtonClass=(value:string,type:'status'|'type')=>{
        if(type==='status'){
            return contentgroupStatus===value ? 'activate':'';
        }
    }
    return(
        <div className={styles.content_list}>
            <div className={styles.content_sidebar}>
                <div className={styles.content_search__wrapper}>
                    <SearchIcon className={styles.content_search__icon}/>
                    <input type="text"
                        placeholder="コンテンツグループを検索"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={styles.content_searh}
                        />
                </div>
                <div className={styles.content_filter}>
                <button onClick={resetFilters} className={`{contentgroupStatus==='all'?'activate':''} ${styles.content_filter__btn}`} >
                    すべて
                </button>
                <button onClick={() =>handleContentGroupStatusChange('公開')}className={`${contentgroupStatus === '公開' ? styles.active : ''} ${styles.content_filter__btn}`}>
                    使用中
                </button>
            <button onClick={()=>handleContentGroupStatusChange('未公開')} className={`${contentgroupStatus === '未公開' ? styles.active : ''} ${styles.content_filter__btn}`}>
                未使用
                </button>
                </div>
            <div className={styles.content_delete__wrapper}>
                <button onClick={handleDeleteClick} className={styles.content_delete}><DeleteIcon className={styles.content_delete__icon}/>削除</button>
            </div>
            </div>
            <div className={styles.content_table}>
            <table>
                
                <thead className={styles.content_table_head}>
                    <tr>
                    <th className={styles.content_table_label}>
                                <input type="checkbox"
                                        onChange={handleSelectAllChange}
                                        checked={SelectedContentGroupIds.size === filterdContentGroups.length && filterdContentGroups.length >0}/></th>
                        <th className={styles.content_table_label}>ステータス</th>
                        <th className={styles.content_table_label}>コンテンツタイトル</th>
                        <th className={styles.content_table_label}>コンテンツの詳細</th>
                    </tr>
                </thead>
                <tbody>
                {filterdContentGroups.map((contentGroups)=>(
                        <tr key={contentGroups.id}>
                            <td>
                                <input type="checkbox" 
                                        checked={SelectedContentGroupIds.has(contentGroups.id)} 
                                        onChange={()=>handleCheckboxChange(contentGroups.id)}/>
                            </td>
                            {/* <td key={contentGroups.id} onClick={()=>handleContentEdit(contentGroups.id)}> */}
                            <td>{contentGroups.status}</td>
                            <td>{contentGroups.name}</td>
                            <td>{contentGroups.description}</td>
                            {/* </td> */}
                        </tr>
                ))}
                </tbody>
            
        </table>
            </div>
            
            {contentgroups.map((contentgroup)=>(
                <div key={contentgroup.id}>
            {isModalOpen &&(
                <Modal
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancel}>
                        <p>コンテンツを削除してもよろしいですか?</p>
                    </Modal>
            )}
            </div>
            ))}
        </div>
    )

}
//コンテンツグループの新規作成
// export const CreateContentGroup=()=>{
//     const[name,setName]=useState('');
//     const [description,setDescription]=useState('');
//     const [selectedContents,setSelectedContents]=useState<number[]>([]);
//     const dispatch=useDispatch<AppDispatch>();
//     const contents=useSelector(SelectContent);
//     const currentMonitorId=useSelector(SelectCurrentMonitorId);

//     useEffect(()=>{
//         const monitorId=Number(currentMonitorId);
//         if(!isNaN(monitorId)){
//             dispatch(fetchContent(monitorId));
//         }
//     },[dispatch,currentMonitorId]);

//     const handleCheckboxChange=(contentId:number)=>{
//         setSelectedContents(prev=>{
//             if(prev.includes(contentId)){
//                 return prev.filter(id=>id!==contentId);
//             }else{
//                 return[...prev,contentId];
//             }
//         })
//     };
//     const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
//         e.preventDefault();
//         const formData=new FormData();
//         formData.append('name',name);
//         formData.append('description',description);
//         dispatch(createContentGroup_api({formData})).then((action)=>{
//             if(createContentGroup_api.fulfilled.match(action)){
//                 const contentGroupId=action.payload.id;
//                 selectedContents.forEach(contentId=>{
//                     const memberData={id:1,group:contentGroupId,content:contentId,order:selectedContents.indexOf(contentId)+1};
//                     dispatch(addContentGroupMember(memberData));
//                 })
//             }
//         }
//         )
//     }
// }
const CreateContentGroupButton=()=>{
    const navigate=useNavigate();
    const navigateToCreateContentGroup=()=>{
        navigate('create-content-group');
    };
    return(
        <Button  variant="contained" color="primary" onClick={navigateToCreateContentGroup}>新規コンテンツグループを作成</Button>
    )
}
const DisplaySignageButton=()=>{
    const navigate=useNavigate();
    const navigateToDisplaySignage=()=>{
        navigate('/display');
    };
    return(
        <button onClick={navigateToDisplaySignage}>サイネージを表示</button>
    )
}


const ContentGroupPage=()=>{
    return(
        <div>
            <div className={styles.content_title_box}>
                <div className={styles.content_title}>
                    < InsertDriveFileIcon className={styles.content_title_icon}/>
                    コンテンツグループ管理
                </div>
                <CreateContentGroupButton/>
            </div>
            <ContentGroupDisplay/>
        </div>
    )
}
export default ContentGroupPage