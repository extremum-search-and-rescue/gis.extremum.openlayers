import { WaysLayer } from './ways';
import { YandexHybridLayer } from './yandex';

export const Hybrid = {
  id: 'gHyb',
  title: 'Hybrid Yandex+OSM',
  visible: false,
  layers: [
    WaysLayer,
    YandexHybridLayer
  ]
};