import {ScreenWrapper} from './wrapper'
import { uploadImage } from '../database/firebase'

export function UploadForm({uploadEvent, mapHandler, returnBase}){
    async function publish(event){
        const map = mapHandler.map
        const coords = map.getEventCoordinate(uploadEvent)
        await uploadImage(coords)
        mapHandler.imagePoints.load()
        returnBase()
    }

    return(
        <ScreenWrapper returnBase={returnBase}>
            <div className="upload-form-card">
                Photographer name:
                <input className="text-input" id="upload-input-photographer" type="text" placeholder="Photographer"/>
                PM25 value of the picture:
                <input className="text-input" id="upload-input-pm25" type="text" placeholder="PM25"/>
                Description of the picture:
                <textarea className="text-input" id="upload-input-desc" type="text" placeholder="Description" ></textarea>
                When was the picture taken:
                <input type="date" id="upload-input-date"/>
                Choose picture:
                <input type="file" id="upload-input-file" accept=".png,.jpg,.jpeg"/>       
            </div>
            <div className="button" id = "upload-input-button" onClick = {publish}>Publish!</div>
        </ScreenWrapper>
    )
}