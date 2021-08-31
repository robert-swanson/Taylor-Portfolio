// COS 280 starter kit (sb) 2017-03-14
// Based on code from www.elegoo.com 2016.09.23

/**
 * Set up ENA, ENB, IN1-IN4 pins 
 * 
 * NOTES: Written documentation is incorrect about right side forward and backward. Correct values are as follows:
 *   RIGHT Forward  = IN1:HIGH, IN2:LOW
 *   RIGHT Backward = IN1:LOW, IN2:HIGH
 *   LEFT  Forward  = IN3:LOW, IN4:HIGH
 *   LEFT  Backward = IN3:HIGH, IN4:LOW
 */
 
int ENA=5;
int ENB=6; 

int IN1=7;
int IN2=8;
int IN3=9;
int IN4=11;

int SENSE_LEFT=2;
int SENSE_CENTER=4;
int SENSE_RIGHT=10;

bool LIGHT=false;
bool DARK=true;

// Enumerated type to keep code a bit cleaner.

enum Side { Left, Right };

// "constructor" function for Arduino programs.

void setup() {
    pinMode(IN1,OUTPUT);
    pinMode(IN2,OUTPUT);
    pinMode(IN3,OUTPUT);
    pinMode(IN4,OUTPUT);
    pinMode(ENA,OUTPUT);
    pinMode(ENB,OUTPUT);
  
    pinMode(SENSE_LEFT,INPUT);
    pinMode(SENSE_CENTER,INPUT);
    pinMode(SENSE_RIGHT,INPUT);
    
    digitalWrite(ENA,HIGH);       
    digitalWrite(ENB,HIGH);       
  
    // Start up the serial output so can monitor messages.
    Serial.begin(9600);
  
    Serial.println("Setup done");
}

/**
 * Main loop: runs forever.
 */
 
void loop() {
    
    Serial.println("Left = " + String(digitalRead(SENSE_LEFT)) );
    Serial.println("Center = " + String(digitalRead(SENSE_CENTER)) );
    Serial.println("Right = " + String(digitalRead(SENSE_RIGHT)) );
    
    if( digitalRead(SENSE_CENTER)==LIGHT ) {
      acquireLeft();
    }
    if( digitalRead(SENSE_LEFT)==DARK ) {
      Serial.println("pull left");
      forward( Right );
    }
    else if( digitalRead(SENSE_RIGHT)==DARK ) {
      Serial.println("pull right");
      forward( Left );
    }
    else {
      forward( Left );
      forward( Right );
    }
    delay(20);
  
    halt( Left );
    halt( Right );
    delay(20);

}

void acquireLeft(){
  while( digitalRead(SENSE_CENTER)==LIGHT ){
    forward( Right );
    backward( Left );
    delay(10);
    halt( Right );
    halt( Left );
    delay(20);
  }
}

void forward( Side side ){
  if( side==Left ) {
    digitalWrite(IN3,LOW);          // Left wheel forward
    digitalWrite(IN4,HIGH);         
  } else if( side==Right ) {
    digitalWrite(IN1,HIGH);         // Right wheel forward
    digitalWrite(IN2,LOW);          
  } else {
    Serial.println("forward() invalid side: " + side);
  }
}

void backward( Side side ){
  if( side==Left ) {
    digitalWrite(IN3,HIGH);         // Left wheel backward
    digitalWrite(IN4,LOW);         
  } else if( side==Right ) {
    digitalWrite(IN1,LOW);          // Right wheel backward
    digitalWrite(IN2,HIGH);          
  } else {
    Serial.println("backward() invalid side: " + side);
  }
}

void halt( Side side ){
  if( side==Left ) {
    digitalWrite(IN3,LOW);          // Left wheel halt
    digitalWrite(IN4,LOW);         
  } else if( side==Right ) {
    digitalWrite(IN1,LOW);         // Right wheel halt
    digitalWrite(IN2,LOW);          
  } else {
    Serial.println("halt() invalid side: " + side);
  }
}
