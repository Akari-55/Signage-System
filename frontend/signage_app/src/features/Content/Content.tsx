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
// async function createFile=(originalFileurl:string)=>{
//     const response =await fetch(originalFileurl);
//     const Blob=await response.blob();
//     return Blob;
    // const data=new Blob([originalFile],{type:originalFile.type});
    // const file=new File([data],originalFile.name,{type:originalFile.type});
    // return file;
//}
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
    );
  };
//Content一覧表示
const ContentDisplay=()=>{
    const dispatch:AppDispatch=useDispatch();
    const contents=useSelector(SelectContent);
    const [searchTerm,setSearchTerm] = useState('');
    const [contentType,setContentType] = useState('all');
    const [contentStatus,setContentStatus] = useState('all');
    const [SelectedContentIds,setSelectedContentIds] = useState<Set<number>>(new Set());
    const [isModalOpen,setIsModalOpen]=useState(false);
    const [active,setActive]=useState(false);

    const handleSearchChange = (event:React.ChangeEvent<HTMLInputElement>)=>{
        setSearchTerm(event.target.value);
    };
    const handleContentTypeChange=(type:'all' | 'image' | 'movie')=>{
        setContentType(prevType=>prevType===type ? 'all':type);
    };
    const handleContentStatusChange=(status:'公開' | '未公開' |'all')=>{
        setContentStatus(prevStatus=>prevStatus === status ? 'all':status);
    }
    const resetFilters=()=>{
        setContentStatus('all');
        setContentType('all');
    }
    const handleCheckboxChange = (id:number) =>{
        setSelectedContentIds(prev =>{
            const newSet=new Set(prev);
            if(newSet.has(id)){
                newSet.delete(id);
            }else{
                newSet.add(id);
            }
            return newSet;
        });
    };
    const handleSelectAllChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        const newSelectedContentIds=new Set<number>();
        if(event.target.checked){
            filterdContents.forEach(content=>newSelectedContentIds.add(content.id));
        }
        setSelectedContentIds(newSelectedContentIds);
    };
    const handleDeleteClick =()=>{
        setIsModalOpen(true)//モーダルを開く
    }
    const handleConfirmDelete =()=>{
        SelectedContentIds.forEach(id=>{
            dispatch(deleteContent(id));
            dispatch(deleteContent_api(id));
        });
        setSelectedContentIds(new Set());//選択をクリア
        setIsModalOpen(false); //モーダルを閉じる
    };
    const handleCancel=()=>{
        setIsModalOpen(false);//モーダルを閉じる
    };
    const filterdContents = contents.filter(content=>{
        return(
            (content.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (contentType === 'all' || content.content_type === contentType) &&
            (contentStatus ==='all' ||content.status===contentStatus)
        );
    });
    // const getButtonClass=(value:string,type:'status'|'type')=>{
    //     if(type==='status'){
    //         return contentStatus ===value ? 'active':'';
    //     }else{
    //         return contentType ===value ?'active':'';
    //     }
    // }

    //編集画面ボタン
    const navigate=useNavigate();
    const handleContentEdit=(id:number)=>{
            navigate(`edit/${id}`);
}
    //console.log('Current content:',contents);


    return(
        <div className={styles.content_list}>
            <div className={styles.content_sidebar}>
                <div className={styles.content_search__wrapper}>
                    <SearchIcon className={styles.content_search__icon}/>
                    <input type="text"
                        placeholder="コンテンツを検索"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={styles.content_search}
                        />
                </div>
                <div className={styles.content_filter}>
                    <button onClick={resetFilters} className={`${contentStatus === 'all' && contentType === 'all' ? styles.activate : ''} ${styles.content_filter__btn}`}>
                        すべて
                    </button>
                    <button onClick={() => handleContentTypeChange('image')} className={`${contentType === 'image' ? styles.active : ''} ${styles.content_filter__btn}`}>
                        画像のみ
                    </button>
                    <button onClick={() => handleContentTypeChange('movie')} className={`${contentType === 'movie' ? styles.active : ''} ${styles.content_filter__btn}`}>
                        動画のみ
                    </button>
                    <button onClick={() => handleContentStatusChange('公開')} className={`${contentStatus === '公開' ? styles.active : ''} ${styles.content_filter__btn}`}>
                        使用中
                    </button>
                    <button onClick={() => handleContentStatusChange('未公開')} className={`${contentStatus === '未公開' ? styles.active : ''} ${styles.content_filter__btn}`}>
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
                                        checked={SelectedContentIds.size === filterdContents.length && filterdContents.length >0}/></th>
                            <th className={styles.content_table_label}>ステータス</th>
                            <th className={styles.content_table_label}>コンテンツタイトル</th>
                            <th className={styles.content_table_label}>コンテンツの詳細</th>
                            <th className={styles.content_table_label}>更新日</th>
                            <th className={styles.content_table_label}>作成日</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filterdContents.map((contents)=>(
                            <tr key={contents.id} >
                                <td >
                                    <input type="checkbox" 
                                            checked={SelectedContentIds.has(contents.id)} 
                                            onChange={()=>handleCheckboxChange(contents.id)}/>
                                </td>
                                <td onClick={()=>handleContentEdit(contents.id)}>{contents.status}</td>
                                <td onClick={()=>handleContentEdit(contents.id)}>{contents.title}</td>
                                <td onClick={()=>handleContentEdit(contents.id)}>{contents.description}</td>
                                <td onClick={()=>handleContentEdit(contents.id)}>{contents.updated_at}</td>
                                <td onClick={()=>handleContentEdit(contents.id)}>{contents.created_at}</td>
                            </tr>
                    ))}
                    </tbody>
                
            </table>
            </div>
            {contents.map((content)=>(
                <div key={content.id}>
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

//新規作成ボタン
const CreateContentButton=()=>{
    const navigate=useNavigate();
    const navigateToCreateContent=()=>{
        navigate('create-content');//新規作成画面へパスにナビゲート
    };
    return(
        // <button onClick={navigateToCreateContent}>新規コンテンツ作成</button>
        <Button variant="contained" color="primary" onClick={navigateToCreateContent}>新規コンテンツ作成</Button>
    );
};




const ContentPage=()=>{
    const navigate=useNavigate();
    const handleNavigation=(path:string)=>{
        navigate(path);
      }
    return(
        <div>
            <div className={styles.content_title_box}>
                <div className={styles.content_title}>
                    < InsertDriveFileIcon className={styles.content_title_icon}/>
                    コンテンツ管理
                </div>
                <CreateContentButton/>
                
            </div>

            <ContentDisplay/>
            

            
        </div>
    )
}
export default ContentPage