import { LightningElement, track, api } from 'lwc';
import readCSVFile from '@salesforce/apex/ParkingController.readCSVFile';

const COLUMNS = [
  {label: "Sensor Model", fieldName: "SensorModel"},
  {label: "Status", fieldName: "Status"},
  {label: "Base Station", fieldName: "BaseStation"},
  {
    type: 'action',
    typeAttributes: { rowActions: 'delete' },
  },
];

export default class ParkingComponent extends LightningElement {
  @api recordId;
  @track data;
  @track error;
  @track columns = COLUMNS;

  get acceptedFormats() {
    return ['.csv'];
  }

  handleUploadFinished(event) {
    const uploadedFiles = event.detail.files;
    readCSVFile({contentDocumentId: uploadedFiles[0].documentId})
    .then(result => {
      console.log(result);
      console.log(this.data);
      this.data = result;
      console.log(this.data);
    })
    .catch(err => {
      this.error = err;
    })
    
  }

  deleteRow(event) {
    const id = event.detail.row;
    const index = this.findRowIndexById(id);
    if (index !== -1) {
      this.data = this.data
        .slice(0, index)
        .concat(this.data.slice(index + 1));
    }
  }

  findRowIndexById(id) {
    let ret = -1;
    this.data.some((row, index) => {
      if (row.id === id) {
        ret = index;
        return true;
      }
      return false;
    });
    return ret;
  }
}