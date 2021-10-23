public with sharing class ParkingController {
  @AuraEnabled
  public static List<Sensor__c> readCSVFile(ID contentDocumentId){
    List<Sensor__c> sensorsList = new List<Sensor__c>();
      
    if (contentDocumentId != null) {
      ContentVersion contentVersionObj = [SELECT Id, VersionData FROM ContentVersion WHERE ContentDocumentId =: contentDocumentId];
      List<String> csvRecordsList = contentVersionObj.VersionData.toString().split('\n');
  
      for(Integer i = 1; i < csvRecordsList.size(); i++){
        Sensor__c sensorObj = new Sensor__c();
        List<String> csvRecordItems = csvRecordsList[i].split(',');
        sensorObj.Base_Station__c = [SELECT Name FROM Base_Station__c WHERE Name =: csvRecordItems[0]].id;
        //System.debug([SELECT ID FROM Base_Station__c WHERE Name =: csvRecordItems[0]]);
        //sensorObj.Base_Station__c.Name = csvRecordItems[0];
        sensorObj.Sensor_Model__c = csvRecordItems[1];
        sensorObj.Status__c = csvRecordItems[2];
        sensorsList.add(sensorObj);
      }
      System.debug(sensorsList);
  
      try {
        if(!sensorsList.isEmpty()) {
          insert sensorsList;
        }
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }

    return sensorsList;
  }
}