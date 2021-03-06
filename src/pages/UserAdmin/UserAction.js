import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { deleteUser } from './UserService';
import { COLORS } from '../../constants/colors';
import Notification from '../../components/Notification';
import ConfirmDialog from '../../components/ConfirmDialog';

const UserAction = props => {
    const { id, fetchUsers } = props;
    const [confirmDialog, setConfirmDialog] = useState({ 
        isOpen: false, 
        title: '', 
        content: '', 
    });
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: 'success' });
    let attr = {
        title: 'Delete User',
        content: 'Users will be permanently deleted and cannot be recovered.',
    };

    const handleDeleteUser = () => {
        deleteUser(id, setNotify);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        setTimeout(() => {
            fetchUsers();
        }, 3000);
    };

    return (
        <>
            <Tooltip title="Delete User" arrow>
                <IconButton
                    sx={{
                        "&:hover": { backgroundColor: COLORS.dangerShade },
                        zIndex: 1,
                    }}
                    onClick={() => {
                        setConfirmDialog({
                            isOpen: true,
                            content: attr.content,
                            onConfirm: () => { handleDeleteUser() }
                        });
                    }} 
                >
                    <DeleteOutlineRoundedIcon sx={{ color: COLORS.danger }} />
                </IconButton>
            </Tooltip>
            <ConfirmDialog 
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
                title={attr.title} 
            />
            <Notification notify={notify} setNotify={setNotify} />
        </>
    );
};

export default UserAction;