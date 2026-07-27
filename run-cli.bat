@echo off
echo Starting Smart Parking System CLI Mode...
cd backend
mvn spring-boot:run -Dspring-boot.run.arguments="--cli"
