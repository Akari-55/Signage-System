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
        <div>
            <button onClick={handleDeleteClick}>削除</button>
            <input type="text"
                    placeholder="検索"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    />
            <button onClick={resetFilters} className={contentgroupStatus==='all'?'activate':''}>すべて</button>
            <button onClick={() =>handleContentGroupStatusChange('公開')}className={getButtonClass('公開','status')}>使用中</button>
            <button onClick={()=>handleContentGroupStatusChange('未公開')}className={getButtonClass('未公開','status')}>未使用</button>
            <table>
                
                    <thead>
                        <tr>
                            <th>選択</th>
                            <td>
                            <th>ステータス</th>
                            <th>コンテンツタイトル</th>
                            <th>コンテンツの詳細</th>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                    {filterdContentGroups.map((contentGroups)=>(
                            <tr key={contentGroups.id}>
                                <th>
                                    <input type="checkbox" 
                                            checked={SelectedContentGroupIds.has(contentGroups.id)} 
                                            onChange={()=>handleCheckboxChange(contentGroups.id)}/>
                                </th>
                                {/* <td key={contentGroups.id} onClick={()=>handleContentEdit(contentGroups.id)}> */}
                                <th>{contentGroups.status}</th>
                                <th>{contentGroups.name}</th>
                                <th>{contentGroups.description}</th>
                                {/* </td> */}
                            </tr>
                    ))}
                    </tbody>
                
            </table>
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
//コンテンツグループの新規作成
const CreateContentGroup=()=>{
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
const CreateContentGroupButton=()=>{
    const navigate=useNavigate();
    const navigateToCreateContentGroup=()=>{
        navigate('/create-content-group');
    };
    return(
        <button onClick={navigateToCreateContentGroup}>新規コンテンツグループを作成</button>
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
//コンテンツ表示
const DigitalSignage=()=>{
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
export default ContentGroupDisplay