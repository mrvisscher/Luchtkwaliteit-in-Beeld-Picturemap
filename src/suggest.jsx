import './style.css';
import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { updateSuggest } from './modules/database/firebase';

const root = createRoot(document.getElementById('app'));
root.render(<Interface/>)

let params = new URLSearchParams(location.search);
let data = params.get('id').split("-")
let id = data[0]

settings.suggestId = data[1]

updateSuggest(id, "opened", true)

function Interface(){
    const [status, setStatus] = useState("base")

    function submit(event){
        setStatus("submitted")
    }

    function submitMail(event){
        setStatus("mail-submitted")
    }

    if (status == "base"){
        
        return(
            <div className='wrapper mobile'>
                <h1>Luchtkwaliteit in Beeld</h1>
                <p>Een goede luchtkwaliteit is van levensbelang. Je hebt zojuist op de kaart een plek aangegeven waar jij de luchtkwaliteit graag in kaart zou brengen.</p>
                <OpenQuestion questionId={"why"}>Kun je ons vertellen waarom?</OpenQuestion>
                <div className='button' onClick={submit}>Versturen</div>
            </div>
        )

    }

    else if (status == "submitted"){
        return(
            <div className='wrapper mobile'>
                <h1>Luchtkwaliteit in Beeld</h1>
                <p>Gelukt! Je reden is binnenkort op de kaart te zien. Je kan dit venster nu sluiten.</p>
            </div>
        )
    }

    else {
        return(
            <div className='wrapper mobile'>
                <h1>Luchtkwaliteit in Beeld</h1>
                <p>Gelukt! Nog veel plezier tijdens Nacht van Ontdekkingen!</p>
            </div>

        )

    }

}

function OpenQuestion({children, questionId}){
    const [answer, setAnswer] = useState("")
    const [timer, setTimer] = useState(null)

    function handleChange(event){
        clearTimeout(timer)
        const value = event.target.value
        setAnswer(value)
        const updateTimer = setTimeout(updateFirebase, 1000, value)
        setTimer(updateTimer)         
    }

    function updateFirebase(value){
        updateSuggest(id, questionId, value) 
    }

    function handleEndInput(event){
        console.log("end input")
    }

    return(
        <div className='question'>
            <div>{children}</div>
            <textarea value={answer} onChange={handleChange}/>
        </div>
    )
}