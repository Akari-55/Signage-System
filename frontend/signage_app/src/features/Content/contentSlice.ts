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
        console.log('Fetching content ');
        try{
            const response=await axios.get(`http://localhost:8000/signage_app/content?monitor_id=${monitor_id}`,{
                headers:{
                    "Content-Type":"application/json",
                    //"Cache-Control":"no-store",
                },
            });
            console.log("Data received:",response.data);
            return response.data;
        }catch(error){
            console.error("Error fetching content:",error);
            throw error;
        }
    }
);
export const fetchContentGroup=createAsyncThunk(
    'Content/fetchContentGroup',
    async(monitor_id:number)=>{
        const response =await axios.get(`http://localhost:8000/signage_app/contentgroup?monitor_id=${monitor_id}`,{
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
        const response =await axios.get(`http://localhost:8000/signage_app/contentgroupmember`,{
            headers:{
                "Content-Type":"application/json",
            },
        });
        return response.data;
    }
)
export const deleteContent_api =createAsyncThunk(
    'Content/deleteContent_api',
    async(contentId:number,{dispatch,rejectWithValue})=>{
        try{
            const response=await axios.delete(`http://localhost:8000/signage_app/content/${contentId}/`);
            if(response.status !== 200){
                console.error('API request failed with status code:',response.status);
                return rejectWithValue('API request failed');
            }
            return response.data;
        }catch(error:any){
            console.error('API request failed:',error);
            return rejectWithValue(error.response.data);
        }
    }
);
export const createContent_api=createAsyncThunk(
    'Content/createContent_api',
    async({formData}:{formData:FormData},thunkAPI)=>{
        try{
            const response=await axios.post('http://localhost:8000/signage_app/content/',formData,{
                headers:{
                    'Content-Type':'multipart/form-data',
                },
            });
            return response.data;
        }catch(error:any){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const editContent_api=createAsyncThunk(
    'Content/editContent_api',
    async(contentId:number,{rejectWithValue})=>{
        try{
            const response=await axios.get(`http://localhost:8000/signage_app/content/${contentId}/`);
            return response.data;
        }catch(error:any){
            return rejectWithValue(error.response.data);
        }
        }
);
// export const updateContent_api=createAsyncThunk(
//     'Content/updateContent_api',
//     async(content:Content,{dispatch,rejectWithValue})=>{
//         console.log("Sending PUT Request with data:",content);
//         try{
//             const response=await axios.put(`http://localhost:8000/signage_app/content/${content.id}/`,content);
//             dispatch(updateContent(content));
//             return response.data;
//         }catch(error:any){
//             return rejectWithValue(error.response.data);
//         }
//     }
// );
export const updateContent_api = createAsyncThunk(
    'Content/updateContent_api',
    async(content: Content, { dispatch, rejectWithValue }) => {
        console.log("Sending PUT Request with data:", content);

        // FormDataの作成
        const formData = new FormData();
        Object.keys(content).forEach(key => {
            formData.append(key, content[key]);
        });

        // ファイルがある場合のみ追加
        if (content.file) {
            console.log("okaa");
            formData.append('file', content.file);
        }

        try {
            // Content-Typeをmultipart/form-dataに設定してリクエストを送信
            const response = await axios.put(`http://localhost:8000/signage_app/content/${content.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            dispatch(updateContent(content));
            return response.data;
        } catch (error:any) {
            return rejectWithValue(error.response.data);
        }
    }
);

interface UploadFileParams{
    numericId:number;
    formData:FormData;
}
export const uploadContentFile_api=createAsyncThunk(
    'Content/uploadContentFile_api',
    async({numericId,formData}:UploadFileParams,{getState})=>{
        try{
            console.log(numericId);
            const response=await axios.post(`http://localhost:8000/signage_app/content/${numericId}/upload/`,formData,{
                headers:{
                    'Content-Type': 'multipart/form-data', 
                },
            });
            return response.data;
        } catch(error){
            throw error;
        }
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
            const index=state.contents.findIndex(content =>content.id === action.payload.id);
            if(index !== -1){
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
            const index=state.contentGroups.findIndex(group=>group.id === action.payload.id);
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
            const index = state.contentGroupMembers.findIndex(member=>member.id===action.payload.id);
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
export const SelectContentById=(state:RootState,contentId:number)=>{
    return state.content.contents.find(content=>content.id===contentId);
}




