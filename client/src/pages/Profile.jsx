import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';
import { updateUserStart,updateUserSuccess,updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOut } from '../redux/user/userSlice';


const Profile = () => {
  const {currentUser,loading,error}=useSelector(state=>state.user);
  const fileRef=useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch=useDispatch();

  useEffect(()=>{
    if(image){
      handleFileUpload(image);
    }
  },[image]);

  const handleFileUpload= async (image)=>{
    const storage=getStorage(app);
    const fileName=new Date().getTime() +image.name;
    const storageRef=ref(storage,fileName);
    const uploadTask=uploadBytesResumable(storageRef,image);
    uploadTask.on(
      'state_changed',
      (spanshot)=>{
        const progress=(spanshot.bytesTransferred/spanshot.totalBytes)*100;
        setImagePercent(Math.round(progress));
        console.log(imagePercent);
      },
      (error)=>{
        setImageError(true)
        console.log(error + ' ' + imageError)
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadUrl)=>setFormData({...formData,profilePicture:downloadUrl})
        )
      }
    );
  };

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  };

  const handleSubmit=async (e)=>{
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      const res=await fetch(`api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      });
      const data= await res.json(); 
      if(data.success=false){
        dispatch(updateUserFailure(data));
        return
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    }catch(error){
      console.log(error);
      dispatch(updateUserFailure(error));
    }
  };

  const handleDelete=async ()=>{
    try{
      dispatch(deleteUserStart())
      const res=await fetch(`api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });
      const data= await res.json(); 
      if(data.success==false){
        dispatch(deleteUserFailure(data));
        return
      }
      dispatch(deleteUserSuccess(data))
    }catch(error){
      console.log(error)
      dispatch(deleteUserFailure(error))
    }
  }

  const handleSignOut=async ()=>{
    try{
      await fetch('api/auth/signout');
      dispatch(signOut())
    }catch(error){
      console.log(error);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 mt-2'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
          ref={fileRef} 
          hidden 
          type='file' 
          accept='image/*'
          onChange={(e)=>setImage(e.target.files[0])}
        />
        <img 
          src={formData.profilePicture || currentUser.profilePicture} 
          alt='profile-picture' 
          className='w-24 h-24 rounded-full object-cover self-center cursor-pointer'
          onClick={()=>fileRef.current.click()}
        />
        <p className='font-semibold text-sm self-center'>
          {
            imageError? (
              <span className='text-red-700'>Error uploading image (file size must be less than 2 MB)</span>
            )
            : imagePercent>0 && imagePercent<100 ?(
              <span className='text-slate-700'>{`Uploading:${imagePercent}%`}</span>
            ) : imagePercent===100 ?(
              <span className='text-green-700'>Image uploaded successfully</span>
            ) : (
              <span className='text-slate-700'> Click on the image to change</span>
            )
          }
        </p>
        <input 
          defaultValue={currentUser.username} 
          type='text' id='username' placeholder='Username' 
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange} 
        />

        <input 
          defaultValue={currentUser.email} 
          type='email' id='email' placeholder='Email' 
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />

        <input 
          type='password' 
          id='password' 
          placeholder='Password' 
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />

        <button 
          className='bg-slate-700 rounded-lg text-white p-3 uppercase disabled:opacity-80 hover:opacity-95'>
            {loading?'Loading...':'Update'}
          </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDelete} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error && 'something went wrong!'}</p>
      <p className='text-green-700 mt-5'>{updateSuccess && 'User updated successfully'}</p>
    </div>
  )
}

export default Profile