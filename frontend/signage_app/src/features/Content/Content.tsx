import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import styles from "./Content.module.css";
import {useSelector,useDispatch} from "react-redux";
import {AppDispatch} from "../../app/store";
import {Modal} from "../Core/Core";
import{selectDevice,setCurrentContent,SelectCurrentMonitorId} from '../Device/deviceSlice';
import {Content,ContentGroup,ContentGroupMember,Device} from '../types';
import{
    SelectContent,
    SelectContentGroup,
    SelectContentGroupMember,
    deleteContent,
    addContent,
    deleteContent_api,
} from './contentSlice'

//Content一覧表示
export const ContentDisplay=()=>{
    const dispatch:AppDispatch=useDispatch();
    const contents=useSelector(SelectContent);
    const [searchTerm,setSearchTerm] = useState('');
    const [contentType,setContentType] = useState('all');
    const [contentStatus,setContentStatus] = useState('未公開');
    const [SelectedContentIds,setSelectedContentIds] = useState<Set<number>>(new Set());
    const [isModalOpen,setIsModalOpen]=useState(false);

    const handleSearchChange = (event:React.ChangeEvent<HTMLInputElement>)=>{
        setSearchTerm(event.target.value);
    };
    const handleContentTypeChange=(type:'all' | 'image' | 'video')=>{
        setContentType(type);
    };
    const handleContentStatusChange=(type:'公開中' | '未公開')=>{
        setContentStatus(type);
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
            (content.status===contentStatus)
        );
    });
    return(
        <div>
            <button onClick={handleConfirmDelete}>削除</button>
            <input type="text"
                    placeholder="検索"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    />
            <button onClick={() => handleContentTypeChange('all')}>すべて</button>
            <button onClick={() =>handleContentTypeChange('image')}>画像のみ</button>
            <button onClick={() =>handleContentTypeChange('video')}>動画のみ</button>
            <button onClick={() =>handleContentStatusChange('公開中')}>使用中</button>
            <button onClick={()=>handleContentStatusChange('未公開')}>未使用</button>
            <table>
                
                    <thead>
                        <tr>
                            <th>選択</th>
                            <th>ステータス</th>
                            <th>コンテンツタイトル</th>
                            <th>コンテンツの詳細</th>
                            <th>更新日</th>
                            <th>作成日</th>
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
                                <th>{contents.status}</th>
                                <th>{contents.title}</th>
                                <th>{contents.description}</th>
                                <th>{contents.updated_at}</th>
                                <th>{contents.created_at}</th>
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
export const ContentCreator=()=>{
    const dispatch=useDispatch();
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
        formData.append('status','未使用')

        // try{
            // const response=await axios.post(`http://loaclhost:8000/signage_app/content/${}`,formData,{
                // headers:{
                    // 'Content-Type':'multipart/form-data',
                // },
            // });
            // 
            // dispatch(addContent(response.data));
        // } catch(error){
            // console.error('コンテンツ作成中にエラーが発生しました:',error);
        // }
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
export const CreateContentButton=()=>{
    const navigate=useNavigate();
    const navigateToCreateContent=()=>{
        navigate('/create-content');//新規作成画面へパスにナビゲート
    };
    return(
        <button onClick={navigateToCreateContent}>新規コンテンツ作成</button>
    );
};