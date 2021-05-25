import React from 'react'

const ConfirmDialog = ({children, onClickYes = ()=>{}, onClickNo = ()=>{}}) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    return (
        <div>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          確認
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Let Google help apps determine location. This means sending anonymous location data to
              Google, even when no apps are running.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClickNo} color="primary">
              いいえ
            </Button>
            <Button onClick={onClickYes} color="primary" autoFocus>
              はい
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
}

export default ConfirmDialog
