@isTest
public class TestParkingController {
  public static String str = 'Sensor id,Sensor model,Status,Base Station \n' +
                              '1,Mark 1,Inactive,Freedom97 \n' +
                              '2,Mark 3,Inactive,DontTouch';

  @isTest
  public static void testReadCSVFile() {
    // Sensor__c newSensor = new Sensor__c (Sensor_model__c = 'Mark', Status__c = 'Inactive', Base_Station__c = 'DontTouch');
    // insert newSensor;
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
}