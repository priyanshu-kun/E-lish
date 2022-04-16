import React,{useState} from 'react'
import axios from "axios"
import { v4 as uuidv4 } from "uuid"
import loader from "../assets/loader.gif"
import "./Form.css"
import SendMessage from '../twilio'

function Form({addTaskLoading, setAddTaskLoading, addDoc, collection, formData, invalidGrammer, getSpellCheck, db, setToogleForm, setFormData,  setInvalidGrammer }) {
    const [numberInput, setNumberInput] = useState("")
    return (
        <>
            <h1 className='form__heading'>Enter your sentence below</h1>
            <textarea onChange={(e) => {
                setFormData(e.target.value);
            }} value={formData} type="text" placeholder="Here..."></textarea>
            <input style={{marginTop: "10px"}} value={numberInput} onChange={(e) => setNumberInput(e.target.value)} className="url__input" type="url" placeholder="Ph.no - eg. 09034995549" />

            <button type="button" onClick={async (e) => {
                // save the document here
                e.preventDefault();
                if (formData === "" && numberInput.length === 0) {
                    return alert("plase put something here!!!")
                }
                try {

                    setAddTaskLoading(true);

                    let key = process.env.REACT_APP_CLOUD_TRANSLATION;
                    let endpoint = process.env.REACT_APP_URI;

                    let location = "centralindia";

                    axios({
                        baseURL: endpoint,
                        url: '/translate',
                        method: 'post',
                        headers: {
                            'Ocp-Apim-Subscription-Key': key,
                            'Ocp-Apim-Subscription-Region': location,
                            'Content-type': 'application/json',
                            'X-ClientTraceId': uuidv4().toString()
                        },
                        params: {
                            'api-version': '3.0',
                            'from': 'en',
                            'to': ['hi']
                        },
                        data: [{
                            'text': formData
                        }],
                        responseType: 'json'
                    }).then(async function (response) {

                        getSpellCheck(formData).then(async (res) => {
                            if (res?.length === 0) {
                                const collReff = collection(db, "sentences_words");
                                addDoc(collReff, {
                                    data: formData,
                                    isKnown: false,
                                    hindiTranslation: response.data[0].translations[0].text,
                                }).then(() => {
                                    SendMessage(`Your Friend Learn this new english sentence: ${formData} Hindi: ${response.data[0].translations[0].text}`,numberInput)
                                    setToogleForm(false);
                                    setFormData("");
                                    setInvalidGrammer([])
                                    setAddTaskLoading(false)
                                })
                            }
                            else {
                                setInvalidGrammer(res)
                            }
                        })
                    })
                } catch (e) {
                    console.error("Error in adding document: ", e);
                }
            }} className="submitBtn">{addTaskLoading ? <img style={{width: "50px", height: "auto"}} src={loader} alt="kaboom" /> : "Submit"}</button>
            <ul className="suggetion">
                <div className="suggetion-heading">
                    Suggetions -
                </div>
                {
                    invalidGrammer.length !== 0 && invalidGrammer.map(grm => {
                        return <li><span className="wrong__words">{grm.token} - </span> {
                            grm.suggestions.map(({ suggestion }) => {
                                return <span className='suggested-words'>{suggestion}, </span>
                            })
                        }
                        </li>
                    })
                }
            </ul>
        </>
    )
}

export default Form