import { useState, useEffect } from "react"
import axios from "axios"
import { v4 as uuidv4 } from "uuid"
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore/lite';

import logo from "./logo_64.png"
import './App.css';

function App({ fireBaseApp }) {

  const [toogleState, setToogleState] = useState(1)
  const [toogleForm, setToogleForm] = useState(false)
  const [firebaseData, setFirebaseData] = useState([]);
  const [formData, setFormData] = useState("");

  const db = getFirestore(fireBaseApp);


  async function fetchDataFromFirebase() {
    try {
      const dataCollection = collection(db, "sentences_words")
      const dataSnapshot = await getDocs(dataCollection);
      const data = dataSnapshot.docs.map(doc => doc.data());
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
            firebaseData.map(({ data, hindiTranslation }) => (
              <div className="sentence__content">
                <div className="sentence">
                  <input type="checkbox" />
                  <div contentEditable="true">{data}</div>
                </div>
                <div className="defination">
                  <p>{hindiTranslation}</p>
                </div>
              </div>
            ))
          }
        </div>
      </section>
      <div className="actions__btns">
        <button className={`${toogleForm && "active__action__btn"}`} onClick={() => {
          setToogleForm(!toogleForm)
        }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
        <button><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mic"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg></button>
      </div>
      <div className={`content__input ${toogleForm && "active_input"}`}>
        <textarea onChange={(e) => {
          setFormData(e.target.value);
        }} value={formData} type="text" placeholder="put your stuff here."></textarea>
        <button type="button" onClick={async (e) => {
          // save the document here
          e.preventDefault();
          if (formData === "") {
            return alert("plase put something here!!!")
          }
          try {

            var key = process.env.REACT_APP_CLOUD_TRANSLATION;
            var endpoint = process.env.REACT_APP_URI;

            // Add your location, also known as region. The default is global.
            // This is required if using a Cognitive Services resource.
            var location = "centralindia";

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
            }).then( async function (response) {
              const docRef = await addDoc(collection(db, "sentences_words"), {
                data: formData,
                isKnown: false,
                hindiTranslation: response.data[0].translations[0].text
              });

              window.location.reload(false);
            })


          } catch (e) {
            console.error("Error adding document: ", e);
          }
          setToogleForm(false);
          setFormData("");
          fetchDataFromFirebase();
        }} className="submitBtn">Submit</button>
      </div>
    </div >
  );
}

export default App;
