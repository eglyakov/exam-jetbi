import { LightningElement, track, api } from 'lwc';
import readCSVFile from '@salesforce/apex/ParkingController.readCSVFile';

const COLUMNS = [
  {label: "Sensor model", fieldName: "SensorModel"},
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
  // record = {};

  get acceptedFormats() {
    return ['.csv'];
  }

  handleUploadFinished(event) {
    const uploadedFiles = event.detail.files;
    console.log(uploadedFiles[0].documentId)
    readCSVFile({contentDocumentId: uploadedFiles[0].documentId})
    .then(result => {
      console.log('result ===> '+result);
      this.data = result;
      console.log('this.data ===> '+this.data);
      console.log('data ===> '+data);
    })
    .catch(err => {
      this.error = err;
      console.log('err ===> '+err);
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

// const actions = [
//     { label: 'Show details', name: 'show_details' },
//     { label: 'Delete', name: 'delete' },
// ];


// export default class DatatableWithRowActions extends LightningElement {
    

//     // eslint-disable-next-line @lwc/lwc/no-async-await
//     // async connectedCallback() {
//     //    this.data = await fetchDataHelper({ amountOfRecords: 100 });
//     // }

//     handleRowAction(event) {
//         const actionName = event.detail.action.name;
//         const row = event.detail.row;
//         switch (actionName) {
//             case 'delete':
//                 this.deleteRow(row);
//                 break;
//             case 'show_details':
//                 this.showRowDetails(row);
//                 break;
//             default:
//         }
//     }

//     deleteRow(event) {
//       const id = event.detail.row;
//       const index = this.findRowIndexById(id);
//       if (index !== -1) {
//         this.data = this.data
//           .slice(0, index)
//           .concat(this.data.slice(index + 1));
//       }
//     }

//     findRowIndexById(id) {
//       let ret = -1;
//       this.data.some((row, index) => {
//         if (row.id === id) {
//           ret = index;
//           return true;
//         }
//         return false;
//       });
//       return ret;
//     }

//     showRowDetails(row) {
//         this.record = row;
//     }
// }