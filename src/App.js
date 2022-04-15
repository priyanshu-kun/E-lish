import { useState, useEffect } from "react"
import axios from "axios"
import Preloader from "./preloader.gif"
import { onSnapshot, getFirestore, collection, getDoc, addDoc, doc, updateDoc } from "firebase/firestore"
import './App.css';
import Navbar from "./Navbar/Navbar";
import TabBtns from "./TabBtns/TabBtns";
import ThreadCard from "./ThreadCard/ThreadCard";
import ActionBtns from "./ActionBtns/ActionBtns";
import Form from "./Form/Form";


function App({ fireBaseApp }) {


  const [toogleState, setToogleState] = useState(1)
  const [toogleForm, setToogleForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [addTaskLoading, setAddTaskLoading] = useState(false);
  const [toogleVideoForm, setToogleVideoForm] = useState(false)
  const [firebaseData, setFirebaseData] = useState([]);
  const [isContentEdit, setIsContentEdit] = useState(false)
  const [editedContent, setEditedContent] = useState("")
  const [invalidGrammer, setInvalidGrammer] = useState([])
  const [urlInput, setUrlInput] = useState("")
  const [formData, setFormData] = useState("");

  const db = getFirestore(fireBaseApp);


  async function fetchDataFromFirebase() {
    try {
      setLoading(true);
      const unsub = onSnapshot(collection(db, "sentences_words"), (snapshot) => {
        setLoading(false);
        let data = snapshot.docs.map(doc => {
          return { _id: doc.id, ...doc.data() }
        });
        setFirebaseData(data);
      });
      return unsub
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



  async function doTranscribe() {
    try {
      if (urlInput === "") {
        alert("Input field cannot be empty")
        return;
      }
      const accessTokenRes = await axios({
        url: "/oauth2/token:generate",
        method: "post",
        baseURL: "https://api.symbl.ai",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json"
        },
        data: {
          "type": "application",
          "appId": `${process.env.REACT_APP_SYMBOL_APP_ID}`,
          "appSecret": `${process.env.REACT_APP_SYMBOL_APP_SECRET}`
        }
      })

      const conversationIdRes = await axios({
        url: '/process/audio/url',
        method: 'post', // default
        baseURL: 'https://api.symbl.ai/v1',
        headers: {
          'Authorization': `Bearer ${accessTokenRes.data.accessToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          "url": urlInput,
          "name": "E-lish",
          "confidenceThreshold": 0.6,
          "webhookUrl": "http://localhost:9000/api"
        },
      })



      console.log(accessTokenRes.data.accessToken)
      console.log(conversationIdRes.data.conversationId);

    }
    catch (e) {
      console.log(e.message)
    }
  }




  return (
    <div className="App">
      <Navbar />
      <section className="main__content">
        <TabBtns toogleState={toogleState} setToogleState={setToogleState} />
        <div className="sentence__content__section">
          {
            loading ? (
              <img src={Preloader} alt="prelaoder" />
            ) : (

              firebaseData.length === 0 ? (
                <h1>There is nothing to show...</h1>
              ) : (
                firebaseData.map(({ data, hindiTranslation, isKnown, _id }) => (
                  toogleState === 1 ? (
                    !isKnown && <ThreadCard editedContent={editedContent} setEditedContent={setEditedContent} isContentEdit={isContentEdit} setIsContentEdit={setIsContentEdit} doc={doc} updateDoc={updateDoc} data={data} hindiTranslation={hindiTranslation} db={db} _id={_id} />
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
            )
          }
        </div>
      </section>
      <ActionBtns toogleVideoForm={toogleVideoForm} setToogleVideoForm={setToogleVideoForm} toogleForm={toogleForm} setToogleForm={setToogleForm} />
      <div className={`content__input ${toogleForm && "active_input"}`}>
        <Form addTaskLoading={addTaskLoading} setAddTaskLoading={setAddTaskLoading} addDoc={addDoc} collection={collection} formData={formData} invalidGrammer={invalidGrammer} getSpellCheck={getSpellCheck} db={db} setToogleForm={setToogleForm} setFormData={setFormData} fetchDataFromFirebase={fetchDataFromFirebase} setInvalidGrammer={setInvalidGrammer} />
      </div>
      <div className={`content__input ${toogleVideoForm && "active_input"}`}>

        <div className="video__url__note"><span style={{ color: "#fff", marginRight: "10px" }}>Note</span>If you put a video url below then you could transcribe the whole video into your preferable language, And link must be mp4 format.</div>

        <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} className="url__input" type="url" placeholder="eg. https://some-video-url.mp4" />
          <button onClick={doTranscribe} className="transcribe">Transcribe</button>
        </div>
      </div>
    </div >
  );
}

export default App;
