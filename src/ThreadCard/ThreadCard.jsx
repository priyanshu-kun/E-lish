import React from 'react'
import "./ThreadCard.css"

function ThreadCard({ doc, updateDoc,editedContent, setEditedContent,isContentEdit, setIsContentEdit,data, hindiTranslation,db, _id }) {
    return (
        <div className="sentence__content">
            <div className="sentence">
                <input type="checkbox" onChange={async function (e) {
                    if (e.target.checked) {
                        console.log(_id)
                        const ref = doc(db, "sentences_words", _id);

                        // Set the "capital" field of the city 'DC'
                        await updateDoc(ref, {
                            isKnown: true
                        });
                        console.log(ref)

                        window.location.reload(false);
                    }
                }} />
                <div onInput={(e) => {
                    setEditedContent(e.target.textContent)
                    setIsContentEdit(true);
                }} contentEditable="true">{data}</div>
            </div>
            {isContentEdit && <button className="updateBtn" onClick={async function (e) {
                const ref = doc(db, "sentences_words", _id);

                // Set the "capital" field of the city 'DC'
                await updateDoc(ref, {
                    data: editedContent
                });
                console.log(ref)
                setIsContentEdit(false);
                setEditedContent("")
                window.location.reload(false);
            }}>update</button>}
            <div className="defination">
                <p>{hindiTranslation}</p>
            </div>
        </div>
    )
}

export default ThreadCard