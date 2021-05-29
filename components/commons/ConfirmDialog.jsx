import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import React, { memo, useMemo, useState } from "react";

export const useConfirm = () => {
    const [confirmMessage, setConfirmMessage] = useState("");

    // メッセージ表示汎用
    const openDialog = (message) => {
        setConfirmMessage(message);
    };

    const ConfirmDialog = memo(({ onClickNo = () => {}, onClickYes = () => {} }) => {
        const handleNo = () => {
            onClickNo();
            openDialog("");
        };
        const handleYes = () => {
            onClickYes();
            openDialog("");
        };

        return (
            <div>
                <Dialog
                    open={confirmMessage !== null && confirmMessage !== ""}
                    onClose={handleNo}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">確認</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">{confirmMessage}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleNo} color="secondary" variant="outlined">
                            いいえ
                        </Button>
                        <Button onClick={handleYes} color="primary" variant="outlined" autoFocus>
                            はい
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    });

    return { ConfirmDialog, openDialog };
};
