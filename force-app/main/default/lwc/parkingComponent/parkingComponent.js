import { LightningElement, track, api, wire } from 'lwc';
import getSensorsList from '@salesforce/apex/ParkingController.getSensorsList';
import readCSVFile from '@salesforce/apex/ParkingController.readCSVFile';
import deleteRecord from '@salesforce/apex/ParkingController.deleteRecord';


const COLUMNS = [
  {label: "Sensor Model", fieldName: "Sensor_Model__c"},
  {label: "Status", fieldName: "Status__c"},
  {label: "Base Station", fieldName: "Base_Station_Name"},
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

  @track page = 1;
  @track items = []; 
  @track startingRecord = 1;
  @track endingRecord = 0; 
  @track totalRecountCount = 0;
  @track totalPage = 1; 
  
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
      // let newData = data.map(row => {
      //   if (!!row.Base_Station__r) {
      //     return {...row, Base_Station_Name: row.Base_Station__r.Name};
      //   } else {
      //     return row;
      //   }
      // });
      // this.items = newData;

      // this.totalRecountCount = data.length;
      this.setData(data);

      // this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
      this.data = this.items.slice(0, this.pageSize); 
      this.endingRecord = this.pageSize;
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.data = [];
    }
  }

  updateData(data) {
    if (data) {
      let newData = data.map(row => {
        if (!!row.Base_Station__r) {
          return {...row, Base_Station_Name: row.Base_Station__r.Name};
        } else {
          return row;
        }
      });
      this.items = newData;

      this.totalRecountCount = data.length;
      this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
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

    this.startingRecord += 1;
  }    

  handleUploadFinished(event) {
    const uploadedFiles = event.detail.files;
    readCSVFile({contentDocumentId: uploadedFiles[0].documentId})
    .then(data => {
      let newData = data.map(row => {
        if (!!row.Base_Station__r) {
          return {...row, Base_Station_Name: row.Base_Station__r.Name};
        } else {
          return row;
        }
      });
      this.items = newData;

      this.totalRecountCount = data.length;
      this.page = 1;
      this.changePage(this.page);
    })
    .catch(err => {
      this.error = err;
    })
    
  }

  deleteRow(event) {
    let rowId = event.detail.row.Id;
    deleteRecord({recordId: rowId});
    // console.log(event.target.value)
 
  }
}