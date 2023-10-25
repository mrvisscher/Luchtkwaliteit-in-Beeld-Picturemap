/* 
DEPRECATED IN FAVOR OF points.js 
*/
import Collection from 'ol/Collection.js';
import Point from 'ol/geom/Point.js';
import {Feature} from 'ol';

import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector';



import { getPointList, uploadSuggest } from '../database/firebase';
import { styles } from './styles';

export class Suggestions{
    collection = new Collection([])
    source = new VectorSource({features: this.collection})
    layer = new VectorLayer({source: this.source})

    async load(){
        const pointList = await getPointList("suggestions/suggestions/" + settings.suggestId)
        pointList.forEach(this.setPoint.bind(this))
    }

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