import { ImagePoints, Suggestions } from "./points";
import { changeCursor, mouseDynamics } from "./dynamics";

import {Map, View, Overlay} from 'ol';
import TileLayer from 'ol/layer/Tile';
import StadiaMaps from 'ol/source/StadiaMaps'

const stamenLayer = new TileLayer({
    className: 'stamen-map',
    source: new StadiaMaps({
        layer: 'stamen_toner_lite',
        retina: true,
      }),
})

export class LKIBMap{
    imagePoints = new ImagePoints()
    suggestions = new Suggestions()
    box = new Overlay({positioning: 'top-center', offset: [0,-75]})

    constructor(){
        const defaultView = new View({enableRotation: false})
        defaultView.setCenter([500166, 6828934])
        defaultView.setZoom(15)

        this.map = new Map({controls:[]})
        this.map.setTarget('map')
        this.map.setView(defaultView)

        this.map.addLayer(stamenLayer)
        this.map.addLayer(this.imagePoints.layer)
        this.map.addLayer(this.suggestions.layer)

        this.imagePoints.load()
        this.suggestions.load()

        this.box.setElement(document.getElementById("popup"))
        this.map.addOverlay(this.box)

        this.map.on("click", this.move.bind(this))
        //this.map.on("rendercomplete", this.log)

        const viewPort = this.map.getViewport()
        viewPort.addEventListener("mousemove", changeCursor.bind(null, this.map))
        if(settings.dynamics == "mouse"){
            viewPort.addEventListener("mousemove", mouseDynamics.bind(null, this));
        }
    }

    move(event){
        const view = this.map.getView()
        view.animate({center: event.coordinate})
    }

    log(event){
        console.log(Date.now())
        console.log(event)
    }
}