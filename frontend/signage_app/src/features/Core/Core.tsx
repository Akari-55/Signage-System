import React,{useState,useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {fetchDevice,setCurrentMonitorId,SelectCurrentMonitorId,SelectDevice} from '../Device/deviceSlice';
import {fetchContent, fetchContentGroup} from '../Content/contentSlice';
import ContentPage from '../Content/Content';
import ContentGroupDisplay from '../Content/ContentGroup';
import {RootState,AppDispatch} from '../../app/store';
import { Routes, Route, BrowserRouter,Link,useNavigate } from "react-router-dom";
import{Device} from '../types';
import styles from './Core.module.css';
import{Button,
        Menu,
        MenuItem,
        List,
        ListItemButton,
        ListItemIcon,
        ListItemText,
      } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Core:React.FC=()=>{
  const dispatch=useDispatch<AppDispatch>();
    const devices:Device[]=useSelector((state:RootState) =>state.device.devices);
    const [selectedMonitor,setSelectedMonitor]=useState<string | null>(null);
    const [anchorEl,setAnchorEl]=React.useState<HTMLElement | null>(null);
    const open =Boolean(anchorEl);
    const navigate=useNavigate();

    useEffect(()=>{
        dispatch(fetchDevice());
    },[dispatch]);
    useEffect(()=>{
        if(selectedMonitor){
            dispatch(setCurrentMonitorId(selectedMonitor));
            dispatch(fetchContent(Number(selectedMonitor)));
            dispatch(fetchContentGroup(Number(selectedMonitor)));
        }
    },[selectedMonitor,dispatch]);
    const handleClick=(event:React.MouseEvent<HTMLButtonElement>)=>{
      setAnchorEl(event.currentTarget as HTMLElement);
    }
    const handleClose=()=>{
      setAnchorEl(null);
    }
    const handleMenuItemClick=(deviceId:string)=>{
      setSelectedMonitor(deviceId);
      handleClose();
    }
    const handleNavigation=(path:string)=>{
      navigate(path);
    }
    return(
      <body>
      {/* <header className={styles.l_header}>
        <div className={styles.l_header_inner}>
          <div className={styles.l_header_setmonitor}>
            <Button aria-controls="monitor-menu" aria-haspopup="true" onClick={handleClick} className={styles.m_btn_monitor}>
              {selectedMonitor ? devices.find(device=>device.id === Number(selectedMonitor))?.name:"Select a monitor"}
            </Button>
            <Menu
              id="monitor-menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleClose}>
                {devices.map((device)=>(
                  <MenuItem
                    key={device.id}
                    selected={device.id === Number(selectedMonitor)}
                    onClick={()=>handleMenuItemClick(device.id.toString())}
                    >
                      {device.name}
                    </MenuItem>
                ))}

            </Menu>
          </div>
        </div>
      </header> */}
      <main style={{height:'100%'}}>
        <div className={styles.main_content}>
      <div className={styles.l_sidebar}> 
        <div className={styles.l_sidebar_inner}>
          <List>
            <ListItemButton onClick={()=>handleNavigation('/') } className={styles.l_sidebar_item}>
              <ListItemIcon>
                <HomeIcon/>
              </ListItemIcon>
              <ListItemText primary="ホーム"/>
            </ListItemButton>
            <ListItemButton onClick={()=>handleNavigation('/contents')} className={styles.l_sidebar_item}>
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText primary="コンテンツ管理"/>
            </ListItemButton>
            <ListItemButton onClick={()=>handleNavigation('/groups')} className={styles.l_sidebar_item}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="グループコンテンツ管理"/>
            </ListItemButton>
          </List>
          

        </div>

      </div>
      <div className={styles.l_main_conteiner}>
        <div className={styles.l_header}>
          <div className={styles.l_header_inner}>
            <div className={styles.l_header_setmonitor}>
              <div className={styles.m_btn_monitor_inner}>
              <Button aria-controls="monitor-menu" aria-haspopup="true" onClick={handleClick} className={styles.m_btn_monitor}>
                {selectedMonitor ? devices.find(device=>device.id === Number(selectedMonitor))?.name:"Select a monitor"}
              </Button>
              <ExpandMoreIcon className={styles.m_btn_monitor_icon}/>
              
              </div>
              <Menu
                id="monitor-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}>
                  {devices.map((device)=>(
                    <MenuItem
                      key={device.id}
                      selected={device.id === Number(selectedMonitor)}
                      onClick={()=>handleMenuItemClick(device.id.toString())}
                      >
                        {device.name}
                      </MenuItem>
                  ))}

              </Menu>
            </div>
          </div>
        </div>
        <Routes>
        <Route path="/" element={<ContentPage/>}/>
        <Route path="/contents" element={<ContentPage/>} />
        <Route path="/groups" element={<ContentGroupDisplay/>} />
      </Routes>
      </div>

      </div>
      </main>
      </body>
    );
}


export default Core