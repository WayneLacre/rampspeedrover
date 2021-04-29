function scalespeed2 (num: number) {
    if (Math.abs(m3) >= 0 && Math.abs(m3) < 100) {
        m4 = m3 * speedmult[0]
    } else if (Math.abs(m3) >= 100 && Math.abs(m3) < 200) {
        m4 = m3 * speedmult[1]
    } else if (Math.abs(m3) >= 200 && Math.abs(m3) < 300) {
        m4 = m3 * speedmult[2]
    } else {
        m4 = m3 * speedmult[3]
    }
}
bluetooth.onBluetoothConnected(function () {
    connected = 1
    basic.showString("C")
})
bluetooth.onBluetoothDisconnected(function () {
    connected = 0
    basic.showString("D")
    Rover.MotorStopAll(MotorActions.Stop)
})
function scalespeed (num: number) {
    if (Math.abs(m0) >= 0 && Math.abs(m0) < 100) {
        m1 = m0 * speedmult[0]
    } else if (Math.abs(m0) >= 100 && Math.abs(m0) < 200) {
        m1 = m0 * speedmult[1]
    } else if (Math.abs(m0) >= 200 && Math.abs(m0) < 300) {
        m1 = m0 * speedmult[2]
    } else {
        m1 = m0 * speedmult[3]
    }
}
function LightTracing222222222 () {
    LightingValue = Rover.LightTracing()
    bluetooth.uartWriteString(Rover.SendString(Orders.LIGHTING, LightingValue))
    difValue = LightingValue - centerValue
    if (difValue > 20) {
        Rover.MotorRunDual(150, 0)
    } else if (difValue < -20) {
        Rover.MotorRunDual(0, 150)
    } else {
        Rover.Move(100)
    }
}
function LineTracking2222 () {
    trackingValues = Rover.LineTracking()
    bluetooth.uartWriteString(Rover.SendString(Orders.TRACKING, trackingValues))
    if (trackingValues == 2 || trackingValues == 5) {
        Rover.Move(trackingSpeed)
    } else if (trackingValues == 4 || trackingValues == 6) {
        Rover.MotorRunDual(speedSlowSide, speedFastSide)
    } else if (trackingValues == 1 || trackingValues == 3) {
        Rover.MotorRunDual(speedFastSide, speedSlowSide)
    } else {
        Rover.MotorStopAll(MotorActions.Stop)
    }
}
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    Rover.setReceiveString(bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine)))
    if (Rover.checkOrder(Orders.MOVE)) {
        m0 = Rover.getParameter(0)
        scalespeed(1)
        m3 = Rover.getParameter(1)
        scalespeed2(1)
        // Rover.MotorRunDual(Rover.getParameter(0), Rover.getParameter(1))
        Rover.MotorRunDual(m1, m4)
    } else if (Rover.checkOrder(Orders.STOP)) {
        Rover.MotorStopAll(MotorActions.Stop)
    } else if (Rover.checkOrder(Orders.ORDER_RGB)) {
        Rover.setRGBLED(Rover.getParameter(0), Rover.rgb(Rover.getParameter(1), Rover.getParameter(2), Rover.getParameter(3)))
    } else if (Rover.checkOrder(Orders.BUZZER)) {
        music.ringTone(Rover.getParameter(0))
    } else if (Rover.checkOrder(Orders.VOLTAGE)) {
        bluetooth.uartWriteString(Rover.SendString(Orders.VOLTAGE, Rover.BatteryLevel()))
    } else if (Rover.checkOrder(Orders.MODE)) {
        Rover.setRoverMode(Rover.getParameter(0))
    } else {
    	
    }
})
function Obstacleavoidance2222222 () {
    SonicDistance = Rover.Ultrasonic()
    bluetooth.uartWriteString(Rover.SendString(Orders.DISTANCE, SonicDistance))
    if (SonicDistance <= 15) {
        Rover.MotorRunDual(-100, 100)
    } else {
        Rover.Move(100)
    }
}
let SonicDistance = 0
let trackingValues = 0
let difValue = 0
let LightingValue = 0
let m1 = 0
let m0 = 0
let m4 = 0
let m3 = 0
let speedFastSide = 0
let speedSlowSide = 0
let trackingSpeed = 0
let connected = 0
let centerValue = 0
let sumValue = 0
let speedmult: number[] = []
bluetooth.startUartService()
speedmult = [0.25, 0.5, 0.75, 1]
for (let index = 0; index <= 9; index++) {
    sumValue = sumValue + Rover.LightTracing()
}
centerValue = Math.round(sumValue / 10)
basic.showIcon(IconNames.Happy)
connected = 0
trackingSpeed = 100
speedSlowSide = 30
speedFastSide = 100
basic.forever(function () {
    if (Rover.checkMode(RoverModes.Mode_ObstacleAvoidance)) {
        Obstacleavoidance2222222()
    } else if (Rover.checkMode(RoverModes.Mode_None)) {
        Rover.MotorStopAll(MotorActions.Stop)
        Rover.setRoverMode(Rover.rover_mode_export(RoverModes.Mode_Remote))
    } else if (Rover.checkMode(RoverModes.Mode_LightTracing)) {
        LightTracing222222222()
    } else if (Rover.checkMode(RoverModes.Mode_LineTracking)) {
        LineTracking2222()
    } else {
    	
    }
})
