import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import React, { useState } from "react";

export const useMessage = () => {
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    // メッセージ表示汎用
    const openMessage = (message, severity) => {
        setMessage(message);
        setSeverity(severity);
    };

    // メッセージ表示エラー
    const openError = (message) => {
        openMessage(message, "error");
    };

    // メッセージ表示インフォ
    const openInfo = (message) => {
        openMessage(message, "success");
    };

    const handleClose = () => {
        setMessage("");
        setSeverity("success");
    };

    // メッセージコンポーネント
    const Message = () => (
        <Snackbar open={message !== ""} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
            <MuiAlert onClose={handleClose} severity={severity} elevation={6} variant="filled">
                {message}
            </MuiAlert>
        </Snackbar>
    );

    return { openMessage, openError, openInfo, Message };
};
