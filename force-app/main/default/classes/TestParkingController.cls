@isTest
public class TestParkingController {
  public static String csvFile = 'Base Station,Sensor Model,Status\n' +
                                'Freedom97,Mark 3,Inactive';

  @TestSetup
  static void makeData(){
    Base_station__c newBStation = new Base_station__c(Name = 'Freedom97', Status__c = 'Inactive');
    insert newBStation;
      
    Sensor__c newSensor = new Sensor__c(Sensor_Model__c = 'Mark 1', Status__c = 'Inactive');
      newSensor.Base_Station__c = [SELECT Name FROM Base_Station__c WHERE Name = 'Freedom97'].id;
    insert newSensor;
  }                             

  @isTest
  public static void testReadCSVFile() {
    ContentVersion contentVersionInsert = new ContentVersion(
      Title = 'sensors',
      PathOnClient = 'sensors.csv',
      VersionData = Blob.valueOf(csvFile),
      IsMajorVersion = true
    );
    insert contentVersionInsert;
    Id getId = [Select ContentDocumentId From ContentVersion Where Id =:contentVersionInsert.id and isLatest=true].ContentDocumentId;
    List<Sensor__c> result = ParkingController.readCSVFile(getId);
  }

  @isTest
  public static void testGetSensors() {
    List<Sensor__c> result = ParkingController.getSensorsList();
  }
    
  @isTest
  public static void testDeleteRecord() {
    Id recordId = [SELECT ID FROM Sensor__c].id;
    List<Sensor__c> result = ParkingController.deleteRecord(recordId);
  }
    
  @isTest
  public static void testGetRecordsPerPage() {
    String result = ParkingController.getRecordsPerPage();
  }
}