/* eslint-disable no-alert */
import '@popperjs/core/dist/umd/popper.min.js';
import '../scss/app.scss';
import 'jquery-ui/dist/jquery-ui.js';
import 'jquery-mask-plugin/dist/jquery.mask.js';
/* Your JS Code goes here */
import './form-builder.js';

/* Demo JS */
import './demo.js';

$('#app').formBuilder({ name: 'Juanchi' });
