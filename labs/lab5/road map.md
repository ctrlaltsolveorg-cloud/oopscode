CUSTOMER MOBILE APP
          (Order + QR + Live Tracking)
                         │
                         ▼
                  CLOUD SERVER/API
         (Database + Verification + Maps)
                         │
──────────────────────────────────────────
                         │
                         ▼
                 RASPBERRY PI 5
                 (Main Brain)
──────────────────────────────────────────
 │          │            │            │
 ▼          ▼            ▼            ▼
Camera     GPS        Touch Screen   Internet
(QR)      Module        UI           WiFi/4G

 │
 ▼
ESP32 / Arduino
(Motion Controller)
 │
 ├── Motor Driver
 ├── Motors
 ├── Ultrasonic Sensors
 ├── IR Cliff Sensors
 ├── Battery Monitor
 └── Servo Lock System