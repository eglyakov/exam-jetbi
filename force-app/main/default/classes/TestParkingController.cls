@isTest
public class TestParkingController {
  public static String str = 'Base Station,Sensor Model,Status\n' +
                              'Fredom97,Mark 1,Inactive\n' +
                              'Fredom97,Mark 3,Inactive';

  @TestSetup
  static void makeData(){
    Sensor__c newSensor = new Sensor__c(Sensor_model__c = 'Mark', Status__c = 'Inactive', Base_Station__c = 'a015j000003sUVNAA2');
    insert newSensor;
    Base_station__c newBStation = new Base_station__c(Name = 'Fredom97', Status__c = 'Inactive');
    insert newBStation;
  }                             

  @isTest
  public static void testReadCSVFile() {
    ContentVersion contentVersionInsert = new ContentVersion(
      Title = 'sensors',
      PathOnClient = 'sensors.csv',
      VersionData = Blob.valueOf(str),
      IsMajorVersion = true
    );
    insert contentVersionInsert;
    Id getId = [Select ContentDocumentId From ContentVersion Where Id =:contentVersionInsert.id and isLatest=true].ContentDocumentId;
    List<Sensor__c> result = ParkingController.readCSVFile(getId);
  }

  @isTest
  public static void testGetSensors() {
    Test.startTest();
      List<Sensor__c> result = ParkingController.getSensorsList();
    Test.stopTest();
  }
}