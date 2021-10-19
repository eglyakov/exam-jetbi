import { LightningElement, api } from 'lwc';

const COLUMS = [
  {label: "Sensor model", fieldName: "Sensor_model__c"},
  {label: "Status", fieldName: "Status__c"},
  {label: "Base Station", fieldName: "Base_Station__c"},
];

export default class ParkingComponent extends LightningElement {
  @api
  recordId;

  get acceptedFormats() {
    return ['.csv'];
  }

  handleUploadFinished(event) {
    const uploadedFiles = event.detail.files;
    alert('No. of files uploaded : ' + uploadedFiles.length);
  }
}