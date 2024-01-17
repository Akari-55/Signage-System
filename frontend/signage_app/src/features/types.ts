export interface Device{
    id:number;
    serial_number:string;
    monitor_id:string | null;
    name:string;
    location:string;
    status:string;
    last_active:string;
}
export interface Content{
    [key:string]:any;
    id:number;
    title:string;
    device:Device;
    description:string;
    file:File|null;
    status:string;
    content_type:string;
    created_at:string;
    updated_at:string;
}
export interface Schedule{
    content_type:any;
    object_id:number;
    content_object:any;
    start_time:string;
    end_time:string;
    priority:number;
}
export interface ContentGroup{
    id:number;
    name:string;
    description:string;
    device:Device;
    status:string;
}
export interface ContentGroupMember{
    id:number;
    group:number;
    content:number;
    order:number;
}