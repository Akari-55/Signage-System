import {createSlice,createAsyncThunk,PayloadAction} from '@reduxjs/toolkit';
import {Content,ContentGroup,ContentGroupMember,Device} from '../types';
import {RootState} from "../../app/store";
import axios from "axios";
interface ContentState{
    contents:Content[];
    contentGroups:ContentGroup[];
    contentGroupMembers:ContentGroupMember[];
    loading:boolean;
    error:string | null;
}
const initialState: ContentState={
    contents:[],
    contentGroups:[],
    contentGroupMembers:[],
    loading:false,
    error:null,
};

export const fetchContent=createAsyncThunk(
    'Content/fetchContent',
    async(monitor_id:number)=>{
        const response=await axios.get('http://loacalhost:8000/signage_app/content?monitor_id=${monitor_id}',{
            headers:{
                "Content-Type":"application/json",
            },
        });
        return response.data;
    }
)
export const fetchContentGroup=createAsyncThunk(
    'Content/fetchContentGroup',
    async(monitor_id:number)=>{
        const response =await axios.get('http://loacalhost:8000/signage_app/contentgroup?monitor_id=${monitor_id}',{
            headers:{
                "Content-Type":"application/json",
            },
        });
        return response.data;
    }
)
export const fetchContentGroupMember=createAsyncThunk(
    'Content/fetchContentGroupMember',
    async()=>{
        const response =await axios.get('http://localhost:8000/signage_app/contentgroupmember',{
            headers:{
                "Content-Type":"application/json",
            },
        });
        return response.data;
    }
)
const contentSlice=createSlice({
    name:'content',
    initialState,
    reducers:{
        //同期アクションの定義
        //コンテンツの追加
        addContent:(state,action:PayloadAction<Content>)=>{
            state.contents.push(action.payload);
        },
        //コンテンツの更新
        updateContent:(state,action:PayloadAction<Content>)=>{
            const index=state.contents.findIndex(content =>content.id ==action.payload.id);
            if(index != -1){
                state.contents[index]=action.payload;
            }
        },
        //コンテンツの削除
        deleteContent:(state,action:PayloadAction<number>)=>{
            state.contents=state.contents.filter(content=>content.id !==action.payload);
        },
        //コンテンツグループの作成
        addContentGroup:(state,action:PayloadAction<ContentGroup>)=>{
            state.contentGroups.push(action.payload);
        },
        //コンテンツグループの更新
        updateContentGroup:(state,action:PayloadAction<ContentGroup>)=>{
            const index=state.contentGroups.findIndex(group=>group.id == action.payload.id);
            if(index !== -1){
                state.contentGroups[index]=action.payload;
            }
        },
        //コンテンツグループの削除
        deleteContentGroup:(state,action:PayloadAction<number>)=>{
            state.contentGroups=state.contentGroups.filter(group=>group.id !== action.payload);
            //関連するContentGroupMemberの削除
            state.contentGroupMembers=state.contentGroupMembers.filter(member=>member.group.id !== action.payload);
        },
        //コンテンツグループメンバーの作成
        addContentGroupMember:(state,action:PayloadAction<ContentGroupMember>)=>{
            state.contentGroupMembers.push(action.payload);
        },
        //コンテンツグループメンバーの更新
        updateContentGroupMember:(state,action:PayloadAction<ContentGroupMember>)=>{
            const index = state.contentGroupMembers.findIndex(member=>member.id==action.payload.id);
            if(index !== -1){
                state.contentGroupMembers[index]=action.payload;
            }
        },
        //コンテンツグループメンバの削除
        deleteContentGroupMember:(state,action:PayloadAction<number>)=>{
            state.contentGroupMembers=state.contentGroupMembers.filter(member =>member.id !== action.payload);
        },
    },
    extraReducers:(builder)=>{
        builder
            .addCase(fetchContent.pending,(state)=>{
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchContent.fulfilled,(state,action)=>{
                //コンテンツデータの取得に成功した場合の処理
                state.contents=action.payload;
                state.loading=false;
            })
            .addCase(fetchContent.rejected,(state,action)=>{
                //エラーが発生した場合の処理
                state.error=action.error.message ?? 'エラーが発生しました';
                state.loading=false;
            })
            .addCase(fetchContentGroup.pending,(state)=>{
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchContentGroup.fulfilled,(state,action)=>{
                //コンテンツグループデータの取得に成功した場合の処理
                state.contentGroups=action.payload;
                state.loading=false;
            })
            .addCase(fetchContentGroup.rejected,(state,action)=>{
                //エラーが発生した場合の処理
                state.error=action.error.message ?? 'エラーが発生しました'
                state.loading=false;
            })
            .addCase(fetchContentGroupMember.pending,(state)=>{
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchContentGroupMember.fulfilled,(state,action)=>{
                //コンテンツグループメンバーのデータの取得に成功した場合の処理
                state.contentGroupMembers=action.payload;
                state.loading=false;
            })
            .addCase(fetchContentGroupMember.rejected,(state,action)=>{
                //エラーが発生した場合の処理
                state.error=action.error.message ?? 'エラーが発生しました'
                state.loading=false;
            })
        
    },
})
export const{
    addContent,
    updateContent,
    deleteContent,
    addContentGroup,
    updateContentGroup,
    deleteContentGroup,
    addContentGroupMember,
    updateContentGroupMember,
    deleteContentGroupMember,
}=contentSlice.actions

export const SelectContent=(state:RootState)=>state.content.contents;
export const SelectContentGroup=(state:RootState)=>state.content.contentGroups;
export const SelectContentGroupMember=(state:RootState)=>state.content.contentGroupMembers;
export const SelectLoading=(state:RootState)=>state.content.loading;
export const SelectError=(state:RootState)=>state.content.error;

export default contentSlice.reducer;









