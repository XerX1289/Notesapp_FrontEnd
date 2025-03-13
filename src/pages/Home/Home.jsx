import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../Cards/NoteCard'
import Toast from '../../components/ToastMessage/Toast';
import { MdAdd } from "react-icons/md";
import AddEditNotes from './AddEditNotes';
import { useState,useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import AddNotesImg from '../../asset/images/notepad.svg'
import NoDataImg from '../../asset/images/No_data_table.svg'

const Home = () => {
 const [allNotes, setAllNotes] = useState([])
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type : "add",
    data : null,
  })
 
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message : "",
    type : "add",
  })

  const [userInfo, setUserInfo] = useState("")
  const [isSearch, setIsSearch] = useState("")
 const navigate = useNavigate()

const handleEdit=(noteDetails)=>{
  setOpenAddEditModal({isShown: true, data: noteDetails, type: "edit"})
}

const showToastMessage=(message, type)=>{
  setShowToastMsg({isShown: true, message , type,})
}


const handleCloseToast=()=>{
  setShowToastMsg({isShown: false , message: "",})
}

 // get user info
 const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get('/get-user')
   if(response.data && response.data.user){
     setUserInfo(response.data.user)
   }
  } catch (error) {
    console.error("Error fetching user info:", error); // Log the error for debugging
    if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
    }
    if(error.response.status === 401){
      localStorage.clear();
      navigate('/login')
    }
  }
 }

//Get all notes
const getAllNotes = async () => {
  try {
    const response = await axiosInstance.get('/get-all-notes');
    if (response.data && response.data.notes) {
      setAllNotes(response.data.notes);
    }
  } catch (error) {
    console.log("An unexpected error occurred. Please try again.");
    showToastMessage("Failed to fetch notes. Please try again.", "delete");
  }
};
//Delete Note
const deleteNote = async (data) => {
  const noteId=data._id
  try {
    const response = await axiosInstance.delete("/delete-note/" + noteId)
    if(response.data && !response.data.error){
    showToastMessage("Note Deleted successfully",'delete');
      getAllNotes()
    }
    
} catch (error) {
    if(
     error.response && error.response.data && error.response.data.message
    ){
      console.log("An unexpected error occurred. Please try again.");
    }
}
}
//search for a note
const onSearchNote = async (query) => {
 try {
  const response = await axiosInstance.get("/search-notes",{
    params:{query},
  })
  if(response.data && response.data.notes){
    setIsSearch(true)
    setAllNotes(response.data.notes)
  }
  
 } catch (error) {
  console.log(error)
 }
}
//update pinned

const updateIsPinnedNote = async (noteData) => {
  const noteId = noteData._id
  try { 
    const response = await axiosInstance.put("/update-note-pinned/" + noteId,{
       isPinned : !noteData.isPinned
    })
    if(response.data && response.data.note){
    showToastMessage("Note updated successfully")
      getAllNotes()
    }
    
} catch (error) {
   console.log(error)
     }
}

const handleClearSearch = ()=>{
  setIsSearch(true)
  getAllNotes()
}

useEffect(() => {
  getAllNotes()
  getUserInfo()
  return () => {}
}, [])





  return (
    <><Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />
    <div className='container mx-auto'>
     { allNotes.length > 0 ? (<div className='grid grid-cols-3 gap-4 mt-8 '>
        {allNotes.map((item, index)=>{
          return ( 
        <NoteCard
         key={item._id}
         title={item.title}
         date={item.createdOn}
         content={item.content}
         tags={item.tags}
         isPinned={item.isPinned}
         onEdit={()=>handleEdit(item)}
         onDelete={()=>{deleteNote(item)}}
         onPinNote={()=>{updateIsPinnedNote(item)}}
        />
        )
        })}
      </div>
      ) : ( <EmptyCard
      imgSrc={isSearch ? NoDataImg : AddNotesImg} 
      message={isSearch ? `Oops! No notes found matching your search`:`Start creating your first note! Click the 'Add' button to get down your thoughts, ideas, and reminders. Lets get start`}
      />
    )}
      </div>
      <button className='w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-bule-800 absolute right-10 bottom-10 cursor-pointer'
       onClick={()=>{
        setOpenAddEditModal({ isShown: true, type:"add", data:null})
       }}
       >
      <MdAdd className='text-[32px] text-white'/>
      </button>

      <Modal
  isOpen={openAddEditModal.isShown}
  onRequestClose={() => {
    setOpenAddEditModal({ isShown: false, type: "add", data: null });
  }}
  style={{
    overlay: {
      backgroundColor: "rgba(0,0,0,0.2)",
    },
  }}
  contentLabel=''
  className='w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 md:overflow-y-scroll'
>
  <AddEditNotes
    type={openAddEditModal.type}
    noteData={openAddEditModal.data}
    onClose={() => {
      setOpenAddEditModal({ isShown: false, type: "add", data: null });
    }}
    getAllNotes={getAllNotes}
    showToastMessage={showToastMessage}
  />
</Modal>

       <Toast
       isShown={showToastMsg.isShown}
       message={showToastMsg.message}
       type={showToastMsg.type}
       onClose={handleCloseToast}
       />

    </>
  )
}

export default Home