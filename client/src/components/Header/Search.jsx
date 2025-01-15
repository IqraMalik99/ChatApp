import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SearchIcon from '@mui/icons-material/Search';
import { Tooltip, Autocomplete } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { userId } from '../../store/reducer';
import { useNavigate } from 'react-router-dom';

export default function Search() {
    const [users, setUsers] = React.useState([]); // Corrected variable name to be plural
    const [open, setOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState(null);
 const dispatch = useDispatch();
 const id = useSelector((state)=> state.user.chatId);
 const navigate = useNavigate();
    React.useEffect(() => {
        const fetcher = async () => {
            try {
                const response = await axios.get('http://localhost:3000/chat/getFriends', { withCredentials: true });
                console.log('Response from server:', response.data.message ,"The use which are my friends");
                setUsers(response.data.message); // Corrected setUser to setUsers
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetcher();
    }, []); // Added empty dependency array to prevent infinite loop

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedUser) {
            console.log('Selected User:', selectedUser.username);
        } else {
            console.log('No user selected');
        }
        handleClose();
    };

    const handleUserSelect = (user) => {
        if (user) {
            let getter = async () => {
                let response = await axios.get(`http://localhost:3000/chat/friendchat/${user._id}`, { withCredentials: true });
                if(response.data.message.length<1){
                    console.log(response.data);
                    
                }else{
                console.log(response.data);
                dispatch(userId(response.data.message[0]._id));
                navigate(`/chats/${response.data.message[0]._id}`)
                }
            }
            getter();
        }
        handleClose();
    };

    return (
        <React.Fragment>
            <Tooltip title="Search">
                <span><SearchIcon sx={{ fontSize: 30 }} className='text-white' onClick={handleClickOpen} /></span>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit,
                    sx: { width: 400, height: 600 }, // Adjust height here
                }}
            >
                <DialogTitle>Search Friends</DialogTitle>
                <DialogContent sx={{ height: '100%' }}> {/* Set height of content to fill dialog */}
                    <Autocomplete
                        disablePortal
                        options={users}
                        getOptionLabel={(option) => option.username} // Display the username
                        onChange={(event, newValue) => {
                            setSelectedUser(newValue); // Update selected user
                            console.log("Hello");
                            
                            handleUserSelect(newValue); // Call the function when an option is selected
                        }}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Username" variant="standard" />}
                    />
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
    
}