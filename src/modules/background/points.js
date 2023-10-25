import Collection from 'ol/Collection.js';
import Point from 'ol/geom/Point.js';
import {Feature} from 'ol';
import {Style, Icon} from 'ol/style.js';

import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector';

import { getPointList, uploadSuggest } from '../database/firebase';
import { Pulser } from './dynamics';
import { styles } from './styles';


class LKIBPoints {
    collection = new Collection([])
    source = new VectorSource({features: this.collection})
    layer = new VectorLayer({source: this.source})

    databaseLocation = ""

    async load(){
        this.collection.clear()
        const pointList = await getPointList(this.databaseLocation)
        pointList.forEach(this.setPoint.bind(this))
    }
    
    setPoint(point){
        //Normally do something with each point here
        return
    }

    filter(candidate){
        if (candidate != this.layer){return false}
        else {return true}
    }

    atClick(clickEvent){
        const map = clickEvent.map
        const features = map.getFeaturesAtPixel(clickEvent.pixel, {layerFilter: this.filter.bind(this)})
        return features
    }

}

export class ImagePoints extends LKIBPoints {
    databaseLocation = "points"

    setPoint(point){
        const geometry = new Point([point.data.x, point.data.y], "xy")
        const feature = new Feature({geometry:geometry})
        
        const image = new Icon({
            src: "/assets/spot.png",
            scale: 0.2,
            rotation: Math.random() * 6
        })
        const style = new Style({image:image})

        feature.setId(point.id)
        feature.setStyle(style)

        feature.clickable = true

        this.collection.push(feature)
        if(settings.dynamics == "pulse"){new Pulser(feature)}
    }
}

export class Suggestions extends LKIBPoints{
    databaseLocation = "suggestions/suggestions/" + settings.suggestId

    setPoint(point){
        const geometry = new Point([point.data.x, point.data.y], "xy")
        const feature = new Feature({geometry:geometry})
        
        const text = point.data.why
        if ( text != "" && text != undefined ) { this.setClickable(feature) }
        else { feature.setStyle(styles[1]) }

        feature.setId(point.id)
        this.collection.push(feature)
    }

    setClickable(feature){
        feature.setStyle(styles[2])
        feature.clickable = true
    }

    add(coordinates){
        const geometry = new Point(coordinates, "xy")
        const feature = new Feature({geometry:geometry})

        feature.setStyle(styles[3])

        this.collection.push(feature)
    }

    remove(){
        this.collection.pop()
    }

    async confirm(){
        const feature = this.collection.item(this.collection.getLength() - 1)
        feature.setStyle(styles[1])

        const coords = feature.getGeometry().getCoordinates()
        const suggestId = await uploadSuggest(coords)
        feature.setId(suggestId)
        return suggestId
    }
}