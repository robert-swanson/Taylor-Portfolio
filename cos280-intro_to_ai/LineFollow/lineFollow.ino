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

#define lowSpeed 110
#define medSpeed 140
#define higSpeed 200

#define waitTime 50
#define debugTime 0

int lastLeft = 0;
int lastRight = 0;
int closestObj = 1000;
unsigned long startTime;

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
 //Serial.println("Stop!");
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
}

void loop(){
 int seenObj = 0;
 for(int i = 0; i <10; i++){
  int distance = Distance_test();
  if(distance == 0){
   i--;
  }
  seenObj = seenObj + distance;
 }
 seenObj = seenObj/10;
 int left, right;
 if (seenObj < 50) {
  left = 0;
  right = 0;
 }else{
  if(LS && !MS && !RS){ // Point Turn Left
   //    move(-lowSpeed, lowSpeed);
   left = -lowSpeed;
   right = lowSpeed;
  }
  else if(LS && MS && !RS) { // Moving Turn Left
   //    move(-lowSpeed, lowSpeed);
   left = -lowSpeed;
   right = medSpeed;
  }
  else if(!LS && MS && !RS) { // Forward
   //    move(lowSpeed, lowSpeed);
   left = lowSpeed;
   right = lowSpeed;
  }
  else if(!LS && MS && RS) { // Moving Turn Right
   //    move(lowSpeed, -lowSpeed);
   left = medSpeed;
   right = -lowSpeed;
  }
  else if(!LS && !MS && RS) { // Point Turn Right
   //    move(lowSpeed, -lowSpeed);
   left = lowSpeed;
   right = -lowSpeed;
  }
  else if(!LS && !MS && !RS) { // Backwards
   //    move(-lowSpeed, -lowSpeed);

   //if((millis() > waitTime) && !LS && !MS && !RS){
   left = -100;
   right = -100;
   //}
  }
  else if(LS && MS && RS) { // Left if all
   //    move(-lowSpeed, lowSpeed);
   left = -lowSpeed;
   right = medSpeed;
  }
 }

 if (lastLeft != left || lastRight != right) { // Update Instructions
  stop();
  delay(debugTime);
  move(left, right);
  lastLeft = left;
  lastRight = right;
  Serial.println(left);
  Serial.println(right);
  Serial.println("--------");
 }

}
