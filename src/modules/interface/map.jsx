import { useState, useEffect} from 'react';
import { LKIBMap } from '../background/lkibmap';
import { getSuggestData } from '../database/firebase';
import { Gallery } from "./gallery.jsx";
import { UploadForm } from "./upload.jsx";

export function Map({openUpload, openGallery}){
    const [handler, setHandler] = useState()
    const [mapStatus, setMapStatus] = useState("base")
    const [popUpStatus, setPopUpStatus] = useState("hidden")
    const [suggestData, setSuggestData] = useState("")
    const [click, setClick] = useState({execute:false})

    useEffect(initialize, []);
    useEffect(function(){if(click.execute){clickExecute()}})
    
    function initialize(){
        //Load map after element is initiated
        const map = new LKIBMap()
        map.map.on("click", clickCallback)
        setHandler(map)
        //setInterval(refreshSuggests, 60000)
    }
    
    function clickCallback(clickEvent){
        setClick({execute:true, event:clickEvent})
    }

    function contextMenuCallback(clickEvent){
        clickEvent.preventDefault()

        if (settings.uploads == false){return}

        setClick({event:clickEvent})
        setMapStatus("upload")
    }

    function clickExecute(){
        setClick({execute:false, event:click.event})

        if (popUpStatus == "information"){setPopUpStatus("hidden")}
        if (popUpStatus == "suggesting"){return}

        //If there is an imagepoint at the location, open the gallery
        const points = handler.imagePoints.atClick(click.event)
        if (points.length > 0) {return setMapStatus("gallery")}

        //Return here if suggestions are disabled
        if (settings.suggests == false){return}

        //Open Suggest info when there is a suggest at the click
        const suggests = handler.suggestions.atClick(click.event)
        if (suggests.length > 0) {return showSuggestInfo(suggests[0], click.event)}
        
        //If there is no suggest, let the user add one
        handler.suggestions.add(click.event.coordinate)
        handler.box.setPosition(click.event.coordinate)
        setPopUpStatus("suggesting")
    }

    async function showSuggestInfo(suggestion, event){
        const id = suggestion.getId()
        const data = await getSuggestData(id, "why")

        if(data == "" || data == undefined){return}

        setSuggestData(data)
        setPopUpStatus("information")

        handler.box.setPosition(event.coordinate)
    }

    function returnBase(){
        setMapStatus("base")
    }

    return(
        <> 
            <div id="map" onContextMenu={contextMenuCallback}></div>
            <div id="popup">
                {popUpStatus == "suggesting" && <AddSuggest setPopUpStatus={setPopUpStatus} mapHandler={handler}/>}
                {popUpStatus == "information" && <ShowInfo setPopUpStatus={setPopUpStatus} data={suggestData}/>}
            </div>
            {mapStatus == "gallery" && <Gallery galleryEvent={click.event} mapHandler={handler} returnBase={returnBase}/>}
            {mapStatus == "upload" && <UploadForm uploadEvent={click.event} mapHandler={handler} returnBase={returnBase}/>}
            
        </>
    )
}

function AddSuggest({setPopUpStatus, mapHandler}){
    const [suggestStatus, setSuggestStatus] = useState("initial")

    useEffect(closeCheck)

    function closeCheck(){
        if (suggestStatus != "done"){return}
        setPopUpStatus("hidden")
        setSuggestStatus("initial")
    }

    return(
        <div className='pop-up'>
            {suggestStatus == "initial" && <AddSuggestConfirm mapHandler={mapHandler} setSuggestStatus={setSuggestStatus}/>}
            {suggestStatus == "confirmed" && <AddSuggestScan mapHandler={mapHandler} setSuggestStatus={setSuggestStatus}/>}
            {suggestStatus == "scanned" && <AddSuggestThanks setSuggestStatus={setSuggestStatus}/>}
        </div>
    )
}

function AddSuggestConfirm({mapHandler, setSuggestStatus}){

    function yesSuggest(){
        setSuggestStatus("confirmed")
    }

    function noSuggest(){
        mapHandler.suggestions.remove()
        setSuggestStatus("done")        
    }

    return(
        <>
            <div className="float-textbox">Punt op de kaart zetten?</div>
            <div className="pop-up-spacer"></div>
            <div className="yn-wrapper">
                <div className="button" onClick={yesSuggest}>Ja</div>
                <div className="button" onClick={noSuggest}>Nee</div>
            </div>

        </>
    )
}

function AddSuggestScan({mapHandler, setSuggestStatus}){
    let [timer, setTimer] = useState(undefined)
    let [qrSource, setQrSource] = useState("")
    let [scanned, setScanned] = useState(false)

    useEffect(function(){setUp()},[])
    useEffect(function(){if(scanned){yesScanned()}})

    async function setUp(){
        const id = await mapHandler.suggestions.confirm()
        setTimer(setInterval(checkScan, 1000, id))
        setQrSource(getQrSource(id))
    }

    async function checkScan(id){
        console.log("checkscan")
        const scanned = await getSuggestData(id, "opened")
        if (scanned){setScanned(true)}     
    }

    function yesScanned(){
        clearInterval(timer)
        setSuggestStatus("scanned")
    }

    function noScanned(){
        clearInterval(timer)
        setSuggestStatus("done")
    }

    function getQrSource(id){
        const qrAPI = "https://api.qrserver.com/v1/create-qr-code/?size=160x160&format=svg&data="
        const thisURL = window.location.origin
        return(qrAPI + thisURL + "/suggest.html?id=" + id + "-" + settings.suggestId)
    }

    return(
        <>
            <div className="float-textbox">Vertel ons waarom daar!</div>
            <div className="pop-up-spacer"></div>
            <div className="float-box">
                <img width={175} height={175} src={qrSource}/>
            </div>
            <div className="button" onClick={noScanned}>Liever niet</div>
        </>
    )
}

function AddSuggestThanks({setSuggestStatus}){
    
    setTimeout(done, 3000)

    function done(){
        setSuggestStatus("done")
    }

    return(
        <>
            <div className="float-textbox">Dankjewel!</div>
            <div className="pop-up-spacer"></div>
            <div className="float-box">
                <img width={175} src={"https://clipart-library.com/image_gallery/126705.png"}/>
            </div>
        </>
    )
}

function ShowInfo({data, setPopUpStatus}){
    function hide(){
        setPopUpStatus("hidden")
    }

    return(
        <div className="pop-up" onClick={hide}>
            <div className="pop-up-spacer-90"></div>
            <div className="float-textbox">{data}</div>
        </div>
    )
}