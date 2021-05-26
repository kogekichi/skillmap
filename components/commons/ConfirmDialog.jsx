import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import React, { memo } from 'react'

const ConfirmDialog = memo(({children, open, onClickYes = ()=>{}, onClickNo = ()=>{}}) => {

    return (
        <div>
        <Dialog
          open={children !== null && children !== ""}
          onClose={onClickNo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">確認</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {children}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClickNo} color="secondary" variant="outlined">
              いいえ
            </Button>
            <Button onClick={onClickYes} color="primary" variant="outlined" autoFocus>
              はい
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
});

export default ConfirmDialog
