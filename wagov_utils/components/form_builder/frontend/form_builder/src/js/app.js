/* eslint-disable no-alert */
import '@popperjs/core/dist/umd/popper.min.js';
import '../scss/app.scss';
import 'jquery-ui/dist/jquery-ui.js';
import 'jquery-toast-plugin/dist/jquery.toast.min.js';
import 'jquery-mask-plugin/dist/jquery.mask.js';
/* Your JS Code goes here */
import './form-builder.js';

/* Demo JS */
import './demo.js';
// import { fileIcons } from './images.js';

const storedForm = window.localStorage.getItem('storedForm');

$('#app').formBuilder({
  API_KEY: 'AXAKSDHASKJDHAKSJHDLAKSHDASDFHASDHFJKL',
  initialValue: {
    emailField: 'robe@extremoduro.com',
    people: [
      {
        selectBoxes: ['john.doe@test.com'],
        checkboxControl: true,
      },
    ],
    datePicker: ['2024-10-20T16:00:00.000Z', '2024-10-21T16:00:00.000Z'],
    table: [
      {
        textField1: 'sadf',
        inputNumber: 123,
        selectBoxes1: ['john.doe@test.com', 'jane.doe@test.com'],
        datePicker1: '2024-11-11T16:00:00.000Z',
      },
    ],
  },
});
$('#app').formBuilder('build');

$('#app').formBuilder('render', {
  formData: storedForm ? JSON.parse(storedForm) : [],
  //   onSubmit
  submitData: {
    url: 'https://formbuilder-api.com',
    method: 'POST',
    headers: {
      'X-Api-Key': '12345',
    },
    data: {},
  },
});
console.log($('#app').formBuilder('getJSON'));
