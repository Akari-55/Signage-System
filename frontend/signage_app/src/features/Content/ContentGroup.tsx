import React,{useState,useEffect} from 'react';
import { useNavigate ,useParams} from 'react-router-dom';
import axios from "axios";
import styles from "./Content.module.css";
import {useSelector,useDispatch} from "react-redux";
import {AppDispatch} from "../../app/store";
import {Modal} from "../Core/Core";
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
    createContent_api,
    updateContent_api,
    editContent_api,
    uploadContentFile_api,
    deleteContentGroup
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

export const ContentGroupDisplay=()=>{
    const dispatch:AppDispatch=useDispatch();
    const contentgroups=useSelector(SelectContentGroup);
    const [searchTerm,setSearchTerm]=useState('');
    const [contentgroupStatus,setContentGroupStatus]=useState('all');
    const [SelectedContentGroupIds,setSelectedContentGroupIds]=useState<Set<number>>(new Set());
    const [isModalOpen,setIsModalOpen]=useState(false);
    const handleSearchChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        setSearchTerm(event.target.value);
    }
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