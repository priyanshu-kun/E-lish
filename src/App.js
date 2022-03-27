import { useState, useEffect } from "react"
import axios from "axios"
import Preloader from "./preloader.gif"
import { v4 as uuidv4 } from "uuid"
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore/lite';
import logo from "./logo_64.png"
import './App.css';


function App({ fireBaseApp }) {

  const [toogleState, setToogleState] = useState(1)
  const [toogleForm, setToogleForm] = useState(false)
  const [firebaseData, setFirebaseData] = useState([]);
  const [isContentEdit, setIsContentEdit] = useState(false)
  const [editedContent, setEditedContent] = useState("")
  const [invalidGrammer, setInvalidGrammer] = useState([])
  const [formData, setFormData] = useState("");

  const db = getFirestore(fireBaseApp);


  async function fetchDataFromFirebase() {
    try {
      const dataCollection = collection(db, "sentences_words")
      const dataSnapshot = await getDocs(dataCollection);
      const data = dataSnapshot.docs.map(doc => {
        return {
          _id: doc.id,
          ...doc.data()
        }
      });
      console.log(data);
      setFirebaseData(data);
    }
    catch (e) {
      console.log(e.message)
    }
  }


  useEffect(() => {
    fetchDataFromFirebase();
  }, [])


  async function getSpellCheck(data) {
    try {
      let host = 'https://api.bing.microsoft.com/v7.0/spellcheck';
      let key = '322b7fd7815b470b86b8e32c19f8c0ef';
      let mkt = "en-US";
      let mode = "proof";
      let text = data;

      const res = await axios({
        method: 'post',
        url: host,
        params: {
          mkt,
          mode,
          text
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Ocp-Apim-Subscription-Key': key,
        }
      })
      console.log(res.data.flaggedTokens)
      return res.data.flaggedTokens
    }
    catch (e) {
      console.log(e)
    }
  }




  return (
    <div className="App">
      <nav className="navbar">
        <img src={logo} alt="logo" />
        <h3>E-lish</h3>
      </nav>
      <section className="main__content">
        <div className="main__content__tabs">
          <button onClick={() => {
            setToogleState(1)
          }} className={` ${toogleState === 1 && "active__btn"}`}>Sentences</button>
          <button onClick={() => {
            setToogleState(2)
          }} className={` ${toogleState === 2 && "active__btn"}`}>Learned</button>
        </div>
        <div className="sentence__content__section">
          {
            // I have to put a preloader here
            firebaseData.length === 0 ? (
              <img src={Preloader} alt="prelaoder" />
            ) : (

              firebaseData.map(({ data, hindiTranslation, isKnown, _id }) => (
                toogleState === 1 ? (
                  !isKnown && <div className="sentence__content">
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
                ) : (
                  isKnown && <div className="sentence__content">
                    <div className="sentence">
                      <input type="checkbox" checked disabled />
                      <div contentEditable="false">{data}</div>
                    </div>
                    <div className="defination">
                      <p>{hindiTranslation}</p>
                    </div>
                  </div>
                )
              ))
            )
          }
        </div>

      </section>
      <div className="actions__btns">
        <button className={`${toogleForm && "active__action__btn"}`} onClick={() => {
          setToogleForm(!toogleForm)
        }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>

      </div>
      <div className={`content__input ${toogleForm && "active_input"}`}>
        <textarea onChange={(e) => {
          setFormData(e.target.value);
        }} value={formData} type="text" placeholder="put your stuff here."></textarea>
        <ul className="suggetion">
          <div className="suggetion-heading">
            Suggetions -
          </div>
          {
            invalidGrammer.length !== 0 && invalidGrammer.map(grm => {
              return <li><span className="wrong__words">{grm.token} - </span> {
                grm.suggestions.map(({ suggestion }) => {
                  return <span>{suggestion}, </span>
                })
              }
              </li>
            })
          }
        </ul>
        <button type="button" onClick={async (e) => {
          // save the document here
          e.preventDefault();
          if (formData === "") {
            return alert("plase put something here!!!")
          }
          try {

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
                  const docRef = await addDoc(collection(db, "sentences_words"), {
                    data: formData,
                    isKnown: false,
                    hindiTranslation: response.data[0].translations[0].text,
                  });

                  setToogleForm(false);
                  setFormData("");
                  fetchDataFromFirebase();
                  setInvalidGrammer([])
                  window.location.reload(false);
                }
                else {
                  setInvalidGrammer(res)
                }
              })
            })
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        }} className="submitBtn">Submit</button>
      </div>
    </div >
  );
}

export default App;
