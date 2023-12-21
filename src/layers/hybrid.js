import { WaysLayer } from './ways'
export { WaysLayer }
import { YandexHybridLayer } from './yandex'
export { YandexHybridLayer }

export const Hybrid = {
    id: 'gHyb',
    title: 'Hybrid Yandex+OSM',
    visible: false,
    layers: [
        WaysLayer,
        YandexHybridLayer
    ]
}