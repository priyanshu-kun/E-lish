import React from 'react'
import { IconContext } from 'react-icons'
import { FaPhotoVideo } from "react-icons/fa";
import "./ActionBtns.css"

function ActionBtns({ toogleForm, setToogleForm, toogleVideoForm, setToogleVideoForm }) {
    return (
        <div className="actions__btns">
            <button className={`${toogleVideoForm && "active__action__btn"}`} onClick={() => {
                setToogleVideoForm(!toogleVideoForm)
            }} >
 <IconContext.Provider value={{ className: "actions__btn__icon__style" }}>
            <FaPhotoVideo />
          </IconContext.Provider>
            </button>
            <button className={`${toogleForm && "active__action__btn"}`} onClick={() => {
                setToogleForm(!toogleForm)
            }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>

        </div>
    )
}

export default ActionBtns