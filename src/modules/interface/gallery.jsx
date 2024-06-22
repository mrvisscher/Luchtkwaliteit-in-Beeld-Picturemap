import { useState, useEffect} from 'react';
import {ScreenWrapper} from './wrapper'
import { getImageData, removeImage } from '../database/firebase';

export function Gallery({galleryEvent, mapHandler, returnBase}){
    document.body.style.cursor = "progress"
    
    const map = galleryEvent.map
    const pixel = galleryEvent.pixel
    const features = map.getFeaturesAtPixel(pixel);

    const imageContainers = []
    for (const feature of features){
        const id = feature.getId()
        console.log(id)
        imageContainers.push(
            <ImageContainer key = {id} imageId = {id} mapHandler={mapHandler} returnBase={returnBase}/>
        )
    }
    return (
    <ScreenWrapper returnBase={returnBase}>
        {imageContainers}
    </ScreenWrapper>
    )
}

function ImageContainer({imageId, mapHandler, returnBase}){
    //TODO: change in favor of object, or handle with HTML form API
    const [url, setUrl] = useState("")
    const [description, setDescription] = useState("")
    const [photographer, setPhotographer] = useState("")
    const [pm25, setPm25] = useState("")
    const [date, setDate] = useState("")
    const [owned, setOwned] = useState(false)

    useEffect(() => {
        setImage()
        document.body.style.cursor = "auto"
    }, []);

    async function setImage(){
        const imageData =  await getImageData(imageId)
        setUrl(imageData.url)
        setDescription(imageData.description)
        setPhotographer(imageData.photographer)
        setPm25(imageData.pm25)
        setDate(imageData.date)

        const userId = localStorage.getItem("userId")
        if (userId == imageData.userID){setOwned(true)}
        if (userId == "marin"){setOwned(true)}
    }
    
    async function deleteImage(event){
        await removeImage(imageId)
        mapHandler.imagePoints.load()
        returnBase()
    }

    return(
        <div className="image-card">
            <img src={url}/>
            {description != "" && <div className="float-textbox">{description}</div>}
            <div className="meta-wrapper">
                {photographer != "" && <div className="float-textbox">Door: {photographer}</div>}
                {pm25 != "" && <div className="float-textbox small-fit">PM25: {pm25}</div>}
                {date != "" && <div className="float-textbox small-fit">{date}</div>}
            </div>
        </div>
    )
}