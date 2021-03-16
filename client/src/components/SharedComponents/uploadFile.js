import React from 'react'

const UploadFile = (props) => {

   return (
      <input type="file" accept="image/x-png,image/jpg,image/jpeg" name={`upload-file${props.number}`} id={`upload-file${props.number}`} onChange={props.handleFileUpload}></input>
   )
}

export default UploadFile;
