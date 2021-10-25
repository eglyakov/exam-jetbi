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

const ComboboxOptions = [
  { label: '10', value: '10' },
  { label: '25', value: '25' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
  { label: '200', value: '200' },
];

export default class ParkingComponent extends LightningElement {
  @api recordId;
  @track data = [];
  @track dataPerPage = [];
  @track error;
  @track columns = COLUMNS;
  @track isSpinner = false;
  @track comboboxOptions = ComboboxOptions;

  @track page = 1; //this will initialize 1st page
  @track items = []; //it contains all the records.
  @track startingRecord = 1; //start record position per page
  @track endingRecord = 0; //end record position per page
  // @track pageSize = 10; //default value we are assigning
  @track totalRecountCount = 0; //total record count received from all retrieved records
  @track totalPage = 0; //total number of page is needed to display all records
  
  get acceptedFormats() {
    return ['.csv'];
  }

  connectedCallback() {
    this.isSpinner = true;
    this.pageSize = '25';
  }

  @wire(getSensorsList) wiredSensors({data, error}) {
    this.isSpinner = false;
    if (data) {
      this.items = data;
      this.totalRecountCount = data.length;
      this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
      this.data = this.items.slice(0, this.pageSize); 
      this.endingRecord = this.pageSize;
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.data = [];
    }
  }

  comboboxChangeHandler(event) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.changePage(this.page);
  }

  previousHandler() {
    if (this.page > 1) {
      this.page -= 1;
      this.changePage(this.page);
    }
  }

  nextHandler() {
    if (this.page < this.totalPage) {
      this.page += 1; 
      this.changePage(this.page);            
    }             
  }

  firstHandler() {
    if (this.page > 1) {
      this.page = 1; 
      this.changePage(this.page);            
    }   
  }

  lastHandler() {
    if (this.page < this.totalPage) {
      this.page = this.totalPage; 
      this.changePage(this.page);            
    }   
  }

  changePage(page){
    this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);

    this.startingRecord = (page - 1) * this.pageSize ;
    this.endingRecord = this.pageSize * page;
    this.endingRecord = (this.endingRecord > this.totalRecountCount) ? this.totalRecountCount : this.endingRecord; 

    this.data = this.items.slice(this.startingRecord, this.endingRecord);

    this.startingRecord = this.startingRecord + 1;
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