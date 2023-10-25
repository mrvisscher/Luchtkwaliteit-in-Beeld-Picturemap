import {Circle, Fill, Stroke, Style} from 'ol/style.js';
import Icon from 'ol/style/Icon.js';

const fill = new Fill({
    color: 'rgba(255,255,255,0.4)',
});

const redStroke = new Stroke({
    color: 'red',
    width: 1.25,
});

const greenStroke = new Stroke({
    color: 'green',
    width: 1.25,
});

const blueStroke = new Stroke({
    color: '#3399CC',
    width: 1.25,
});

export const styles = [
    new Style({
        image: new Icon({
        src: "/assets/spot.png",
        scale: 0.2
        }),
        fill: fill,
        stroke: redStroke,
    }),
    new Style({
        image: new Circle({
        fill: fill,
        stroke: redStroke,
        radius: 7,
        })
    }),
    new Style({
        image: new Circle({
        fill: fill,
        stroke: greenStroke,
        radius: 7,
        })
    }),
    new Style({
        image: new Circle({
        fill: fill,
        stroke: blueStroke,
        radius: 7,
        })
    })
]