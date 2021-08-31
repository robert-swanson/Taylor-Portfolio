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
#define carSpeed 250

void stop() {
  digitalWrite(ENA, LOW);
  digitalWrite(ENB, LOW);
  Serial.println("Stop!");
} 

void left() {
  analogWrite(ENA, carSpeed);
  analogWrite(ENB, carSpeed);
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH); 
  Serial.println("Left");
}

void right() {
  analogWrite(ENA, carSpeed);
  analogWrite(ENB, carSpeed);
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
  Serial.println("Right");
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

void rotateLeft(int degrees) {
  left();
  delay(3.8 * degrees);
  stop();
}

void rotateRight(int degrees) {
  right();
  delay(3.8 * degrees);
  stop();
}

void loop() {

//  analogWrite(ENA, 250);
//  analogWrite(ENB, 100);
//  digitalWrite(IN1, HIGH); //Left
//  digitalWrite(IN2, LOW);
//  digitalWrite(IN3, LOW); // RIght
//  digitalWrite(IN4, HIGH); 
  
 double bestDist = 10000;
 double bestDeg = 0;
 
 for(int deg = 0; deg <= 180; deg+=10) {
  Serial.println(deg);
  myservo.write(deg);
  delay(100);
  double dist = Distance_test();
  if(dist < bestDist) {
    bestDist = dist;
    bestDeg = deg;
  }
 }
  Serial.println("Degrees:");
  Serial.println(bestDeg);
  Serial.println("Distance:");
  Serial.println(bestDist);
  
  if (bestDeg > 90) {
    rotateLeft(bestDeg - 90);
  } else {
    rotateRight(90 - bestDeg);
  }

  delay(2000);


}
