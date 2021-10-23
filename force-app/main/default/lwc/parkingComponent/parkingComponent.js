import { LightningElement, track, api, wire } from 'lwc';
import getSensorsList from '@salesforce/apex/ParkingController.getSensorsList';
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

// const ComboboxOptions = [
//   { label: '10', value: '10' },
//   { label: '25', value: '25' },
//   { label: '50', value: '50' },
//   { label: '100', value: '100' },
//   { label: '200', value: '200' },
// ];

export default class ParkingComponent extends LightningElement {
  @api recordId;
  @track data = [];
  @track dataPerPage = [];
  @track error;
  @track columns = COLUMNS;
  @track isSpinner = false;
  
  get acceptedFormats() {
    return ['.csv'];
  }

  connectedCallback() {
    this.isSpinner = true;
  }

  @wire(getSensorsList) fetchSensorsList(result) {
    this.isSpinner = false;
    if (result.data) {
      let obj=JSON.parse(JSON.stringify(result));
      console.log(obj);
      console.log(result.data);
      console.log(result);


      this.data = result.data;
      this.error = undefined;
      this.showData(result.data)
    } else if (result.error) {
      this.error = result.error;
      this.data = [];
    }
  }

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
      // console.log(this.data);
    })
    .catch(err => {
      this.error = err;
    })
    
  }

  deleteRow(event) {
    const { id } = event.detail.row;
    const index = this.findRowIndexById(id);
    if (index !== -1) {
      this.data = this.data
        .slice(0, index)
        .concat(this.data.slice(index + 1));
    }
  }

  findRowIndexById(id) {
    let ret = -1;
    console.log(id)
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