export interface Device{
    serial_number:string;
    monitor_id:number;
    name:string;
    location:string;
    status:string;
    last_active:string;
}
export interface DeviceState{
    isOn:boolean;
    currentContent:string | null;
}
export interface Content{
    title:string;
    device:Device;
    description:string;
    file:string;
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
    name:string;
    description:string;
    device:Device;
    status:string;
}
export interface ContentGroupMember{
    group:ContentGroup;
    content:Content;
    order:number;
}