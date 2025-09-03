import { registerSW } from 'virtual:pwa-register';
import { init } from './js/game.ts';

init();
registerSW({ immediate: true });