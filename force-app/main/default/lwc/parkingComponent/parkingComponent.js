import { LightningElement, track, api, wire } from 'lwc';
import readCSVFile from '@salesforce/apex/ParkingController.readCSVFile';

const COLUMNS = [
  {label: "Sensor Model", fieldName: "Sensor_Model__c"},
  {label: "Status", fieldName: "Status__c"},
  {label: "Base Station", fieldName: "Base_Station__c"},
  {
    type: 'action',
    typeAttributes: { rowActions: [{ label: 'Delete', name: 'delete' }] },
  },
];

export default class ParkingComponent extends LightningElement {
  @api recordId;
  @track data = [];
  @track error;
  @track columns = COLUMNS;

  get acceptedFormats() {
    return ['.csv'];
  }

  // @wire(readCSVFile, {recordId: '$recordId', fields: ['Sensor__c.Base_Station__c']})
  // sensors;

  // handleUploadFinished(event) {
  //   console.log(this.sensors);
  //   console.log(this.sensors.data);
  // }

  handleUploadFinished(event) {
    const uploadedFiles = event.detail.files;
    readCSVFile({contentDocumentId: uploadedFiles[0].documentId})
    .then(result => {
      // console.log(result);
      // let sensonrsList = [];
      // result.forEach((sens) => {
      //   console.log(sens);
      //   let sensorRecord = {};
      //   sensorRecord.SensorModel = sens.Sensor_Model__c;
      //   sensorRecord.Status = sens.Status__c;
      //   sensorRecord.BaseStationName = sens.Base_Station__c;
      //   sensonrsList.push(sensorRecord);
      // });
      // console.log(result);
      // this.data = result.map(row => {return {...row, Base_Station__r__Name: row.Base_Station__r.Name}});
      // this.data = result.map(row => {
      //   console.log(row);
      //   console.log(row.Base_Station__r.Name);
      //   return {...row, BaseStationName: row.Base_Station__r.Name}
      // });
      this.data = result;
      console.log(this.data);
    })
    .catch(err => {
      this.error = err;
    })
    
  }

  deleteRow(row) {
    const { id } = row;
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