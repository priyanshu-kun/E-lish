import React, { useState } from 'react'
import "./TabBtns.css"

function TabBtns({toogleState, setToogleState}) {

    return (
        <div className="main__content__tabs">
            <button onClick={() => {
                setToogleState(1)
            }} className={` ${toogleState === 1 && "active__btn"}`}>Sentences</button>
            <button onClick={() => {
                setToogleState(2)
            }} className={` ${toogleState === 2 && "active__btn"}`}>Learned</button>
        </div>
    )
}

export default TabBtns