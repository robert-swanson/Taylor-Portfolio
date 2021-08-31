// Code copied from https://www.elegoo.com/download/ "Obstacle_Avoidance_Car.ino"

#include <Servo.h>  //servo library

Servo myservo;      // create servo object to control servo

int Echo = A4;
int Trig = A5;

#define ENA 5
#define ENB 6
#define IN1 7
#define IN2 8
#define IN3 9
#define IN4 11
#define LS !digitalRead(2)
#define MS !digitalRead(4)
#define RS !digitalRead(10)
#define carSpeed 250
#define CIRCUT_TIME 15000

#define lowSpeed 130
#define medSpeed 160
#define higSpeed 200

#define waitTime 50
#define debugTime 0

int lastLeft = 0;
int lastRight = 0;
int left = 0, right = 0;
int secondToLastL = -1;
int secondToLastR = -1;

int route[7] = {0,1,2,1,0,0,1}; // 0 = left, 1 = right, 2 = straight
bool makeDesc = false;
int currInstruc = 0;
int currInstrucIndex = -1;


unsigned long clock = 0;

void move(int left, int right) {
 analogWrite(ENA, (left > 0 ? left: -left));
 analogWrite(ENB, (right > 0 ? right: -right));

 if(left > 0){
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
 }else{
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
 }

 if(right > 0){
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
 }else{
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
 }

}

void stop() {
 digitalWrite(ENA, LOW);
 digitalWrite(ENB, LOW);
}

int Distance_test() {
 digitalWrite(Trig, LOW);
 delayMicroseconds(2);
 digitalWrite(Trig, HIGH);
 delayMicroseconds(20);
 digitalWrite(Trig, LOW);
 float Fdistance = pulseIn(Echo, HIGH);
 Fdistance= Fdistance / 58;
 return (int)Fdistance;
}

void setup() {
 Serial.begin(9600);
 myservo.attach(3,700,2400);  // attach servo on pin 3 to servo object
 myservo.write(90);

 pinMode(IN1, OUTPUT);
 pinMode(IN2, OUTPUT);
 pinMode(IN3, OUTPUT);
 pinMode(IN4, OUTPUT);
 pinMode(ENA, OUTPUT);
 pinMode(ENB, OUTPUT);
 pinMode(Echo, INPUT);
 pinMode(Trig, OUTPUT);
 stop();

 Serial.println("Starting...");
}

void updateSpeeds(){
  if(LS && !MS && !RS){ // Point Turn Left
   left = -lowSpeed;
   right = lowSpeed;
  }
  else if(LS && MS && !RS) { // Moving Turn Left
   left = -lowSpeed;
   right = medSpeed;
  }
  else if(!LS && MS && !RS) { // Forward
   left = lowSpeed;
   right = lowSpeed;
  }
  else if(!LS && MS && RS) { // Moving Turn Right
   left = medSpeed;
   right = -lowSpeed;
  }
  else if(!LS && !MS && RS) { // Point Turn Right
   left = lowSpeed;
   right = -lowSpeed;
  }
  else if(!LS && !MS && !RS) { // Backwards
   left = -lowSpeed;
   right = -lowSpeed;
  }
  else if(LS && MS && RS) { // Follow currInstruc
   if (currInstruc == 0){
    left = -lowSpeed;
    right = lowSpeed;
   } else if (currInstruc == 1) {
    left = lowSpeed;
    right = -lowSpeed;
   } else if (currInstruc == 2) {
    left = lowSpeed;
    right = lowSpeed;
   }
  }
 }

void loop(){
 clock++;

 if ((clock % 1) == 0) {
  updateSpeeds();
 }
// if (fowards && secondToLast == backwards)
 bool forward = (left == lowSpeed && right == lowSpeed);
 bool lastBack = (secondToLastL == -lowSpeed && secondToLastR == -lowSpeed);
 bool allThree = LS && MS && RS;
 if (forward && lastBack) {
  makeDesc = true;
 } else if (makeDesc && allThree && currInstrucIndex < 5) {
   currInstruc = route[++currInstrucIndex];
   makeDesc = false;
   if (currInstruc == 0) {
    Serial.println("Left");
   } else if (currInstruc == 1) {
    Serial.println("Right");
   } else if (currInstruc == 2) {
    Serial.println("Straight");
   }
 } else {
   move(left, right);
   secondToLastL = left;
   secondToLastR = right;
 }

}
