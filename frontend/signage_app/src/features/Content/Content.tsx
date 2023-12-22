import React,{useState} from 'react';
import styles from "./Content.module.css";
import {useSelector,useDispatch} from "react-redux";
import {AppDispatch} from "../../app/store";
import{
    SelectContent,
    SelectContentGroup,
    SelectContentGroupMember,
} from './contentSlice'
const contents=useSelector(SelectContent);
//選択されたモニターに関連するコンテンツをフィルタリング
//Content一覧表示
const ContentDisplay=()=>{
    const contents=useSelector(SelectContent);

    return(
        <table>
            <div>
                <tr>
                    <th>ステータス</th>
                    <th>コンテンツタイトル</th>
                    <th>コンテンツの詳細</th>
                    <th>更新日</th>
                    <th>作成日</th>
                </tr>
                {contents.map((content,index)=>(
                    <div key={index}>
                        <tr>
                            <th>{content.status}</th>
                            <th>{content.title}</th>
                            <th>{content.description}</th>
                            <th>{content.updated_at}</th>
                            <th>{content.created_at}</th>
                        </tr>
                    </div>
                ))}
            </div>
        </table>
    )
}
export default ContentDisplay;