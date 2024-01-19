import React,{useState,useEffect} from 'react';
import { useNavigate ,useParams} from 'react-router-dom';
import axios from "axios";
import styles from "./Content.module.css";
import {useSelector,useDispatch} from "react-redux";
import {AppDispatch} from "../../app/store";
import {RootState} from "../../app/store";
import{selectDevice,setCurrentContent,SelectCurrentMonitorId} from '../Device/deviceSlice';
import {Content,ContentGroup,ContentGroupMember,Device} from '../types';
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
    const getButtonClass=(value:string,type:'status'|'type')=>{
        if(type==='status'){
            return contentStatus ===value ? 'active':'';
        }else{
            return contentType ===value ?'active':'';
        }
    }
    //編集画面ボタン
    const navigate=useNavigate();
    const handleContentEdit=(id:number)=>{
            navigate(`edit/${id}`);
}
    //console.log('Current content:',contents);


    return(
        <div>
            <button onClick={handleDeleteClick}>削除</button>
            <input type="text"
                    placeholder="検索"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    />
            <button onClick={resetFilters} className={contentStatus==='all' &&contentType ==='all'?'activate':''}>すべて</button>
            <button onClick={() =>handleContentTypeChange('image')}className={getButtonClass('image','type')}>画像のみ</button>
            <button onClick={() =>handleContentTypeChange('movie')}className={getButtonClass('movie','type')}>動画のみ</button>
            <button onClick={() =>handleContentStatusChange('公開')}className={getButtonClass('公開','status')}>使用中</button>
            <button onClick={()=>handleContentStatusChange('未公開')}className={getButtonClass('未公開','status')}>未使用</button>
            <table>
                
                    <thead>
                        <tr>
                            <th>選択</th>
                            <td>
                            <th>ステータス</th>
                            <th>コンテンツタイトル</th>
                            <th>コンテンツの詳細</th>
                            <th>更新日</th>
                            <th>作成日</th>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                    {filterdContents.map((contents)=>(
                            <tr key={contents.id}>
                                <th>
                                    <input type="checkbox" 
                                            checked={SelectedContentIds.has(contents.id)} 
                                            onChange={()=>handleCheckboxChange(contents.id)}/>
                                </th>
                                <td key={contents.id} onClick={()=>handleContentEdit(contents.id)}>
                                <th>{contents.status}</th>
                                <th>{contents.title}</th>
                                <th>{contents.description}</th>
                                <th>{contents.updated_at}</th>
                                <th>{contents.created_at}</th>
                                </td>
                            </tr>
                    ))}
                    </tbody>
                
            </table>
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
//コンテンツの新規作成
const ContentCreator=()=>{
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
//新規作成ボタン
const CreateContentButton=()=>{
    const navigate=useNavigate();
    const navigateToCreateContent=()=>{
        navigate('/create-content');//新規作成画面へパスにナビゲート
    };
    return(
        <button onClick={navigateToCreateContent}>新規コンテンツ作成</button>
    );
};
function isString(value:any){
    return typeof value === 'string' || value instanceof String;
}

//編集画面
const ContentEdit=()=>{
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

// export const ContentEdit=()=>{
//     const {contentId}=useParams();
//     console.log("URLから取得したcontentId:",contentId);
//     const parsedContentId=contentId ? parseInt(contentId):null;

//     const navigate=useNavigate();
//     const dispatch=useDispatch<AppDispatch>();
//     const contents=useSelector(SelectContent);
//     const contentToEdit=parsedContentId !== null ? contents.find(content=>content.id === parsedContentId):null;
//     const[originalContent,setOriginalContent]=useState(contentToEdit);
//     const [title,setTitle]=useState(contentToEdit?.title || ``);
//     const [description,setDescription]=useState(contentToEdit?.description || '');
//     const [file,setFile]=useState<File | null>(null);

//     useEffect(()=>{
//         if(contentToEdit){
//             setOriginalContent(contentToEdit);
//             setTitle(contentToEdit.title);
//             setDescription(contentToEdit.description);
//             console.log('Edit Data Changed:',contentToEdit);
//         }
//     },[contentToEdit]);
//     const handleFileChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
//         if(e.target.files && e.target.files.length >0){
//             setFile(e.target.files[0]);
//         }
//     };
//     const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
//         e.preventDefault();
//         if(!contentToEdit){
//             alert('編集するコンテンツが選択されていません');
//             return;
//         }
//         let formData=new FormData();
//         if(title !== originalContent?.title){
//             formData.append('title',title);
//         }
//         if(description !== originalContent?.description){
//             formData.append(`description`,description);
//         }
//         if(file){
//             formData.append('file',file);
//         }
//         console.log("data:",formData);
//         if(formData.has('title') || formData.has('description')|| formData.has(`file`)){
//             dispatch(updateContent_api({id:contentToEdit.id,formData}));
//         }else{
//             alert("変更が検出されませんでした");
//         }
//         navigate(`/`);
//     };
//     return(
//         <div>
//             <h1>編集</h1>
//             <form onSubmit={handleSubmit} encType="multipart/form-data">
//                 <div>
//                     <label>Title:</label>
//                     <input type="text"
//                             name="title"
//                             value={title}
//                             onChange={(e)=>setTitle(e.target.value)}
//                             />
//                 </div>
//                 <div>
//                     <label>description:</label>
//                     <textarea 
//                             name="description"
//                             value={description}
//                             onChange={(e)=>setDescription(e.target.value)}
//                             />
//                 </div>
//                 <div>
//                     <label>File:</label>
//                     <input type="file"
//                             name="file"
//                             onChange={handleFileChange}
//                             />
//                 </div>
//                 <button type="submit">Save Changes</button>
//             </form>
//         </div>
//     )
// };
const ContentPage=()=>{
    return(
        <div>
            <ContentDisplay/>
            <CreateContentButton/>

            
        </div>
    )
}
export default ContentPage