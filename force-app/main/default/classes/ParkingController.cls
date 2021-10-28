public with sharing class ParkingController {
  @AuraEnabled(cacheable=true)
  public static List<Sensor__c> getSensorsList(){
    return [SELECT Sensor_Model__c, Status__c, Base_Station__r.Name FROM Sensor__c];
  }

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
        sensorObj.Sensor_Model__c = csvRecordItems[1];
        sensorObj.Status__c = csvRecordItems[2];
        sensorsList.add(sensorObj);
      }
  
      try {
        if(!sensorsList.isEmpty()) {
          insert sensorsList;
        }
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }

    return [SELECT Sensor_Model__c, Status__c, Base_Station__r.Name FROM Sensor__c];
  }

  @AuraEnabled
  public static List<Sensor__c> deleteRecord(ID recordId){
    Sensor__c sensorDel = [SELECT ID FROM Sensor__c WHERE ID =: recordId];
    delete sensorDel;
    return [SELECT Sensor_Model__c, Status__c, Base_Station__r.Name FROM Sensor__c];
  }

  @AuraEnabled
  public static String getRecordsPerPage(){
    Id userId = UserInfo.getUserId();
    RecordsPerPage__c userCS = RecordsPerPage__c.getInstance(userId);
    String userDisplayRecord = userCS.Display_Record_Per_Page__c;
    return userDisplayRecord;
  }
}